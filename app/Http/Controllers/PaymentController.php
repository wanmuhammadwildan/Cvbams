<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str; 
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Imports\PaymentImport;
use Maatwebsite\Excel\Facades\Excel;

class PaymentController extends Controller {

    private function resolvePackagePrice(?string $package): int
    {
        if (!$package) {
            return 0;
        }

        $normalized = strtolower($package);

        // Paket lama (legacy/new format)
        if ((str_contains($normalized, 'lama') || str_contains($normalized, 'paket lama')) && str_contains($normalized, '10')) return 100000;
        if ((str_contains($normalized, 'lama') || str_contains($normalized, 'paket lama')) && str_contains($normalized, '15')) return 150000;
        if ((str_contains($normalized, 'lama') || str_contains($normalized, 'paket lama')) && str_contains($normalized, '25')) return 250000;

        // Paket baru (legacy/new format)
        if ((str_contains($normalized, 'baru') || str_contains($normalized, 'paket baru')) && str_contains($normalized, '10')) return 110000;
        if ((str_contains($normalized, 'baru') || str_contains($normalized, 'paket baru')) && str_contains($normalized, '15')) return 165000;
        if ((str_contains($normalized, 'baru') || str_contains($normalized, 'paket baru')) && str_contains($normalized, '25')) return 275000;

        // Fallback data lama yang belum spesifik (tetap agar tidak error)
        if ($normalized === 'lama') return 100000;
        if ($normalized === 'baru') return 110000;

        return 0;
    }
    
public function index(Request $request)
{
    $query = Payment::with('customer')->orderBy('created_at', 'desc');

    if ($request->filter_method && $request->filter_method != 'all') {
        $query->where('payment_method', $request->filter_method);
    }

    $payments = $query->get();
    return view('viewWeb.pembayaran', compact('payments'));
}
    public function getCustomer($id_string) {
        $customer = Customer::where('customer_id_string', $id_string)->first();
        
        if (!$customer) {
            return response()->json(['error' => 'Pelanggan tidak ditemukan'], 404);
        }
        
        $price = $this->resolvePackagePrice($customer->package);

        return response()->json([
            'full_name' => $customer->full_name,
            'package' => $customer->package,
            'price' => $price,
            'db_id' => $customer->id
        ]);
    }

    public function store(Request $request) {
        // 1. VALIDASI
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'months' => 'required|array|min:1', 
            'amount_paid' => 'required|numeric|min:1',
            'payment_method' => 'required'
        ], [
            'customer_id.required' => 'Cari dan pilih pelanggan terlebih dahulu!',
            'months.required' => 'Pilih minimal satu bulan pembayaran!',
            'amount_paid.required' => 'Masukkan jumlah pembayaran!',
        ]);

        $customer = Customer::find($request->customer_id);
        $previousExpiryDate = $customer?->expiry_date;

        // 2. SIMPAN: Kirim $request->months LANGSUNG sebagai array.
        // JANGAN pakai json_encode karena sudah di-handle oleh Casting di Model.
        $payment = Payment::create([
            'customer_id' => $request->customer_id, 
            'transaction_id' => 'TRX-' . strtoupper(Str::random(8)), 
            'period_months' => count($request->months), 
            'amount_paid' => $request->amount_paid,
            'payment_method' => $request->payment_method,
            'paid_months' => $request->months, // PERBAIKAN: Hapus json_encode()
            'previous_expiry_date' => $previousExpiryDate,
            'notes' => $request->notes
        ]);

        // Update jatuh tempo pelanggan tetap tanggal 15 setiap bulan
        if ($customer) {
            $paidMonths = max(1, count($request->months));

            $baseDue = $customer->expiry_date
                ? Carbon::parse($customer->expiry_date)
                : now();

            $dueOn15 = Carbon::create($baseDue->year, $baseDue->month, 15);
            $nextDue = $dueOn15->copy()->addMonthsNoOverflow($paidMonths);

            $customer->update([
                'expiry_date' => $nextDue->format('Y-m-d')
            ]);
        }

        return redirect()->route('pembayaran.index')->with('success', 'Pembayaran berhasil dicatat!');
    }

    public function destroy($id) {
        $payment = Payment::with('customer')->findOrFail($id);

        // Jika transaksi yang dihapus adalah input pembayaran terakhir customer,
        // maka jatuh tempo dikembalikan ke kondisi sebelum transaksi itu dibuat.
        $customer = $payment->customer;
        if ($customer) {
            $latestPayment = Payment::where('customer_id', $customer->id)
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->first();

            if ($latestPayment && $latestPayment->id === $payment->id) {
                $customer->update([
                    'expiry_date' => $payment->previous_expiry_date
                        ? Carbon::parse($payment->previous_expiry_date)->format('Y-m-d')
                        : null
                ]);
            }
        }

        $payment->delete();
        return redirect()->route('pembayaran.index')->with('success', 'Transaksi telah dibatalkan.');
    }

    public function downloadStruk($id) {
        $payment = Payment::with('customer')->findOrFail($id);
        $pdf = Pdf::loadView('viewWeb.struk_pdf', compact('payment'));
        return $pdf->download('Struk-'.$payment->transaction_id.'.pdf');
    }
    public function import(Request $request) 
{
    $request->validate(['file_excel' => 'required|mimes:xlsx,xls,csv']);
    Excel::import(new PaymentImport, $request->file('file_excel'));
    return redirect()->route('pembayaran.index')->with('success', 'Database berhasil dimigrasi dari Excel!');
}

}
<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TranscriptController extends Controller {

    public function index(Request $request) {
        $query = Payment::with('customer');

        // 1. FILTER: Bulan
        if ($request->filled('month') && $request->month != 'all') {
            $query->whereMonth('created_at', $request->month);
        }
        
        // 2. FILTER: Tahun
        if ($request->filled('year')) {
            $query->whereYear('created_at', $request->year);
        }

        // 3. FILTER: Metode Pembayaran (PENTING)
        if ($request->filled('payment_method') && $request->payment_method != 'all') {
            $query->where('payment_method', $request->payment_method);
        }

        // Ambil data dengan urutan terbaru
        $payments = $query->orderBy('created_at', 'desc')->get();

        // 4. DATA RINGKASAN (Stat Cards)
        $totalRevenue = $payments->sum('amount_paid');
        $totalTransactions = $payments->count();
        $lunasCount = $totalTransactions; // Karena di sini sistemnya langsung lunas
        $pendingCount = 0;

        // 5. DATA GRAFIK: Pendapatan Harian
        $dailyTrends = $payments->groupBy(fn($p) => $p->created_at->format('d M'))
                                ->map(fn($group) => $group->sum('amount_paid'));

        // Pastikan view-nya mengarah ke folder yang benar (viewWeb.transkrip)
        return view('viewWeb.transkrip', compact(
            'payments', 'totalRevenue', 'totalTransactions', 
            'lunasCount', 'pendingCount', 'dailyTrends'
        ));
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil Parameter Filter (Default: awal tahun ini sampai hari ini)
        $start = $request->get('startDate', now()->startOfYear()->format('Y-m-d'));
        $end = $request->get('endDate', now()->format('Y-m-d'));

        // 2. Statistik Pembayaran (Berdasarkan Periode)
        $paymentQuery = Payment::whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59']);
        $totalPayments = $paymentQuery->count();
        $totalRevenue = $paymentQuery->sum('amount_paid');

        // 3. Statistik Pelanggan (Sesuai Permintaan Anda)
        $activeCustomers = Customer::where('status', 'aktif')->count();
        $inactiveCustomers = Customer::where('status', 'nonaktif')->count();

        // 4. Data untuk Grafik Distribusi Pembayaran (Doughnut Chart)
        $paymentMethods = Payment::select('payment_method', DB::raw('count(*) as total'))
            ->groupBy('payment_method')
            ->get();

        // 5. Data untuk Grafik Tren Keuangan (Line Chart)
        $trends = Payment::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(amount_paid) as total'))
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        return view('viewWeb.index', compact(
            'totalPayments', 'totalRevenue', 'activeCustomers', 
            'inactiveCustomers', 'start', 'end', 'paymentMethods', 'trends'
        ));
    }
}
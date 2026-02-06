@extends('layouts.app')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
@endpush

@section('content')
<div class="main-content">
    <div class="dashboard-header">
        <div>
            <h2>Dashboard</h2>
            <p class="dashboard-subtitle">Data Statistik Billing & Pelanggan</p>
        </div>
        <form action="{{ route('dashboard') }}" method="GET" class="filter-controls">
            <span style="color: #95a5a6;">Dari:</span>
            <input type="date" name="startDate" class="date-input" value="{{ $start }}">
            <span style="color: #95a5a6;">Hingga:</span>
            <input type="date" name="endDate" class="date-input" value="{{ $end }}">
            <button type="submit" class="filter-btn"><i class="fas fa-filter"></i> Filter</button>
        </form>
    </div>

    <div class="stats-container">
        <div class="stat-card income-today">
            <i class="fas fa-money-bill-wave stat-icon"></i>
            <div class="stat-value">{{ $totalPayments }}</div>
            <div class="stat-label">Total Pembayaran</div>
            <div class="stat-subtitle">periode terpilih</div>
        </div>
        
        <div class="stat-card income-month">
            <i class="fas fa-coins stat-icon"></i>
            <div class="stat-value">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</div>
            <div class="stat-label">Total Pemasukan</div>
            <div class="stat-subtitle">periode terpilih</div>
        </div>
        
        <div class="stat-card active-member">
            <i class="fas fa-user-check stat-icon"></i>
            <div class="stat-value">{{ $activeCustomers }}</div>
            <div class="stat-label">Pelanggan Aktif</div>
            <div class="stat-subtitle">Total saat ini</div>
        </div>
        
        <div class="stat-card total-member">
            <i class="fas fa-user-times stat-icon"></i>
            <div class="stat-value">{{ $inactiveCustomers }}</div>
            <div class="stat-label">Pelanggan Non-Aktif</div>
            <div class="stat-subtitle">Total saat ini</div>
        </div>
    </div>

    <div class="content-sections">
        <div class="section">
            <h3 class="section-title"><div><i class="fas fa-chart-line"></i> Tren Keuangan</div></h3>
           <div class="chart-container">
    <canvas id="trendChart"></canvas> 
</div>

<div class="chart-container">
    <canvas id="paymentChart"></canvas>
</div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // 1. GRAFIK TREN KEUANGAN (Line Chart)
    const trendCtx = document.getElementById('trendChart');
    const trendData = {!! json_encode($trends) !!}; // Mengambil data dari Controller

    if (trendCtx && trendData.length > 0) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: trendData.map(t => t.date),
                datasets: [{
                    label: 'Pemasukan (Rp)',
                    data: trendData.map(t => t.total),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // WAJIB: Agar mengisi kotak 220px Anda
                plugins: { legend: { display: false } }
            }
        });
    }

    // 2. GRAFIK METODE PEMBAYARAN (Doughnut Chart)
    const paymentCtx = document.getElementById('paymentChart');
    const methodData = {!! json_encode($paymentMethods) !!}; // Mengambil data dari Controller

    if (paymentCtx && methodData.length > 0) {
        new Chart(paymentCtx, {
            type: 'doughnut',
            data: {
                labels: methodData.map(m => m.payment_method.toUpperCase()),
                datasets: [{
                    data: methodData.map(m => m.total),
                    backgroundColor: ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // WAJIB
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
});
</script>
@endpush
<!DOCTYPE html>
<html lang="id">
<head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - CV BAMS</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
    <link rel="stylesheet" href="{{ asset('css/pembayaran.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    @stack('styles')
</head>
<body>
    <div class="user-info">
    <div style="text-align: right; margin-right: 15px;">
        <h4 style="margin: 0; font-size: 0.95rem;">{{ Auth::user()->full_name }}</h4>
        <p style="margin: 0; font-size: 0.8rem; color: #95a5a6;">
            {{ Auth::user()->role == 'super_admin' ? 'Super Admin' : 'Admin' }}
        </p>
    </div>
    
    <form action="{{ route('logout') }}" method="POST" style="display: inline;">
        @csrf
        <button type="submit" title="Logout" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem; padding: 10px;">
            <i class="fas fa-sign-out-alt"></i>
        </button>
    </form>
</div>
    @stack('scripts')
    <div class="container">
        <aside class="sidebar">
            <div class="logo">
                <h1><i class="fas fa-satellite-dish"></i> CV BAMS</h1>
            </div>
            <ul class="nav-links">
                <li><a href="{{ route('dashboard') }}" class="{{ request()->is('/') ? 'active' : '' }}"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="{{ route('pelanggan.index') }}" class="{{ request()->is('pelanggan*') ? 'active' : '' }}"></i> Data Pelanggan</a></li>
                <li> <a href="{{ route('pembayaran.index') }}" class="{{ request()->is('pembayaran*') ? 'active' : '' }}"><i class="fas fa-credit-card"></i> Pembayaran </a></li>
                <li> <a href="{{ route('transkrip.index') }}" class="{{ request()->is('transkrip*') ? 'active' : '' }}"></i> Transkrip</a></li>
            </ul>
        </aside>

        <main class="main-content">
            @yield('content')
            
            <div class="footer">
                <p>© 2025 Dashboard Admin ISP. Semua hak dilindungi.</p>
                <p>Versi 2.1.0</p>
            </div>
        </main>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    @stack('scripts')
    <script>
    // FUNGSI: Menghilangkan notifikasi secara otomatis setelah 3 detik
    document.addEventListener('DOMContentLoaded', function() {
        const alerts = document.querySelectorAll('.alert-success, [style*="background: #2ecc71"], [style*="background: #e74c3c"]');
        alerts.forEach(function(alert) {
            setTimeout(function() {
                alert.style.transition = "opacity 0.5s ease";
                alert.style.opacity = "0";
                setTimeout(() => alert.remove(), 500); // Menghapus elemen dari HTML
            }, 3000); // 3000ms = 3 detik
        });
    });
</script>
</body>
</html>
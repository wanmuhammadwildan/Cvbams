@extends('layouts.app')

@section('title', 'Pembayaran')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/pembayaran.css') }}">
    <style>
        /* Style tambahan agar form import terlihat menyatu dengan desain Anda */
        .import-box {
            background: #f8f9fa;
            border: 2px dashed #3498db;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }
        .import-info { display: flex; align-items: center; gap: 15px; }
        .import-info i { font-size: 2rem; color: #3498db; }
        .import-form { display: flex; gap: 10px; flex-grow: 1; }
    </style>
@endpush

@section('content')
<div class="header">
    <h2>Pembayaran</h2>
</div>

@if(session('success'))
    <div class="alert-auto-hide" style="background: #2ecc71; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(46,204,113,0.2);">
        <i class="fas fa-check-circle"></i> {{ session('success') }}
    </div>
@endif

@if($errors->any())
    <div style="background: #e74c3c; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <i class="fas fa-exclamation-triangle"></i> <strong>Peringatan:</strong>
        <ul style="margin-top: 5px; margin-left: 20px;">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="tab-navigation">
    <button class="tab-btn {{ session('success') ? '' : 'active' }}" data-tab="input-pembayaran">
        <i class="fas fa-money-bill-wave"></i> Input Pembayaran
    </button>
    <button class="tab-btn {{ session('success') ? 'active' : '' }}" data-tab="riwayat-pembayaran">
        <i class="fas fa-history"></i> Riwayat
    </button>
</div>

<div id="input-pembayaran" class="tab-content {{ session('success') ? '' : 'active' }}">
    <form action="{{ route('pembayaran.store') }}" method="POST" id="form-pembayaran">
        @csrf
        <div class="form-section">
            <h4 class="section-title"><i class="fas fa-user-circle"></i> Data Pelanggan</h4>
            <span class="section-badge">1</span>
            <div class="form-grid">
                <div class="form-group">
                    <label>ID Pelanggan</label>
                    <div class="input-with-action">
                        <input type="text" id="input-id-search" class="form-control" placeholder="Contoh: PLG-001">
                        <button type="button" class="btn-action" id="btn-fetch-customer">
                            <i class="fas fa-search"></i>
                            <span id="loading-indicator" style="display: none; margin-left: 5px;">
                                <i class="fas fa-spinner fa-spin"></i>
                            </span>
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Nama Pelanggan</label>
                    <input type="text" id="display-name" class="form-control" readonly placeholder="Cari ID pelanggan dulu...">
                </div>
                <div class="form-group">
                    <label>Paket Saat Ini</label>
                    <input type="text" id="display-package" class="form-control" readonly>
                </div>
                <input type="hidden" name="customer_id" id="customer-db-id">
            </div>
        </div>

        <div class="form-section">
            <h4 class="section-title"><i class="fas fa-calendar-alt"></i> Pilih Bulan Pembayaran</h4>
            <span class="section-badge">2</span>
            <div class="form-group">
                <label>Centang bulan yang ingin dibayar:</label>
                <div class="month-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
                    @foreach(['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'] as $index => $month)
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" name="months[]" value="{{ $index + 1 }}" class="month-check" style="width: 18px; height: 18px;">
                            <span style="font-size: 0.9rem;">{{ $month }}</span>
                        </label>
                    @endforeach
                </div>
            </div>
            <div class="form-group" style="margin-top: 15px;">
                <label>Harga Paket Per Bulan (Rp)</label>
                <input type="text" id="display-price" class="form-control" readonly value="0">
            </div>
        </div>

        <div class="form-section">
            <h4 class="section-title"><i class="fas fa-money-check-alt"></i> Detail Pembayaran</h4>
            <span class="section-badge">3</span>
            <div class="payment-summary" style="background: #f1f9f5; border-left: 5px solid #2ecc71; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #27ae60; font-weight: 600;">TOTAL TAGIHAN:</span>
                    <strong id="summary-total" style="font-size: 1.8rem; color: #2ecc71;">Rp 0</strong>
                </div>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Metode Pembayaran</label>
                    <select name="payment_method" class="form-control">
                        <option value="cash">Tunai (Cash)</option>
                        <option value="bri">Transfer Bank BRI</option>
                        <option value="bca">Transfer Bank BCA</option>
                        <option value="jatim">Transfer Bank JATIM</option>
                        <option value="bni">Transfer Bank BNI</option>
                        <option value="mandiri">Transfer Bank MANDIRI</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Jumlah Bayar (Rp)</label>
                    <input type="number" name="amount_paid" id="input-paid" class="form-control" placeholder="0">
                </div>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-success btn-large" style="width: 100%; border-radius: 12px; font-weight: bold; padding: 15px;">
                <i class="fas fa-check-circle"></i> KONFIRMASI PEMBAYARAN
            </button>
        </div>
    </form>
</div>

<div id="riwayat-pembayaran" class="tab-content {{ session('success') ? 'active' : '' }}">
    
 

<div class="list-header" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
    <h3><i class="fas fa-history"></i> Riwayat Pembayaran Terakhir</h3>
    <form action="{{ route('pembayaran.index') }}" method="GET" style="display: flex; gap: 10px;">
        <select name="filter_method" class="form-control" onchange="this.form.submit()" style="width: 200px;">
            <option value="all">Semua Metode</option>
            <option value="cash" {{ request('filter_method') == 'cash' ? 'selected' : '' }}>Cash</option>
            <option value="bri" {{ request('filter_method') == 'bri' ? 'selected' : '' }}>BRI</option>
            <option value="bca" {{ request('filter_method') == 'bca' ? 'selected' : '' }}>BCA</option>
            <option value="jatim" {{ request('filter_method') == 'jatim' ? 'selected' : '' }}>JATIM</option>
            <option value="bni" {{ request('filter_method') == 'bni' ? 'selected' : '' }}>BNI</option>
            <option value="mandiri" {{ request('filter_method') == 'mandiri' ? 'selected' : '' }}>MANDIRI   </option>
        </select>
    </form>
</div>

    <div class="table-container" style="background: white; border-radius: 12px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <table class="payment-history-table" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="text-align: left; background: #f8f9fa; border-bottom: 2px solid #eee;">
                    <th style="padding: 15px;">No</th>
                    <th>ID Transaksi</th>
                    <th>Pelanggan</th>
                    <th>Periode</th>
                    <th>Total Bayar</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($payments as $no => $item)
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px;">{{ $no + 1 }}</td>
                    <td style="font-weight: bold; color: #3498db;">{{ $item->transaction_id }}</td>
                    <td>{{ $item->customer->full_name ?? 'N/A' }}</td>
                    <td>{{ $item->period_months }} Bulan</td>
                    <td>Rp {{ number_format($item->amount_paid, 0, ',', '.') }}</td>
                    <td>{{ $item->created_at->format('d/m/Y') }}</td>
                    <td style="display: flex; gap: 5px;">
                        <a href="{{ route('pembayaran.cetak', $item->id) }}" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">
                            <i class="fas fa-print"></i> Struk
                        </a>
                        <form action="{{ route('pembayaran.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin membatalkan transaksi ini?')">
                            @csrf @method('DELETE')
                            <button type="submit" class="btn btn-danger" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="7" style="text-align: center; padding: 40px; color: #95a5a6;">Belum ada riwayat pembayaran.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');
        const btnFetch = document.getElementById('btn-fetch-customer');
        const inputId = document.getElementById('input-id-search');
        const loadingIndicator = document.getElementById('loading-indicator');

        const displayName = document.getElementById('display-name');
        const displayPackage = document.getElementById('display-package');
        const customerDbId = document.getElementById('customer-db-id');
        const displayPrice = document.getElementById('display-price');
        const inputPaid = document.getElementById('input-paid');
        const summaryTotal = document.getElementById('summary-total');

        function clearCustomerFields() {
            displayName.value = '';
            displayPackage.value = '';
            customerDbId.value = '';
            displayPrice.value = '0';
            updateTotal();
        }

        function updateTotal() {
            const price = parseInt(displayPrice.value, 10) || 0;
            const selectedMonths = document.querySelectorAll('.month-check:checked').length;
            const total = price * selectedMonths;

            summaryTotal.innerText = 'Rp ' + total.toLocaleString('id-ID');
            inputPaid.value = total;
        }

        function fetchCustomerData() {
            const idString = inputId.value.trim();

            if (!idString) {
                clearCustomerFields();
                return;
            }

            if (loadingIndicator) loadingIndicator.style.display = 'inline-block';

            fetch(`/pembayaran/get-customer/${encodeURIComponent(idString)}`)
                .then(async (res) => {
                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Pelanggan tidak ditemukan');
                    }
                    return data;
                })
                .then((data) => {
                    displayName.value = data.full_name || '';
                    displayPackage.value = data.package || '';
                    customerDbId.value = data.db_id || '';
                    displayPrice.value = data.price || 0;
                    updateTotal();
                })
                .catch((error) => {
                    alert(error.message || 'Terjadi kesalahan saat mengambil data pelanggan');
                    clearCustomerFields();
                })
                .finally(() => {
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                });
        }

        // Tab
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });

        // Fetch customer by ID
        if (btnFetch) btnFetch.addEventListener('click', fetchCustomerData);
        if (inputId) {
            inputId.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    fetchCustomerData();
                }
            });
            inputId.addEventListener('blur', fetchCustomerData);
        }

        // Recalculate total on month change
        document.querySelectorAll('.month-check').forEach(check => {
            check.addEventListener('change', updateTotal);
        });

        // Initial calculation
        updateTotal();
    });
</script>
@endpush
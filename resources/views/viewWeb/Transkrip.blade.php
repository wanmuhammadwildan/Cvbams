@extends('layouts.app')

@section('title', 'Transkrip Pembayaran')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/transkrip.css') }}">
    <style>
        .badge-lunas {
            background: #2ecc71;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: bold;
            display: inline-block;
        }
        .badge-metode {
            background: #e9ecef;
            color: #495057;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .transcript-table th, .transcript-table td {
            text-align: center;
            vertical-align: middle;
            padding: 10px;
        }
    </style>
@endpush

@section('content')
<div class="header">
    <h2>Transkrip Pembayaran</h2>
    <div class="user-info">
        <div style="text-align: right; margin-right: 15px;">
            <h4>{{ Auth::user()->full_name }}</h4>
            <p style="font-size: 0.8rem; color: var(--gray);">{{ ucfirst(Auth::user()->role) }}</p>
        </div>
        <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->full_name) }}&background=3498db&color=fff" alt="Avatar">
    </div>
</div>

<div class="filter-section">
    <div class="filter-header">
        <h3><i class="fas fa-filter"></i> Filter Transkrip Pembayaran</h3>
    </div>
    <form action="{{ route('transkrip.index') }}" method="GET" class="filter-controls">
        <div class="filter-group">
            <label><i class="fas fa-credit-card"></i> Metode Pembayaran</label>
            <select name="payment_method" class="form-control">
                <option value="all">Semua Metode</option>
                <option value="cash" {{ request('payment_method') == 'cash' ? 'selected' : '' }}>Cash (Tunai)</option>
                <option value="bri" {{ request('payment_method') == 'bri' ? 'selected' : '' }}>Bank BRI</option>
                <option value="bca" {{ request('payment_method') == 'bca' ? 'selected' : '' }}>Bank BCA</option>
                <option value="mandiri" {{ request('payment_method') == 'mandiri' ? 'selected' : '' }}>Bank MANDIRI</option>
                <option value="jatim" {{ request('payment_method') == 'jatim' ? 'selected' : '' }}>Bank JATIM</option>
                <option value="bni" {{ request('payment_method') == 'bni' ? 'selected' : '' }}>Bank BNI</option>
            </select>
        </div>

        <div class="filter-group">
            <label><i class="far fa-calendar-check"></i> Tahun</label>
            <input type="number" name="year" class="form-control" value="{{ request('year', date('Y')) }}">
        </div>

        <div class="filter-group">
            <label><i class="fas fa-wifi"></i> Paket Internet</label>
            <select name="package" class="form-control">
                <option value="all">Semua Paket</option>
                <option value="10 Mbps">10 Mbps</option>
                <option value="25 Mbps">25 Mbps</option>
            </select>
        </div>

        <div class="filter-actions">
            <button type="submit" class="btn btn-primary filter-btn"><i class="fas fa-search"></i> Terapkan</button>
            <a href="{{ route('transkrip.index') }}" class="btn btn-secondary reset-btn"><i class="fas fa-redo"></i> Reset</a>
        </div>
    </form>
</div>

<div class="summary-stats">
    <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
        <div class="stat-content">
            <div class="stat-value">Rp {{ number_format($payments->sum('amount_paid'), 0, ',', '.') }}</div>
            <div class="stat-label">Total Pendapatan</div>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-exchange-alt"></i></div>
        <div class="stat-content">
            <div class="stat-value">{{ $payments->count() }}</div>
            <div class="stat-label">Total Transaksi</div>
        </div>
    </div>
</div>

<div class="data-section">
    <div class="data-header">
        <h3><i class="fas fa-table"></i> Data Transkrip Pembayaran</h3>
        <button class="btn btn-success" id="btn-export-excel"><i class="fas fa-file-excel"></i> Export ke Excel</button>
    </div>
    <div class="table-container" style="overflow-x: auto;">
        <table class="transcript-table" id="transcript-table">
            <thead>
                <tr>
                    <th width="40">No</th>
                    <th style="text-align: left;">ID Transaksi</th>
                    <th style="text-align: left;">ID Pelanggan</th> <th style="text-align: left;">Pelanggan</th>
                    @foreach(['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'] as $m)
                        <th>{{ $m }}</th>
                    @endforeach
                    <th>Total</th>
                    <th>Metode</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($payments as $no => $item)
                <tr>
                    <td>{{ $no + 1 }}</td>
                    <td style="text-align: left; font-weight: bold; color: #3498db;">{{ $item->transaction_id }}</td>
                    <td style="text-align: left; font-weight: 600;">{{ $item->customer->customer_id_string ?? 'N/A' }}</td> <td style="text-align: left;">{{ $item->customer->full_name ?? 'N/A' }}</td>
                    
                    @for($i = 1; $i <= 12; $i++)
                        <td>
                            @if(is_array($item->paid_months) && in_array($i, $item->paid_months))
                                <span class="badge-lunas">Lunas</span>
                            @else
                                <span style="color: #eee;">-</span>
                            @endif
                        </td>
                    @endfor

                    <td style="font-weight: bold;">Rp {{ number_format($item->amount_paid, 0, ',', '.') }}</td>
                    <td><span class="badge-metode">{{ strtoupper($item->payment_method) }}</span></td>
                    <td>
                        <form action="{{ route('pembayaran.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Hapus transaksi?')">
                            @csrf @method('DELETE')
                            <button type="submit" style="color: #e74c3c; border: none; background: none; cursor: pointer;"><i class="fas fa-trash"></i></button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="19" style="padding: 50px;">Belum ada data pembayaran.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
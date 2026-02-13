<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Struk - {{ $payment->transaction_id }}</title>
    <style>
        @page { margin: 20px; }
        body { font-family: sans-serif; color: #333; line-height: 1.3; font-size: 12px; }
        
        /* Header Table */
        .header-table { width: 100%; border-bottom: 2px solid #333; margin-bottom: 10px; }
        .logo-cell { width: 100px; text-align: left; vertical-align: middle; }
        .company-cell { text-align: center; vertical-align: middle; padding-right: 100px; } /* padding agar center ke kertas */
        
        .company-name { font-size: 16px; font-weight: bold; border-top: 1px solid #333; border-bottom: 1px solid #333; display: inline-block; padding: 3px 15px; margin-top: 5px; }
        .logo-subtext { font-size: 11px; letter-spacing: 2px; font-weight: bold; }

        /* Content Section */
        .title { text-align: center; font-size: 14px; font-weight: bold; text-decoration: underline; margin-top: 15px; }
        .date { text-align: center; font-size: 11px; margin-bottom: 15px; }

        .info-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .info-table td { padding: 6px; border-bottom: 1px dashed #ccc; }
        .label { width: 150px; font-weight: bold; }

        /* Bank Grid */
        .bank-title { font-weight: bold; font-size: 11px; margin-top: 20px; border-bottom: 1px solid #333; display: inline-block; }
        .bank-table { width: 100%; margin-top: 10px; table-layout: fixed; }
        .bank-table td { text-align: center; font-size: 9px; vertical-align: top; width: 25%; }
        .bank-name { font-weight: bold; margin-bottom: 2px; }

        .footer { margin-top: 40px; text-align: center; font-size: 10px; }
        .footer-bold { font-weight: bold; margin-top: 5px; }
    </style>
</head>
<body>
    @php
        // LOGIKA LOGO: Mengambil file dari resources/views/viewWeb
        $logoPath = resource_path('views/viewWeb/LogoBAMS.jpeg');
        $base64 = '';
        if (file_exists($logoPath)) {
            $data = file_get_contents($logoPath);
            $base64 = 'data:image/jpeg;base64,' . base64_encode($data);
        }
    @endphp

    <table class="header-table">
        <tr>
            <td class="logo-cell">
                @if($base64)
                    <img src="{{ $base64 }}" width="180">
                @else
                    <div style="font-weight: bold; font-size: 20px;">BA MS</div>
                @endif
            </td>
            <td class="company-cell">
                <div class="logo-subtext">INTERNET CONNECTION</div>
                <div class="company-name">CV BAGUS AGUNG MANDIRI SEJAHTERA</div>
            </td>
        </tr>
    </table>

    <div class="title">BUKTI PEMBAYARAN</div>
    <div class="date">Tanggal Bayar: {{ $payment->created_at->translatedFormat('d F Y') }}</div>

    <table class="info-table">
        <tr>
            <td class="label">Periode</td>
            <td width="10">:</td>
            <td>
                @php
                    $monthNames = [1=>'Jan', 2=>'Feb', 3=>'Mar', 4=>'Apr', 5=>'Mei', 6=>'Jun', 7=>'Jul', 8=>'Agu', 9=>'Sep', 10=>'Okt', 11=>'Nov', 12=>'Des'];
                    $months = is_array($payment->paid_months) ? $payment->paid_months : [];
                    $display = [];
                    foreach($months as $m) { $display[] = $monthNames[$m] ?? $m; }
                @endphp
                {{ implode(', ', $display) }} / {{ $payment->created_at->format('Y') }}
            </td>
        </tr>
        <tr>
            <td class="label">Nama</td>
            <td>:</td>
            <td>{{ $payment->customer->full_name }}</td>
        </tr>
        <tr>
            <td class="label">Alamat</td>
            <td>:</td>
            <td>{{ $payment->customer->address }}</td>
        </tr>
        <tr>
            <td class="label">Nomor Hp</td>
            <td>:</td>
            <td>{{ $payment->customer->phone }}</td>
        </tr>
        <tr>
            <td class="label">Pokok</td>
            <td>:</td>
            <td style="font-weight: bold; font-size: 14px;">Rp. {{ number_format($payment->amount_paid, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="label">Metode</td>
            <td>:</td>
            <td>{{ strtoupper($payment->payment_method) }}</td>
        </tr>
    </table>

    <div class="bank-title">TRANSFER REKENING</div>
    <table class="bank-table">
        <tr>
            <td>
                <div class="bank-name">MANDIRI A.N</div>
                <div>PURWATI</div>
                <div>1710006839313</div>
            </td>
            <td>
                <div class="bank-name">BCA A.N</div>
                <div>PURWATI</div>
                <div>0901329604</div>
            </td>
            <td>
                <div class="bank-name">BRI A.N PURWATI</div>
                <div style="margin-top: 5px;">616801005179509</div>
            </td>
            <td>
                <div class="bank-name">BNI A.N PURWATI</div>
                <div style="margin-top: 5px;">0209467638</div>
            </td>
        </tr>
    </table>

    <div class="footer">
        Terima kasih Telah Melakukan Pembayaran Pada Kantor Kami, Simpanlah Struk ini<br>
        Sebagai Bukti pembayaran
        <div class="footer-bold">CV BAGUS AGUNG MANDIRI SEJAHTERA</div>
    </div>
</body>
</html>
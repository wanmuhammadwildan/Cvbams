<!DOCTYPE html>
<html>
<head>
    <title>Struk Pembayaran CV BAMS</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 5px 0; }
        .total-box { background: #f4f4f4; padding: 15px; text-align: right; border-radius: 5px; }
        .total-amount { font-size: 18px; font-weight: bold; color: #2ecc71; }
        .footer { margin-top: 30px; text-align: center; font-style: italic; color: #777; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin: 0;">CV BAMS - ISP</h2>
        <p style="margin: 5px 0;">Bukti Pembayaran Internet Sah</p>
    </div>

    <table class="info-table">
        <tr>
            <td width="30%">ID Transaksi</td>
            <td>: <strong>{{ $payment->transaction_id }}</strong></td>
        </tr>
        <tr>
            <td>Nama Pelanggan</td>
            <td>: {{ $payment->customer->name }}</td>
        </tr>
        <tr>
            <td>Paket Internet</td>
            <td>: {{ $payment->customer->package }}</td>
        </tr>
        <tr>
            <td>Periode</td>
            <td>: {{ $payment->period_months }} Bulan</td>
        </tr>
        <tr>
            <td>Metode Bayar</td>
            <td>: {{ ucfirst($payment->payment_method) }}</td>
        </tr>
        <tr>
            <td>Tanggal Bayar</td>
            <td>: {{ $payment->created_at->format('d F Y H:i') }}</td>
        </tr>
    </table>

    <div class="total-box">
        <span>TOTAL PEMBAYARAN</span><br>
        <span class="total-amount">Rp {{ number_format($payment->amount_paid, 0, ',', '.') }}</span>
    </div>

    <div class="footer">
        <p>Terima kasih telah melakukan pembayaran.<br>Layanan Anda otomatis diperpanjang sesuai periode.</p>
    </div>
</body>
</html>
<?php

namespace App\Imports;

use App\Models\Payment;
use App\Models\Customer;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class PaymentImport implements ToModel, WithHeadingRow, SkipsEmptyRows
{
    public function model(array $row)
    {
        // 1. Lewati jika baris tidak punya ID Transaksi (Mencegah error baris hantu)
        if (empty($row['id_transaksi'])) {
            return null;
        }

        // 2. Cari atau Buat Pelanggan Otomatis agar tidak error 'null violation'
        $customer = Customer::firstOrCreate(
            ['name' => $row['pelanggan']],
            [
                'customer_id_string' => 'PLG-' . strtoupper(substr(uniqid(), -5)),
                'package' => $row['paket'] ?? '10 Mbps',
                'status' => 'aktif',
                'address' => 'Migrasi Excel',
                'phone' => '0800000000'
            ]
        );

        // 3. Hapus otomatis "Rp" dan titik agar menjadi angka murni
        $amount = (int) preg_replace('/[^0-9]/', '', $row['total_tagihan']);

        return new Payment([
            'customer_id'    => $customer->id,
            'transaction_id' => $row['id_transaksi'],
            'amount_paid'    => $amount,
            'payment_method' => strtolower($row['metode'] ?? 'cash'),
            'paid_months'    => [date('n', strtotime($row['tanggal']))],
            'period_months'  => 1,
            'created_at'     => $row['tanggal'] ? date('Y-m-d H:i:s', strtotime($row['tanggal'])) : now(),
        ]);
    }
}
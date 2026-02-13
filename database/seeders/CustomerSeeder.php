<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use Illuminate\Support\Facades\Schema;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        // 1. Bersihkan tabel pelanggan lama (kompatibel MySQL/PostgreSQL/SQLite)
        Schema::disableForeignKeyConstraints();
        Customer::query()->truncate();
        Schema::enableForeignKeyConstraints();

        // 2. Baca file CSV hasil pembersihan AI
        $filePath = base_path('Data_Pelanggan_Fix_Final.csv');
        if (!file_exists($filePath)) {
            throw new \RuntimeException("File CSV tidak ditemukan: {$filePath}");
        }

        $file = fopen($filePath, 'r');
        $header = fgetcsv($file); // Skip header

        while (($row = fgetcsv($file, 1000, ",")) !== FALSE) {
            // Lewati baris kosong / rusak
            if (!is_array($row) || count($row) < 3) {
                continue;
            }

            // Format normal: 7 kolom
            // Jika ada koma di alamat (tanpa quote), kolom bisa > 7
            // => ambil 3 kolom terakhir sebagai package, installation_date, status
            $customerId = trim((string) ($row[0] ?? ''));
            $fullName = trim((string) ($row[1] ?? ''));
            $rawPhone = $row[2] ?? '';

            if (count($row) >= 7) {
                $statusRaw = $row[count($row) - 1] ?? 'aktif';
                $installationDate = $row[count($row) - 2] ?? now()->toDateString();
                $package = $row[count($row) - 3] ?? '-';

                $addressParts = array_slice($row, 3, count($row) - 6);
                $address = trim(implode(', ', $addressParts));
            } else {
                // Baris tidak lengkap, lewati
                continue;
            }

            $phone = $this->normalizePhone($rawPhone);

            // Pastikan status hanya aktif / nonaktif
            $status = strtolower(trim((string) $statusRaw));
            if (!in_array($status, ['aktif', 'nonaktif'], true)) {
                $status = 'aktif';
            }

            if ($customerId === '') {
                continue;
            }

            Customer::updateOrCreate([
                'customer_id_string' => $customerId,
            ], [
                'full_name'          => $fullName,
                'phone'              => $phone,
                'address'            => $address,
                'package'            => $package,
                'installation_date'  => $installationDate,
                'status'             => $status,
            ]);
        }
        fclose($file);
    }

    private function normalizePhone(?string $phone): string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone);

        if ($digits === '') {
            return '08' . str_pad((string) random_int(0, 999999999), 9, '0', STR_PAD_LEFT);
        }

        // Ubah format 62xxxx -> 08xxxx
        if (str_starts_with($digits, '62')) {
            $digits = '0' . substr($digits, 2);
        }

        // Jika dimulai dari 8xxxxx, jadikan 08xxxxx
        if (str_starts_with($digits, '8')) {
            $digits = '0' . $digits;
        }

        // Paksa prefix 08
        if (!str_starts_with($digits, '08')) {
            $digits = '08' . ltrim($digits, '0');
        }

        return $digits;
    }
}
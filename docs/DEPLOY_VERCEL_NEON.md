# Deploy Laravel ke Vercel + Neon PostgreSQL (Panduan Akurat)

Panduan ini untuk project **Iventaris-CVbams** yang sudah memakai:
- `vercel.json` + `api/index.php` (runtime `vercel-php`)
- konfigurasi PostgreSQL (`config/database.php` membaca `DATABASE_URL`)

---

## 1) Persiapan Neon Database

1. Buka: https://console.neon.tech
2. Buat project baru (region dekat user, contoh Singapore).
3. Setelah DB jadi, buka **Connection Details**.
4. Salin connection string format:

```txt
postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

5. Simpan ini untuk environment variable `DATABASE_URL` di Vercel.

> Catatan: untuk Laravel Anda bisa cukup pakai `DATABASE_URL`, tapi aman juga isi `DB_*` terpisah.

---

## 2) Push Project ke GitHub

Jika belum:

```bash
git add .
git commit -m "chore: prepare vercel + neon deployment"
git push origin main
```

---

## 3) Import Project ke Vercel

1. Buka: https://vercel.com/new
2. Import repository GitHub project ini.
3. Framework biarkan auto detect (Other/PHP runtime via `vercel.json`).
4. Deploy pertama boleh langsung, nanti env ditambah lalu redeploy.

### Penting: Setting Build & Output di Vercel

Jika muncul error:

`No Output Directory named "dist" found after the Build completed`

maka lakukan ini di Vercel Project → **Settings → Build and Output Settings**:

- **Framework Preset**: `Other`
- **Build Command**: *(kosongkan)* atau `php -v`
- **Output Directory**: *(kosongkan)*
- **Install Command**: default

Project ini bukan SPA React/Vue yang menghasilkan folder `dist`. Routing utama sudah ditangani oleh `vercel.json` + `api/index.php`.

> Catatan: `vercel.json` pada project ini sudah ditambahkan `"outputDirectory": "public"` untuk mencegah Vercel memaksa mencari `dist`.

---

## 4) Set Environment Variables di Vercel (PENTING)

Di Vercel Project → **Settings** → **Environment Variables**, isi:

### Wajib

- `APP_NAME` = `CV BAMS`
- `APP_ENV` = `production`
- `APP_DEBUG` = `false`
- `APP_URL` = `https://domain-anda.vercel.app`
- `APP_KEY` = *(generate dari lokal, lihat langkah di bawah)*

- `LOG_CHANNEL` = `stderr`
- `SESSION_DRIVER` = `cookie`

- `DB_CONNECTION` = `pgsql`
- `DATABASE_URL` = `postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require`
- `DB_SSLMODE` = `require`

### Disarankan (untuk kompatibilitas Laravel cache di serverless)

- `APP_CONFIG_CACHE` = `/tmp/config.php`
- `APP_EVENTS_CACHE` = `/tmp/events.php`
- `APP_PACKAGES_CACHE` = `/tmp/packages.php`
- `APP_ROUTES_CACHE` = `/tmp/routes.php`
- `VIEW_COMPILED_PATH` = `/tmp`

> Nilai di atas sudah konsisten dengan `vercel.json` project Anda.

---

## 5) Generate APP_KEY

Di lokal jalankan:

```bash
php artisan key:generate --show
```

Copy hasil `base64:...` lalu paste ke env var `APP_KEY` di Vercel.

---

## 6) Jalankan Migration ke Neon (dari lokal)

Karena Vercel serverless **bukan tempat ideal** untuk migrate interaktif, lakukan dari lokal:

1. Set `.env` lokal sementara ke DB Neon:
   - `DB_CONNECTION=pgsql`
   - `DATABASE_URL=postgresql://...`
   - `DB_SSLMODE=require`
2. Jalankan:

```bash
php artisan migrate --force
```

3. Jika perlu user awal/admin, jalankan seeder:

```bash
php artisan db:seed --force
```

---

## 7) Redeploy di Vercel

Setelah env sudah lengkap dan migrasi selesai:

1. Vercel → Deployments → pilih latest → **Redeploy**
2. Cek website.

---

## 8) Checklist Troubleshooting

### Error 500 setelah deploy
- Cek `APP_KEY` sudah diisi.
- Cek `APP_DEBUG=false` dan `LOG_CHANNEL=stderr`.
- Cek `DATABASE_URL` valid, tidak ada karakter terpotong.

### Tidak bisa konek database
- Pastikan Neon URL pakai `sslmode=require`.
- Cek `DB_CONNECTION=pgsql`.
- Cek password Neon tidak berubah.

### Session/login bermasalah
- Untuk Vercel serverless gunakan `SESSION_DRIVER=cookie`.

---

## 9) Rekomendasi Produksi

- Pakai domain custom di Vercel.
- Simpan backup SQL berkala dari Neon.
- Jangan commit `.env`.
- Kalau nanti butuh antrean job berat / PDF intensif, pertimbangkan worker terpisah (Railway/Render/VPS).

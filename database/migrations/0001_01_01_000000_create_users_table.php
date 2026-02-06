<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi untuk membuat tabel users, password_reset, dan sessions.
     */
    public function up(): void
    {
        // 1. TABEL USERS (Disesuaikan dengan UI & AuthController kamu)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name'); // Menampung Nama Lengkap dari Form Registrasi
            $table->string('username')->unique(); // Untuk Login menggunakan Username
            $table->string('password');
            $table->enum('role', ['super_admin', 'admin'])->default('admin'); // Pengatur hak akses
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. TABEL PASSWORD RESET (Bawaan Laravel, biarkan saja)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // 3. TABEL SESSIONS (Bawaan Laravel, biarkan saja)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Batalkan migrasi.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
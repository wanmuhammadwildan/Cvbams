<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
   public function up(): void
{
    Schema::create('customers', function (Blueprint $table) {
        $table->id();
        $table->string('customer_id_string')->unique();
        $table->string('full_name'); // Pastikan tulisannya 'full_name' bukan 'name'        $table->string('phone');
        $table->text('address');
        $table->string('package');
        $table->date('installation_date');
        $table->date('expiry_date')->nullable(); // TAMBAHKAN BARIS INI
        $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
        $table->string('phone')->nullable(); // Kolom yang menyebabkan error tadi
        $table->text('notes')->nullable();
        $table->timestamps();
    });
}

    public function down(): void {
        Schema::dropIfExists('customers');
    }
};
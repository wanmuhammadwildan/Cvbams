<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('invoices', function (Blueprint $table) {
        $table->id();
        $table->string('no_invoice')->unique();
        $table->foreignId('user_id'); // ID Pelanggan
        $table->decimal('amount', 15, 2); // Nominal tagihan
        $table->enum('status', ['lunas', 'pending', 'sebagian', 'overdue']);
        $table->enum('payment_method', ['tunai', 'transfer', 'e-wallet'])->nullable();
        $table->date('due_date'); // Jatuh tempo
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};

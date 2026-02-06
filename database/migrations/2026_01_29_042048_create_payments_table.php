<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel customers (ID database)
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('transaction_id')->unique(); 
            $table->integer('period_months');
            $table->decimal('amount_paid', 15, 2);
            $table->string('payment_method'); 
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
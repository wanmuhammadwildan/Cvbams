<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'customer_id', 
        'transaction_id', 
        'period_months', 
        'amount_paid', 
        'payment_method', 
        'paid_months', // WAJIB DITAMBAHKAN
        'previous_expiry_date',
        'notes'
    ];

    // Mengubah JSON di database otomatis menjadi Array di Laravel
    protected $casts = [
        'paid_months' => 'array',
        'previous_expiry_date' => 'date:Y-m-d',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
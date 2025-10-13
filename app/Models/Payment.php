<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\HasSnowflakeId;

class Payment extends Model
{
    use HasFactory, HasSnowflakeId;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'order_id',
        'payment_method',
        'payment_status',
        'amount',
        'currency',
        'transaction_id',
        'gateway_response',
        'processed_at',
    ];

    protected $casts = [
        'gateway_response' => 'array',
        'processed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}

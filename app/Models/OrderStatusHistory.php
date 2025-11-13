<?php

namespace App\Models;

use App\Models\Concerns\HasSnowflakeId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderStatusHistory extends Model
{
    use HasFactory, HasSnowflakeId;

    public $incrementing = false;
    protected $keyType = 'string';

    // Bảng này chỉ có created_at, không có updated_at
    const UPDATED_AT = null;

    protected $fillable = [
        'order_id',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

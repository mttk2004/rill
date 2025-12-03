<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Concerns\HasSnowflakeId;
use App\Services\OrderService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory, HasSnowflakeId, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'subtotal',
        'shipping_fee',
        'discount_amount',
        'total_amount',
        'shipping_address',
        'notes',
        'placed_at',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'shipping_address' => 'array',
        'placed_at' => 'datetime',
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'RL-' . strtoupper(Str::random(8));
            }
            if (empty($order->placed_at)) {
                $order->placed_at = now();
            }
        });

        // Auto-complete payment when order is delivered
        static::updated(function ($order) {
            if ($order->isDirty('status') && $order->status === OrderStatus::DELIVERED) {
                $payment = $order->payment;
                if ($payment && $payment->payment_status === PaymentStatus::PENDING) {
                    $payment->update(['payment_status' => PaymentStatus::COMPLETED]);
                }
            }
        });

        // Auto-create status history when status changes
        static::updated(function ($order) {
            if ($order->isDirty('status')) {
                $statusService = app(OrderService::class);
                $oldStatusEnum = $order->getOriginal('status');
                $oldStatus = $oldStatusEnum instanceof OrderStatus ? $oldStatusEnum->value : $oldStatusEnum;
                $newStatus = $order->status->value;

                // Get custom notes or generate automatic notes
                $notes = $order->status_change_notes ?? $statusService->generateStatusChangeNotes($oldStatus, $newStatus);

                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'status' => $newStatus,
                    'notes' => $notes,
                    'created_by' => auth()->id(),
                ]);
            }
        });

        // Create initial status history when order is created
        static::created(function ($order) {
            $statusService = app(OrderService::class);
            $notes = $order->status_change_notes ?? 'Đơn hàng mới được tạo, chờ xác nhận';

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $order->status->value,
                'notes' => $notes,
                'created_by' => auth()->id(),
            ]);
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function voucherUsages(): HasMany
    {
        return $this->hasMany(VoucherUsage::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }
}

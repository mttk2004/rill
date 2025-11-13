<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Concerns\HasSnowflakeId;
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
        'discount_amount',
        'total_amount',
        'currency',
        'shipping_address',
        'billing_address',
        'notes',
        'placed_at',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'placed_at' => 'datetime',
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
                $oldStatusEnum = $order->getOriginal('status');
                $oldStatus = $oldStatusEnum instanceof OrderStatus ? $oldStatusEnum->value : $oldStatusEnum;
                $newStatus = $order->status->value;

                // Get custom notes or generate automatic notes
                $notes = $order->status_change_notes ?? static::generateStatusChangeNotes($oldStatus, $newStatus);

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

    /**
     * Generate automatic notes based on status transition
     */
    private static function generateStatusChangeNotes(?string $oldStatus, string $newStatus): string
    {
        $isAdmin = auth()->check() && auth()->user()->role === 'admin';

        // Status transition messages
        $transitions = [
            'pending->confirmed' => $isAdmin
                ? 'Đã xác nhận đơn hàng, đang chuẩn bị hàng'
                : 'Đơn hàng đã được xác nhận',
            'pending->cancelled' => $isAdmin
                ? 'Đơn hàng đã bị hủy bởi quản trị viên'
                : 'Khách hàng yêu cầu hủy đơn hàng',
            'confirmed->shipped' => 'Đơn hàng đã được đóng gói và giao cho đơn vị vận chuyển',
            'confirmed->cancelled' => $isAdmin
                ? 'Đơn hàng đã bị hủy sau khi xác nhận'
                : 'Khách hàng yêu cầu hủy đơn hàng',
            'shipped->delivered' => 'Đơn hàng đã được giao thành công, khách hàng đã nhận hàng',
        ];

        // Direct status messages (không có oldStatus hoặc không match transition)
        $statusMessages = [
            'pending' => 'Đơn hàng đang chờ xác nhận',
            'confirmed' => 'Đơn hàng đã được xác nhận',
            'shipped' => 'Đơn hàng đang được vận chuyển',
            'delivered' => 'Đơn hàng đã được giao thành công',
            'cancelled' => $isAdmin
                ? 'Đơn hàng đã bị hủy bởi quản trị viên'
                : 'Đơn hàng đã bị hủy',
        ];

        // Try to find transition message first
        $transitionKey = $oldStatus ? "{$oldStatus}->{$newStatus}" : null;
        if ($transitionKey && isset($transitions[$transitionKey])) {
            return $transitions[$transitionKey];
        }

        // Fallback to direct status message
        return $statusMessages[$newStatus] ?? "Trạng thái đơn hàng đã được cập nhật thành {$newStatus}";
    }
}

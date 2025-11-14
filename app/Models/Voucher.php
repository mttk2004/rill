<?php

namespace App\Models;

use App\Models\Concerns\HasSnowflakeId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Voucher extends Model
{
    use HasFactory, HasSnowflakeId;

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'minimum_amount',
        'maximum_discount',
        'usage_limit',
        'used_count',
        'usage_limit_per_user',
        'valid_from',
        'valid_to',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'maximum_discount' => 'decimal:2',
        'usage_limit' => 'integer',
        'used_count' => 'integer',
        'usage_limit_per_user' => 'integer',
        'valid_from' => 'datetime',
        'valid_to' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the voucher usages.
     */
    public function usages(): HasMany
    {
        return $this->hasMany(VoucherUsage::class);
    }

    /**
     * Check if voucher is valid for use.
     */
    public function isValid(): bool
    {
        $now = now();

        return $this->is_active
            && $this->valid_from <= $now
            && $this->valid_to >= $now
            && ($this->usage_limit === null || $this->used_count < $this->usage_limit);
    }

    /**
     * Check if user can use this voucher.
     */
    public function canBeUsedByUser(int $userId): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        if ($this->usage_limit_per_user === null) {
            return true;
        }

        $userUsageCount = $this->usages()
            ->where('user_id', $userId)
            ->count();

        return $userUsageCount < $this->usage_limit_per_user;
    }

    /**
     * Calculate discount amount for given order total.
     */
    public function calculateDiscount(float $orderTotal): float
    {
        // Check minimum amount requirement
        if ($this->minimum_amount !== null && $orderTotal < $this->minimum_amount) {
            return 0;
        }

        // Calculate discount based on type
        $discount = match ($this->type) {
            'fixed' => $this->value,
            default => 0,
        };

        // Apply maximum discount cap
        if ($this->maximum_discount !== null && $discount > $this->maximum_discount) {
            $discount = $this->maximum_discount;
        }

        // Discount cannot exceed order total
        if ($discount > $orderTotal) {
            $discount = $orderTotal;
        }

        return $discount;
    }

    /**
     * Increment used count.
     */
    public function incrementUsedCount(): void
    {
        $this->increment('used_count');
    }

    /**
     * Decrement used count.
     */
    public function decrementUsedCount(): void
    {
        $this->decrement('used_count');
    }

    /**
     * Scope to get active vouchers only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get currently valid vouchers.
     */
    public function scopeCurrentlyValid($query)
    {
        $now = now();
        return $query->where('valid_from', '<=', $now)
            ->where('valid_to', '>=', $now);
    }

    /**
     * Scope to get available vouchers (with usage limit check).
     */
    public function scopeAvailable($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('usage_limit')
                ->orWhereColumn('used_count', '<', 'usage_limit');
        });
    }
}

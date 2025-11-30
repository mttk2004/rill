<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Concerns\HasSnowflakeId;

class OrderItem extends Model
{
    use HasFactory, HasSnowflakeId;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'product_sku',
        'quantity',
        'unit_price',
        'total_price',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    protected $appends = [
        'product_image',
        'product_slug',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get product image from related product
     */
    public function getProductImageAttribute(): ?string
    {
        return $this->product?->image_url;
    }

    /**
     * Get product slug from related product
     */
    public function getProductSlugAttribute(): ?string
    {
        return $this->product?->slug;
    }
}

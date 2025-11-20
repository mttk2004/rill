<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Models\Concerns\HasSnowflakeId;

class ProductReview extends Model
{
    use HasFactory, HasSnowflakeId, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'product_id',
        'user_id',
        'order_item_id',
        'rating',
        'comment',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
        'rating' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    /**
     * Get the full URLs for review images from Supabase Storage.
     */
    protected function images(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) return [];
                $paths = json_decode($value, true) ?? [];

                $supabaseUrl = env('SUPABASE_URL');
                $bucket = env('SUPABASE_BUCKET');

                return array_map(function ($path) use ($supabaseUrl, $bucket) {
                    // Nếu là URL ngoài (ảnh test cũ) thì giữ nguyên
                    if (filter_var($path, FILTER_VALIDATE_URL)) return $path;
                    // Nếu là path, nối với Supabase URL
                    return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$path}";
                }, $paths);
            }
        );
    }
}

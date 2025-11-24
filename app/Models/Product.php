<?php

namespace App\Models;

use App\Models\Concerns\HasSnowflakeId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, HasSnowflakeId, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'detailed_description',
        'sku',
        'price',
        'cost_price',
        'stock_quantity',
        'min_stock_level',
        'genre',
        'label',
        'image',
        'status',
        'meta_title',
        'meta_description',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
            if (empty($product->sku)) {
                $product->sku = 'VINYL-' . strtoupper(Str::random(8));
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->getOriginal('slug'))) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /**
     * Get the artists for the product.
     */
    public function artists(): BelongsToMany
    {
        return $this->belongsToMany(Artist::class)
            ->withPivot(['role', 'sort_order'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    /**
     * Get the main artists for the product.
     */
    public function mainArtists(): BelongsToMany
    {
        return $this->artists()->wherePivot('role', 'main');
    }

    /**
     * Get the featured artists for the product.
     */
    public function featuredArtists(): BelongsToMany
    {
        return $this->artists()->wherePivot('role', 'featured');
    }

    /**
     * Get the composers for the product.
     */
    public function composers(): BelongsToMany
    {
        return $this->artists()->wherePivot('role', 'composer');
    }

    /**
     * Get the producers for the product.
     */
    public function producers(): BelongsToMany
    {
        return $this->artists()->wherePivot('role', 'producer');
    }

    /**
     * Get the collections for the product.
     */
    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class, 'collection_product')
            ->withPivot('position')
            ->withTimestamps()
            ->orderByPivot('position');
    }

    /**
     * Get the first active collection for this product (for badge display).
     */
    public function firstActiveCollection()
    {
        return $this->collections()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('started_at')
                    ->orWhere('started_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ended_at')
                    ->orWhere('ended_at', '>=', now());
            })
            ->orderBy('display_order')
            ->first();
    }

    /**
     * Scope to get only active products.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }



    /**
     * Scope to get products by genre.
     */
    public function scopeByGenre($query, $genre)
    {
        return $query->where('genre', $genre);
    }

    /**
     * Scope to get products by label.
     */
    public function scopeByLabel($query, $label)
    {
        return $query->where('label', $label);
    }

    /**
     * Check if product is in stock.
     */
    public function isInStock(): bool
    {
        return $this->stock_quantity > 0 && $this->status !== 'out_of_stock';
    }

    /**
     * Check if product is low on stock.
     */
    public function isLowStock(): bool
    {
        return $this->stock_quantity <= $this->min_stock_level;
    }

    /**
     * Decrease stock quantity safely with pessimistic locking.
     *
     * @param int $quantity Amount to decrease
     * @throws \Exception if insufficient stock
     * @return void
     */
    public function decrementStock(int $quantity): void
    {
        if ($quantity <= 0) {
            throw new \InvalidArgumentException('Quantity must be greater than 0');
        }

        // Lock this product row to prevent race conditions
        $product = self::lockForUpdate()->find($this->id);

        if (!$product) {
            throw new \Exception("Product not found: {$this->id}");
        }

        if ($product->stock_quantity < $quantity) {
            throw new \Exception(
                "Sản phẩm '{$product->name}' không đủ số lượng. " .
                "Yêu cầu: {$quantity}, Còn lại: {$product->stock_quantity}"
            );
        }

        // Decrement stock
        $product->decrement('stock_quantity', $quantity);

        // Update status if out of stock
        if ($product->fresh()->stock_quantity === 0) {
            $product->update(['status' => 'out_of_stock']);
        }
    }

    /**
     * Increase stock quantity (e.g., when order is cancelled).
     *
     * @param int $quantity Amount to increase
     * @return void
     */
    public function incrementStock(int $quantity): void
    {
        if ($quantity <= 0) {
            throw new \InvalidArgumentException('Quantity must be greater than 0');
        }

        $this->increment('stock_quantity', $quantity);

        // Restore status if was out of stock
        if ($this->status === 'out_of_stock' && $this->fresh()->stock_quantity > 0) {
            $this->update(['status' => 'active']);
        }
    }

    /**
     * Get the shopping cart items for the product.
     */
    public function shoppingCartItems()
    {
        return $this->hasMany(ShoppingCartItem::class);
    }

    /**
     * Get the image URL attribute.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // Nếu là URL tuyệt đối (ảnh cũ hoặc link ngoài)
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        // Nếu đang lưu storage path, dùng URL của Supabase
        $supabaseUrl = env('SUPABASE_URL');
        $bucket = env('SUPABASE_BUCKET');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->image}";
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the order items for the product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the product reviews for the product.
     */
    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}

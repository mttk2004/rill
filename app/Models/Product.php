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
        'compare_price',
        'stock_quantity',
        'min_stock_level',
        'genre',
        'label',
        'image',
        'is_featured',
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
        'compare_price' => 'decimal:2',
        'is_featured' => 'boolean',
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
     * Scope to get only active products.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get only featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
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
        return $this->image ? asset('storage/' . $this->image) : null;
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

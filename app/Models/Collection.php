<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Collection extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($collection) {
            if (empty($collection->slug)) {
                $collection->slug = Str::slug($collection->name);
            }
        });

        static::updating(function ($collection) {
            if ($collection->isDirty('name') && empty($collection->getOriginal('slug'))) {
                $collection->slug = Str::slug($collection->name);
            }
        });
    }

    /**
     * Get the products for the collection.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'collection_product')
            ->withPivot('position')
            ->withTimestamps()
            ->orderBy('collection_product.position');
    }

    /**
     * Scope to get only active collections.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get collections by type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get featured collections.
     */
    public function scopeFeatured($query)
    {
        return $query->where('type', 'featured');
    }

    /**
     * Scope to get banner collections.
     */
    public function scopeBanner($query)
    {
        return $query->where('type', 'banner');
    }

    /**
     * Scope to get promotion collections.
     */
    public function scopePromotion($query)
    {
        return $query->where('type', 'promotion');
    }

    /**
     * Scope to get curated collections.
     */
    public function scopeCurated($query)
    {
        return $query->where('type', 'curated');
    }

    /**
     * Check if collection is currently active.
     */
    public function isCurrentlyActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}

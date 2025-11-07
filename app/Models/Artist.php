<?php

namespace App\Models;

use App\Models\Concerns\HasSnowflakeId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Artist extends Model
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
        'image',
        'country',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_active' => 'boolean',
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

        static::creating(function ($artist) {
            if (empty($artist->slug)) {
                $artist->slug = Str::slug($artist->name);
            }
        });

        static::updating(function ($artist) {
            if ($artist->isDirty('name') && empty($artist->getOriginal('slug'))) {
                $artist->slug = Str::slug($artist->name);
            }
        });
    }

    /**
     * Get the products for the artist.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class)
            ->withPivot(['role', 'sort_order'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    /**
     * Get the main products for the artist.
     */
    public function mainProducts(): BelongsToMany
    {
        return $this->products()->wherePivot('role', 'main');
    }

    /**
     * Get the featured products for the artist.
     */
    public function featuredProducts(): BelongsToMany
    {
        return $this->products()->wherePivot('role', 'featured');
    }

    /**
     * Scope to get only active artists.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the artist's image URL.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // If it's already a full URL, return it
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        // Otherwise, prepend the storage path
        return asset('storage/' . $this->image);
    }
}

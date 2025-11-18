<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Concerns\HasSnowflakeId;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, HasSnowflakeId;

    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'gender',
        'date_of_birth',
        'avatar',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'is_active' => 'boolean',
        ];
    }

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'avatar_url',
    ];

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is customer
     */
    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    /**
     * Get the avatar URL attribute.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar) {
            return null;
        }

        // If it's already a full URL, return it
        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }

        // Otherwise, use Supabase URL
        $supabaseUrl = env('SUPABASE_URL');
        $bucket = env('SUPABASE_BUCKET');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->avatar}";
    }

    /**
     * Get the shipping addresses for the user.
     */
    public function shippingAddresses()
    {
        return $this->hasMany(ShippingAddress::class);
    }

    /**
     * Get the default shipping address for the user.
     */
    public function defaultShippingAddress()
    {
        return $this->hasOne(ShippingAddress::class)->where('is_default', true);
    }

    /**
     * Get the shopping cart items for the user.
     */
    public function shoppingCartItems()
    {
        return $this->hasMany(ShoppingCartItem::class);
    }

    /**
     * Get the orders for the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the product reviews for the user.
     */
    public function productReviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * Get the voucher usages for the user.
     */
    public function voucherUsages()
    {
        return $this->hasMany(VoucherUsage::class);
    }
}

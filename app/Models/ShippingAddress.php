<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Concerns\HasSnowflakeId;

class ShippingAddress extends Model
{
    use HasFactory, HasSnowflakeId;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'address_line_1',
        'address_line_2',
        'province',
        'province_id',
        'district',
        'district_id',
        'ward',
        'ward_id',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'province_id' => 'integer',
        'district_id' => 'integer',
    ];

    protected $appends = ['name', 'address', 'city'];

    /**
     * Get name attribute (alias for full_name).
     */
    public function getNameAttribute(): ?string
    {
        return $this->full_name;
    }

    /**
     * Get address attribute (alias for address_line_1).
     */
    public function getAddressAttribute(): ?string
    {
        return $this->address_line_1;
    }

    /**
     * Get city attribute (alias for province).
     */
    public function getCityAttribute(): ?string
    {
        return $this->province;
    }

    /**
     * Get the user that owns the shipping address.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::saving(function (self $address) {
            // Ensure only one default address per user
            if ($address->is_default) {
                self::where('user_id', $address->user_id)
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }
        });
    }
}

<?php

namespace App\DataObjects;

use Illuminate\Http\Request;

/**
 * Base Data Transfer Object
 *
 * Abstract class for all DTOs in the application.
 * Provides common methods for creating DTOs from various sources.
 */
abstract class BaseData
{
    /**
     * Create DTO from validated request data.
     *
     * @param Request $request
     * @return static
     */
    public static function fromRequest(Request $request): static
    {
        return static::from($request->validated());
    }

    /**
     * Create DTO from array.
     *
     * @param array $data
     * @return static
     */
    public static function from(array $data): static
    {
        return new static(...$data);
    }

    /**
     * Convert DTO to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return get_object_vars($this);
    }

    /**
     * Convert DTO to JSON.
     *
     * @param int $options
     * @return string
     */
    public function toJson(int $options = 0): string
    {
        return json_encode($this->toArray(), $options);
    }
}

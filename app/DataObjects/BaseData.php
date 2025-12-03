<?php

namespace App\DataObjects;

use Illuminate\Http\Request;

/**
 * Base Data Transfer Object
 *
 * Abstract class for all DTOs in the application.
 * Child classes should implement their own static factory methods as needed.
 */
abstract class BaseData
{
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

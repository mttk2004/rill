<?php

namespace App\DataObjects\Setting;

use App\DataObjects\BaseData;

/**
 * DTO for setting data
 */
readonly class SettingData extends BaseData
{
    public function __construct(
        public string $key,
        public mixed $value,
        public string $type = 'text',
        public ?string $group = null,
        public ?string $label = null,
        public ?string $description = null,
    ) {}

    /**
     * Validate setting data
     */
    public function validate(): array
    {
        $errors = [];

        if (empty($this->key)) {
            $errors['key'] = 'Setting key is required';
        }

        if (!in_array($this->type, ['text', 'number', 'boolean', 'json'])) {
            $errors['type'] = 'Invalid setting type. Must be: text, number, boolean, or json';
        }

        return $errors;
    }

    /**
     * Cast value based on type
     */
    public function getCastedValue(): mixed
    {
        return match ($this->type) {
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'number' => is_numeric($this->value) ? (int) $this->value : $this->value,
            'json' => is_string($this->value) ? json_decode($this->value, true) : $this->value,
            default => $this->value,
        };
    }

    /**
     * Create from database model
     */
    public static function fromModel(object $setting): self
    {
        return new self(
            key: $setting->key,
            value: $setting->value,
            type: $setting->type ?? 'text',
            group: $setting->group ?? null,
            label: $setting->label ?? null,
            description: $setting->description ?? null,
        );
    }
}

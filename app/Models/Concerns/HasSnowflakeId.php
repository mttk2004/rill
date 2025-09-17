<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\App;

trait HasSnowflakeId
{
    protected static function bootHasSnowflakeId(): void
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = App::make('snowflake')->id();
            }
        });
    }

    public function getIncrementing(): bool
    {
        return false;
    }

    public function getKeyType(): string
    {
        return 'string';
    }
}

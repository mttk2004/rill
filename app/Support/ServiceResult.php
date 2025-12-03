<?php

namespace App\Support;

/**
 * Service Result
 *
 * Standardized response object for service layer operations.
 * Provides consistent return values across all services.
 */
final class ServiceResult
{
    /**
     * ServiceResult constructor.
     *
     * @param bool $success
     * @param mixed $data
     * @param string|null $message
     * @param array|null $errors
     */
    private function __construct(
        public readonly bool $success,
        public readonly mixed $data = null,
        public readonly ?string $message = null,
        public readonly ?array $errors = null
    ) {}

    /**
     * Create a successful result.
     *
     * @param mixed $data
     * @param string|null $message
     * @return self
     */
    public static function success(mixed $data = null, ?string $message = null): self
    {
        return new self(true, $data, $message);
    }

    /**
     * Create an error result.
     *
     * @param string $message
     * @param array|null $errors
     * @return self
     */
    public static function error(string $message, ?array $errors = null): self
    {
        return new self(false, null, $message, $errors);
    }

    /**
     * Check if result is successful.
     *
     * @return bool
     */
    public function isSuccess(): bool
    {
        return $this->success;
    }

    /**
     * Check if result is an error.
     *
     * @return bool
     */
    public function isError(): bool
    {
        return !$this->success;
    }

    /**
     * Get the data if successful, or throw exception.
     *
     * @return mixed
     * @throws \RuntimeException
     */
    public function getData(): mixed
    {
        if ($this->isError()) {
            throw new \RuntimeException($this->message ?? 'Operation failed');
        }

        return $this->data;
    }

    /**
     * Convert result to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'success' => $this->success,
            'data' => $this->data,
            'message' => $this->message,
            'errors' => $this->errors,
        ];
    }

    /**
     * Convert result to JSON.
     *
     * @param int $options
     * @return string
     */
    public function toJson(int $options = 0): string
    {
        return json_encode($this->toArray(), $options);
    }
}

<?php

namespace App\Services\Responses;

/**
 * Standardized service response object.
 *
 * Provides consistent return types across all services with type safety.
 */
readonly class ServiceResponse
{
    /**
     * Create a new service response.
     *
     * @param bool $success Whether the operation was successful
     * @param string $message Human-readable message
     * @param mixed $data Optional data payload
     * @param string|null $errorCode Optional error code for failed responses
     */
    public function __construct(
        public bool $success,
        public string $message,
        public mixed $data = null,
        public ?string $errorCode = null
    ) {}

    /**
     * Create a successful response.
     *
     * @param string $message Success message
     * @param mixed $data Optional data payload
     * @return self
     */
    public static function success(string $message, mixed $data = null): self
    {
        return new self(
            success: true,
            message: $message,
            data: $data
        );
    }

    /**
     * Create an error response.
     *
     * @param string $message Error message
     * @param string|null $errorCode Optional error code
     * @return self
     */
    public static function error(string $message, ?string $errorCode = null): self
    {
        return new self(
            success: false,
            message: $message,
            data: null,
            errorCode: $errorCode
        );
    }

    /**
     * Check if the response is successful.
     *
     * @return bool
     */
    public function isSuccess(): bool
    {
        return $this->success;
    }

    /**
     * Check if the response is an error.
     *
     * @return bool
     */
    public function isError(): bool
    {
        return !$this->success;
    }

    /**
     * Convert to array format (for backward compatibility).
     *
     * @return array{success: bool, message: string, data: mixed, errorCode: string|null}
     */
    public function toArray(): array
    {
        return [
            'success' => $this->success,
            'message' => $this->message,
            'data' => $this->data,
            'errorCode' => $this->errorCode,
        ];
    }
}

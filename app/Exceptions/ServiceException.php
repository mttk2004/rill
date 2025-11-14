<?php

namespace App\Exceptions;

use Exception;
use Throwable;

class ServiceException extends Exception
{
    /**
     * Error code for the exception.
     */
    protected string $errorCode;

    /**
     * Additional data to include in the response.
     */
    protected mixed $data;

    /**
     * HTTP status code.
     */
    protected int $statusCode;

    /**
     * Create a new ServiceException instance.
     *
     * @param string $message
     * @param string $errorCode
     * @param mixed $data
     * @param int $statusCode
     * @param Throwable|null $previous
     */
    public function __construct(
        string $message = "",
        string $errorCode = "SERVICE_ERROR",
        mixed $data = null,
        int $statusCode = 400,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);
        $this->errorCode = $errorCode;
        $this->data = $data;
        $this->statusCode = $statusCode;
    }

    /**
     * Get the error code.
     */
    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    /**
     * Get additional data.
     */
    public function getData(): mixed
    {
        return $this->data;
    }

    /**
     * Get HTTP status code.
     */
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * Convert exception to array format.
     */
    public function toArray(): array
    {
        return [
            'success' => false,
            'message' => $this->getMessage(),
            'error_code' => $this->errorCode,
            'data' => $this->data,
        ];
    }

    /**
     * Create a validation error exception.
     */
    public static function validationError(string $message, mixed $data = null): self
    {
        return new self($message, 'VALIDATION_ERROR', $data, 422);
    }

    /**
     * Create a not found exception.
     */
    public static function notFound(string $message, string $errorCode = 'NOT_FOUND'): self
    {
        return new self($message, $errorCode, null, 404);
    }

    /**
     * Create an unauthorized exception.
     */
    public static function unauthorized(string $message, string $errorCode = 'UNAUTHORIZED'): self
    {
        return new self($message, $errorCode, null, 403);
    }

    /**
     * Create a business logic error exception.
     */
    public static function businessError(string $message, string $errorCode, mixed $data = null): self
    {
        return new self($message, $errorCode, $data, 400);
    }
}

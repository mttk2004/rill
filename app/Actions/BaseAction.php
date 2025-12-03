<?php

namespace App\Actions;

use App\Support\ServiceResult;

/**
 * Base Action
 *
 * Abstract class for all action classes in the application.
 * Actions encapsulate single-purpose business operations.
 */
abstract class BaseAction
{
    /**
     * Execute the action.
     *
     * @param mixed ...$params
     * @return ServiceResult
     */
    abstract public function execute(...$params): ServiceResult;

    /**
     * Create a success result.
     *
     * @param mixed $data
     * @param string|null $message
     * @return ServiceResult
     */
    protected function success(mixed $data = null, ?string $message = null): ServiceResult
    {
        return ServiceResult::success($data, $message);
    }

    /**
     * Create an error result.
     *
     * @param string $message
     * @param array|null $errors
     * @return ServiceResult
     */
    protected function error(string $message, ?array $errors = null): ServiceResult
    {
        return ServiceResult::error($message, $errors);
    }

    /**
     * Validate that a condition is true, or return an error result.
     *
     * @param bool $condition
     * @param string $errorMessage
     * @return ServiceResult|null Returns null if validation passes, error result otherwise
     */
    protected function validate(bool $condition, string $errorMessage): ?ServiceResult
    {
        if (!$condition) {
            return $this->error($errorMessage);
        }

        return null;
    }

    /**
     * Execute a callback within a database transaction.
     *
     * @param callable $callback
     * @return ServiceResult
     */
    protected function transaction(callable $callback): ServiceResult
    {
        try {
            \DB::beginTransaction();

            $result = $callback();

            \DB::commit();

            return $result instanceof ServiceResult
                ? $result
                : $this->success($result);

        } catch (\Exception $e) {
            \DB::rollBack();

            return $this->error(
                'Có lỗi xảy ra: ' . $e->getMessage(),
                ['exception' => $e->getMessage(), 'trace' => $e->getTraceAsString()]
            );
        }
    }
}

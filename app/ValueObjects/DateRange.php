<?php

namespace App\ValueObjects;

use Carbon\Carbon;
use InvalidArgumentException;

/**
 * DateRange Value Object
 *
 * Immutable value object representing a date range.
 * Ensures start date is always before or equal to end date.
 */
readonly class DateRange
{
    public function __construct(
        public Carbon $startDate,
        public Carbon $endDate
    ) {
        if ($startDate->isAfter($endDate)) {
            throw new InvalidArgumentException('Start date must be before or equal to end date');
        }
    }

    /**
     * Create date range for today.
     *
     * @return static
     */
    public static function today(): static
    {
        return new static(
            Carbon::today(),
            Carbon::today()->endOfDay()
        );
    }

    /**
     * Create date range for this week.
     *
     * @return static
     */
    public static function thisWeek(): static
    {
        return new static(
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        );
    }

    /**
     * Create date range for this month.
     *
     * @return static
     */
    public static function thisMonth(): static
    {
        return new static(
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth()
        );
    }

    /**
     * Create date range for this year.
     *
     * @return static
     */
    public static function thisYear(): static
    {
        return new static(
            Carbon::now()->startOfYear(),
            Carbon::now()->endOfYear()
        );
    }

    /**
     * Create date range for last N days.
     *
     * @param int $days
     * @return static
     */
    public static function lastDays(int $days): static
    {
        return new static(
            Carbon::now()->subDays($days)->startOfDay(),
            Carbon::now()->endOfDay()
        );
    }

    /**
     * Create date range for last N months.
     *
     * @param int $months
     * @return static
     */
    public static function lastMonths(int $months): static
    {
        return new static(
            Carbon::now()->subMonths($months)->startOfMonth(),
            Carbon::now()->endOfMonth()
        );
    }

    /**
     * Get number of days in the range.
     *
     * @return int
     */
    public function getDays(): int
    {
        return $this->startDate->diffInDays($this->endDate) + 1;
    }

    /**
     * Check if a date is within the range.
     *
     * @param Carbon $date
     * @return bool
     */
    public function contains(Carbon $date): bool
    {
        return $date->between($this->startDate, $this->endDate);
    }

    /**
     * Check if this range overlaps with another.
     *
     * @param DateRange $other
     * @return bool
     */
    public function overlaps(DateRange $other): bool
    {
        return $this->startDate->lessThanOrEqualTo($other->endDate)
            && $this->endDate->greaterThanOrEqualTo($other->startDate);
    }

    /**
     * Format the date range as string.
     *
     * @param string $format
     * @param string $separator
     * @return string
     */
    public function format(string $format = 'Y-m-d', string $separator = ' to '): string
    {
        return $this->startDate->format($format) . $separator . $this->endDate->format($format);
    }

    /**
     * Convert to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'start_date' => $this->startDate->toDateString(),
            'end_date' => $this->endDate->toDateString(),
            'days' => $this->getDays(),
        ];
    }
}

<?php

namespace App\ValueObjects;

use InvalidArgumentException;

/**
 * Money Value Object
 *
 * Immutable value object representing monetary amounts.
 * Ensures money is always handled with proper precision.
 */
readonly class Money
{
    public function __construct(
        public float $amount,
        public string $currency = 'VND'
    ) {
        if ($amount < 0) {
            throw new InvalidArgumentException('Money amount cannot be negative');
        }
    }

    /**
     * Create from cents/smallest unit.
     *
     * @param int $cents
     * @param string $currency
     * @return static
     */
    public static function fromCents(int $cents, string $currency = 'VND'): static
    {
        return new static($cents / 100, $currency);
    }

    /**
     * Add another money amount.
     *
     * @param Money $other
     * @return static
     * @throws InvalidArgumentException
     */
    public function add(Money $other): static
    {
        $this->ensureSameCurrency($other);
        return new static($this->amount + $other->amount, $this->currency);
    }

    /**
     * Subtract another money amount.
     *
     * @param Money $other
     * @return static
     * @throws InvalidArgumentException
     */
    public function subtract(Money $other): static
    {
        $this->ensureSameCurrency($other);

        if ($this->amount < $other->amount) {
            throw new InvalidArgumentException('Cannot subtract more than current amount');
        }

        return new static($this->amount - $other->amount, $this->currency);
    }

    /**
     * Multiply by a factor.
     *
     * @param int|float $multiplier
     * @return static
     */
    public function multiply(int|float $multiplier): static
    {
        if ($multiplier < 0) {
            throw new InvalidArgumentException('Multiplier cannot be negative');
        }

        return new static($this->amount * $multiplier, $this->currency);
    }

    /**
     * Check if equal to another money amount.
     *
     * @param Money $other
     * @return bool
     */
    public function equals(Money $other): bool
    {
        return $this->currency === $other->currency
            && abs($this->amount - $other->amount) < 0.01;
    }

    /**
     * Check if greater than another money amount.
     *
     * @param Money $other
     * @return bool
     */
    public function greaterThan(Money $other): bool
    {
        $this->ensureSameCurrency($other);
        return $this->amount > $other->amount;
    }

    /**
     * Check if less than another money amount.
     *
     * @param Money $other
     * @return bool
     */
    public function lessThan(Money $other): bool
    {
        $this->ensureSameCurrency($other);
        return $this->amount < $other->amount;
    }

    /**
     * Format as string with currency symbol.
     *
     * @return string
     */
    public function format(): string
    {
        return match ($this->currency) {
            'VND' => number_format($this->amount, 0, ',', '.') . ' ₫',
            'USD' => '$' . number_format($this->amount, 2, '.', ','),
            default => number_format($this->amount, 2, '.', ',') . ' ' . $this->currency,
        };
    }

    /**
     * Get as cents/smallest unit.
     *
     * @return int
     */
    public function toCents(): int
    {
        return (int) round($this->amount * 100);
    }

    /**
     * Convert to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'amount' => $this->amount,
            'currency' => $this->currency,
            'formatted' => $this->format(),
        ];
    }

    /**
     * Ensure same currency for operations.
     *
     * @param Money $other
     * @return void
     * @throws InvalidArgumentException
     */
    private function ensureSameCurrency(Money $other): void
    {
        if ($this->currency !== $other->currency) {
            throw new InvalidArgumentException('Cannot operate on different currencies');
        }
    }
}

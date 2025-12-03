<?php

namespace App\DataObjects\Payment;

use App\DataObjects\BaseData;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;

/**
 * Payment Data Transfer Object
 *
 * Encapsulates payment information for order processing.
 */
readonly class PaymentData extends BaseData
{
    public function __construct(
        public int $orderId,
        public PaymentMethod $paymentMethod,
        public float $amount,
        public PaymentStatus $paymentStatus = PaymentStatus::PENDING,
        public ?string $transactionId = null,
        public ?string $vnpayData = null,
        public ?array $metadata = null,
    ) {}

    /**
     * Create for COD payment.
     *
     * @param int $orderId
     * @param float $amount
     * @return static
     */
    public static function forCOD(int $orderId, float $amount): static
    {
        return new static(
            orderId: $orderId,
            paymentMethod: PaymentMethod::COD,
            amount: $amount,
            paymentStatus: PaymentStatus::PENDING,
        );
    }

    /**
     * Create for VNPay payment.
     *
     * @param int $orderId
     * @param float $amount
     * @param string $transactionId
     * @param array $vnpayData
     * @return static
     */
    public static function forVNPay(int $orderId, float $amount, string $transactionId, array $vnpayData): static
    {
        return new static(
            orderId: $orderId,
            paymentMethod: PaymentMethod::VNPAY,
            amount: $amount,
            paymentStatus: PaymentStatus::PENDING,
            transactionId: $transactionId,
            vnpayData: json_encode($vnpayData),
        );
    }

    /**
     * Check if payment is COD.
     *
     * @return bool
     */
    public function isCOD(): bool
    {
        return $this->paymentMethod === PaymentMethod::COD;
    }

    /**
     * Check if payment is VNPay.
     *
     * @return bool
     */
    public function isVNPay(): bool
    {
        return $this->paymentMethod === PaymentMethod::VNPAY;
    }

    /**
     * Check if payment is completed.
     *
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this->paymentStatus === PaymentStatus::COMPLETED;
    }

    /**
     * Check if payment is pending.
     *
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->paymentStatus === PaymentStatus::PENDING;
    }

    /**
     * Check if payment has failed.
     *
     * @return bool
     */
    public function hasFailed(): bool
    {
        return $this->paymentStatus === PaymentStatus::FAILED;
    }
}

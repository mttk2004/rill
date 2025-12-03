<?php

namespace App\DataObjects\Payment;

use App\DataObjects\BaseData;

/**
 * Vnpay Callback Data DTO
 *
 * Data transfer object for VNPAY callback/return data.
 */
class VnpayCallbackData extends BaseData
{
    public function __construct(
        public readonly string $txnRef,
        public readonly string $amount,
        public readonly string $bankCode,
        public readonly string $bankTranNo,
        public readonly string $cardType,
        public readonly string $orderInfo,
        public readonly string $payDate,
        public readonly string $responseCode,
        public readonly string $tmnCode,
        public readonly string $transactionNo,
        public readonly string $transactionStatus,
        public readonly string $secureHash,
        public readonly array $rawData,
    ) {
        $this->validate();
    }

    /**
     * Validate the data.
     */
    protected function validate(): void
    {
        if (empty($this->txnRef)) {
            throw new \InvalidArgumentException('Transaction reference is required');
        }

        if (empty($this->responseCode)) {
            throw new \InvalidArgumentException('Response code is required');
        }

        if (empty($this->secureHash)) {
            throw new \InvalidArgumentException('Secure hash is required');
        }
    }

    /**
     * Create from request data array.
     */
    public static function fromArray(array $data): self
    {
        return new self(
            txnRef: $data['vnp_TxnRef'] ?? '',
            amount: $data['vnp_Amount'] ?? '0',
            bankCode: $data['vnp_BankCode'] ?? '',
            bankTranNo: $data['vnp_BankTranNo'] ?? '',
            cardType: $data['vnp_CardType'] ?? '',
            orderInfo: $data['vnp_OrderInfo'] ?? '',
            payDate: $data['vnp_PayDate'] ?? '',
            responseCode: $data['vnp_ResponseCode'] ?? '',
            tmnCode: $data['vnp_TmnCode'] ?? '',
            transactionNo: $data['vnp_TransactionNo'] ?? '',
            transactionStatus: $data['vnp_TransactionStatus'] ?? '',
            secureHash: $data['vnp_SecureHash'] ?? '',
            rawData: $data,
        );
    }

    /**
     * Check if payment was successful.
     */
    public function isSuccessful(): bool
    {
        return $this->responseCode === '00' && $this->transactionStatus === '00';
    }

    /**
     * Get order ID from transaction reference.
     */
    public function getOrderId(): int
    {
        return (int) $this->txnRef;
    }

    /**
     * Get actual amount (divide by 100 as per VNPAY format).
     */
    public function getActualAmount(): float
    {
        return (float) $this->amount / 100;
    }

    /**
     * Get data for hash verification (without secure hash).
     */
    public function getDataForHash(): array
    {
        $data = $this->rawData;
        unset($data['vnp_SecureHash'], $data['vnp_SecureHashType']);
        ksort($data);

        return $data;
    }
}

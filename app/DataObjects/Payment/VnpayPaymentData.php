<?php

namespace App\DataObjects\Payment;

use App\DataObjects\BaseData;

/**
 * Vnpay Payment Data DTO
 *
 * Data transfer object for creating VNPAY payment.
 */
readonly class VnpayPaymentData extends BaseData
{
    public function __construct(
        public readonly int $orderId,
        public readonly float $amount,
        public readonly string $orderInfo,
        public readonly string $ipAddress,
        public readonly ?string $locale = 'vn',
        public readonly ?string $orderType = 'other',
    ) {
        $this->validate();
    }

    /**
     * Validate the data.
     */
    protected function validate(): void
    {
        if ($this->amount <= 0) {
            throw new \InvalidArgumentException('Payment amount must be greater than 0');
        }

        if (empty($this->orderInfo)) {
            throw new \InvalidArgumentException('Order info is required');
        }

        if (empty($this->ipAddress)) {
            throw new \InvalidArgumentException('IP address is required');
        }

        if (!in_array($this->locale, ['vn', 'en'])) {
            throw new \InvalidArgumentException('Locale must be either vn or en');
        }
    }

    /**
     * Create from order.
     */
    public static function fromOrder(\App\Models\Order $order, string $ipAddress): self
    {
        return new self(
            orderId: $order->id,
            amount: (float) $order->total_amount,
            orderInfo: "Thanh toan don hang #{$order->order_number}",
            ipAddress: $ipAddress,
        );
    }

    /**
     * Convert to VNPAY parameters array.
     */
    public function toVnpayParams(string $tmnCode, string $returnUrl): array
    {
        return [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => $tmnCode,
            'vnp_Amount' => (int) ($this->amount * 100), // VNPAY requires amount * 100
            'vnp_CurrCode' => 'VND',
            'vnp_TxnRef' => (string) $this->orderId,
            'vnp_OrderInfo' => $this->orderInfo,
            'vnp_OrderType' => $this->orderType,
            'vnp_Locale' => $this->locale,
            'vnp_ReturnUrl' => $returnUrl,
            'vnp_IpAddr' => $this->ipAddress,
            'vnp_CreateDate' => now()->format('YmdHis'),
        ];
    }
}

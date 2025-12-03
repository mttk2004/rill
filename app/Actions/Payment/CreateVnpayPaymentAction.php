<?php

namespace App\Actions\Payment;

use App\Actions\BaseAction;
use App\DataObjects\Payment\VnpayPaymentData;
use App\Support\ServiceResult;

/**
 * Create Vnpay Payment Action
 *
 * Single responsibility: Generate VNPAY payment URL with proper signature.
 */
class CreateVnpayPaymentAction extends BaseAction
{
    protected string $tmnCode;
    protected string $hashSecret;
    protected string $vnpayUrl;
    protected string $returnUrl;

    public function __construct()
    {
        $this->tmnCode = config('vnpay.tmn_code');
        $this->hashSecret = config('vnpay.hash_secret');
        $this->vnpayUrl = config('vnpay.url');
        $this->returnUrl = url(config('vnpay.return_url'));
    }

    /**
     * Execute payment URL creation.
     *
     * @param VnpayPaymentData $data
     * @return ServiceResult
     */
    public function execute(VnpayPaymentData $data): ServiceResult
    {
        try {
            // Convert DTO to VNPAY parameters
            $vnpParams = $data->toVnpayParams($this->tmnCode, $this->returnUrl);

            // Sort parameters alphabetically
            ksort($vnpParams);

            // Create query string
            $query = http_build_query($vnpParams);

            // Generate secure hash
            $secureHash = hash_hmac('sha512', $query, $this->hashSecret);

            // Build payment URL
            $paymentUrl = $this->vnpayUrl . '?' . $query . '&vnp_SecureHash=' . $secureHash;

            return $this->success([
                'payment_url' => $paymentUrl,
                'txn_ref' => $data->orderId,
                'amount' => $data->amount,
            ], 'Payment URL created successfully');

        } catch (\Exception $e) {
            return $this->error('Failed to create payment URL: ' . $e->getMessage());
        }
    }

    /**
     * Generate secure hash for parameters.
     *
     * @param array $params
     * @return string
     */
    protected function generateSecureHash(array $params): string
    {
        ksort($params);
        $hashData = http_build_query($params);

        return hash_hmac('sha512', $hashData, $this->hashSecret);
    }
}

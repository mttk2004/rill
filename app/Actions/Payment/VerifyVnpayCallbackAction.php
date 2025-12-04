<?php

namespace App\Actions\Payment;

use App\Actions\BaseAction;
use App\DataObjects\Payment\VnpayCallbackData;
use App\Support\ServiceResult;

/**
 * Verify Vnpay Callback Action
 *
 * Single responsibility: Verify VNPAY callback signature and data integrity.
 */
class VerifyVnpayCallbackAction extends BaseAction
{
    protected string $hashSecret;

    public function __construct()
    {
        $this->hashSecret = config('vnpay.hash_secret');
    }

    /**
     * Execute callback verification.
     *
     * @param VnpayCallbackData $data
     * @return ServiceResult
     */
    public function execute(VnpayCallbackData $data): ServiceResult
    {
        try {
            // Verify signature
            if (!$this->isValidSignature($data)) {
                return $this->error('Invalid signature', [
                    'code' => 'INVALID_SIGNATURE',
                ]);
            }

            // Note: We don't reject failed payments here
            // ProcessVnpayIPNAction will handle both success and failed cases
            // This allows us to update payment status to 'failed' when needed

            return $this->success([
                'order_id' => $data->getOrderId(),
                'amount' => $data->getActualAmount(),
                'transaction_no' => $data->transactionNo,
                'bank_code' => $data->bankCode,
                'pay_date' => $data->payDate,
                'is_successful' => $data->isSuccessful(),
                'response_code' => $data->responseCode,
                'response_message' => $this->getResponseMessage($data->responseCode),
            ], 'Callback verified successfully');

        } catch (\Exception $e) {
            return $this->error('Failed to verify payment: ' . $e->getMessage());
        }
    }

    /**
     * Validate VNPAY signature.
     *
     * @param VnpayCallbackData $data
     * @return bool
     */
    protected function isValidSignature(VnpayCallbackData $data): bool
    {
        $dataForHash = $data->getDataForHash();
        $hashData = http_build_query($dataForHash);
        $secureHash = hash_hmac('sha512', $hashData, $this->hashSecret);

        return hash_equals($secureHash, $data->secureHash);
    }

    /**
     * Get response message from VNPAY response code.
     *
     * @param string $responseCode
     * @return string
     */
    protected function getResponseMessage(string $responseCode): string
    {
        $messages = [
            '00' => 'Giao dịch thành công',
            '07' => 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
            '09' => 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng',
            '10' => 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            '11' => 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch',
            '12' => 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
            '13' => 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
            '24' => 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
            '51' => 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
            '65' => 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá giới hạn giao dịch trong ngày',
            '75' => 'Ngân hàng thanh toán đang bảo trì',
            '79' => 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định',
            '99' => 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
        ];

        return $messages[$responseCode] ?? 'Lỗi không xác định';
    }
}

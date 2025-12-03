<?php

namespace App\Services;

use App\Actions\Payment\CreateVnpayPaymentAction;
use App\Actions\Payment\ProcessVnpayIPNAction;
use App\Actions\Payment\VerifyVnpayCallbackAction;
use App\DataObjects\Payment\VnpayCallbackData;
use App\DataObjects\Payment\VnpayPaymentData;
use App\Models\Order;
use App\Support\ServiceResult;

/**
 * Vnpay Service Refactored
 *
 * Clean Architecture implementation for VNPAY payment gateway integration.
 * Uses Actions for business logic, DTOs for data transfer.
 */
class VnpayService
{
    public function __construct(
        protected CreateVnpayPaymentAction $createPaymentAction,
        protected VerifyVnpayCallbackAction $verifyCallbackAction,
        protected ProcessVnpayIPNAction $processIPNAction,
    ) {}

    /**
     * Create payment URL for order.
     *
     * @param Order $order
     * @param string $ipAddress
     * @return ServiceResult
     */
    public function createPaymentUrl(Order $order, string $ipAddress): ServiceResult
    {
        $paymentData = VnpayPaymentData::fromOrder($order, $ipAddress);

        return $this->createPaymentAction->execute($paymentData);
    }

    /**
     * Verify payment callback from VNPAY.
     *
     * @param array $callbackData
     * @return ServiceResult
     */
    public function verifyCallback(array $callbackData): ServiceResult
    {
        $data = VnpayCallbackData::fromArray($callbackData);

        return $this->verifyCallbackAction->execute($data);
    }

    /**
     * Process VNPAY Instant Payment Notification (IPN).
     *
     * @param array $ipnData
     * @return ServiceResult
     */
    public function processIPN(array $ipnData): ServiceResult
    {
        $data = VnpayCallbackData::fromArray($ipnData);

        return $this->processIPNAction->execute($data);
    }

    /**
     * Check if callback signature is valid.
     *
     * @param array $callbackData
     * @return bool
     */
    public function isValidSignature(array $callbackData): bool
    {
        $data = VnpayCallbackData::fromArray($callbackData);
        $result = $this->verifyCallbackAction->execute($data);

        return $result->success;
    }

    /**
     * Get response message from response code.
     *
     * @param string $responseCode
     * @return string
     */
    public function getResponseMessage(string $responseCode): string
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

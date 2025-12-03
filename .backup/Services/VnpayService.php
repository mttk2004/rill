<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;

class VnpayService
{
    protected $tmnCode;
    protected $hashSecret;
    protected $url;
    protected $returnUrl;

    public function __construct()
    {
        $this->tmnCode = config('vnpay.tmn_code');
        $this->hashSecret = config('vnpay.hash_secret');
        $this->url = config('vnpay.url');
        $this->returnUrl = url(config('vnpay.return_url'));
    }

    /**
     * Tạo URL thanh toán VNPAY.
     */
    public function createPaymentUrl(Order $order, Request $request): string
    {
        // Các tham số bắt buộc theo tài liệu VNPAY
        $vnp_Params = [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => $this->tmnCode,
            'vnp_Amount' => $order->total_amount * 100, // VNPAY yêu cầu * 100
            'vnp_CurrCode' => 'VND',
            'vnp_TxnRef' => $order->id, // Sử dụng ID đơn hàng làm mã tham chiếu
            'vnp_OrderInfo' => "Thanh toan don hang #{$order->order_number}",
            'vnp_OrderType' => 'other',
            'vnp_Locale' => 'vn',
            'vnp_ReturnUrl' => $this->returnUrl,
            'vnp_IpAddr' => $request->ip(),
            'vnp_CreateDate' => now()->format('YmdHis'),
        ];

        // Sắp xếp các tham số theo thứ tự alphabet
        ksort($vnp_Params);

        // Tạo chuỗi query và hash
        $query = http_build_query($vnp_Params);
        $hashData = $query;
        $vnp_SecureHash = hash_hmac('sha512', $hashData, $this->hashSecret);

        // Thêm hash vào URL
        $paymentUrl = $this->url . '?' . $query . '&vnp_SecureHash=' . $vnp_SecureHash;

        return $paymentUrl;
    }

    /**
     * Xác thực chữ ký từ VNPAY trả về.
     */
    public function isValidSignature(array $data): bool
    {
        $vnp_SecureHash = $data['vnp_SecureHash'] ?? '';
        unset($data['vnp_SecureHash'], $data['vnp_SecureHashType']);

        // Sắp xếp lại dữ liệu để tạo hash
        ksort($data);
        $hashData = http_build_query($data);

        $secureHash = hash_hmac('sha512', $hashData, $this->hashSecret);

        return $secureHash === $vnp_SecureHash;
    }

    /**
     * Lấy thông báo lỗi từ response code của VNPAY.
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

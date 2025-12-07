<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã giảm giá mới</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }

    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }

    .voucher-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }

    .content {
      padding: 40px 30px;
    }

    .greeting {
      font-size: 20px;
      color: #1f2937;
      margin-bottom: 15px;
      font-weight: 600;
    }

    .message {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 25px;
      line-height: 1.8;
    }

    .voucher-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
    }

    .voucher-name {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .voucher-description {
      color: #ffffff;
      font-size: 14px;
      margin: 10px 0;
      opacity: 0.95;
      line-height: 1.5;
    }

    .voucher-code {
      background-color: #ffffff;
      color: #667eea;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 3px;
      display: inline-block;
      margin: 20px 0;
      border: 2px dashed #667eea;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .discount-info {
      background-color: rgba(255, 255, 255, 0.25);
      padding: 12px 20px;
      border-radius: 8px;
      margin: 15px 0;
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
    }

    .voucher-details {
      color: #ffffff;
      font-size: 14px;
      margin-top: 20px;
      line-height: 1.8;
    }

    .detail-row {
      margin: 10px 0;
      padding: 5px 0;
    }

    .detail-label {
      font-weight: 600;
      opacity: 0.9;
    }

    .details-divider {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.3);
      margin: 15px 0;
    }

    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #ffffff;
      color: #667eea !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .info-box {
      background-color: #f9fafb;
      border-left: 4px solid #667eea;
      padding: 15px 20px;
      margin: 25px 0;
      border-radius: 4px;
    }

    .info-text {
      color: #4b5563;
      font-size: 14px;
      margin: 0;
      line-height: 1.6;
    }

    .footer {
      background-color: #1f2937;
      color: #9ca3af;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }

    .footer-text {
      margin: 10px 0;
      color: #9ca3af;
    }

    .footer-brand {
      color: #f59e0b;
      font-weight: 600;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="voucher-icon">🎁</div>
      <h1>Mã Giảm Giá Mới</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Xin chào {{ $userName }},</div>

      <p class="message">
        Chúng tôi vui mừng thông báo có mã giảm giá mới dành riêng cho bạn!
        Đừng bỏ lỡ cơ hội tiết kiệm khi mua sắm tại cửa hàng của chúng tôi.
      </p>

      <!-- Voucher Card -->
      <div class="voucher-card">
        <div class="voucher-name">{{ $voucher->name }}</div>

        @if($voucher->description)
          <div class="voucher-description">
            {{ $voucher->description }}
          </div>
        @endif

        <div class="voucher-code">{{ $voucher->code }}</div>

        @if($voucher->type === 'percentage')
          <div class="discount-info">
            Giảm {{ number_format($voucher->value, 0) }}%
            @if($voucher->maximum_discount && $voucher->maximum_discount > 0)
              (Tối đa {{ number_format($voucher->maximum_discount, 0) }}₫)
            @endif
          </div>
        @else
          <div class="discount-info">
            Giảm {{ number_format($voucher->value, 0) }}₫
          </div>
        @endif

        <div class="voucher-details">
          @if($voucher->minimum_amount && $voucher->minimum_amount > 0)
            <div class="detail-row">
              <span class="detail-label">Đơn hàng tối thiểu:</span>
              {{ number_format($voucher->minimum_amount, 0) }}₫
            </div>
          @endif

          @if($voucher->usage_limit && $voucher->usage_limit > 0)
            <div class="detail-row">
              <span class="detail-label">Số lượng có hạn:</span>
              {{ number_format($voucher->usage_limit) }} mã
            </div>
          @endif

          @if($voucher->usage_limit_per_user && $voucher->usage_limit_per_user > 0)
            <div class="detail-row">
              <span class="detail-label">Giới hạn mỗi người:</span>
              {{ $voucher->usage_limit_per_user }} lần
            </div>
          @endif

          @if($voucher->valid_from || $voucher->valid_to)
            <div class="details-divider"></div>
            @if($voucher->valid_from)
              <div class="detail-row">
                <span class="detail-label">Bắt đầu:</span>
                {{ $voucher->valid_from->format('d/m/Y H:i') }}
              </div>
            @endif
            @if($voucher->valid_to)
              <div class="detail-row">
                <span class="detail-label">Hết hạn:</span>
                {{ $voucher->valid_to->format('d/m/Y H:i') }}
              </div>
            @endif
          @endif
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="{{ config('app.url') }}" class="cta-button">
          Mua sắm ngay
        </a>
      </div>

      <!-- Info Box -->
      <div class="info-box">
        <p class="info-text">
          <strong style="color: #1f2937;">Lưu ý:</strong> Mã giảm giá này có thể áp dụng cho các sản phẩm và điều kiện
          cụ thể.
          Vui lòng kiểm tra điều kiện sử dụng trước khi thanh toán.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        Email này được gửi từ <span class="footer-brand">{{ config('app.name') }}</span>
      </p>
      <p class="footer-text">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
      </p>
      <p class="footer-text" style="margin-top: 20px; font-size: 12px; color: #6b7280;">
        © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
      </p>
    </div>
  </div>
</body>

</html>

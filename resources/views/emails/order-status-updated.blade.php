<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cập nhật đơn hàng</title>
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
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      padding: 40px 20px;
      text-align: center;
    }

    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }

    .status-icon {
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

    .status-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      margin: 15px 0;
    }

    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }

    .status-confirmed {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .status-shipped {
      background-color: #e0e7ff;
      color: #4338ca;
    }

    .status-delivered {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .order-info {
      background-color: #f9fafb;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }

    .order-info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .order-info-row:last-child {
      border-bottom: none;
    }

    .order-info-label {
      color: #6b7280;
      font-size: 14px;
    }

    .order-info-value {
      color: #1f2937;
      font-weight: 600;
      font-size: 14px;
    }

    .order-items {
      margin: 25px 0;
    }

    .order-item {
      display: flex;
      padding: 15px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .item-image {
      width: 60px;
      height: 60px;
      background-color: #f3f4f6;
      border-radius: 8px;
      margin-right: 15px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .item-meta {
      font-size: 13px;
      color: #6b7280;
    }

    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
    }

    .message {
      font-size: 15px;
      color: #4b5563;
      margin-bottom: 20px;
      line-height: 1.8;
    }

    .footer {
      background-color: #1f2937;
      color: #9ca3af;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }

    .footer-link {
      color: #3b82f6;
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      @php
        $statusIcons = [
          'pending' => '⏳',
          'confirmed' => '✅',
          'shipped' => '🚚',
          'delivered' => '🎉',
          'cancelled' => '❌',
        ];
        $statusIcon = $statusIcons[$order->status->value] ?? '📦';
      @endphp
      <div class="status-icon">{{ $statusIcon }}</div>
      <h1>Cập nhật đơn hàng</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Xin chào {{ $userName }}! 👋</div>

      <div class="message">
        Đơn hàng <strong>#{{ $order->order_number }}</strong> của bạn đã được cập nhật trạng thái.
      </div>

      @php
        $statusClasses = [
          'pending' => 'status-pending',
          'confirmed' => 'status-confirmed',
          'shipped' => 'status-shipped',
          'delivered' => 'status-delivered',
          'cancelled' => 'status-cancelled',
        ];
        $statusLabels = [
          'pending' => 'Chờ xác nhận',
          'confirmed' => 'Đã xác nhận',
          'shipped' => 'Đang giao hàng',
          'delivered' => 'Đã giao hàng',
          'cancelled' => 'Đã hủy',
        ];
        $statusClass = $statusClasses[$order->status->value] ?? 'status-pending';
        $statusLabel = $statusLabels[$order->status->value] ?? 'Cập nhật';
      @endphp

      <div style="text-align: center;">
        <span class="status-badge {{ $statusClass }}">
          {{ $statusIcon }} {{ $statusLabel }}
        </span>
      </div>

      <!-- Order Information -->
      <div class="order-info">
        <div class="order-info-row">
          <span class="order-info-label">Mã đơn hàng:</span>
          <span class="order-info-value">#{{ $order->order_number }}</span>
        </div>
        <div class="order-info-row">
          <span class="order-info-label">Ngày đặt:</span>
          <span class="order-info-value">{{ $order->created_at->format('d/m/Y H:i') }}</span>
        </div>
        <div class="order-info-row">
          <span class="order-info-label">Tổng tiền:</span>
          <span class="order-info-value">{{ number_format($order->total_amount, 0, ',', '.') }}₫</span>
        </div>
        <div class="order-info-row">
          <span class="order-info-label">Phương thức thanh toán:</span>
          <span class="order-info-value">
            {{ $order->payment?->payment_method?->value === 'COD' ? 'Thanh toán khi nhận hàng' : 'VNPAY' }}
          </span>
        </div>
      </div>

      <!-- Order Items -->
      @if($order->items->count() > 0)
        <div class="order-items">
          <h3 style="color: #1f2937; margin-bottom: 15px;">Sản phẩm trong đơn hàng:</h3>
          @foreach($order->items as $item)
            <div class="order-item">
              <div class="item-image">🎵</div>
              <div class="item-details">
                <div class="item-name">{{ $item->product->name }}</div>
                <div class="item-meta">
                  Số lượng: {{ $item->quantity }} × {{ number_format($item->unit_price, 0, ',', '.') }}₫
                </div>
              </div>
              <div style="text-align: right;">
                <div class="item-name">{{ number_format($item->total_price, 0, ',', '.') }}₫</div>
              </div>
            </div>
          @endforeach
        </div>
      @endif

      <!-- Status-specific messages -->
      @if($order->status->value === 'confirmed')
        <div class="message">
          Đơn hàng của bạn đã được xác nhận và đang trong quá trình chuẩn bị.
          Chúng tôi sẽ giao hàng trong vòng 2-5 ngày làm việc.
        </div>
      @elseif($order->status->value === 'shipped')
        <div class="message">
          Đơn hàng của bạn đã được giao cho đơn vị vận chuyển.
          Bạn sẽ nhận được hàng trong 1-3 ngày tới.
        </div>
      @elseif($order->status->value === 'delivered')
        <div class="message">
          Đơn hàng đã được giao thành công! 🎉<br>
          Cảm ơn bạn đã mua sắm tại Rill. Chúng tôi hy vọng bạn hài lòng với sản phẩm!
        </div>
      @elseif($order->status->value === 'cancelled')
        <div class="message">
          Đơn hàng của bạn đã bị hủy. Nếu bạn có bất kỳ thắc mắc nào,
          vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
        </div>
      @endif

      <div style="text-align: center;">
        <a href="{{ config('app.url') }}/orders/{{ $order->id }}" class="cta-button">
          Xem chi tiết đơn hàng
        </a>
      </div>

      <div class="message" style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline hỗ trợ.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div style="font-weight: 600; color: #ffffff; margin-bottom: 10px;">
        Rill - Nơi âm nhạc trở nên sống động
      </div>

      <div style="margin: 15px 0;">
        <a href="{{ config('app.url') }}/orders" class="footer-link">Đơn hàng của tôi</a>
        <a href="{{ config('app.url') }}/contact" class="footer-link">Liên hệ hỗ trợ</a>
      </div>

      <div style="margin-top: 20px; font-size: 12px;">
        Email này được gửi đến {{ $order->user->email }}<br>
        © {{ date('Y') }} Rill. All rights reserved.
      </div>
    </div>
  </div>
</body>

</html>

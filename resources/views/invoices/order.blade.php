<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Hóa Đơn {{ $order->order_number }}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: DejaVu Sans, sans-serif;
      font-size: 13px;
      color: #1e293b;
      line-height: 1.6;
      background: #ffffff;
    }

    .container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 30px;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #f59e0b;
    }

    .header .logo {
      font-size: 32px;
      font-weight: bold;
      color: #f59e0b;
      margin-bottom: 5px;
      letter-spacing: 2px;
    }

    .header .tagline {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .invoice-title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #0f172a;
      margin: 30px 0 25px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .invoice-meta {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .invoice-meta table {
      width: 100%;
      border-collapse: collapse;
    }

    .invoice-meta td {
      padding: 8px 0;
      vertical-align: top;
    }

    .invoice-meta .label {
      font-weight: 600;
      color: #475569;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .invoice-meta .value {
      color: #1e293b;
      margin-top: 2px;
    }

    .invoice-meta .right {
      text-align: right;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #0f172a;
      margin: 30px 0 15px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .items-table thead {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .items-table th {
      padding: 12px 10px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: none;
    }

    .items-table td {
      padding: 12px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    .items-table tbody tr:last-child td {
      border-bottom: none;
    }

    .items-table tbody tr:hover {
      background-color: #f8fafc;
    }

    .items-table .text-right {
      text-align: right;
    }

    .items-table .text-center {
      text-align: center;
    }

    .totals {
      margin-top: 30px;
      clear: both;
    }

    .totals-table {
      width: 100%;
      max-width: 350px;
      float: right;
      border-collapse: collapse;
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
    }

    .totals-table td {
      padding: 8px 12px;
    }

    .totals-table .label {
      color: #64748b;
      font-size: 13px;
    }

    .totals-table .amount {
      text-align: right;
      color: #1e293b;
      font-weight: 500;
    }

    .totals-table .total-row {
      border-top: 2px solid #cbd5e1;
      padding-top: 12px;
    }

    .totals-table .total-row .label {
      font-size: 15px;
      font-weight: bold;
      color: #0f172a;
    }

    .totals-table .total-row .amount {
      font-size: 18px;
      font-weight: bold;
      color: #f59e0b;
    }

    .payment-info {
      clear: both;
      margin-top: 40px;
      padding: 20px;
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 4px;
    }

    .payment-info .title {
      font-weight: bold;
      color: #92400e;
      margin-bottom: 8px;
      font-size: 12px;
      text-transform: uppercase;
    }

    .payment-info .detail {
      color: #78350f;
      font-size: 13px;
    }

    .footer {
      clear: both;
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
    }

    .footer .thank-you {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 10px;
    }

    .footer .contact {
      font-size: 11px;
      color: #64748b;
      margin-top: 5px;
    }

    .footer .website {
      color: #f59e0b;
      text-decoration: none;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-completed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">RILL</div>
      <div class="tagline">Cửa hàng Đĩa Than Online</div>
    </div>

    <!-- Invoice Title -->
    <div class="invoice-title">Hóa Đơn Bán Hàng</div>

    <!-- Invoice Meta Information -->
    <div class="invoice-meta">
      <table>
        <tr>
          <td style="width: 50%;">
            <div class="label">Thông tin khách hàng</div>
            <div class="value">
              <strong>{{ $order->shipping_address['full_name'] }}</strong><br>
              {{ $order->shipping_address['phone'] }}<br>
              {{ $order->shipping_address['address_line_1'] }}<br>
              {{ $order->shipping_address['ward'] }}, {{ $order->shipping_address['district'] }}<br>
              {{ $order->shipping_address['city'] }}
            </div>
          </td>
          <td style="width: 50%;" class="right">
            <div class="label">Thông tin đơn hàng</div>
            <div class="value">
              <strong>Mã đơn:</strong> {{ $order->order_number }}<br>
              <strong>Ngày đặt:</strong> {{ $order->placed_at->format('d/m/Y H:i') }}<br>
              @if($order->delivered_at)
                <strong>Ngày giao:</strong> {{ $order->delivered_at->format('d/m/Y H:i') }}<br>
              @endif
              <strong>Trạng thái:</strong>
              @php
                $statusText = match ($order->status->value) {
                  'pending' => 'Chờ xác nhận',
                  'confirmed' => 'Đã xác nhận',
                  'shipped' => 'Đang giao',
                  'delivered' => 'Đã giao',
                  'cancelled' => 'Đã hủy',
                  default => 'Không xác định',
                };
              @endphp
              <span class="status-badge status-completed">{{ $statusText }}</span>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Items Section -->
    <div class="section-title">Chi tiết sản phẩm</div>
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 10%;" class="text-center">STT</th>
          <th style="width: 45%;">Tên sản phẩm</th>
          <th style="width: 15%;" class="text-center">Số lượng</th>
          <th style="width: 15%;" class="text-right">Đơn giá</th>
          <th style="width: 15%;" class="text-right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        @foreach($order->items as $index => $item)
          <tr>
            <td class="text-center">{{ $index + 1 }}</td>
            <td>
              <strong>{{ $item->product_name }}</strong>
              @if($item->product->sku)
                <br><small style="color: #94a3b8;">SKU: {{ $item->product->sku }}</small>
              @endif
            </td>
            <td class="text-center">{{ $item->quantity }}</td>
            <td class="text-right">{{ number_format($item->unit_price, 0, ',', '.') }}₫</td>
            <td class="text-right"><strong>{{ number_format($item->total_price, 0, ',', '.') }}₫</strong></td>
          </tr>
        @endforeach
      </tbody>
    </table>

    <!-- Totals Section -->
    <div class="totals">
      <table class="totals-table">
        <tr>
          <td class="label">Tạm tính:</td>
          <td class="amount">{{ number_format($order->subtotal, 0, ',', '.') }}₫</td>
        </tr>
        <tr>
          <td class="label">Phí vận chuyển:</td>
          <td class="amount" style="color: #10b981;">Miễn phí</td>
        </tr>
        @if($order->discount_amount > 0)
          <tr>
            <td class="label">Giảm giá:</td>
            <td class="amount" style="color: #ef4444;">-{{ number_format($order->discount_amount, 0, ',', '.') }}₫</td>
          </tr>
        @endif
        <tr class="total-row">
          <td class="label">Tổng thanh toán:</td>
          <td class="amount">{{ number_format($order->total_amount, 0, ',', '.') }}₫</td>
        </tr>
      </table>
    </div>

    <!-- Payment Information -->
    <div class="payment-info">
      <div class="title">Thông tin thanh toán</div>
      <div class="detail">
        @php
          $paymentMethodText = match ($order->payment->payment_method ?? 'cod') {
            'cod' => 'Thanh toán khi nhận hàng (COD)',
            'vnpay' => 'Thanh toán qua VNPAY',
            default => 'Không xác định',
          };
          $paymentStatusText = match ($order->payment->payment_status ?? 'pending') {
            'completed' => 'Đã thanh toán',
            'pending' => 'Chờ thanh toán',
            'failed' => 'Thanh toán thất bại',
            default => 'Không xác định',
          };
        @endphp
        <strong>Phương thức:</strong> {{ $paymentMethodText }}<br>
        <strong>Trạng thái:</strong> {{ $paymentStatusText }}
        @if($order->payment->paid_at)
          <br><strong>Thời gian thanh toán:</strong> {{ $order->payment->paid_at->format('d/m/Y H:i') }}
        @endif
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="thank-you">Cảm ơn quý khách đã mua hàng tại Rill!</div>
      <div class="contact">
        Hotline: 1900-xxxx | Email: support@rill.vn<br>
        Website: <span class="website">www.rill.vn</span>
      </div>
      <div class="contact" style="margin-top: 15px; font-style: italic;">
        Hóa đơn được tạo tự động bởi hệ thống - Không cần chữ ký
      </div>
    </div>
  </div>
</body>

</html>

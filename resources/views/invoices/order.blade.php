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
      font-family: "DejaVu Sans", "Arial", sans-serif;
      font-size: 11px;
      color: #1e293b;
      line-height: 1.4;
      background: #ffffff;
    }

    .container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 20px 25px;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f59e0b;
    }

    .header .logo {
      font-size: 28px;
      font-weight: bold;
      color: #f59e0b;
      margin-bottom: 3px;
      letter-spacing: 2px;
    }

    .header .tagline {
      font-size: 10px;
      color: #64748b;
      letter-spacing: 0.5px;
    }

    .invoice-title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #0f172a;
      margin: 15px 0 15px 0;
      letter-spacing: 1px;
    }

    .invoice-meta {
      background: #f8fafc;
      padding: 12px 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .invoice-meta table {
      width: 100%;
      border-collapse: collapse;
    }

    .invoice-meta td {
      padding: 4px 0;
      vertical-align: top;
      font-size: 10px;
    }

    .invoice-meta .label {
      font-weight: 600;
      color: #475569;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 3px;
    }

    .invoice-meta .value {
      color: #1e293b;
      margin-top: 2px;
      line-height: 1.5;
    }

    .invoice-meta .right {
      text-align: right;
    }

    .section-title {
      font-size: 11px;
      font-weight: bold;
      color: #0f172a;
      margin: 15px 0 10px 0;
      padding-bottom: 5px;
      border-bottom: 1px solid #e2e8f0;
      letter-spacing: 0.3px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .items-table thead {
      background: #f59e0b;
    }

    .items-table th {
      padding: 8px 6px;
      text-align: left;
      font-size: 9px;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: 0.3px;
      border: none;
    }

    .items-table td {
      padding: 8px 6px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
      font-size: 10px;
    }

    .items-table tbody tr:last-child td {
      border-bottom: none;
    }

    .items-table .text-right {
      text-align: right;
    }

    .items-table .text-center {
      text-align: center;
    }

    .totals {
      margin-top: 15px;
      clear: both;
    }

    .totals-table {
      width: 100%;
      max-width: 280px;
      float: right;
      border-collapse: collapse;
      background: #f8fafc;
      padding: 10px;
      border-radius: 4px;
    }

    .totals-table td {
      padding: 5px 8px;
      font-size: 10px;
    }

    .totals-table .label {
      color: #64748b;
    }

    .totals-table .amount {
      text-align: right;
      color: #1e293b;
      font-weight: 500;
    }

    .totals-table .total-row {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
    }

    .totals-table .total-row .label {
      font-size: 12px;
      font-weight: bold;
      color: #0f172a;
    }

    .totals-table .total-row .amount {
      font-size: 13px;
      font-weight: bold;
      color: #f59e0b;
    }

    .payment-info {
      clear: both;
      margin-top: 20px;
      padding: 12px;
      background: #fef3c7;
      border-left: 3px solid #f59e0b;
      border-radius: 3px;
    }

    .payment-info .title {
      font-weight: bold;
      color: #92400e;
      margin-bottom: 5px;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .payment-info .detail {
      color: #78350f;
      font-size: 10px;
      line-height: 1.6;
    }

    .footer {
      clear: both;
      margin-top: 25px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }

    .footer .thank-you {
      font-size: 12px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .footer .contact {
      font-size: 9px;
      color: #64748b;
      margin-top: 3px;
      line-height: 1.5;
    }

    .footer .website {
      color: #f59e0b;
      text-decoration: none;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.3px;
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

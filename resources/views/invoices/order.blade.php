<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Hoa Don {{ $order->order_number }}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: DejaVu Sans, sans-serif;
      font-size: 9pt;
      color: #1e293b;
      line-height: 1.3;
      background: #ffffff;
    }

    .container {
      width: 100%;
      padding: 15px 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f59e0b;
    }

    .header .logo {
      font-size: 24pt;
      font-weight: bold;
      color: #f59e0b;
      margin-bottom: 2px;
      letter-spacing: 2px;
    }

    .header .tagline {
      font-size: 8pt;
      color: #64748b;
    }

    .invoice-title {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      color: #0f172a;
      margin: 10px 0;
    }

    .invoice-meta {
      background: #f8fafc;
      padding: 8px 10px;
      margin-bottom: 10px;
    }

    .invoice-meta table {
      width: 100%;
      border-collapse: collapse;
    }

    .invoice-meta td {
      padding: 2px 0;
      vertical-align: top;
      font-size: 8pt;
    }

    .invoice-meta .label {
      font-weight: bold;
      color: #475569;
      font-size: 7pt;
      text-transform: uppercase;
      margin-bottom: 2px;
      display: block;
    }

    .invoice-meta .value {
      color: #1e293b;
      line-height: 1.4;
    }

    .invoice-meta .right {
      text-align: right;
    }

    .section-title {
      font-size: 9pt;
      font-weight: bold;
      color: #0f172a;
      margin: 10px 0 6px 0;
      padding-bottom: 3px;
      border-bottom: 1px solid #e2e8f0;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5px;
    }

    .items-table thead {
      background: #f59e0b;
    }

    .items-table th {
      padding: 5px 4px;
      text-align: left;
      font-size: 7pt;
      font-weight: bold;
      color: #ffffff;
      border: none;
    }

    .items-table td {
      padding: 5px 4px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
      font-size: 8pt;
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
      margin-top: 10px;
      clear: both;
    }

    .totals-table {
      width: 100%;
      max-width: 250px;
      float: right;
      border-collapse: collapse;
      background: #f8fafc;
      padding: 8px;
    }

    .totals-table td {
      padding: 3px 6px;
      font-size: 8pt;
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
      padding-top: 5px;
    }

    .totals-table .total-row .label {
      font-size: 10pt;
      font-weight: bold;
      color: #0f172a;
    }

    .totals-table .total-row .amount {
      font-size: 11pt;
      font-weight: bold;
      color: #f59e0b;
    }

    .payment-info {
      clear: both;
      margin-top: 12px;
      padding: 8px 10px;
      background: #fef3c7;
      border-left: 3px solid #f59e0b;
    }

    .payment-info .title {
      font-weight: bold;
      color: #92400e;
      margin-bottom: 3px;
      font-size: 7pt;
      text-transform: uppercase;
    }

    .payment-info .detail {
      color: #78350f;
      font-size: 8pt;
      line-height: 1.5;
    }

    .footer {
      clear: both;
      margin-top: 15px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }

    .footer .thank-you {
      font-size: 10pt;
      font-weight: bold;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .footer .contact {
      font-size: 7pt;
      color: #64748b;
      margin-top: 2px;
      line-height: 1.4;
    }

    .footer .website {
      color: #f59e0b;
      text-decoration: none;
      font-weight: bold;
    }

    .status-badge {
      display: inline-block;
      padding: 2px 6px;
      background: #d1fae5;
      color: #065f46;
      border-radius: 2px;
      font-size: 7pt;
      font-weight: bold;
    }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">RILL</div>
      <div class="tagline">Cua hang Dia Than Online</div>
    </div>

    <!-- Invoice Title -->
    <div class="invoice-title">HOA DON BAN HANG</div>

    <!-- Invoice Meta Information -->
    <div class="invoice-meta">
      <table>
        <tr>
          <td style="width: 50%;">
            <span class="label">THONG TIN KHACH HANG</span>
            <div class="value">
              <strong>{{ $order->shipping_address['full_name'] }}</strong><br>
              {{ $order->shipping_address['phone'] }}<br>
              {{ $order->shipping_address['address_line_1'] }}<br>
              {{ $order->shipping_address['ward'] }}, {{ $order->shipping_address['district'] }}<br>
              {{ $order->shipping_address['city'] }}
            </div>
          </td>
          <td style="width: 50%;" class="right">
            <span class="label">THONG TIN DON HANG</span>
            <div class="value">
              <strong>Ma don:</strong> {{ $order->order_number }}<br>
              <strong>Ngay dat:</strong> {{ $order->placed_at->format('d/m/Y H:i') }}<br>
              @if($order->delivered_at)
                <strong>Ngay giao:</strong> {{ $order->delivered_at->format('d/m/Y H:i') }}<br>
              @endif
              @php
                $statusText = match ($order->status->value) {
                  'pending' => 'Cho xac nhan',
                  'confirmed' => 'Da xac nhan',
                  'shipped' => 'Dang giao',
                  'delivered' => 'Da giao',
                  'cancelled' => 'Da huy',
                  default => 'Khong xac dinh',
                };
              @endphp
              <strong>Trang thai:</strong> <span class="status-badge">{{ $statusText }}</span>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Items Section -->
    <div class="section-title">Chi tiet san pham</div>
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 8%;" class="text-center">STT</th>
          <th style="width: 50%;">Ten san pham</th>
          <th style="width: 12%;" class="text-center">So luong</th>
          <th style="width: 15%;" class="text-right">Don gia</th>
          <th style="width: 15%;" class="text-right">Thanh tien</th>
        </tr>
      </thead>
      <tbody>
        @foreach($order->items as $index => $item)
          <tr>
            <td class="text-center">{{ $index + 1 }}</td>
            <td><strong>{{ $item->product_name }}</strong></td>
            <td class="text-center">{{ $item->quantity }}</td>
            <td class="text-right">{{ number_format($item->unit_price, 0, ',', '.') }}d</td>
            <td class="text-right"><strong>{{ number_format($item->total_price, 0, ',', '.') }}d</strong></td>
          </tr>
        @endforeach
      </tbody>
    </table>

    <!-- Totals Section -->
    <div class="totals">
      <table class="totals-table">
        <tr>
          <td class="label">Tam tinh:</td>
          <td class="amount">{{ number_format($order->subtotal, 0, ',', '.') }}d</td>
        </tr>
        <tr>
          <td class="label">Phi van chuyen:</td>
          <td class="amount" style="color: #10b981;">Mien phi</td>
        </tr>
        @if($order->discount_amount > 0)
          <tr>
            <td class="label">Giam gia:</td>
            <td class="amount" style="color: #ef4444;">-{{ number_format($order->discount_amount, 0, ',', '.') }}d</td>
          </tr>
        @endif
        <tr class="total-row">
          <td class="label">Tong thanh toan:</td>
          <td class="amount">{{ number_format($order->total_amount, 0, ',', '.') }}d</td>
        </tr>
      </table>
    </div>

    <!-- Payment Information -->
    <div class="payment-info">
      <div class="title">THONG TIN THANH TOAN</div>
      <div class="detail">
        @php
          $paymentMethodText = match ($order->payment->payment_method ?? 'cod') {
            'cod' => 'Thanh toan khi nhan hang (COD)',
            'vnpay' => 'Thanh toan qua VNPAY',
            default => 'Khong xac dinh',
          };
          $paymentStatusText = match ($order->payment->payment_status ?? 'pending') {
            'completed' => 'Da thanh toan',
            'pending' => 'Cho thanh toan',
            'failed' => 'Thanh toan that bai',
            default => 'Khong xac dinh',
          };
        @endphp
        <strong>Phuong thuc:</strong> {{ $paymentMethodText }}<br>
        <strong>Trang thai:</strong> {{ $paymentStatusText }}
        @if($order->payment->paid_at)
          <br><strong>Thoi gian thanh toan:</strong> {{ $order->payment->paid_at->format('d/m/Y H:i') }}
        @endif
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="thank-you">Cam on quy khach da mua hang tai Rill!</div>
      <div class="contact">
        Hotline: 1900-xxxx | Email: support@rill.vn<br>
        Website: <span class="website">www.rill.vn</span>
      </div>
      <div class="contact" style="margin-top: 8px; font-style: italic;">
        Hoa don duoc tao tu dong boi he thong - Khong can chu ky
      </div>
    </div>
  </div>
</body>

</html>

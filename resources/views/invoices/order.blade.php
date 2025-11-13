<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Hóa Đơn {{ $order->order_number }}</title>
  <style>
    body {
      font-family: DejaVu Sans, sans-serif;
      font-size: 14px;
      color: #333;
    }

    .container {
      width: 100%;
      margin: 0 auto;
    }

    .header,
    .footer {
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .invoice-details {
      margin: 20px 0;
      width: 100%;
    }

    .invoice-details table {
      width: 100%;
      border-collapse: collapse;
    }

    .invoice-details td {
      padding: 5px;
    }

    .invoice-details .right {
      text-align: right;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .items-table th,
    .items-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    .items-table th {
      background-color: #f2f2f2;
    }

    .items-table .text-right {
      text-align: right;
    }

    .totals {
      width: 100%;
      margin-top: 20px;
    }

    .totals table {
      width: 50%;
      float: right;
      border-collapse: collapse;
    }

    .totals td {
      padding: 8px;
    }

    .totals .text-right {
      text-align: right;
    }

    .footer {
      margin-top: 50px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Rill</h1>
      <p>Cửa hàng Đĩa Than Online</p>
    </div>

    <h2 style="text-align: center; margin-top: 40px;">HÓA ĐƠN BÁN HÀNG</h2>

    <div class="invoice-details">
      <table>
        <tr>
          <td>
            <strong>Khách hàng:</strong> {{ $order->shipping_address['full_name'] }}<br>
            <strong>Địa chỉ:</strong> {{ $order->shipping_address['address_line_1'] }},
            {{ $order->shipping_address['ward'] }}, {{ $order->shipping_address['district'] }},
            {{ $order->shipping_address['city'] }}<br>
            <strong>Điện thoại:</strong> {{ $order->shipping_address['phone'] }}
          </td>
          <td class="right">
            @php
              $paymentMethodText = match ($order->payment->payment_method ?? 'cod') {
                'cod' => 'Thanh toán khi nhận hàng (COD)',
                'vnpay' => 'Thanh toán qua VNPAY',
                default => 'Không xác định',
              };
            @endphp
            <strong>Mã hóa đơn:</strong> {{ $order->order_number }}<br>
            <strong>Ngày đặt hàng:</strong> {{ $order->placed_at->format('d/m/Y') }}<br>
            <strong>Phương thức thanh toán:</strong> {{ $paymentMethodText }}
          </td>
        </tr>
      </table>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th class="text-right">Số lượng</th>
          <th class="text-right">Đơn giá</th>
          <th class="text-right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        @foreach($order->items as $item)
          <tr>
            <td>{{ $item->product_name }}</td>
            <td class="text-right">{{ $item->quantity }}</td>
            <td class="text-right">{{ number_format($item->unit_price, 0, ',', '.') }} ₫</td>
            <td class="text-right">{{ number_format($item->total_price, 0, ',', '.') }} ₫</td>
          </tr>
        @endforeach
      </tbody>
    </table>

    <div class="totals">
      <table>
        <tr>
          <td>Tổng tiền hàng:</td>
          <td class="text-right">{{ number_format($order->subtotal, 0, ',', '.') }} ₫</td>
        </tr>
        <tr>
          <td>Giảm giá:</td>
          <td class="text-right">{{ number_format($order->discount_amount, 0, ',', '.') }} ₫</td>
        </tr>
        <tr>
          <td><strong>Tổng thanh toán:</strong></td>
          <td class="text-right"><strong>{{ number_format($order->total_amount, 0, ',', '.') }} ₫</strong></td>
        </tr>
      </table>
    </div>

    <div class="footer">
      <p>Cảm ơn bạn đã mua hàng tại Rill!</p>
    </div>
  </div>
</body>

</html>

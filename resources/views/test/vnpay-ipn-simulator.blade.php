<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>VNPAY IPN Simulator - DEV ONLY</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }

    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #e74c3c;
      border-bottom: 3px solid #e74c3c;
      padding-bottom: 10px;
    }

    .warning {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-top: 15px;
      font-weight: bold;
      color: #333;
    }

    input,
    textarea {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
    }

    textarea {
      min-height: 100px;
    }

    button {
      background: #3498db;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 20px;
    }

    button:hover {
      background: #2980b9;
    }

    .result {
      margin-top: 20px;
      padding: 15px;
      border-radius: 4px;
      display: none;
    }

    .result.success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .result.error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .instructions {
      background: #e7f3ff;
      padding: 15px;
      border-left: 4px solid #2196F3;
      margin-bottom: 20px;
    }

    .instructions ol {
      margin: 10px 0;
      padding-left: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>🧪 VNPAY IPN Simulator (Development Only)</h1>

    <div class="warning">
      <strong>⚠️ Cảnh báo:</strong> Tool này CHỈ dùng trong môi trường development để test IPN callback.
      File này PHẢI được xóa trước khi deploy production!
    </div>

    <div class="instructions">
      <h3>📋 Hướng dẫn sử dụng:</h3>
      <ol>
        <li>Copy URL VNPAY return từ browser (sau khi thanh toán thành công)</li>
        <li>Paste vào ô "VNPAY Return URL" bên dưới</li>
        <li>Click "Simulate IPN Callback"</li>
        <li>Kiểm tra database xem payment đã được cập nhật chưa</li>
      </ol>
    </div>

    <form id="ipnForm">
      <label for="returnUrl">
        VNPAY Return URL:
        <small style="color: #666; font-weight: normal;">(Copy từ address bar sau khi VNPAY redirect về)</small>
      </label>
      <textarea id="returnUrl"
        placeholder="http://localhost:8000/orders/thank-you?vnp_Amount=45000000&vnp_BankCode=..."></textarea>

      <button type="submit">🚀 Simulate IPN Callback</button>
    </form>

    <div id="result" class="result"></div>

    <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 4px;">
      <h4>ℹ️ Giải thích:</h4>
      <p>Trong production, VNPAY sẽ tự động gọi IPN endpoint (server-to-server) để cập nhật trạng thái payment.</p>
      <p>Trong development (localhost), VNPAY không thể gọi được endpoint của chúng ta, nên chúng ta phải simulate bằng
        tool này.</p>
      <p><strong>IPN Endpoint:</strong> <code>{{ url('/vnpay/ipn') }}</code></p>
    </div>
  </div>

  <script>
    document.getElementById('ipnForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const returnUrl = document.getElementById('returnUrl').value.trim();
      const resultDiv = document.getElementById('result');

      if (!returnUrl) {
        resultDiv.className = 'result error';
        resultDiv.style.display = 'block';
        resultDiv.textContent = 'Vui lòng nhập VNPAY Return URL';
        return;
      }

      try {
        // Parse URL parameters
        const url = new URL(returnUrl);
        const params = Object.fromEntries(url.searchParams);

        // Call IPN endpoint
        const response = await fetch('/vnpay/ipn?' + url.search, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        const result = await response.json();

        resultDiv.style.display = 'block';
        if (result.RspCode === '00') {
          resultDiv.className = 'result success';
          resultDiv.innerHTML = `
                        <strong>✅ IPN Callback thành công!</strong><br>
                        <br>
                        Response: ${JSON.stringify(result, null, 2)}<br>
                        <br>
                        Bây giờ kiểm tra database xem payment đã được cập nhật chưa!
                    `;
        } else {
          resultDiv.className = 'result error';
          resultDiv.innerHTML = `
                        <strong>❌ IPN Callback thất bại</strong><br>
                        <br>
                        Response: ${JSON.stringify(result, null, 2)}
                    `;
        }
      } catch (error) {
        resultDiv.className = 'result error';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
                    <strong>❌ Lỗi:</strong><br>
                    ${error.message}
                `;
      }
    });
  </script>
</body>

</html>

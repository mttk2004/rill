<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Testing - Rill</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
      max-width: 600px;
      width: 100%;
    }

    h1 {
      color: #1a202c;
      margin-bottom: 10px;
      font-size: 28px;
    }

    .subtitle {
      color: #718096;
      margin-bottom: 30px;
      font-size: 14px;
    }

    .warning {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 30px;
      color: #856404;
      font-size: 14px;
    }

    .test-section {
      margin-bottom: 30px;
    }

    .test-section h2 {
      color: #2d3748;
      font-size: 18px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .test-section p {
      color: #4a5568;
      margin-bottom: 15px;
      font-size: 14px;
      line-height: 1.6;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
    }

    .btn:active {
      transform: translateY(0);
    }

    .icon {
      font-size: 20px;
    }

    .divider {
      height: 1px;
      background: #e2e8f0;
      margin: 30px 0;
    }

    .info-box {
      background: #ebf8ff;
      border-left: 4px solid #3182ce;
      padding: 15px;
      border-radius: 4px;
      margin-top: 30px;
    }

    .info-box h3 {
      color: #2c5282;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .info-box ul {
      color: #2c5282;
      font-size: 13px;
      line-height: 1.8;
      padding-left: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>📧 Email Testing Dashboard</h1>
    <p class="subtitle">Test email functionality for Rill application</p>

    <div class="warning">
      ⚠️ <strong>Development Only:</strong> This page is only available in local environment.
    </div>

    <!-- Welcome Email Test -->
    <div class="test-section">
      <h2><span class="icon">👋</span> Welcome Email</h2>
      <p>
        Test welcome email sent to new users after registration.
        This email includes greeting, features overview, and call-to-action.
      </p>
      <a href="/test/email/welcome" class="btn" target="_blank">Send Welcome Email</a>
    </div>

    <div class="divider"></div>

    <!-- Order Status Email Test -->
    <div class="test-section">
      <h2><span class="icon">📦</span> Order Status Update Email</h2>
      <p>
        Test order status notification email. This email is sent when order status changes
        (confirmed, shipped, delivered, cancelled).
      </p>
      <a href="/test/email/order-status" class="btn" target="_blank">Send Order Status Email</a>
    </div>

    <div class="info-box">
      <h3>📝 Testing Instructions:</h3>
      <ul>
        <li>Make sure you have configured RESEND_API_KEY in .env</li>
        <li>Ensure MAIL_MAILER is set to "resend"</li>
        <li>Check that you have at least one user and one order in database</li>
        <li>Emails will be queued and sent via queue worker</li>
        <li>Run <code>php artisan queue:work</code> to process email jobs</li>
      </ul>
    </div>
  </div>
</body>

</html>

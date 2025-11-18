<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chào mừng đến với Rill</title>
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
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      padding: 40px 20px;
      text-align: center;
    }

    .header h1 {
      color: #1f2937;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }

    .vinyl-icon {
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
      font-size: 24px;
      color: #1f2937;
      margin-bottom: 20px;
      font-weight: 600;
    }

    .message {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 30px;
      line-height: 1.8;
    }

    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #1f2937 !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
    }

    .features {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 25px;
      margin: 30px 0;
    }

    .feature-item {
      display: flex;
      align-items: start;
      margin-bottom: 15px;
    }

    .feature-icon {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      color: #f59e0b;
      flex-shrink: 0;
    }

    .feature-text {
      color: #4b5563;
      font-size: 14px;
    }

    .footer {
      background-color: #1f2937;
      color: #9ca3af;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }

    .footer-links {
      margin: 15px 0;
    }

    .footer-link {
      color: #f59e0b;
      text-decoration: none;
      margin: 0 10px;
    }

    .social-icons {
      margin: 20px 0;
    }

    .social-icon {
      display: inline-block;
      width: 36px;
      height: 36px;
      margin: 0 5px;
      background-color: rgba(245, 158, 11, 0.2);
      border-radius: 50%;
      text-align: center;
      line-height: 36px;
      color: #f59e0b;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="vinyl-icon">🎵</div>
      <h1>Rill</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Xin chào {{ $userName }}! 👋</div>

      <div class="message">
        Chào mừng bạn đến với <strong>Rill</strong> - Thiên đường dành cho những người yêu đĩa than!
      </div>

      <div class="message">
        Chúng tôi rất vui mừng được đồng hành cùng bạn trong hành trình khám phá âm nhạc chất lượng cao.
        Tại Rill, bạn sẽ tìm thấy những album vinyl độc đáo từ các nghệ sĩ tài năng trên toàn thế giới.
      </div>

      <div style="text-align: center;">
        <a href="{{ config('app.url') }}/products" class="cta-button">
          Khám phá ngay
        </a>
      </div>

      <!-- Features -->
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">✨</div>
          <div class="feature-text">
            <strong>Bộ sưu tập đa dạng</strong><br>
            Hàng nghìn album từ Pop, Rock, Jazz đến Classical
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🚚</div>
          <div class="feature-text">
            <strong>Giao hàng miễn phí</strong><br>
            Cho đơn hàng từ 1.000.000₫
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎁</div>
          <div class="feature-text">
            <strong>Ưu đãi hấp dẫn</strong><br>
            Nhận ngay mã giảm giá cho lần mua đầu tiên
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💎</div>
          <div class="feature-text">
            <strong>Chất lượng đảm bảo</strong><br>
            100% đĩa than chính hãng, nguyên seal
          </div>
        </div>
      </div>

      <div class="message">
        Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.
        Đội ngũ hỗ trợ của Rill luôn sẵn sàng giúp đỡ!
      </div>

      <div class="message" style="color: #f59e0b; font-weight: 600;">
        Chúc bạn có những trải nghiệm tuyệt vời! 🎶
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div style="font-weight: 600; color: #ffffff; margin-bottom: 10px;">
        Rill - Nơi âm nhạc trở nên sống động
      </div>

      <div class="footer-links">
        <a href="{{ config('app.url') }}/products" class="footer-link">Sản phẩm</a>
        <a href="{{ config('app.url') }}/about" class="footer-link">Về chúng tôi</a>
        <a href="{{ config('app.url') }}/contact" class="footer-link">Liên hệ</a>
      </div>

      <div class="social-icons">
        <a href="#" class="social-icon">f</a>
        <a href="#" class="social-icon">📷</a>
        <a href="#" class="social-icon">🐦</a>
      </div>

      <div style="margin-top: 20px; font-size: 12px;">
        Email này được gửi đến {{ $userEmail }}<br>
        © {{ date('Y') }} Rill. All rights reserved.
      </div>
    </div>
  </div>
</body>

</html>

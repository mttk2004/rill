
export const flyToCart = (imgSrc: string | null, startRect: DOMRect) => {
  // 1. Tìm điểm đến (icon giỏ hàng)
  const cartIconDesktop = document.getElementById('cart-icon-desktop');
  const cartIconMobile = document.getElementById('cart-icon-mobile');
  
  let targetElement = cartIconDesktop;
  
  // Kiểm tra nếu đang ở mobile (mobile icon hiển thị)
  if (cartIconMobile && window.getComputedStyle(cartIconMobile).display !== 'none') {
     targetElement = cartIconMobile;
  }
  
  // Fallback
  if (!targetElement) targetElement = cartIconDesktop || cartIconMobile;
  if (!targetElement) return;

  const cartRect = targetElement.getBoundingClientRect();
  
  // 2. Tạo phần tử ảnh bay
  const img = document.createElement('img');
  img.src = imgSrc || 'https://via.placeholder.com/150';
  img.style.position = 'fixed';
  // Bắt đầu từ vị trí nút bấm
  img.style.left = `${startRect.left}px`;
  img.style.top = `${startRect.top}px`;
  img.style.width = `${Math.min(startRect.width, 50)}px`;
  img.style.height = `${Math.min(startRect.height, 50)}px`;
  img.style.borderRadius = '50%';
  img.style.objectFit = 'cover';
  img.style.zIndex = '9999';
  img.style.pointerEvents = 'none';
  img.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
  img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  
  document.body.appendChild(img);

  // Trigger reflow
  void img.offsetWidth;

  // 3. Tính toán vị trí đích (Tâm của icon giỏ hàng)
  const targetX = cartRect.left + cartRect.width / 2;
  const targetY = cartRect.top + cartRect.height / 2;

  // 4. Kích hoạt Animation
  img.style.left = `${targetX - 10}px`;
  img.style.top = `${targetY - 10}px`;
  img.style.width = '20px';
  img.style.height = '20px';
  img.style.opacity = '0.5';

  // 5. Dọn dẹp
  setTimeout(() => {
    if (document.body.contains(img)) {
      document.body.removeChild(img);
    }
  }, 800);
};

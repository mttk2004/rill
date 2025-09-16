# Quy ước Giao diện - Rill

## Tổng quan
Tài liệu này định nghĩa phong cách thiết kế và quy ước UI cho Rill - cửa hàng đĩa than online. Mục tiêu là tạo ra giao diện vừa hiện đại vừa mang hơi hướng retro phù hợp với văn hóa đĩa than.

---

## 1. Phong cách thiết kế

### 1.1 Nguyên tắc
- **Modern Retro**: Kết hợp sự hiện đại với hơi hướng cổ điển của đĩa than
- **Clean & Minimal**: Tập trung vào sản phẩm, không cluttered
- **Mobile-First**: Ưu tiên trải nghiệm mobile (375px+)
- **Vietnamese-Friendly**: Tối ưu cho tiếng Việt

### 1.2 Responsive Breakpoints
```
sm: 640px   (Mobile landscape)
md: 768px   (Tablet)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
```

---

## 2. Bảng màu

### 2.1 Màu chính
```css
/* Primary - Đen chủ đạo */
--primary: #1a1a1a
--primary-foreground: #fafafa

/* Secondary - Xám ấm */
--secondary: #f5f5f4
--secondary-foreground: #0c0a09

/* Accent - Đồng cổ điển */
--accent: #d97706
--accent-foreground: #fefbf3
```

### 2.2 Màu hệ thống
```css
/* Background */
--background: #ffffff
--foreground: #0a0a0a

/* Muted */
--muted: #f5f5f5
--muted-foreground: #737373

/* Border */
--border: #e5e5e5
--input: #e5e5e5

/* Destructive */
--destructive: #dc2626
--destructive-foreground: #fefefe
```

---

## 3. Typography

### 3.1 Font Stack
```css
/* Primary - Inter cho UI */
font-family: 'Inter', system-ui, sans-serif

/* Heading - Dùng font chính để nhất quán trong MVP */
font-family: 'Inter', system-ui, sans-serif

/* Mono - Cho số liệu, code */
font-family: 'JetBrains Mono', monospace
```

### 3.2 Font Sizes
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
```

### 3.3 Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale
```css
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-5: 1.25rem   /* 20px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
--spacing-10: 2.5rem   /* 40px */
--spacing-12: 3rem     /* 48px */
--spacing-16: 4rem     /* 64px */
```

### 4.2 Container & Grid
```css
/* Container max-widths */
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px

/* Grid gaps */
--gap-4: 1rem      /* Product grid mobile */
--gap-6: 1.5rem    /* Product grid desktop */
--gap-8: 2rem      /* Section spacing */
```

---

## 5. Border Radius

```css
--radius-sm: 0.25rem   /* 4px - Small elements */
--radius: 0.5rem       /* 8px - Default */
--radius-md: 0.75rem   /* 12px - Cards */
--radius-lg: 1rem      /* 16px - Large cards */
--radius-xl: 1.5rem    /* 24px - Hero sections */
```

---

## 6. Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
```

---

## 7. Component Guidelines

### 7.1 Buttons
```css
/* Primary Button */
- Background: var(--primary)
- Text: var(--primary-foreground)
- Padding: 12px 24px
- Border-radius: var(--radius)
- Font-weight: var(--font-medium)

/* Secondary Button */
- Background: var(--secondary)
- Text: var(--secondary-foreground)
- Border: 1px solid var(--border)
```

### 7.2 Cards
```css
/* Product Card */
- Background: var(--card)
- Border: 1px solid var(--border)
- Border-radius: var(--radius-md)
- Padding: var(--spacing-4)
- Shadow: var(--shadow-sm)
```

### 7.3 Forms
```css
/* Input Fields */
- Background: var(--background)
- Border: 1px solid var(--input)
- Border-radius: var(--radius)
- Padding: 12px 16px
- Font-size: var(--text-base)

/* Focus State */
- Border-color: var(--accent)
- Box-shadow: 0 0 0 2px var(--accent) / 0.2
```

---

## 8. Icon Guidelines

### 8.1 Icon Library
- **Primary**: Lucide React
- **Size**: 16px, 20px, 24px làm kích thước chuẩn
- **Style**: Outline style, stroke-width 1.5px

### 8.2 Icon Usage
```css
/* Small icons (16px) */
- Inline với text
- Form field icons

/* Medium icons (20px) */
- Buttons
- Navigation items

/* Large icons (24px) */
- Feature highlights
- Empty states
```

---

## 9. Animation

### 9.1 Transitions
```css
/* Standard transitions */
--transition-fast: 150ms ease-in-out
--transition-normal: 250ms ease-in-out
--transition-slow: 350ms ease-in-out

/* Common usage */
- Hover effects: var(--transition-fast)
- Modal/drawer: var(--transition-normal)
- Page transitions: var(--transition-slow)
```

### 9.2 Easing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in: cubic-bezier(0.4, 0, 1, 1)
```

---

## 10. Dark Mode (Tùy chọn)

### 10.1 Dark Colors
```css
.dark {
  --background: #0a0a0a
  --foreground: #fafafa
  --card: #1a1a1a
  --card-foreground: #fafafa
  --primary: #fafafa
  --primary-foreground: #0a0a0a
  --muted: #262626
  --muted-foreground: #a3a3a3
  --border: #262626
}
```

---

*Lưu ý: Tất cả giá trị này được implement trong Tailwind CSS config và CSS variables để đảm bảo tính nhất quán.*

# Quy Trình Phát Triển - Rill

## Tổng quan thời gian
**Tổng thời gian**: 8 tuần (2 tháng)
**Phương pháp**: Agile/Scrum với sprint 2 tuần

---

## Giai đoạn 1: Thiết lập & Core Foundation (Tuần 1-2)

### Sprint 1 (Tuần 1-2)
**Mục tiêu**: Thiết lập project và xây dựng nền tảng cơ bản

#### Deliverables:
- [ ] **Setup Project**
  - Khởi tạo Laravel 12 project
  - Cài đặt và cấu hình Inertia.js 2.1
  - Setup React 19 + TypeScript
  - Setup Tailwind CSS + Radix UI
  - Cài đặt additional packages:
    - React Hook Form + Zod (forms)
    - Class Variance Authority (component variants)
    - Lucide React (icons)
  - Cấu hình database MySQL/MariaDB
  - Setup development tools (ESLint, Prettier, TypeScript)

- [ ] **Authentication System**
  - User registration & login
  - Laravel Sanctum setup
  - Password reset functionality
  - User roles (Admin, Customer)

- [ ] **Core Models & Migrations**
  - User model with simple role system (admin/customer enum)
  - Products, Artists, artist_product (pivot table)
  - Basic seeding data

- [ ] **Basic Layout & Navigation**
  - Header, Footer components
  - Navigation menu
  - Responsive layout foundation

**Estimated Story Points**: 30-35 (tăng do setup phức tạp hơn)

---

## Giai đoạn 2: Product Management & Catalog (Tuần 3-4)

### Sprint 2 (Tuần 3-4)
**Mục tiêu**: Xây dựng hệ thống quản lý sản phẩm

#### Deliverables:
- [ ] **Product Management**
  - CRUD operations cho products
  - Image upload & management
  - Genre và Label management (text fields)
  - Inventory tracking

- [ ] **Artist Management**
  - Artist CRUD operations
  - Artist-Product relationships
  - Artist profiles và filtering

- [ ] **Admin Dashboard**
  - Admin layout
  - Product management interface
  - Basic statistics overview

- [ ] **Public Product Catalog**
  - Product listing page
  - Genre & Label filtering
  - Artist browsing
  - Product search functionality

**Estimated Story Points**: 35-40 (tăng do image upload và attributes)

---

## Giai đoạn 3: Shopping Cart & User Management (Tuần 5-6)

### Sprint 3 (Tuần 5-6)
**Mục tiêu**: Phát triển tính năng mua sắm và quản lý người dùng

#### Deliverables:
- [ ] **Shopping Cart System**
  - Add/remove items from cart
  - Cart persistence (session/database)
  - Quantity updates
  - Cart total calculations

- [ ] **User Profile Management**
  - Profile editing
  - Shipping addresses CRUD
  - Order history
  - Account preferences

- [ ] **Voucher System**
  - Discount code creation
  - Voucher validation logic
  - Apply discounts to cart
  - Usage tracking

- [ ] **Basic Checkout Flow**
  - Checkout page design
  - Address selection
  - Order summary
  - Basic validation

**Estimated Story Points**: 40-45 (tăng do cart persistence và voucher system)

---

## Giai đoạn 4: Orders & Payment Integration (Tuần 7-8)

### Sprint 4 (Tuần 7-8)
**Mục tiêu**: Hoàn thiện quy trình đặt hàng và thanh toán

#### Deliverables:
- [ ] **Order Management**
  - Order creation & processing
  - Order status tracking
  - Order history for users
  - Admin order management

- [ ] **Hoàn thiện luồng thanh toán COD**
  - Hoàn thiện quy trình thanh toán COD (Cash on Delivery)
  - Admin xác nhận thanh toán cho đơn hàng COD
  - Xử lý các trường hợp liên quan đến COD

- [ ] **Email Notifications**
  - Order confirmation emails
  - Payment success notifications
  - Order status updates
  - Account registration emails

- [ ] **Product Reviews**
  - Review submission
  - Rating system (1-5 stars)
  - Review moderation
  - Display reviews on product pages

**Estimated Story Points**: 35-40 (tăng do email notifications và review system)

---

## Buffer Tasks (Nếu còn thời gian)

### Optional Enhancements
**Mục tiêu**: Cải thiện UX và performance nếu hoàn thành sớm

#### Deliverables (Optional):
- [ ] **Basic Analytics**
  - Simple sales statistics
  - Basic product performance

- [ ] **Performance Optimization**
  - Image optimization
  - Basic caching
  - Code cleanup

- [ ] **Polish & Testing**
  - UI/UX improvements
  - Bug fixing
  - Basic testing

- [ ] **Deployment Preparation**
  - Production environment setup
  - Security review
  - Documentation completion
  - User acceptance testing

**Estimated Story Points**: 25-30 (tăng do testing và deployment)

---

## Milestones & Checkpoints

### Milestone 1 (End of Week 2)
- ✅ Project setup hoàn thành
- ✅ Authentication working
- ✅ Basic UI components ready

### Milestone 2 (End of Week 4)
- ✅ Product catalog functioning
- ✅ Admin can manage products
- ✅ Public can browse products

### Milestone 3 (End of Week 6)
- ✅ Shopping cart working
- ✅ User profiles complete
- ✅ Voucher system operational

### Milestone 4 (End of Week 8)
- ✅ Full order flow working
- ✅ Payment integration complete
- ✅ MVP ready for deployment

---

## Rủi ro và Giảm thiểu

### Rủi ro cao
1. **Payment integration complexity**
   - *Giảm thiểu*: Đã được giảm thiểu tối đa bằng cách chỉ tập trung vào COD (Cash on Delivery) cho MVP. Các cổng thanh toán online sẽ được tích hợp ở giai đoạn sau.
2. **Performance với large product catalog**
   - *Giảm thiểu*: Implement pagination và caching từ sớm
3. **Time constraints cho advanced features**
   - *Giảm thiểu*: Prioritize core features, defer nice-to-haves
4. **Email system complexity**
   - *Giảm thiểu*: Sử dụng Mailgun/SendGrid đơn giản, template cơ bản
5. **Image upload và management**
   - *Giảm thiểu*: Sử dụng Laravel Media Library, resize tự động

### Rủi ro trung bình
1. **Third-party API dependencies**
2. **Mobile responsiveness issues**
3. **Browser compatibility**

---

## Daily Standup Questions
1. Hôm qua đã hoàn thành gì?
2. Hôm nay sẽ làm gì?
3. Có blockers nào không?
4. Có cần support từ team members khác không?

## Sprint Review & Retrospective
- **Sprint Review**: Demo working features
- **Sprint Retrospective**: What went well, what could improve
- **Sprint Planning**: Plan next sprint based on backlog priority

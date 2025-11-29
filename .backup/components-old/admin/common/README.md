# Admin Common Components - Hướng dẫn sử dụng

Đây là bộ components tái sử dụng cho các trang quản trị (Admin pages).

## 📦 Components

### 1. AdminTable
Component table generic với TypeScript support.

**Props:**
- `data`: Array dữ liệu
- `columns`: Định nghĩa các cột
- `loading`: Trạng thái loading (optional)
- `emptyMessage`: Thông báo khi không có dữ liệu (optional)
- `getRowKey`: Function lấy unique key cho mỗi row
- `rowClassName`: Function tùy chỉnh className cho row (optional)

**Ví dụ:**
```tsx
import { AdminTable, Column } from "@/components/admin/common";

interface Product {
  id: string;
  name: string;
  price: number;
}

const columns: Column<Product>[] = [
  {
    header: "Tên sản phẩm",
    accessor: "name", // Simple accessor
  },
  {
    header: "Giá",
    render: (product) => ( // Custom render
      <span className="font-bold">
        {product.price.toLocaleString()}₫
      </span>
    ),
  },
];

<AdminTable
  data={products}
  columns={columns}
  getRowKey={(p) => p.id}
  emptyMessage="Không có sản phẩm nào"
/>
```

### 2. AdminFilters
Component bộ lọc linh hoạt với nhiều loại field.

**Field Types:**
- `search`: Input tìm kiếm với icon
- `select`: Dropdown select

**Ví dụ:**
```tsx
import { AdminFilters, FilterField } from "@/components/admin/common";

const fields: FilterField[] = [
  {
    name: 'search',
    label: 'Tìm kiếm',
    type: 'search',
    placeholder: 'Nhập từ khóa...',
    value: searchTerm,
    onChange: setSearchTerm,
    className: 'lg:col-span-2', // Span 2 columns
  },
  {
    name: 'status',
    label: 'Trạng thái',
    type: 'select',
    value: status,
    onChange: setStatus,
    options: [
      { value: 'all', label: 'Tất cả' },
      { value: 'active', label: 'Hoạt động' },
      { value: 'inactive', label: 'Không hoạt động' },
    ],
  },
];

<AdminFilters fields={fields} />
```

### 3. AdminStatsCards
Component hiển thị thống kê dạng cards với gradient đẹp.

**Ví dụ:**
```tsx
import { AdminStatsCards, StatCardData } from "@/components/admin/common";
import { ShoppingCart, DollarSign } from "lucide-react";

const stats: StatCardData[] = [
  {
    title: "Tổng đơn hàng",
    value: 1250,
    subtitle: "Tháng này",
    icon: ShoppingCart,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Doanh thu",
    value: "125.5M₫",
    icon: DollarSign,
    gradient: "from-green-500 to-green-600",
  },
];

<AdminStatsCards stats={stats} />
```

### 4. AdminPagination
Component phân trang chuẩn Laravel.

**Ví dụ:**
```tsx
import { AdminPagination } from "@/components/admin/common";

<AdminPagination
  pagination={ordersPaginator}
  itemName="đơn hàng"
/>
```

## 🎯 Use Cases

### Trang /admin/orders
```tsx
// Order Table
const orderColumns: Column<Order>[] = [
  {
    header: "Mã đơn hàng",
    render: (order) => <span>#{order.order_number}</span>,
  },
  {
    header: "Khách hàng",
    accessor: (order) => order.customer.name,
  },
  {
    header: "Tổng tiền",
    render: (order) => formatPrice(order.total),
  },
  {
    header: "Trạng thái",
    render: (order) => getOrderStatusBadge(order.status),
  },
];

// Order Filters
const orderFilters: FilterField[] = [
  {
    name: 'search',
    label: 'Tìm kiếm',
    type: 'search',
    placeholder: 'Mã đơn, khách hàng...',
    value: filters.search,
    onChange: handleSearchChange,
    className: 'lg:col-span-2',
  },
  {
    name: 'status',
    label: 'Trạng thái',
    type: 'select',
    value: filters.status,
    onChange: handleStatusChange,
    options: [
      { value: 'all', label: 'Tất cả' },
      { value: 'pending', label: 'Chờ xử lý' },
      { value: 'processing', label: 'Đang xử lý' },
      { value: 'completed', label: 'Hoàn thành' },
      { value: 'cancelled', label: 'Đã hủy' },
    ],
  },
];

// Order Stats
const orderStats: StatCardData[] = [
  {
    title: "Tổng đơn hàng",
    value: stats.total,
    icon: ShoppingCart,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Chờ xử lý",
    value: stats.pending,
    icon: Clock,
    gradient: "from-amber-500 to-amber-600",
  },
  // ...
];
```

### Trang /admin/artists
```tsx
// Artist Table
const artistColumns: Column<Artist>[] = [
  {
    header: "Nghệ sĩ",
    render: (artist) => (
      <div className="flex items-center gap-3">
        <img src={artist.image} className="w-12 h-12 rounded-full" />
        <div>
          <div className="font-medium">{artist.name}</div>
          <div className="text-sm text-gray-500">{artist.genre}</div>
        </div>
      </div>
    ),
  },
  {
    header: "Số sản phẩm",
    accessor: "products_count",
  },
  {
    header: "Quốc gia",
    accessor: "country",
  },
];

// Artist Filters
const artistFilters: FilterField[] = [
  {
    name: 'search',
    label: 'Tìm kiếm',
    type: 'search',
    placeholder: 'Tên nghệ sĩ...',
    value: filters.search,
    onChange: handleSearchChange,
    className: 'lg:col-span-3',
  },
  {
    name: 'genre',
    label: 'Thể loại',
    type: 'select',
    value: filters.genre,
    onChange: handleGenreChange,
    options: genreOptions,
  },
  {
    name: 'country',
    label: 'Quốc gia',
    type: 'select',
    value: filters.country,
    onChange: handleCountryChange,
    options: countryOptions,
  },
];
```

## 💡 Tips

1. **Type Safety**: Sử dụng TypeScript generics để có type-safe columns
2. **Customization**: Sử dụng `className` prop để customize layout của từng field
3. **Reusability**: Tách logic columns/filters ra thành separate functions
4. **Performance**: AdminTable tự động optimize rendering với React keys

## 📁 File Structure
```
resources/js/components/admin/
├── common/
│   ├── admin-table.tsx
│   ├── admin-filters.tsx
│   ├── admin-stats-cards.tsx
│   ├── admin-pagination.tsx
│   └── index.tsx
├── product-table.tsx (specific implementation)
├── product-filters.tsx (specific implementation)
└── product-stats-cards.tsx (specific implementation)
```

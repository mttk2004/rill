import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AdminNavigation } from '@/components/admin-navigation';
import {
  AdminTable,
  AdminFilters,
  AdminStatsCards,
  AdminPagination,
  type AdminTableColumn,
  type FilterField,
  type StatCardData,
} from '@/components/admin/common';
import {
  type AdminOrder,
  getOrderStatusBadge,
  getPaymentStatusBadge,
  formatCurrency,
  formatDateTime,
} from '@/lib/order-helpers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ShoppingCart,
  Clock,
  Package,
  Truck,
  PackageCheck,
  XCircle,
  Eye,
  User,
} from 'lucide-react';

interface OrdersPageProps {
  orders: {
    data: AdminOrder[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  filters: {
    search: string;
    status: string;
    payment_status: string;
    sort: string;
  };
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export default function Orders({ orders, filters, stats }: OrdersPageProps) {
  const [currentFilters, setCurrentFilters] = useState(filters);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats cards configuration
  const statsCards: StatCardData[] = [
    {
      title: 'Tổng đơn hàng',
      value: stats.total.toLocaleString(),
      subtitle: 'Tất cả đơn hàng',
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Chờ xử lý',
      value: stats.pending.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Đang xử lý',
      value: stats.confirmed.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.confirmed / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: Package,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Đang giao',
      value: stats.shipped.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.shipped / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: Truck,
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Đã giao',
      value: stats.delivered.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: PackageCheck,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Đã hủy',
      value: stats.cancelled.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.cancelled / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
    },
  ];

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      name: 'search',
      label: 'Tìm kiếm',
      type: 'search',
      value: currentFilters.search,
      onChange: (value) => handleFilterChange('search', value),
      placeholder: 'Tìm theo mã đơn, tên khách hàng, email...',
      className: 'md:col-span-2',
    },
    {
      name: 'status',
      label: 'Trạng thái đơn hàng',
      type: 'select',
      value: currentFilters.status,
      onChange: (value) => handleFilterChange('status', value),
      options: [
        { label: 'Tất cả trạng thái', value: 'all' },
        { label: 'Chờ xử lý', value: 'pending' },
        { label: 'Đang xử lý', value: 'confirmed' },
        { label: 'Đang giao', value: 'shipped' },
        { label: 'Đã giao', value: 'delivered' },
        { label: 'Đã hủy', value: 'cancelled' },
      ],
    },
    {
      name: 'payment_status',
      label: 'Trạng thái thanh toán',
      type: 'select',
      value: currentFilters.payment_status,
      onChange: (value) => handleFilterChange('payment_status', value),
      options: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Chờ thanh toán', value: 'pending' },
        { label: 'Đã thanh toán', value: 'completed' },
        { label: 'Thất bại', value: 'failed' },
        { label: 'Hoàn tiền', value: 'refunded' },
      ],
    },
    {
      name: 'sort',
      label: 'Sắp xếp',
      type: 'select',
      value: currentFilters.sort,
      onChange: (value) => handleFilterChange('sort', value),
      options: [
        { label: 'Mới nhất', value: 'newest' },
        { label: 'Cũ nhất', value: 'oldest' },
        { label: 'Giá trị cao nhất', value: 'total_desc' },
        { label: 'Giá trị thấp nhất', value: 'total_asc' },
      ],
    },
  ];

  // Table columns configuration
  const columns: AdminTableColumn<AdminOrder>[] = [
    {
      header: 'Mã đơn hàng',
      accessor: 'order_number',
      render: (order) => (
        <div className="font-medium text-blue-600">#{order.order_number}</div>
      ),
    },
    {
      header: 'Khách hàng',
      accessor: 'customer',
      render: (order) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{order.customer?.name || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">{order.customer?.email || ''}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Sản phẩm',
      accessor: 'order_items_count',
      className: 'text-center',
      render: (order) => (
        <div className="text-center">
          <span className="font-medium">{order.order_items_count}</span>
          <span className="text-sm text-muted-foreground ml-1">sản phẩm</span>
        </div>
      ),
    },
    {
      header: 'Tổng tiền',
      accessor: 'total_amount',
      render: (order) => (
        <div className="font-medium text-green-600">{formatCurrency(order.total_amount)}</div>
      ),
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (order) => getOrderStatusBadge(order.status, order.deleted_at),
    },
    {
      header: 'Thanh toán',
      accessor: 'payment_status',
      render: (order) => getPaymentStatusBadge(order.payment_status),
    },
    {
      header: 'Ngày đặt',
      accessor: 'placed_at',
      render: (order) => (
        <div className="text-sm">{formatDateTime(order.placed_at)}</div>
      ),
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      className: 'text-right',
      render: (order) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(order.id)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Xem
          </Button>
        </div>
      ),
    },
  ];

  // Handlers
  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...currentFilters, [name]: value };

    if (name === 'search') {
      // Debounce search
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      searchTimerRef.current = setTimeout(() => {
        setCurrentFilters(newFilters);
        router.get(route('admin.orders'), newFilters, { preserveState: true });
      }, 500);
    } else {
      setCurrentFilters(newFilters);
      router.get(route('admin.orders'), newFilters, { preserveState: true });
    }
  };

  const handleViewDetails = (orderId: number) => {
    router.visit(route('admin.orders.edit', orderId));
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý đơn hàng" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
              <p className="text-muted-foreground mt-2">
                Quản lý và theo dõi đơn hàng của khách hàng
              </p>
            </div>

            <AdminStatsCards stats={statsCards} cols={{ default: 2, md: 3, xl: 6 }} />

            <AdminFilters fields={filterFields} />

            <Card className="p-6">
              <AdminTable
                data={orders.data}
                columns={columns}
                emptyMessage="Không tìm thấy đơn hàng nào"
                getRowKey={(order) => order.id.toString()}
              />

              <div className="mt-6">
                <AdminPagination
                  pagination={{
                    current_page: orders.current_page,
                    last_page: orders.last_page,
                    from: orders.from,
                    to: orders.to,
                    total: orders.total,
                    links: orders.links,
                  }}
                  itemName="đơn hàng"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

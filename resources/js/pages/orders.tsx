import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { Package, Truck, CheckCircle, Clock, X, Disc3 } from "lucide-react";
import { Link, Head, usePage, router } from "@inertiajs/react";
import { type SharedData, type Paginator, type PaginationLink } from '@/types';
import { formatVND } from "@/lib/utils";

// Define TypeScript interfaces for props
interface Product {
  name: string;
  slug: string;
}

interface OrderItem {
  product: Product;
}

interface Order {
  id: string;
  order_number: string;
  placed_at: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items_count: number;
  items: OrderItem[];
}

interface OrdersPageProps extends SharedData {
  orders: Paginator<Order>;
  filters: {
    status?: string;
  }
}

// Helper functions for status
const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending": return <Clock className="h-4 w-4 mr-2" />;
    case "confirmed": return <Package className="h-4 w-4 mr-2" />;
    case "shipped": return <Truck className="h-4 w-4 mr-2" />;
    case "delivered": return <CheckCircle className="h-4 w-4 mr-2" />;
    case "cancelled": return <X className="h-4 w-4 mr-2" />;
    default: return <Package className="h-4 w-4 mr-2" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending": return "Chờ xác nhận";
    case "confirmed": return "Đã xác nhận";
    case "shipped": return "Đang giao";
    case "delivered": return "Đã giao";
    case "cancelled": return "Đã hủy";
    default: return "Chưa xác định";
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-500";
    case "confirmed": return "bg-blue-500";
    case "shipped": return "bg-purple-500";
    case "delivered": return "bg-green-500";
    case "cancelled": return "bg-red-500";
    default: return "bg-slate-500";
  }
};

const Pagination = ({ links }: { links: Paginator<Order>['links'] }) => (
  <div className="flex justify-center items-center space-x-2 mt-8">
    {links.map((link: PaginationLink, index: number) => {
      if (!link.url) {
        return <span key={index} className="px-4 py-2 text-slate-400" dangerouslySetInnerHTML={{ __html: link.label }} />;
      }
      return (
        <Link
          key={index}
          href={link.url}
          className={`px-4 py-2 rounded-md transition-colors ${link.active ? 'bg-amber-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 hover:bg-amber-100 dark:hover:bg-slate-700'}`}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      );
    })}
  </div>
);


const orderStatuses = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipped", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
];

export default function Orders() {
  const pageProps = usePage<OrdersPageProps>().props;
  const { auth, orders, filters } = pageProps;

  const handleStatusFilter = (status: string) => {
    const newStatus = status === 'all' ? undefined : status;
    router.get(
      '/orders',
      { status: newStatus },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  const currentStatus = filters.status || 'all';

  return (
    <>
      <Head title="Đơn hàng của tôi - Rill" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Navigation user={auth.user} />

        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1ल्यूLCAyNTUsLCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="absolute top-10 left-10 animate-spin-slow"><Disc3 className="h-20 w-20 text-amber-500/10" /></div>
          <div className="absolute top-20 right-10 animate-spin-reverse"><Disc3 className="h-16 w-16 text-amber-500/5" /></div>

          <div className="relative container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
              Đơn hàng của tôi
            </h1>
            <p className="text-slate-200 drop-shadow">Theo dõi và quản lý các đơn hàng của bạn.</p>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar - Vertical Tabs */}
              <aside className="lg:w-64 flex-shrink-0">
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-4">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-slate-600 dark:text-slate-400 mb-3 px-2">Trạng thái đơn hàng</h3>
                    <nav className="space-y-1">
                      {orderStatuses.map((status) => (
                        <button
                          key={status.value}
                          onClick={() => handleStatusFilter(status.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${currentStatus === status.value
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                            }`}
                        >
                          {status.value !== 'all' && getStatusIcon(status.value)}
                          <span className={currentStatus === status.value ? 'font-semibold' : ''}>{status.label}</span>
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {orders.data.length === 0 ? (
                  <Card className="text-center py-16 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent>
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                        <Package className="h-10 w-10 text-slate-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Không tìm thấy đơn hàng</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Không có đơn hàng nào khớp với bộ lọc hiện tại.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <TooltipProvider delayDuration={100}>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                          {orders.data.map((order: Order) => (
                            <Link
                              href={`/orders/${order.id}`}
                              className="block p-6 transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:shadow-sm group"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                {/* Order Number & Date */}
                                <div className="lg:col-span-2">
                                  <p className="font-bold text-amber-600 transition-colors group-hover:text-amber-500">
                                    #{order.order_number}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>

                                {/* Products Info with Tooltip */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="lg:col-span-4 cursor-help">
                                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {order.items.length > 0 && order.items[0].product.name}
                                      </p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {order.items_count > 1 ? `và ${order.items_count - 1} sản phẩm khác` : `${order.items_count} sản phẩm`}
                                      </p>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" align="start" className="max-w-sm bg-slate-900 dark:bg-slate-800 border-slate-700">
                                    <p className="font-bold mb-2 text-white">Sản phẩm trong đơn:</p>
                                    <ul className="list-disc list-inside text-slate-100 dark:text-slate-200 space-y-1">
                                      {order.items.map((item: OrderItem, index: number) => (
                                        <li key={index} className="text-sm">{item.product.name}</li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>

                                {/* Status Badge */}
                                <div className="lg:col-span-3">
                                  <Badge className={`text-white border-0 ${getStatusVariant(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {getStatusLabel(order.status)}
                                  </Badge>
                                </div>

                                {/* Total Amount */}
                                <div className="lg:col-span-3 text-left lg:text-right">
                                  <p className="font-bold text-xl text-slate-900 dark:text-white">
                                    {formatVND(order.total_amount)}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Tổng thanh toán
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </TooltipProvider>
                      <div className="p-6">
                        <Pagination links={orders.links} />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

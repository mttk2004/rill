import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { Package, Truck, CheckCircle, Clock, Eye, X, Disc3, MessageSquareQuote } from "lucide-react";
import { Link, Head, usePage, router } from "@inertiajs/react";
import { type SharedData, type Paginator } from '@/types';

// Define TypeScript interfaces for props
interface Product {
    name: string;
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

const Pagination = ({ links }: { links: Paginator<any>['links'] }) => (
    <div className="flex justify-center items-center space-x-2 mt-8">
        {links.map((link, index) => {
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

  const handleTabChange = (status: string) => {
    const newStatus = status === 'all' ? undefined : status;

    router.get(
        route('orders.index'),
        { status: newStatus },
        {
            preserveState: true,
            replace: true,
        }
    );
  };

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
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg"><Package className="h-8 w-8" /></div>
              Đơn hàng của tôi
            </h1>
            <p className="text-slate-200 drop-shadow">Theo dõi và quản lý các đơn hàng của bạn.</p>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Tabs value={filters.status || 'all'} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4">
                    {orderStatuses.map((status) => (
                        <TabsTrigger key={status.value} value={status.value}>
                            {status.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={filters.status || 'all'}>
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
                                {orders.data.map((order) => (
                                    <Tooltip key={order.id}>
                                        <TooltipTrigger asChild>
                                            <div className="py-4 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:bg-slate-50/80 dark:hover:bg-slate-800/50 px-6 group">
                                                <div className="flex items-center gap-6">
                                                    <div className="space-y-1 w-32">
                                                        <p className="font-bold text-amber-600 transition-colors group-hover:text-amber-500">#{order.order_number}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Badge className={`text-white border-0 ${getStatusVariant(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {getStatusLabel(order.status)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right w-36">
                                                        <p className="font-bold text-lg text-slate-900 dark:text-white">
                                                            {order.total_amount.toLocaleString('vi-VN')}₫
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{order.items_count} sản phẩm</p>
                                                    </div>
                                                    <div className="space-x-2 flex items-center">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/orders/${order.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem chi tiết
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={order.status !== 'delivered'}
                                                            asChild
                                                        >
                                                            <Link href="#" className={order.status !== 'delivered' ? 'pointer-events-none' : ''}>
                                                                <MessageSquareQuote className="h-4 w-4 mr-2" />
                                                                Đánh giá
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="start">
                                            <p className="font-bold mb-1">Gồm:</p>
                                            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300">
                                                {order.items.slice(0, 2).map((item, index) => (
                                                    <li key={index}>{item.product.name}</li>
                                                ))}
                                            </ul>
                                            {order.items_count > 2 && (
                                                <p className="mt-1 text-slate-500 dark:text-slate-400">... và {order.items_count - 2} sản phẩm khác.</p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </TooltipProvider>
                          <div className="p-6">
                            <Pagination links={orders.links} />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}

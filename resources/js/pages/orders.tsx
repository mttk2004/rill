import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Package, Truck, CheckCircle, Clock, Eye, X, Disc3, Star } from "lucide-react";
import { Link, Head, usePage, router } from "@inertiajs/react";
import { type SharedData, type Paginator } from '@/types';
import { route } from 'ziggy-js';

// Define TypeScript interfaces for props
interface OrderItem {
    id: string;
    product_name: string;
}

interface Order {
    id: string;
    order_number: string;
    placed_at: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    items: OrderItem[];
    items_count: number;
}

interface OrdersPageProps extends SharedData {
    orders: Paginator<Order>;
    filters: {
        status?: string;
    };
}

// Helper functions for status styling
const getStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };
  return labels[status] || "Chưa xác định";
};

const getStatusBadgeClass = (status: string) => {
    const classes: { [key: string]: string } = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700",
        confirmed: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700",
        shipped: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700",
        delivered: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700",
        cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700",
    };
    return classes[status] || "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600";
};

// Pagination Component
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
                    className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${link.active ? 'bg-amber-500 text-white shadow' : 'bg-white/80 dark:bg-slate-800/80 hover:bg-amber-100 dark:hover:bg-slate-700'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    preserveState
                    preserveScroll
                />
            );
        })}
    </div>
);

// Main Orders Component
export default function Orders() {
  const pageProps = usePage<OrdersPageProps>().props;
  const { auth, orders, filters } = pageProps;

  const handleTabChange = (status: string) => {
    const newStatus = status === 'all' ? undefined : status;
    router.get(route('orders'), { status: newStatus }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
  };

  const orderStatuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <>
      <Head title="Đơn hàng của tôi - Rill" />
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <Navigation user={auth.user} />

          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-20"></div>
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
            <div className="max-w-5xl mx-auto">
                <Tabs defaultValue={filters.status || 'all'} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                        {orderStatuses.map(status => (
                             <TabsTrigger key={status} value={status} className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg">
                                {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="mt-8">
                    {orders.data.length === 0 ? (
                    <Card className="text-center py-16 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardContent>
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                            <Package className="h-10 w-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Không có đơn hàng nào</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                            {filters.status ? `Bạn không có đơn hàng nào với trạng thái "${getStatusLabel(filters.status)}".` : "Hãy khám phá và mua sắm những đĩa vinyl tuyệt vời!"}
                        </p>
                        <Link href="/products">
                            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                            Bắt đầu mua sắm
                            </Button>
                        </Link>
                        </CardContent>
                    </Card>
                    ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <Tooltip key={order.id}>
                                <TooltipTrigger asChild>
                                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group hover:shadow-xl hover:scale-[1.01] hover:bg-amber-50/50 dark:hover:bg-slate-700/50 transition-all duration-300">
                                        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <p className="font-bold text-amber-600 text-lg">#{order.order_number}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Đặt ngày: {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                                                </p>
                                                 <Badge variant="outline" className={`mt-2 ${getStatusBadgeClass(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </Badge>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="font-bold text-xl text-slate-900 dark:text-white">
                                                    {order.total_amount.toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 sm:mt-0 self-start sm:self-center">
                                                <Link href={`/orders/${order.id}`}>
                                                    <Button variant="outline" size="sm" className="bg-white dark:bg-slate-700">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Chi tiết
                                                    </Button>
                                                </Link>
                                                <Button
                                                    asChild
                                                    variant={order.status === 'delivered' ? 'default' : 'secondary'}
                                                    size="sm"
                                                    disabled={order.status !== 'delivered'}
                                                    className={order.status === 'delivered' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' : ''}
                                                >
                                                     <Link href="#">
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Đánh giá
                                                     </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-semibold">Sản phẩm trong đơn:</p>
                                    <ul className="list-disc list-inside">
                                        {order.items.map(item => <li key={item.id}>{item.product_name}</li>)}
                                        {order.items_count > 3 && <li>... và {order.items_count - 3} sản phẩm khác.</li>}
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                         <Pagination links={orders.links} />
                    </div>
                    )}
                </div>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}

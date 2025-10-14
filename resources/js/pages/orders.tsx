import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Package, Truck, CheckCircle, Clock, Eye, X, Disc3 } from "lucide-react";
import { Link, Head, usePage } from "@inertiajs/react";
import { type SharedData, type Paginator } from '@/types';

// Define TypeScript interfaces for props
interface Order {
    id: string;
    order_number: string;
    placed_at: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
}

interface OrdersPageProps extends SharedData {
    orders: Paginator<Order>;
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


export default function Orders() {
  const pageProps = usePage<OrdersPageProps>().props;
  const { auth, orders } = pageProps;

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
            {orders.data.length === 0 ? (
              <Card className="text-center py-16 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Bạn chưa có đơn hàng nào</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Hãy khám phá và mua sắm những đĩa vinyl tuyệt vời!</p>
                  <Link href="/products">
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                      Bắt đầu mua sắm
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Lịch sử mua hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {orders.data.map((order) => (
                      <div key={order.id} className="py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 -mx-6 px-6">
                        <div className="space-y-1">
                          <p className="font-bold text-amber-600">#{order.order_number}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Ngày đặt: {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div>
                          <Badge className={`text-white border-0 ${getStatusVariant(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {order.total_amount.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <div>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination links={orders.links} />
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

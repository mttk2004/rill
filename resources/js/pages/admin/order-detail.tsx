import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Package2, Truck, DollarSign, User, CheckCircle, XCircle, Eye, MapPin, Phone, Mail } from 'lucide-react';
import { AdminNavigation } from '@/components/admin-navigation';

interface OrderDetail {
  id: number;
  order_number: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  subtotal: number;
  discount_amount: number;
  placed_at: string;
  updated_at: string;
  notes?: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line_1: string;
    ward: string;
    district: string;
    city: string;
  };
  payment: {
    payment_method: 'cod' | 'bank_transfer' | 'card';
    payment_status: 'pending' | 'completed' | 'failed';
    processed_at?: string;
    amount: number;
  };
  items: Array<{
    id: number;
    product_id: number;
    product_name: string;
    product_sku: string;
    artist_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

interface Props {
  order: OrderDetail;
}

export default function OrderDetailPage({ order }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'confirmed': return 'bg-blue-500 text-white';
      case 'processing': return 'bg-purple-500 text-white';
      case 'shipped': return 'bg-indigo-500 text-white';
      case 'delivered': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="h-3 w-3" />;
      case 'confirmed': return <CheckCircle className="h-3 w-3" />;
      case 'processing': return <Package2 className="h-3 w-3" />;
      case 'shipped': return <Truck className="h-3 w-3" />;
      case 'delivered': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return <Package className="h-3 w-3" />;
    }
  };

  const formatAddress = (address: { address_line_1: string; ward: string; district: string; city: string }) => {
    return `${address.address_line_1}, ${address.ward}, ${address.district}, ${address.city}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title={`Chi tiết đơn hàng #${order.order_number}`} />
      <AdminNavigation />

      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/orders" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Đơn hàng #{order.order_number}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Đặt ngày {new Date(order.placed_at).toLocaleDateString('vi-VN')} lúc {new Date(order.placed_at).toLocaleTimeString('vi-VN')}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(order.status)} border-0 flex items-center gap-1 px-4 py-2 text-base`}>
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tổng cộng</p>
                  <p className="font-bold text-2xl text-amber-600">
                    {order.total_amount.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <Package2 className="h-5 w-5" />
                    Sản phẩm đã đặt ({order.items.length} sản phẩm)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{item.product_name}</h4>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">{item.artist_name}</p>
                          <p className="text-sm text-slate-500 font-mono mt-1">SKU: {item.product_sku}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>Số lượng: {item.quantity}</span>
                            <span>Đơn giá: {item.unit_price.toLocaleString('vi-VN')}₫</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-amber-600">
                            {item.total_price.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Tạm tính:</span>
                        <span>{order.subtotal.toLocaleString('vi-VN')}₫</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá:</span>
                          <span>-{order.discount_amount.toLocaleString('vi-VN')}₫</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-white border-t pt-2">
                        <span>Tổng cộng:</span>
                        <span className="text-amber-600">{order.total_amount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              {order.notes && (
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Ghi chú đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      {order.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                      {order.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{order.user.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Khách hàng #{order.user.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300">{order.user.email}</span>
                    </div>
                    {order.user.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-700 dark:text-slate-300">{order.user.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{order.shipping_address.full_name}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <Phone className="h-3 w-3" />
                        {order.shipping_address.phone}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{formatAddress(order.shipping_address)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Phương thức:</span>
                    <Badge variant="secondary" className="uppercase font-medium">
                      {order.payment.payment_method === 'cod' ? 'Tiền mặt' : 
                       order.payment.payment_method === 'bank_transfer' ? 'Chuyển khoản' : 'Thẻ'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Trạng thái:</span>
                    <Badge 
                      className={order.payment.payment_status === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : order.payment.payment_status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                      }
                    >
                      {order.payment.payment_status === 'completed' ? 'Đã thanh toán' :
                       order.payment.payment_status === 'pending' ? 'Chờ thanh toán' : 'Thất bại'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Số tiền:</span>
                    <span className="font-semibold text-amber-600">
                      {order.payment.amount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  
                  {order.payment.processed_at && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Thanh toán lúc:</span>
                        <span className="text-sm text-slate-900 dark:text-white">
                          {new Date(order.payment.processed_at).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-slate-900 dark:text-white">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {order.status === 'pending' && (
                      <>
                        <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Xác nhận đơn hàng
                        </Button>
                        <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                          <XCircle className="h-4 w-4 mr-2" />
                          Hủy đơn hàng
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'confirmed' && (
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                        <Truck className="h-4 w-4 mr-2" />
                        Giao hàng
                      </Button>
                    )}
                    
                    {order.status === 'shipped' && (
                      <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Xác nhận đã giao
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
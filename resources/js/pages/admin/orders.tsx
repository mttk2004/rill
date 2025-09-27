import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AdminNavigation } from '@/components/admin-navigation';
import { Package, Search, Eye, Filter, ShoppingCart, Clock, CheckCircle, Truck, Package2, XCircle, DollarSign } from 'lucide-react';

const orders = [
  {
    id: 1,
    order_number: "RL-001234",
    user_id: 1,
    status: "delivered",
    subtotal: 1590000,
    discount_amount: 50000,
    total_amount: 1540000,
    currency: "VND",
    shipping_address: {
      full_name: "Nguyễn Văn A",
      phone: "0901234567",
      address_line_1: "123 Nguyễn Văn A",
      district: "Quận 1",
      city: "TP.HCM",
      ward: "Phường Bến Nghé"
    },
    billing_address: null,
    notes: "Gọi trước khi giao hàng",
    placed_at: "2024-01-20T10:30:00Z",
    created_at: "2024-01-20T10:30:00Z",
    updated_at: "2024-01-24T16:30:00Z",
    user: {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com"
    },
    items: [
      {
        id: 1,
        product_id: 1,
        product_name: "Rumours",
        product_sku: "FL-RUM-001",
        artist_name: "Fleetwood Mac",
        quantity: 1,
        unit_price: 490000,
        total_price: 490000
      },
      {
        id: 2,
        product_id: 2,
        product_name: "Hotel California",
        product_sku: "EG-HOT-001",
        artist_name: "Eagles",
        quantity: 1,
        unit_price: 420000,
        total_price: 420000
      },
      {
        id: 3,
        product_id: 3,
        product_name: "The Wall",
        product_sku: "PF-WAL-001",
        artist_name: "Pink Floyd",
        quantity: 1,
        unit_price: 680000,
        total_price: 680000
      }
    ],
    payment: {
      payment_method: "cod",
      payment_status: "completed",
      amount: 1540000,
      processed_at: "2024-01-24T16:30:00Z"
    }
  },
  {
    id: 2,
    order_number: "RL-001233",
    user_id: 2,
    status: "shipped",
    subtotal: 920000,
    discount_amount: 0,
    total_amount: 920000,
    currency: "VND",
    shipping_address: {
      full_name: "Trần Thị B",
      phone: "0902345678",
      address_line_1: "456 Trần Hưng Đạo",
      district: "Quận 5",
      city: "TP.HCM",
      ward: "Phường 14"
    },
    billing_address: null,
    notes: null,
    placed_at: "2024-01-18T09:15:00Z",
    created_at: "2024-01-18T09:15:00Z",
    updated_at: "2024-01-22T09:00:00Z",
    user: {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com"
    },
    items: [
      {
        id: 4,
        product_id: 4,
        product_name: "Back in Black",
        product_sku: "AC-BIB-001",
        artist_name: "AC/DC",
        quantity: 1,
        unit_price: 400000,
        total_price: 400000
      },
      {
        id: 5,
        product_id: 5,
        product_name: "Bohemian Rhapsody",
        product_sku: "QU-BRH-001",
        artist_name: "Queen",
        quantity: 1,
        unit_price: 520000,
        total_price: 520000
      }
    ],
    payment: {
      payment_method: "cod",
      payment_status: "pending",
      amount: 920000,
      processed_at: null
    }
  },
  {
    id: 3,
    order_number: "RL-001232",
    user_id: 3,
    status: "pending",
    subtotal: 460000,
    discount_amount: 0,
    total_amount: 460000,
    currency: "VND",
    shipping_address: {
      full_name: "Lê Văn C",
      phone: "0903456789",
      address_line_1: "789 Lê Văn Việt",
      district: "Quận 7",
      city: "TP.HCM",
      ward: "Phường Tân Phú"
    },
    billing_address: null,
    notes: "Giao hàng giờ hành chính",
    placed_at: "2024-01-15T14:20:00Z",
    created_at: "2024-01-15T14:20:00Z",
    updated_at: "2024-01-15T14:20:00Z",
    user: {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com"
    },
    items: [
      {
        id: 6,
        product_id: 6,
        product_name: "Thriller",
        product_sku: "MJ-THR-001",
        artist_name: "Michael Jackson",
        quantity: 1,
        unit_price: 460000,
        total_price: 460000
      }
    ],
    payment: {
      payment_method: "cod",
      payment_status: "pending",
      amount: 460000,
      processed_at: null
    }
  },
  {
    id: 4,
    order_number: "RL-001231",
    user_id: 4,
    status: "cancelled",
    subtotal: 840000,
    discount_amount: 84000,
    total_amount: 756000,
    currency: "VND",
    shipping_address: {
      full_name: "Phạm Thị D",
      phone: "0904567890",
      address_line_1: "321 Võ Văn Tần",
      district: "Quận 3",
      city: "TP.HCM",
      ward: "Phường 6"
    },
    billing_address: null,
    notes: "Khách hàng hủy do thay đổi ý định",
    placed_at: "2024-01-12T16:45:00Z",
    created_at: "2024-01-12T16:45:00Z",
    updated_at: "2024-01-13T10:20:00Z",
    user: {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@example.com"
    },
    items: [
      {
        id: 7,
        product_id: 7,
        product_name: "Abbey Road",
        product_sku: "BT-ABR-001",
        artist_name: "The Beatles",
        quantity: 2,
        unit_price: 420000,
        total_price: 840000
      }
    ],
    payment: {
      payment_method: "cod",
      payment_status: "cancelled",
      amount: 756000,
      processed_at: null
    }
  },
  {
    id: 5,
    order_number: "RL-001230",
    user_id: 5,
    status: "confirmed",
    subtotal: 1200000,
    discount_amount: 120000,
    total_amount: 1080000,
    currency: "VND",
    shipping_address: {
      full_name: "Hoàng Văn E",
      phone: "0905678901",
      address_line_1: "654 Điện Biên Phủ",
      district: "Quận Bình Thạnh",
      city: "TP.HCM",
      ward: "Phường 25"
    },
    billing_address: null,
    notes: null,
    placed_at: "2024-01-10T11:30:00Z",
    created_at: "2024-01-10T11:30:00Z",
    updated_at: "2024-01-10T15:45:00Z",
    user: {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@example.com"
    },
    items: [
      {
        id: 8,
        product_id: 8,
        product_name: "Dark Side of the Moon",
        product_sku: "PF-DSM-001",
        artist_name: "Pink Floyd",
        quantity: 1,
        unit_price: 650000,
        total_price: 650000
      },
      {
        id: 9,
        product_id: 9,
        product_name: "Led Zeppelin IV",
        product_sku: "LZ-IV-001",
        artist_name: "Led Zeppelin",
        quantity: 1,
        unit_price: 550000,
        total_price: 550000
      }
    ],
    payment: {
      payment_method: "cod",
      payment_status: "pending",
      amount: 1080000,
      processed_at: null
    }
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'confirmed': return <CheckCircle className="h-4 w-4" />;
    case 'shipped': return <Truck className="h-4 w-4" />;
    case 'delivered': return <Package2 className="h-4 w-4" />;
    case 'cancelled': return <XCircle className="h-4 w-4" />;
    default: return <Package className="h-4 w-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'shipped': return 'Đang giao';
    case 'delivered': return 'Đã giao';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    case 'confirmed': return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
    case 'shipped': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    case 'delivered': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    case 'cancelled': return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total_amount, 0);
  const processingOrders = orders.filter(order => order.status === "pending").length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;

  const formatAddress = (address: { address_line_1: string; ward: string; district: string; city: string }) => {
    return `${address.address_line_1}, ${address.ward}, ${address.district}, ${address.city}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý đơn hàng - Admin" />
      <AdminNavigation />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Quản lý đơn hàng
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Theo dõi và xử lý các đơn hàng của khách hàng
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Tổng đơn hàng
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {totalOrders}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Doanh thu
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {totalRevenue.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Chờ xử lý
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {processingOrders}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Đã giao
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {deliveredOrders}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Tìm theo số đơn hàng, tên khách hàng hoặc email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ xác nhận</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="shipped">Đang giao</SelectItem>
                      <SelectItem value="delivered">Đã giao</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Không tìm thấy đơn hàng nào
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-slate-900 dark:text-white">
                            Đơn hàng #{order.order_number}
                          </CardTitle>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <span>Khách hàng: {order.user.name}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{order.user.email}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{new Date(order.placed_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(order.status)} border-0 flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </Badge>
                        <span className="font-bold text-lg text-amber-600">
                          {order.total_amount.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Package2 className="h-4 w-4" />
                          Sản phẩm ({order.items.length})
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-slate-900 dark:text-white">{item.product_name}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{item.artist_name}</p>
                                <p className="text-xs text-slate-500 font-mono">SKU: {item.product_sku}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-amber-600">
                                  {item.total_price.toLocaleString('vi-VN')}₫
                                </p>
                                <p className="text-xs text-slate-500">
                                  {item.quantity} x {item.unit_price.toLocaleString('vi-VN')}₫
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200 dark:border-amber-700">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Tạm tính:</span>
                              <span className="text-slate-900 dark:text-white">{order.subtotal.toLocaleString('vi-VN')}₫</span>
                            </div>
                            {order.discount_amount > 0 && (
                              <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Giảm giá:</span>
                                <span className="text-green-600">-{order.discount_amount.toLocaleString('vi-VN')}₫</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-base border-t pt-1">
                              <span className="text-slate-900 dark:text-white">Tổng cộng:</span>
                              <span className="text-amber-600">{order.total_amount.toLocaleString('vi-VN')}₫</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipping & Payment Info */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Thông tin giao hàng
                          </h4>
                          <div className="p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-lg space-y-2">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{order.shipping_address.full_name}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">{order.shipping_address.phone}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">{formatAddress(order.shipping_address)}</p>
                            </div>
                            {order.notes && (
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-500">
                                <p className="text-xs text-slate-500">Ghi chú: {order.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Thanh toán
                          </h4>
                          <div className="p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Phương thức:</span>
                              <Badge variant="secondary" className="uppercase">
                                {order.payment.payment_method}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Trạng thái:</span>
                              <Badge
                                className={order.payment.payment_status === 'completed'
                                  ? 'bg-green-500 text-white'
                                  : order.payment.payment_status === 'pending'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-red-500 text-white'
                                }
                              >
                                {order.payment.payment_status === 'completed' ? 'Đã thanh toán' :
                                 order.payment.payment_status === 'pending' ? 'Chờ thanh toán' : 'Đã hủy'}
                              </Badge>
                            </div>
                            {order.payment.processed_at && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Thanh toán lúc:</span>
                                <span className="text-sm text-slate-900 dark:text-white">
                                  {new Date(order.payment.processed_at).toLocaleString('vi-VN')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-4">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                              <Eye className="h-4 w-4 mr-2" />
                              Chi tiết
                            </Button>
                          </Link>
                          {order.status === 'pending' && (
                            <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Xác nhận
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                              <Truck className="h-4 w-4 mr-2" />
                              Giao hàng
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                              <XCircle className="h-4 w-4 mr-2" />
                              Hủy
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;

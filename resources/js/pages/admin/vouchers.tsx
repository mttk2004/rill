import { AdminNavigation } from '@/components/admin-navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link } from '@inertiajs/react';
import {
  Ticket,
  Plus,
  Search,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Copy,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

// Mock data - trong thực tế sẽ từ server via Inertia props
const mockVouchers = [
  {
    id: 1,
    code: 'VINYL50K',
    name: 'Giảm 50K cho đơn hàng đầu tiên',
    description: 'Voucher chào mừng khách hàng mới, giảm 50,000 VND cho đơn hàng từ 300,000 VND',
    type: 'fixed',
    value: 50000,
    minimum_amount: 300000,
    maximum_discount: null,
    usage_limit: 100,
    used_count: 23,
    usage_limit_per_user: 1,
    valid_from: '2025-01-01T00:00:00Z',
    valid_to: '2025-12-31T23:59:59Z',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    code: 'NEWYEAR2025',
    name: 'Chào năm mới 2025',
    description: 'Ưu đãi đặc biệt năm mới, giảm 100,000 VND cho đơn hàng từ 500,000 VND',
    type: 'fixed',
    value: 100000,
    minimum_amount: 500000,
    maximum_discount: null,
    usage_limit: 50,
    used_count: 47,
    usage_limit_per_user: 1,
    valid_from: '2025-01-01T00:00:00Z',
    valid_to: '2025-01-31T23:59:59Z',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    code: 'OLDSCHOOL',
    name: 'Vinyl cổ điển',
    description: 'Giảm 30,000 VND cho các album cổ điển',
    type: 'fixed',
    value: 30000,
    minimum_amount: 200000,
    maximum_discount: null,
    usage_limit: 200,
    used_count: 156,
    usage_limit_per_user: 2,
    valid_from: '2024-12-01T00:00:00Z',
    valid_to: '2025-02-28T23:59:59Z',
    is_active: false,
    created_at: '2024-12-01T00:00:00Z'
  }
];

export default function AdminVouchers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVouchers = mockVouchers.filter(voucher =>
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = (voucher: typeof mockVouchers[0]) => {
    const now = new Date();
    const validFrom = new Date(voucher.valid_from);
    const validTo = new Date(voucher.valid_to);

    if (!voucher.is_active) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Tạm dừng</Badge>;
    }

    if (now < validFrom) {
      return <Badge variant="outline" className="border-blue-200 text-blue-700">Chưa bắt đầu</Badge>;
    }

    if (now > validTo) {
      return <Badge variant="secondary" className="bg-red-100 text-red-700">Hết hạn</Badge>;
    }

    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Hết lượt</Badge>;
    }

    return <Badge variant="default" className="bg-green-100 text-green-700">Đang hoạt động</Badge>;
  };

  const getUsagePercentage = (voucher: typeof mockVouchers[0]) => {
    if (!voucher.usage_limit) return 0;
    return (voucher.used_count / voucher.usage_limit) * 100;
  };

  const handleDeleteVoucher = (voucherId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      // TODO: Implement delete with Inertia router.delete()
      console.log('Deleting voucher:', voucherId);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // TODO: Show toast notification
  };

  return (
    <div className="min-h-screen bg-background">
      <Head title="Quản lý Voucher - Admin" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
              <Ticket className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Quản lý Voucher
              </h1>
              <p className="text-slate-600 mt-1">
                Tạo và quản lý mã giảm giá để thu hút khách hàng
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-slate-900">2</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tổng voucher</p>
                    <p className="text-2xl font-bold text-slate-900">3</p>
                  </div>
                  <Ticket className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Lượt sử dụng</p>
                    <p className="text-2xl font-bold text-slate-900">226</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tiết kiệm cho KH</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(1830000)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên voucher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Link href="/admin/vouchers/create">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tạo voucher mới
            </Button>
          </Link>
        </div>

        {/* Vouchers List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVouchers.map((voucher) => (
            <Card key={voucher.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <code className="px-3 py-1 bg-slate-100 rounded-md font-mono font-bold text-sm">
                          {voucher.code}
                        </code>
                        <button
                          onClick={() => handleCopyCode(voucher.code)}
                          className="p-1 hover:bg-slate-100 rounded"
                          title="Copy mã voucher"
                        >
                          <Copy className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                      {getStatusBadge(voucher)}
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {voucher.name}
                    </h3>

                    <p className="text-slate-600 mb-4 line-clamp-2">
                      {voucher.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>
                          <span className="font-medium">Giảm:</span> {formatCurrency(voucher.value)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>
                          <span className="font-medium">Đã dùng:</span> {voucher.used_count}
                          {voucher.usage_limit && ` / ${voucher.usage_limit}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>
                          <span className="font-medium">Hết hạn:</span> {formatDate(voucher.valid_to)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span>
                          <span className="font-medium">Tối thiểu:</span> {
                            voucher.minimum_amount ? formatCurrency(voucher.minimum_amount) : 'Không'
                          }
                        </span>
                      </div>
                    </div>

                    {voucher.usage_limit && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>Tiến độ sử dụng</span>
                          <span>{getUsagePercentage(voucher).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(getUsagePercentage(voucher), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/admin/vouchers/${voucher.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVoucher(voucher.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredVouchers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {searchTerm ? 'Không tìm thấy voucher' : 'Chưa có voucher nào'}
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm
                  ? `Không tìm thấy voucher nào với từ khóa "${searchTerm}"`
                  : 'Tạo voucher đầu tiên để bắt đầu thu hút khách hàng'
                }
              </p>
              {!searchTerm && (
                <Link href="/admin/vouchers/create">
                  <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo voucher đầu tiên
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

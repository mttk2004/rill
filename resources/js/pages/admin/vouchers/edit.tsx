import { AdminNavigation } from '@/components/admin-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  Ticket,
  ArrowLeft,
  Calendar,
  Settings,
  Gift,
  Save,
  AlertCircle,
  Users,
  TrendingUp
} from 'lucide-react';

interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'fixed';
  value: number;
  minimum_amount: number | null;
  maximum_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  usage_limit_per_user: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  created_at: string;
}

interface Props {
  voucher: Voucher;
}

export default function AdminVoucherEdit({ voucher }: Props) {
  // Mock data cho demo - thực tế sẽ từ props
  const mockVoucher = voucher || {
    id: 1,
    code: 'VINYL50K',
    name: 'Giảm 50K cho đơn hàng đầu tiên',
    description: 'Voucher chào mừng khách hàng mới, giảm 50,000 VND cho đơn hàng từ 300,000 VND',
    type: 'fixed' as const,
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
  };

  const { data, setData, put, processing, errors } = useForm({
    code: mockVoucher.code,
    name: mockVoucher.name,
    description: mockVoucher.description,
    type: 'fixed' as const,
    value: mockVoucher.value,
    minimum_amount: mockVoucher.minimum_amount,
    maximum_discount: mockVoucher.maximum_discount,
    usage_limit: mockVoucher.usage_limit,
    usage_limit_per_user: mockVoucher.usage_limit_per_user,
    valid_from: mockVoucher.valid_from.split('T')[0],
    valid_to: mockVoucher.valid_to.split('T')[0],
    is_active: mockVoucher.is_active
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/vouchers/${mockVoucher.id}`);
  };

  const formatVND = (amount: number) => {
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

  const getStatusBadge = () => {
    const now = new Date();
    const validFrom = new Date(mockVoucher.valid_from);
    const validTo = new Date(mockVoucher.valid_to);

    if (!mockVoucher.is_active) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Tạm dừng</Badge>;
    }

    if (now < validFrom) {
      return <Badge variant="outline" className="border-blue-200 text-blue-700">Chưa bắt đầu</Badge>;
    }

    if (now > validTo) {
      return <Badge variant="secondary" className="bg-red-100 text-red-700">Hết hạn</Badge>;
    }

    if (mockVoucher.usage_limit && mockVoucher.used_count >= mockVoucher.usage_limit) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Hết lượt</Badge>;
    }

    return <Badge variant="default" className="bg-green-100 text-green-700">Đang hoạt động</Badge>;
  };

  const getUsagePercentage = () => {
    if (!mockVoucher.usage_limit) return 0;
    return (mockVoucher.used_count / mockVoucher.usage_limit) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Head title={`Chỉnh sửa Voucher: ${mockVoucher.code} - Admin`} />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/vouchers">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                <Ticket className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">
                    Chỉnh sửa Voucher
                  </h1>
                  {getStatusBadge()}
                </div>
                <p className="text-slate-600">
                  Cập nhật thông tin và cài đặt cho voucher: <code className="font-mono bg-slate-100 px-2 py-1 rounded">{mockVoucher.code}</code>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Đã sử dụng</p>
                    <p className="text-xl font-bold text-slate-900">{mockVoucher.used_count}</p>
                  </div>
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Giá trị</p>
                    <p className="text-xl font-bold text-slate-900">{formatVND(mockVoucher.value)}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Hết hạn</p>
                    <p className="text-xl font-bold text-slate-900">{formatDate(mockVoucher.valid_to)}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Progress */}
          {mockVoucher.usage_limit && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span className="font-medium">Tiến độ sử dụng</span>
                  <span>{getUsagePercentage().toFixed(1)}% ({mockVoucher.used_count} / {mockVoucher.usage_limit})</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-600" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="code">
                    Mã voucher *
                    <span className="text-xs text-slate-500 ml-2">(Không thể thay đổi)</span>
                  </Label>
                  <Input
                    id="code"
                    value={data.code}
                    disabled
                    className="font-mono bg-slate-50"
                  />
                  <p className="text-xs text-slate-500">
                    Mã voucher không thể thay đổi sau khi tạo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">
                    Giá trị giảm (VND) *
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={data.value}
                    onChange={(e) => setData('value', parseInt(e.target.value) || 0)}
                    placeholder="50000"
                    min="1000"
                    step="1000"
                  />
                  {errors.value && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.value}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên voucher *
                  <span className="text-xs text-slate-500 ml-2">(Tên hiển thị cho khách hàng)</span>
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Giảm 50K cho đơn hàng đầu tiên"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả chi tiết
                  <span className="text-xs text-slate-500 ml-2">(Tùy chọn)</span>
                </Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Voucher chào mừng khách hàng mới, áp dụng cho đơn hàng từ 300,000 VND..."
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Mô tả sẽ hiển thị trong danh sách voucher</span>
                  <span>{data.description?.length ?? 0}/500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Điều kiện áp dụng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Điều kiện áp dụng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minimum_amount">
                    Giá trị đơn hàng tối thiểu
                    <span className="text-xs text-slate-500 ml-2">(Tùy chọn)</span>
                  </Label>
                  <Input
                    id="minimum_amount"
                    type="number"
                    value={data.minimum_amount || ''}
                    onChange={(e) => setData('minimum_amount', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="300000"
                    min="0"
                    step="1000"
                  />
                  <p className="text-xs text-slate-500">
                    Để trống = không yêu cầu giá trị tối thiểu
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usage_limit_per_user">
                    Giới hạn sử dụng / khách hàng *
                  </Label>
                  <Input
                    id="usage_limit_per_user"
                    type="number"
                    value={data.usage_limit_per_user}
                    onChange={(e) => setData('usage_limit_per_user', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-slate-500">
                    Mỗi khách hàng có thể sử dụng bao nhiều lần
                  </p>
                </div>
              </div>

              {mockVoucher.used_count > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-900 mb-1">Lưu ý khi chỉnh sửa</p>
                      <p className="text-orange-700">
                        Voucher này đã được sử dụng {mockVoucher.used_count} lần.
                        Một số thay đổi có thể ảnh hưởng đến khách hàng đã sử dụng.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thời hạn & Giới hạn */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Thời hạn & Giới hạn sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="valid_from">
                    Có hiệu lực từ *
                  </Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={data.valid_from}
                    onChange={(e) => setData('valid_from', e.target.value)}
                  />
                  {errors.valid_from && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.valid_from}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valid_to">
                    Có hiệu lực đến *
                  </Label>
                  <Input
                    id="valid_to"
                    type="date"
                    value={data.valid_to}
                    onChange={(e) => setData('valid_to', e.target.value)}
                    min={data.valid_from}
                  />
                  {errors.valid_to && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.valid_to}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">
                    Tổng số lượt sử dụng
                    <span className="text-xs text-slate-500 ml-2">(Tùy chọn)</span>
                  </Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={data.usage_limit || ''}
                    onChange={(e) => setData('usage_limit', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="100"
                    min={mockVoucher.used_count || 1}
                  />
                  <p className="text-xs text-slate-500">
                    {mockVoucher.used_count > 0
                      ? `Tối thiểu ${mockVoucher.used_count} (đã sử dụng)`
                      : 'Để trống = không giới hạn số lượt sử dụng'
                    }
                  </p>
                </div>

                <div className="flex items-center space-x-3 pb-2">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                    className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                    Voucher đang hoạt động
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Link href="/admin/vouchers">
              <Button variant="outline" type="button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setData('is_active', false)}
                disabled={processing}
              >
                Tạm dừng
              </Button>

              <Button
                type="submit"
                disabled={processing}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Cập nhật voucher
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

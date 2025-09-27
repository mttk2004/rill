import { AdminNavigation } from '@/components/admin-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  Ticket,
  ArrowLeft,
  Calendar,
  Settings,
  Gift,
  Save,
  AlertCircle,
  Info
} from 'lucide-react';

interface VoucherFormData {
  code: string;
  name: string;
  description: string;
  type: 'fixed';
  value: number;
  minimum_amount: number | null;
  maximum_discount: number | null;
  usage_limit: number | null;
  usage_limit_per_user: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
}

export default function AdminVoucherCreate() {
  const { data, setData, post, processing, errors } = useForm<VoucherFormData>({
    code: '',
    name: '',
    description: '',
    type: 'fixed',
    value: 0,
    minimum_amount: null,
    maximum_discount: null,
    usage_limit: null,
    usage_limit_per_user: 1,
    valid_from: '',
    valid_to: '',
    is_active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/vouchers');
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setData('code', result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Head title="Tạo Voucher Mới - Admin" />
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
                <h1 className="text-3xl font-bold text-slate-900">
                  Tạo Voucher Mới
                </h1>
                <p className="text-slate-600 mt-1">
                  Tạo mã giảm giá để thu hút và giữ chân khách hàng
                </p>
              </div>
            </div>
          </div>
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
                    <span className="text-xs text-slate-500 ml-2">(8 ký tự, chỉ chữ và số)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={data.code}
                      onChange={(e) => setData('code', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                      placeholder="VINYL50K"
                      className="font-mono"
                      maxLength={8}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateCode}
                      className="shrink-0"
                    >
                      Tự động
                    </Button>
                  </div>
                  {errors.code && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.code}
                    </p>
                  )}
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
                  <span>{data.description.length}/500</span>
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

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">MVP - Chỉ hỗ trợ giảm giá cố định</p>
                    <p className="text-blue-700">
                      Hiện tại chỉ hỗ trợ giảm giá theo số tiền cố định (VND).
                      Tính năng giảm theo % sẽ được bổ sung trong phiên bản tiếp theo.
                    </p>
                  </div>
                </div>
              </div>
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
                    min={new Date().toISOString().split('T')[0]}
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
                    min={data.valid_from || new Date().toISOString().split('T')[0]}
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
                    min="1"
                  />
                  <p className="text-xs text-slate-500">
                    Để trống = không giới hạn số lượt sử dụng
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
                    Kích hoạt voucher ngay sau khi tạo
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
                Lưu nháp
              </Button>

              <Button
                type="submit"
                disabled={processing}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Tạo voucher
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

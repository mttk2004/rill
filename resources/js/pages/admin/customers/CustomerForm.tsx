
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Phone, Eye, Package, ChevronRight } from 'lucide-react';
import { User as UserType } from '../../../types';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/admin/AdminLayout';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  placed_at: string;
}

interface CustomerFormProps {
  customer: UserType & {
    gender?: 'male' | 'female' | 'other' | null;
    date_of_birth?: string | null;
    phone?: string | null;
    is_active?: number;
    orders?: Order[];
    orders_count?: number;
    total_spent?: number;
  };
}

const CustomerForm = ({ customer }: CustomerFormProps) => {
  const isEditMode = true; // Always view mode since we receive customer from backend



  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đang chuẩn bị',
      shipped: 'Đang giao',
      delivered: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.visit('/admin/customers')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Chi tiết khách hàng
              </h1>
              <p className="text-sm text-gray-500">
                ID: {customer.id}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.visit('/admin/customers')} className="h-10 px-4 py-2">
              Quay lại
            </Button>
          </div>
        </div>

        {isEditMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Eye className="text-blue-600" size={20} />
            <p className="text-sm text-blue-800">
              Bạn đang ở chế độ <b>Xem chi tiết</b>. Thông tin khách hàng không thể chỉnh sửa từ trang quản trị này.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" /> Thông tin cá nhân
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-6 mb-6">
                  <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {customer.avatar_url || customer.avatar ? (
                      <img src={customer.avatar_url || customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      value={customer.name}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Nguyễn Văn A"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                    <select
                      name="gender"
                      value={customer.gender || ''}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                      disabled
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date_of_birth"
                        value={customer.date_of_birth || ''}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={customer.email}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="email@example.com"
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={customer.phone || ''}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="0912..."
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-primary" /> Lịch sử đơn hàng ({customer.orders?.length || 0})
                </h3>
              </div>
              {customer.orders && customer.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.orders!.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link href={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-primary inline-flex items-center">
                              <span className="text-xs mr-1">Chi tiết</span> <ChevronRight size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 italic">
                  Khách hàng này chưa có đơn hàng nào.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Status & Meta */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng thái</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <input
                    type="radio"
                    name="is_active"
                    value={1}
                    checked={Number(customer.is_active) === 1}
                    readOnly
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                    disabled
                  />
                  <div>
                    <span className="block text-gray-900 font-medium text-sm">Hoạt động</span>
                    <span className="block text-xs text-gray-500">Cho phép đăng nhập</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <input
                    type="radio"
                    name="is_active"
                    value={0}
                    checked={Number(customer.is_active) === 0}
                    readOnly
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                    disabled
                  />
                  <div>
                    <span className="block text-gray-900 font-medium text-sm">Vô hiệu hóa</span>
                    <span className="block text-xs text-gray-500">Chặn truy cập</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-sm text-gray-600 space-y-3">
              <div className="flex justify-between">
                <span>Ngày đăng ký:</span>
                <span className="font-medium">{customer.created_at ? new Date(customer.created_at).toLocaleDateString('vi-VN') : '---'}</span>
              </div>
              <div className="flex justify-between">
                <span>Lần cuối đăng nhập:</span>
                <span className="font-medium">Chưa có dữ liệu</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng chi tiêu:</span>
                <span className="font-bold text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    Number(customer.total_spent) || 0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerForm;

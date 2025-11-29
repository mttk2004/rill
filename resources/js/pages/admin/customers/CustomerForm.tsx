
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
// TODO: Remove react-router-dom - import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Lock, Mail, Phone, Eye, Package, Clock, CheckCircle, Truck, XCircle, ChevronRight } from 'lucide-react';
import { USERS, ORDERS } from '../../../data';
import { User as UserType, Order } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/Button';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditMode = Boolean(id);

  // Initialize form state
  const [formData, setFormData] = useState<Partial<UserType>>({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    gender: 'male',
    date_of_birth: '',
    is_active: 1,
    avatar: '',
    password: ''
  });

  useEffect(() => {
    if (isEditMode && id) {
      const user = USERS.find(u => u.id === id);
      if (user) {
        setFormData({ ...user, password: '' });
      } else {
        showToast('Không tìm thấy người dùng', 'error');
        navigate('/admin/customers');
      }
    }
  }, [isEditMode, id, navigate, showToast]);

  // Fetch Customer Orders
  const customerOrders = useMemo(() => {
    if (!id) return [];
    return ORDERS
      .filter(o => o.user_id === id)
      .sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime());
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) return; // Prevent edit logic if somehow triggered

    console.log("Creating User:", formData);
    showToast(`Đã thêm khách hàng mới "${formData.name}"`, 'success');
    navigate('/admin/customers');
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/customers')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {isEditMode ? 'Chi tiết khách hàng' : 'Thêm khách hàng mới'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEditMode ? `ID: ${id}` : 'Tạo tài khoản khách hàng mới'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/admin/customers')} className="h-10 px-4 py-2">
            Quay lại
          </Button>
          
          {/* Show Save button only in Create Mode */}
          {!isEditMode && (
            <Button onClick={handleSubmit} className="h-10 px-4 py-2 flex items-center gap-2">
              <Save size={18} /> Lưu thông tin
            </Button>
          )}
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <User size={20} className="text-primary"/> Thông tin cá nhân
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-6 mb-6">
                   <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-gray-400" />
                      )}
                   </div>
                   <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Nguyễn Văn A"
                        required
                        disabled={isEditMode}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                      <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={isEditMode}
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
                          value={formData.date_of_birth || ''}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          disabled={isEditMode}
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
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="email@example.com"
                          required
                          disabled={isEditMode}
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
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="0912..."
                          disabled={isEditMode}
                        />
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {!isEditMode && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <Lock size={20} className="text-primary"/> Bảo mật
                 </h3>
                 <div className="grid grid-cols-1 gap-6">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                       <input
                         type="password"
                         name="password"
                         value={formData.password}
                         onChange={handleChange}
                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                         placeholder="Nhập mật khẩu..."
                         required
                       />
                    </div>
                 </div>
              </div>
            )}
          </form>

          {/* Order History Section - Only in View Mode */}
          {isEditMode && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                     <Package size={20} className="text-primary"/> Lịch sử đơn hàng ({customerOrders.length})
                  </h3>
               </div>
               {customerOrders.length > 0 ? (
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
                          {customerOrders.map((order) => (
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
                                   <Link to={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-primary inline-flex items-center">
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
          )}
        </div>

        {/* Right Column: Status & Meta */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng thái</h3>
             <div className="space-y-3">
               <label className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg ${!isEditMode ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="is_active" 
                    value={1} 
                    checked={Number(formData.is_active) === 1}
                    onChange={() => setFormData(prev => ({ ...prev, is_active: 1 }))}
                    className="w-5 h-5 text-green-600 focus:ring-green-500" 
                    disabled={isEditMode}
                  />
                  <div>
                    <span className="block text-gray-900 font-medium text-sm">Hoạt động</span>
                    <span className="block text-xs text-gray-500">Cho phép đăng nhập</span>
                  </div>
               </label>
               <label className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg ${!isEditMode ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="is_active" 
                    value={0} 
                    checked={Number(formData.is_active) === 0}
                    onChange={() => setFormData(prev => ({ ...prev, is_active: 0 }))}
                    className="w-5 h-5 text-red-600 focus:ring-red-500" 
                    disabled={isEditMode}
                  />
                  <div>
                    <span className="block text-gray-900 font-medium text-sm">Vô hiệu hóa</span>
                    <span className="block text-xs text-gray-500">Chặn truy cập</span>
                  </div>
               </label>
             </div>
          </div>

          {isEditMode && (
             <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-sm text-gray-600 space-y-3">
                <div className="flex justify-between">
                   <span>Ngày đăng ký:</span>
                   <span className="font-medium">{formData.created_at ? new Date(formData.created_at).toLocaleDateString('vi-VN') : '---'}</span>
                </div>
                <div className="flex justify-between">
                   <span>Lần cuối đăng nhập:</span>
                   <span className="font-medium">Chưa có dữ liệu</span>
                </div>
                <div className="flex justify-between">
                   <span>Tổng chi tiêu:</span>
                   <span className="font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                         customerOrders.reduce((acc, cur) => acc + cur.total_amount, 0)
                      )}
                   </span>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;


import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { ArrowLeft, Save, Tag, Calendar, AlertCircle, Lock } from 'lucide-react';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/admin/AdminLayout';

interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: 'fixed' | 'percentage';
  value: number;
  minimum_amount: number | null;
  maximum_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  usage_limit_per_user: number | null;
  valid_from: string;
  valid_to: string;
  is_active: number | boolean;
  created_at: string;
  updated_at?: string;
  usages_count?: number;
}

interface VoucherFormProps {
  voucher?: Voucher;
}

const VoucherForm = ({ voucher }: VoucherFormProps) => {
  const isEditMode = Boolean(voucher);

  // Initialize with correct DB fields
  const [formData, setFormData] = useState<Partial<Voucher>>(voucher || {
    code: '',
    name: '',
    description: '',
    type: 'fixed', // Enforce fixed type only
    value: 0,
    minimum_amount: 0,
    maximum_discount: null, // Not used for fixed amount
    valid_from: '',
    valid_to: '',
    usage_limit: 100,
    usage_limit_per_user: 1,
    is_active: 1,
    used_count: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && voucher) {
      router.put(`/admin/vouchers/${voucher.id}`, formData, {
        preserveScroll: true,
      });
    } else {
      router.post('/admin/vouchers', formData, {
        preserveScroll: true,
      });
    }
  };

  // Helpers to handle date-time-local input string format
  const toInputDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  // Check if voucher has been used
  const hasUsage = isEditMode && (voucher?.used_count || 0) > 0;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.visit('/admin/vouchers')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                {isEditMode ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.visit('/admin/vouchers')} className="h-10 px-4 py-2">
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit} className="h-10 px-4 py-2 flex items-center gap-2">
              <Save size={18} /> Lưu mã
            </Button>
          </div>
        </div>

        {hasUsage && isEditMode && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Lock className="text-yellow-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-yellow-800">Chế độ chỉnh sửa hạn chế</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Mã giảm giá này đã có <b>{formData.used_count}</b> lượt sử dụng.
                Để đảm bảo tính toàn vẹn dữ liệu, bạn không thể thay đổi <b>Mã Code</b>, <b>Giá trị giảm</b> và <b>Điều kiện giá trị đơn hàng</b>.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag size={20} className="text-primary" /> Thông tin chung
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên chiến dịch (Name)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Ví dụ: Sale Mùa Hè 2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã khuyến mãi (Code)</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-lg uppercase tracking-wide focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${hasUsage ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    placeholder="SUMMER25"
                    required
                    disabled={hasUsage}
                  />
                  {!hasUsage && <p className="text-xs text-gray-500 mt-1">Chỉ dùng chữ cái và số, không khoảng trắng.</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Description)</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Ví dụ: Giảm 100k cho đơn hàng đầu tiên..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                    <input
                      type="text"
                      value="Số tiền cố định (Fixed Amount)"
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm (VNĐ)</label>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleNumberChange}
                      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${hasUsage ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                      min="0"
                      required
                      disabled={hasUsage}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-primary" /> Điều kiện áp dụng
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu (Min Amount)</label>
                  <input
                    type="number"
                    name="minimum_amount"
                    value={formData.minimum_amount || ''}
                    onChange={handleNumberChange}
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${hasUsage ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    min="0"
                    placeholder="0"
                    disabled={hasUsage}
                  />
                  <p className="text-xs text-gray-500 mt-1">Áp dụng cho đơn hàng có giá trị từ mức này trở lên.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-primary" /> Thời gian
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu (Valid From)</label>
                  <input
                    type="datetime-local"
                    name="valid_from"
                    value={toInputDate(formData.valid_from)}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_from: new Date(e.target.value).toISOString().replace('T', ' ').slice(0, 19) }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc (Valid To)</label>
                  <input
                    type="datetime-local"
                    name="valid_to"
                    value={toInputDate(formData.valid_to)}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_to: new Date(e.target.value).toISOString().replace('T', ' ').slice(0, 19) }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cấu hình khác</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn tổng (Usage Limit)</label>
                  <input
                    type="number"
                    name="usage_limit"
                    value={formData.usage_limit || ''}
                    onChange={handleNumberChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tổng số lần mã có thể được sử dụng toàn hệ thống.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn mỗi người (Per User)</label>
                  <input
                    type="number"
                    name="usage_limit_per_user"
                    value={formData.usage_limit_per_user || ''}
                    onChange={handleNumberChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    min="1"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái (Is Active)</label>
                  <select
                    name="is_active"
                    value={Number(formData.is_active)}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value={1}>Đang hoạt động (Active)</option>
                    <option value={0}>Tạm ngưng (Inactive)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default VoucherForm;

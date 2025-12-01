
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  Plus, Search, Filter, Edit2, Trash2, Tag, Calendar, User, AlignLeft, DollarSign, ChevronLeft, ChevronRight
} from 'lucide-react';
import Button from '../../../components/Button';
import AlertDialog from '../../../components/AlertDialog';
import { useDebounce } from '../../../hooks/useDebounce';
import { useToast } from '../../../context/ToastContext';

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
  is_active: number;
  created_at: string;
  updated_at?: string;
}

interface VoucherListProps {
  vouchers: {
    data: Voucher[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  filters: {
    search: string;
    status: string | null;
    sort: string;
  };
  stats: {
    total: number;
    active: number;
    expired: number;
    total_used: number;
  };
}

const VoucherList = ({ vouchers, filters, stats }: VoucherListProps) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Handle filter changes with server-side request
  React.useEffect(() => {
    const params: Record<string, string> = {};

    if (debouncedSearch) params.search = debouncedSearch;
    if (filterStatus !== 'all') params.status = filterStatus;

    router.get('/admin/vouchers', params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [debouncedSearch, filterStatus]);

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: page.toString() };

    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.sort) params.sort = filters.sort;

    router.get('/admin/vouchers', params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Helper to determine logical status
  const getVoucherStatus = (v: Voucher) => {
    const now = new Date();
    const endDate = new Date(v.valid_to);

    if (v.is_active === 0) return 'inactive';
    if (endDate < now) return 'expired';
    if (v.usage_limit && v.used_count >= v.usage_limit) return 'exhausted';
    return 'active';
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      const voucherCode = vouchers.data.find(v => v.id === deleteId)?.code || 'mã giảm giá';
      router.delete(`/admin/vouchers/${deleteId}`, {
        preserveScroll: true,
        onSuccess: () => {
          setDeleteId(null);
          showToast(`Đã xóa ${voucherCode}`, 'success');
        },
        onError: (errors: Record<string, string>) => {
          const firstError = Object.values(errors)[0];
          showToast(firstError || 'Có lỗi xảy ra khi xóa mã giảm giá', 'error');
        },
      });
    }
  };

  const getStatusBadge = (v: Voucher) => {
    const status = getVoucherStatus(v);
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Đang hoạt động</span>;
      case 'expired':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Đã hết hạn</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Ngừng hoạt động</span>;
      case 'exhausted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Hết lượt dùng</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý mã giảm giá</h1>
            <p className="text-sm text-gray-500 mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => router.visit('/admin/vouchers/create')}>
            <Plus size={18} /> Tạo mã mới
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Tìm theo tên hoặc mã code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="expired">Đã hết hạn</option>
              <option value="inactive">Ngừng hoạt động</option>
              <option value="exhausted">Hết lượt dùng</option>
              <option value="upcoming">Sắp diễn ra</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.data.length > 0 ? (
            vouchers.data.map((voucher) => (
              <div key={voucher.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                        <Tag size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{voucher.code}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Giảm tiền mặt (Fixed)
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(voucher)}
                  </div>

                  <div className="space-y-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1 flex items-center gap-1.5 mb-1">
                        <AlignLeft size={14} className="text-gray-400" /> {voucher.name}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] pl-5">{voucher.description}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5"><DollarSign size={14} /> Giá trị giảm:</span>
                        <span className="font-bold text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.value)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5"><User size={14} /> Giới hạn/User:</span>
                        <span className="font-medium text-gray-900">{voucher.usage_limit_per_user || '∞'}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={14} /> Hạn dùng:</span>
                        <span className="font-medium text-gray-900">{formatDate(voucher.valid_to)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Đã dùng: <b>{voucher.used_count}</b></span>
                      <span>Tổng: <b>{voucher.usage_limit || '∞'}</b></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-500"
                        style={{ width: voucher.usage_limit ? `${Math.min((voucher.used_count / voucher.usage_limit) * 100, 100)}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 mt-auto">
                  <button
                    onClick={() => router.visit(`/admin/vouchers/${voucher.id}/edit`)}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(voucher.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>Không tìm thấy mã giảm giá nào.</p>
            </div>
          )}
        </div>        {/* Pagination */}
        {vouchers.last_page > 1 && (
          <div className="mt-6 bg-white px-4 py-3 flex items-center justify-between border border-gray-200 rounded-xl sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(vouchers.current_page - 1)}
                disabled={vouchers.current_page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(vouchers.current_page + 1)}
                disabled={vouchers.current_page === vouchers.last_page}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{vouchers.from}</span> đến <span className="font-medium">{vouchers.to}</span> trong tổng số{' '}
                  <span className="font-medium">{vouchers.total}</span> mã giảm giá
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(vouchers.current_page - 1)}
                    disabled={vouchers.current_page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: vouchers.last_page }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === vouchers.current_page
                        ? 'z-10 bg-primary border-primary text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(vouchers.current_page + 1)}
                    disabled={vouchers.current_page === vouchers.last_page}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        <AlertDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          title="Xóa mã giảm giá?"
          description="Bạn có chắc chắn muốn xóa mã giảm giá này không? Hành động này không thể hoàn tác."
          confirmText="Xóa vĩnh viễn"
        />
      </div>
    </AdminLayout>
  );
};

export default VoucherList;


import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { User } from '../../../types';
import {
  Search, Filter, Eye, User as UserIcon, Mail, Phone, CheckCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';

interface CustomerWithOrders extends User {
  orders_count?: number;
}

interface CustomerListProps {
  users: {
    data: CustomerWithOrders[];
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
    verified: string | null;
    sort: string;
  };
  stats: {
    total: number;
    active: number;
    verified: number;
    new_this_month: number;
  };
}

const CustomerList = ({ users, filters }: CustomerListProps) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
  const [filterVerified, setFilterVerified] = useState(filters.verified || 'all');
  const [sortBy, setSortBy] = useState(filters.sort || 'newest');

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Handle filter changes with server-side request
  React.useEffect(() => {
    const params: Record<string, string> = {};

    if (debouncedSearch) params.search = debouncedSearch;
    if (filterStatus !== 'all') params.status = filterStatus;
    if (filterVerified !== 'all') params.verified = filterVerified;
    if (sortBy !== 'newest') params.sort = sortBy;

    router.get('/admin/customers', params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [debouncedSearch, filterStatus, filterVerified, sortBy]);

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: page.toString() };

    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.verified) params.verified = filters.verified;
    if (filters.sort) params.sort = filters.sort;

    router.get('/admin/customers', params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý Khách hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Danh sách khách hàng trong hệ thống</p>
          </div>
          {/* Removed 'Add Customer' button as per requirement that Admins cannot add customers manually */}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="relative w-full md:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Tìm theo tên, email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Vô hiệu hóa</option>
            </select>

            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">Tất cả xác thực</option>
              <option value="verified">Đã xác thực</option>
              <option value="unverified">Chưa xác thực</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="newest">Mới nhất</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="orders-desc">Nhiều đơn nhất</option>
            </select>
          </div>
        </div>        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.data.length > 0 ? users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar_url || user.avatar ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url || user.avatar} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <UserIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">ID: {user.id.toString().slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-sm text-gray-500 space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          {user.email}
                          {user.email_verified_at && (
                            <span title="Đã xác thực">
                              <CheckCircle size={12} className="text-green-500" />
                            </span>
                          )}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} /> {String(user.phone)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {user.orders_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.visit(`/admin/customers/${user.id}`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <p>Không tìm thấy khách hàng nào.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {users.last_page > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-xl">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(users.current_page - 1)}
                disabled={users.current_page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(users.current_page + 1)}
                disabled={users.current_page === users.last_page}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{users.from}</span> đến <span className="font-medium">{users.to}</span> trong tổng số{' '}
                  <span className="font-medium">{users.total}</span> khách hàng
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(users.current_page - 1)}
                    disabled={users.current_page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === users.current_page
                        ? 'z-10 bg-primary border-primary text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(users.current_page + 1)}
                    disabled={users.current_page === users.last_page}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CustomerList;

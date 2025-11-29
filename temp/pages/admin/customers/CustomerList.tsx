
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { USERS } from '../../../data';
import { User } from '../../../types';
import { 
  Plus, Search, Filter, Eye, Trash2, User as UserIcon, Mail, Phone, CheckCircle
} from 'lucide-react';
import Button from '../../../components/Button';
import AlertDialog from '../../../components/AlertDialog';
import { useToast } from '../../../context/ToastContext';

const CustomerList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Filter out admins initially
  const [users, setUsers] = useState<User[]>(USERS.filter(u => u.role !== 'admin'));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    let items = [...users];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(u => 
        u.name.toLowerCase().includes(lowerQuery) || 
        u.email.toLowerCase().includes(lowerQuery) ||
        (u.phone && u.phone.includes(lowerQuery))
      );
    }

    // Filter Status (Active/Inactive)
    if (filterStatus !== 'all') {
      const isActive = filterStatus === 'active' ? 1 : 0;
      items = items.filter(u => u.is_active === isActive);
    }

    return items;
  }, [users, searchQuery, filterStatus]);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      setUsers(prev => prev.filter(u => u.id !== deleteId));
      showToast('Đã xóa người dùng thành công', 'success');
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý Khách hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách khách hàng trong hệ thống</p>
        </div>
        {/* Removed 'Add Customer' button as per requirement that Admins cannot add customers manually */}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
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
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Vô hiệu hóa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <UserIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">ID: {user.id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail size={14} /> 
                        {user.email} 
                        {user.email_verified_at && <CheckCircle size={12} className="text-green-500" title="Đã xác thực" />}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} /> {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/admin/customers/${user.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" 
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => setDeleteId(user.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p>Không tìm thấy khách hàng nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Xóa người dùng?"
        description="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này có thể ảnh hưởng đến lịch sử đơn hàng."
        confirmText="Xóa vĩnh viễn"
      />
    </div>
  );
};

export default CustomerList;

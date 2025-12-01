
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Collection } from '../../../types';
import { Plus, Search, Filter, Edit2, Trash2, Layers } from 'lucide-react';
import Button from '../../../components/Button';
import AlertDialog from '../../../components/AlertDialog';
import { useToast } from '../../../context/ToastContext';
import { useDebounce } from '../../../hooks/useDebounce';
import AdminLayout from '../../../components/admin/AdminLayout';

interface CollectionListProps {
  collections: {
    data: Collection[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: {
    total: number;
    active: number;
    featured: number;
    expired: number;
  };
  filters?: {
    search?: string;
    type?: string;
    status?: string;
    sort?: string;
  };
}

const CollectionList = ({ collections, filters }: CollectionListProps) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [filterType, setFilterType] = useState(filters?.type || 'all');
  const [filterStatus, setFilterStatus] = useState(filters?.status || 'all');
  const [sortBy, setSortBy] = useState(filters?.sort || 'name_asc');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Handle filter changes with server-side request
  React.useEffect(() => {
    const params: Record<string, string> = {};

    if (debouncedSearch) params.search = debouncedSearch;
    if (filterType !== 'all') params.type = filterType;
    if (filterStatus !== 'all') params.status = filterStatus;
    if (sortBy !== 'name_asc') params.sort = sortBy;

    router.get('/admin/collections', params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [debouncedSearch, filterType, filterStatus, sortBy]);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      const collectionName = collections.data.find(c => c.id === deleteId)?.name || 'bộ sưu tập';
      router.delete(`/admin/collections/${deleteId}`, {
        preserveScroll: true,
        onSuccess: () => {
          setDeleteId(null);
          showToast(`Đã xóa ${collectionName}`, 'success');
        },
        onError: (errors: Record<string, string>) => {
          const firstError = Object.values(errors)[0];
          showToast(firstError || 'Có lỗi xảy ra khi xóa bộ sưu tập', 'error');
        },
      });
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'featured': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 uppercase">Featured</span>;
      case 'curated': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 uppercase">Curated</span>;
      case 'banner': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 uppercase">Banner</span>;
      case 'promotion': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 uppercase">Promotion</span>;
      default: return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-800 uppercase">{type}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý Bộ sưu tập</h1>
            <p className="text-sm text-gray-500 mt-1">Tổ chức và hiển thị sản phẩm theo nhóm</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => router.visit('/admin/collections/create')}>
            <Plus size={18} /> Tạo bộ sưu tập
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
              placeholder="Tìm kiếm bộ sưu tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">Tất cả loại</option>
                <option value="featured">Featured</option>
                <option value="curated">Curated</option>
                <option value="banner">Banner</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên bộ sưu tập</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {collections.data.length > 0 ? collections.data.map((collection) => (
                  <tr key={collection.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {collection.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{collection.name}</div>
                      <div className="text-xs text-gray-500">{collection.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(collection.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${collection.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                        }`}>
                        {collection.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.visit(`/admin/collections/${collection.id}/edit`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(collection.id)}
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
                      <div className="flex flex-col items-center justify-center">
                        <Layers size={48} className="text-gray-300 mb-3" />
                        <p>Không tìm thấy bộ sưu tập nào.</p>
                      </div>
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
          title="Xóa bộ sưu tập?"
          description="Bạn có chắc chắn muốn xóa bộ sưu tập này không? Các sản phẩm bên trong sẽ không bị xóa."
          confirmText="Xóa vĩnh viễn"
        />
      </div>
    </AdminLayout>
  );
};

export default CollectionList;

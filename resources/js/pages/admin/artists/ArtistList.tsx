
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Artist } from '../../../types';
import {
  Plus, Search, Globe, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import Button from '../../../components/Button';
import AlertDialog from '../../../components/AlertDialog';
import { useToast } from '../../../context/ToastContext';
import { useDebounce } from '../../../hooks/useDebounce';
import ArtistCard from '../../../components/admin/artists/ArtistCard';
import AdminLayout from '../../../components/admin/AdminLayout';

interface ArtistListProps {
  artists: {
    data: Artist[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  stats: {
    total: number;
    with_products: number;
    without_products: number;
    total_products: number;
  };
  countries: string[];
  filters?: {
    search?: string;
    country?: string;
    status?: string;
    sort?: string;
  };
}

const ArtistList = ({ artists, stats, countries, filters }: ArtistListProps) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [filterCountry, setFilterCountry] = useState(filters?.country || 'all');
  const [filterStatus, setFilterStatus] = useState(filters?.status || 'all');
  const [sortBy, setSortBy] = useState(filters?.sort || 'name_asc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Handle filter changes with server-side request
  React.useEffect(() => {
    const params: Record<string, string> = {};

    if (debouncedSearch) params.search = debouncedSearch;
    if (filterCountry !== 'all') params.country = filterCountry;
    if (filterStatus !== 'all') params.status = filterStatus;
    if (sortBy !== 'name_asc') params.sort = sortBy;

    router.get('/admin/artists', params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [debouncedSearch, filterCountry, filterStatus, sortBy]);

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: page.toString() };

    if (filters?.search) params.search = filters.search;
    if (filters?.country) params.country = filters.country;
    if (filters?.status) params.status = filters.status;
    if (filters?.sort) params.sort = filters.sort;

    router.get('/admin/artists', params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      const artistName = artists.data.find(a => a.id === deleteId)?.name || 'nghệ sĩ';
      router.delete(`/admin/artists/${deleteId}`, {
        preserveScroll: true,
        onSuccess: () => {
          setDeleteId(null);
          showToast(`Đã xóa ${artistName}`, 'success');
        },
        onError: (errors: Record<string, string>) => {
          const firstError = Object.values(errors)[0];
          showToast(firstError || 'Có lỗi xảy ra khi xóa nghệ sĩ', 'error');
        },
      });
    }
  };

  const handleRestore = (id: string) => {
    const artistName = artists.data.find(a => a.id === id)?.name || 'nghệ sĩ';
    router.post(`/admin/artists/${id}/restore`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        showToast(`Đã khôi phục ${artistName}`, 'success');
      },
      onError: (errors: Record<string, string>) => {
        const firstError = Object.values(errors)[0];
        showToast(firstError || 'Có lỗi xảy ra khi khôi phục nghệ sĩ', 'error');
      },
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý Nghệ sĩ</h1>
            <p className="text-sm text-gray-500 mt-1">Danh sách các nghệ sĩ, ban nhạc trong hệ thống</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => router.visit('/admin/artists/create')}>
            <Plus size={18} /> Thêm nghệ sĩ
          </Button>
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
              placeholder="Tìm tên nghệ sĩ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-gray-500" />
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">Tất cả quốc gia</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
                <option value="deleted">Đã xóa</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
              <option value="products_desc">Nhiều sản phẩm nhất</option>
              <option value="created_desc">Mới nhất</option>
              <option value="created_asc">Cũ nhất</option>
            </select>
          </div>
        </div>

        {/* List Grid - Updated to 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.data.length > 0 ? (
            artists.data.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onEdit={() => router.visit(`/admin/artists/${artist.id}/edit`)}
                onDelete={setDeleteId}
                onRestore={handleRestore}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Không tìm thấy nghệ sĩ nào.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {artists.last_page > 1 && (
          <div className="mt-6 bg-white px-4 py-3 flex items-center justify-between border border-gray-200 rounded-xl sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(artists.current_page - 1)}
                disabled={artists.current_page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(artists.current_page + 1)}
                disabled={artists.current_page === artists.last_page}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{artists.from}</span> đến <span className="font-medium">{artists.to}</span> trong tổng số{' '}
                  <span className="font-medium">{artists.total}</span> nghệ sĩ
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(artists.current_page - 1)}
                    disabled={artists.current_page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: artists.last_page }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === artists.current_page
                        ? 'z-10 bg-primary border-primary text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(artists.current_page + 1)}
                    disabled={artists.current_page === artists.last_page}
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
          title="Xóa nghệ sĩ?"
          description="Bạn có chắc chắn muốn xóa nghệ sĩ này không? Lưu ý: Các sản phẩm liên kết với nghệ sĩ này có thể bị ảnh hưởng."
          confirmText="Xóa vĩnh viễn"
        />
      </div>
    </AdminLayout>
  );
};

export default ArtistList;

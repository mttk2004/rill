
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Product, Artist } from '../../../types';
import {
  Plus, Search, Filter,
  Eye, Edit2, Trash2, AlertCircle
} from 'lucide-react';
import { getImageUrl } from '../../../utils/image';
import Button from '../../../components/Button';
import ProductDetailDialog from '../../../components/admin/products/ProductDetailDialog';
import AlertDialog from '../../../components/AlertDialog';
import { useToast } from '../../../context/ToastContext';
import AdminLayout from '../../../components/admin/AdminLayout';

interface ProductListProps {
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: {
    total: number;
    active: number;
    low_stock: number;
    out_of_stock: number;
  };
  genres: string[];
  labels: string[];
  artists: Artist[];
  filters: {
    search?: string;
    status?: string;
    genre?: string;
    sort?: string;
  };
}

const ProductList = ({ products: productsPagination, filters, stats, genres }: ProductListProps) => {
  const { showToast } = useToast();

  // State for filters - initialize from backend
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
  const [filterGenre, setFilterGenre] = useState(filters.genre || 'all');
  const [sortBy, setSortBy] = useState(filters.sort || 'newest');

  // Modal State
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) params.append('search', value);
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      if (filterGenre && filterGenre !== 'all') params.append('genre', filterGenre);
      if (sortBy) params.append('sort', sortBy);

      router.get(`/admin/products?${params.toString()}`, {}, {
        preserveState: true,
        preserveScroll: true,
      });
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      router.delete(`/admin/products/${deleteId}`, {
        preserveScroll: true,
        onSuccess: () => {
          showToast('Đã xóa sản phẩm thành công', 'success');
          setDeleteId(null);
        },
        onError: () => {
          showToast('Có lỗi xảy ra khi xóa sản phẩm', 'error');
        },
      });
    }
  };

  // Updated to handle multiple artists
  const getMainArtistsName = (product: Product) => {
    if (product.artists && product.artists.length > 0) {
      const mainArtists = product.artists
        .filter((a: Artist & { pivot?: { role?: string } }) => a.pivot?.role === 'main')
        .map((a: Artist) => a.name);

      if (mainArtists.length > 0) return mainArtists.join(', ');
      // Fallback to first artist if no main role
      return (product.artists[0] as Artist).name || '---';
    }

    return '---';
  };

  const getStatusBadge = (status: string = 'active') => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      out_of_stock: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'Đang bán',
      inactive: 'Ngừng bán',
      out_of_stock: 'Hết hàng'
    };
    const s = status as keyof typeof styles;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[s] || styles.active}`}>
        {labels[s] || labels.active}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-sm text-gray-500 mt-1">Danh sách tất cả đĩa than trong hệ thống</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => router.visit('/admin/products/create')}>
            <Plus size={18} /> Thêm sản phẩm
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Tìm theo tên, SKU..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (e.target.value && e.target.value !== 'all') params.append('status', e.target.value);
                  if (filterGenre && filterGenre !== 'all') params.append('genre', filterGenre);
                  if (sortBy) params.append('sort', sortBy);
                  router.get(`/admin/products?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="inactive">Ngừng kinh doanh</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterGenre}
                onChange={(e) => {
                  setFilterGenre(e.target.value);
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                  if (e.target.value && e.target.value !== 'all') params.append('genre', e.target.value);
                  if (sortBy) params.append('sort', sortBy);
                  router.get(`/admin/products?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">Tất cả thể loại</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                  if (filterGenre && filterGenre !== 'all') params.append('genre', filterGenre);
                  params.append('sort', e.target.value);
                  router.get(`/admin/products?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="name_asc">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
                <option value="price_asc">Giá thấp → cao</option>
                <option value="price_desc">Giá cao → thấp</option>
                <option value="stock_asc">Tồn kho ít nhất</option>
                <option value="stock_desc">Tồn kho nhiều nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productsPagination.data.length > 0 ? productsPagination.data.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
                        {product.image ? (
                          <img src={getImageUrl(product.image) || ''} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={product.name}>
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">{getMainArtistsName(product)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setDetailProduct(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.visit(`/admin/products/${product.id}`)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
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
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle size={48} className="text-gray-300 mb-3" />
                        <p>Không tìm thấy sản phẩm nào.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{productsPagination.data.length}</span> trong tổng số{' '}
            <span className="font-medium">{productsPagination.total}</span> sản phẩm
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            {productsPagination.current_page > 1 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                  if (filterGenre && filterGenre !== 'all') params.append('genre', filterGenre);
                  if (sortBy) params.append('sort', sortBy);
                  params.append('page', String(productsPagination.current_page - 1));
                  router.get(`/admin/products?${params.toString()}`, {}, { preserveState: true, preserveScroll: false });
                }}
                className="px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Trước
              </button>
            )}

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: productsPagination.last_page }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === productsPagination.last_page ||
                  (page >= productsPagination.current_page - 1 && page <= productsPagination.current_page + 1);

                // Show ellipsis
                if (!showPage) {
                  if (page === productsPagination.current_page - 2 || page === productsPagination.current_page + 2) {
                    return <span key={page} className="px-3 py-2 text-gray-400">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => {
                      if (page === productsPagination.current_page) return;
                      const params = new URLSearchParams();
                      if (searchQuery) params.append('search', searchQuery);
                      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                      if (filterGenre && filterGenre !== 'all') params.append('genre', filterGenre);
                      if (sortBy) params.append('sort', sortBy);
                      params.append('page', String(page));
                      router.get(`/admin/products?${params.toString()}`, {}, { preserveState: true, preserveScroll: false });
                    }}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${page === productsPagination.current_page
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {productsPagination.current_page < productsPagination.last_page && (
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('search', searchQuery);
                  if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
                  if (filterGenre && filterGenre !== 'all') params.append('genre', filterGenre);
                  if (sortBy) params.append('sort', sortBy);
                  params.append('page', String(productsPagination.current_page + 1));
                  router.get(`/admin/products?${params.toString()}`, {}, { preserveState: true, preserveScroll: false });
                }}
                className="px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Sau
              </button>
            )}
          </div>
        </div>

        {/* Detail Dialog */}
        <ProductDetailDialog
          isOpen={!!detailProduct}
          onClose={() => setDetailProduct(null)}
          product={detailProduct}
        />

        {/* Delete Alert */}
        <AlertDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          title="Xóa sản phẩm?"
          description="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác và có thể ảnh hưởng đến dữ liệu đơn hàng."
          confirmText="Xóa vĩnh viễn"
        />
      </div>
    </AdminLayout>
  );
};

export default ProductList;

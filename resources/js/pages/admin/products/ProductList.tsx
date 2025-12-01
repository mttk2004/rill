
import React, { useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import { Product, Artist } from '../../../types';
import {
  Plus, Search, Filter, ArrowUpDown,
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

const ProductList = ({ products: productsPagination, filters: _filters }: ProductListProps) => {
  const { showToast } = useToast();

  // State
  const [products, setProducts] = useState<Product[]>(productsPagination.data);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);

  // Modal State
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Derived Data
  const filteredProducts = useMemo(() => {
    let items = [...products];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter
    if (filterStatus !== 'all') {
      items = items.filter(p => (p.status || 'active') === filterStatus);
    }

    // Sort
    if (sortConfig) {
      items.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle numeric strings like price
        if (sortConfig.key === 'price' || sortConfig.key === 'stock_quantity') {
          const numA = Number(aValue);
          const numB = Number(bValue);
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        }

        if ((aValue ?? '') < (bValue ?? '')) return sortConfig.direction === 'asc' ? -1 : 1;
        if ((aValue ?? '') > (bValue ?? '')) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return items;
  }, [products, searchQuery, filterStatus, sortConfig]);

  // Handlers
  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="inactive">Ngừng kinh doanh</option>
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
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">Tên sản phẩm <ArrowUpDown size={14} /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('stock_quantity')}
                  >
                    <div className="flex items-center gap-1">Tồn kho <ArrowUpDown size={14} /></div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">Giá bán <ArrowUpDown size={14} /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
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
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {productsPagination.data.length} trong tổng số {productsPagination.total} sản phẩm
          </div>
          <div className="flex gap-2">
            {productsPagination.current_page > 1 && (
              <button
                onClick={() => router.get(`/admin/products?page=${productsPagination.current_page - 1}`)}
                className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm font-medium"
              >
                Trước
              </button>
            )}
            <span className="px-4 py-2 border rounded-lg bg-primary text-white text-sm font-medium">
              {productsPagination.current_page}
            </span>
            {productsPagination.current_page < productsPagination.last_page && (
              <button
                onClick={() => router.get(`/admin/products?page=${productsPagination.current_page + 1}`)}
                className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm font-medium"
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

import { AdminNavigation } from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Package } from "lucide-react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { toast } from 'react-toastify';
import type { Paginator } from '@/types';
import { useRef, useCallback, useState } from 'react';
import { ProductStatsCards } from "@/components/admin/product-stats-cards";
import { ProductFilters } from "@/components/admin/product-filters";
import { ProductTable } from "@/components/admin/product-table";
import { ProductDetailDialog } from "@/components/admin/product-detail-dialog";
import { ProductEditDialog } from "@/components/admin/product-edit-dialog";
import { AdminProduct } from "@/lib/product-helpers";

const AdminProducts = () => {
  interface PageProps {
    products: Paginator<AdminProduct>;
    stats: {
      total: number;
      active: number;
      out_of_stock: number;
      low_stock: number;
      featured: number;
    };
    genres: string[];
    filters?: Record<string, unknown>;
    [key: string]: unknown;
  }

  const page = usePage<PageProps>().props;
  const productsPaginator = (page.products as Paginator<AdminProduct>) || {
    data: [],
    links: [],
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: null,
    to: null
  } as Paginator<AdminProduct>;

  const stats = (page.stats as PageProps['stats']) || {
    total: 0,
    active: 0,
    out_of_stock: 0,
    low_stock: 0,
    featured: 0
  };

  const genres = (page.genres as string[]) || [];
  const filters = (page.filters as Record<string, unknown>) || {};
  const products = productsPaginator.data;

  // Dialog state
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<AdminProduct | null>(null);

  // Debounce timer ref
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter state
  const [currentFilters, setCurrentFilters] = useState({
    search: (filters.search as string) || '',
    status: (filters.status as string) || 'all',
    genre: (filters.genre as string) || 'all',
    stock: (filters.stock as string) || 'all',
    sort: (filters.sort as string) || 'name_asc',
  });

  // Fetch full product details
  const fetchProductDetails = async (productId: string) => {
    setIsLoadingProduct(true);
    try {
      const response = await fetch(`/admin/products/${productId}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        setSelectedProduct(data.props.product);
        setIsDialogOpen(true);
      } else {
        const text = await response.text();
        console.error('Expected JSON but received:', text);
        toast.error('Server trả về dữ liệu không hợp lệ');
        return;
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  // Handle edit
  const handleEdit = async (productId: string) => {
    setIsLoadingProduct(true);
    try {
      const response = await fetch(`/admin/products/${productId}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        setProductToEdit(data.props.product);
        setIsEditDialogOpen(true);
      } else {
        const text = await response.text();
        console.error('Expected JSON but received:', text);
        toast.error('Server trả về dữ liệu không hợp lệ');
        return;
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: string | undefined) => {
    const currentParams = new URLSearchParams(window.location.search);

    if (value && value !== 'all' && !value.startsWith('all-')) {
      currentParams.set(key, value);
    } else {
      currentParams.delete(key);
    }

    currentParams.delete('page');

    const queryString = currentParams.toString();
    router.get(`/admin/products${queryString ? '?' + queryString : ''}`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  }, []);

  const handleSearchChange = useCallback((searchTerm: string) => {
    setCurrentFilters(prev => ({ ...prev, search: searchTerm }));

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      handleFilterChange('search', searchTerm || undefined);
    }, 500);
  }, [handleFilterChange]);

  const handleStatusChange = useCallback((value: string) => {
    setCurrentFilters(prev => ({ ...prev, status: value }));
    handleFilterChange('status', value === 'all' ? undefined : value);
  }, [handleFilterChange]);

  const handleGenreChange = useCallback((value: string) => {
    setCurrentFilters(prev => ({ ...prev, genre: value }));
    handleFilterChange('genre', value === 'all' ? undefined : value);
  }, [handleFilterChange]);

  const handleStockChange = useCallback((value: string) => {
    setCurrentFilters(prev => ({ ...prev, stock: value }));
    handleFilterChange('stock', value === 'all' ? undefined : value);
  }, [handleFilterChange]);

  const handleSortChange = useCallback((value: string) => {
    setCurrentFilters(prev => ({ ...prev, sort: value }));
    handleFilterChange('sort', value);
  }, [handleFilterChange]);

  const handleDelete = (productId: string, productName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      router.delete(`/admin/products/${productId}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Sản phẩm đã được xóa thành công');
        },
        onError: () => {
          toast.error('Không thể xóa sản phẩm');
        }
      });
    }
  };

  const handleRestore = (productId: string, productName: string) => {
    if (confirm(`Bạn có chắc chắn muốn khôi phục sản phẩm "${productName}"?`)) {
      router.post(`/admin/products/${productId}/restore`, {}, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Sản phẩm đã được khôi phục thành công');
        },
        onError: () => {
          toast.error('Không thể khôi phục sản phẩm');
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý sản phẩm" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                Quản lý Sản phẩm
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 ml-12">
                Quản lý toàn bộ sản phẩm đĩa than trong cửa hàng
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <ProductStatsCards stats={stats} />

          {/* Filters */}
          <ProductFilters
            filters={currentFilters}
            genres={genres}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onGenreChange={handleGenreChange}
            onStockChange={handleStockChange}
            onSortChange={handleSortChange}
          />

          {/* Products Table */}
          <ProductTable
            products={products}
            loading={false}
            onViewDetails={fetchProductDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />

          {/* Pagination */}
          {productsPaginator.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Hiển thị {productsPaginator.from} đến {productsPaginator.to} trong tổng số {productsPaginator.total} sản phẩm
              </div>
              <div className="flex gap-2">
                {productsPaginator.links.map((link, idx) => {
                  if (!link.url) return null;
                  return (
                    <Link
                      key={idx}
                      href={link.url}
                      className={`px-3 py-1 rounded-md ${link.active ? 'bg-amber-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 hover:bg-amber-100'}`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* Product Edit Dialog */}
      <ProductEditDialog
        product={productToEdit}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        genres={genres}
      />
    </div>
  );
};

export default AdminProducts;

import { AdminNavigation } from "@/components/admin-navigation";
import { AdminStatsCards, StatCardData } from "@/components/admin/common/admin-stats-cards";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Package, CheckCircle, AlertTriangle, TrendingUp, Star } from "lucide-react";
import { Head, Link, usePage } from "@inertiajs/react";
import { toast } from 'react-toastify';
import type { Paginator } from '@/types';
import { useState } from 'react';
import { useQueryFilters } from '@/hooks/use-query-filters';
import { useToastRouter } from '@/hooks/use-toast-router';
import { ProductFilters } from "@/components/admin/product-filters";
import { ProductTable } from "@/components/admin/product-table";
import { ProductDetailDialog } from "@/components/admin/product-detail-dialog";
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
    labels: string[];
    artists: Array<{
      id: string;
      name: string;
    }>;
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

  // Hooks
  const { filters: currentFilters, handleFilterChange } = useQueryFilters({
    initialFilters: {
      search: (filters.search as string) || '',
      status: (filters.status as string) || 'all',
      genre: (filters.genre as string) || 'all',
      stock: (filters.stock as string) || 'all',
      sort: (filters.sort as string) || 'name_asc',
    },
    routeOrPath: '/admin/products',
  });
  const { post, delete: destroy } = useToastRouter();

  // Fetch full product details
  const fetchProductDetails = async (productId: string) => {
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
        toast.error('Server trả về dữ liệu không hợp lệ');
        return;
      }
    } catch {
      toast.error('Không thể tải thông tin sản phẩm');
    }
  };

  // Specialized filter handlers
  const handleSearchChange = (searchTerm: string) => {
    handleFilterChange('search', searchTerm || undefined);
  };

  const handleStatusChange = (value: string) => {
    handleFilterChange('status', value === 'all' ? undefined : value);
  };

  const handleGenreChange = (value: string) => {
    handleFilterChange('genre', value === 'all' ? undefined : value);
  };

  const handleStockChange = (value: string) => {
    handleFilterChange('stock', value === 'all' ? undefined : value);
  };

  const handleSortChange = (value: string) => {
    handleFilterChange('sort', value);
  };

  const handleDelete = (productId: string, productName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      destroy(`/admin/products/${productId}`, {
        success: 'Sản phẩm đã được xóa thành công',
        error: 'Không thể xóa sản phẩm'
      }, {
        preserveState: true,
        preserveScroll: true
      });
    }
  };

  const handleRestore = (productId: string, productName: string) => {
    if (confirm(`Bạn có chắc chắn muốn khôi phục sản phẩm "${productName}"?`)) {
      post(`/admin/products/${productId}/restore`, {}, {
        success: 'Sản phẩm đã được khôi phục thành công',
        error: 'Không thể khôi phục sản phẩm'
      }, {
        preserveState: true,
        preserveScroll: true
      });
    }
  };

  // Stats cards configuration
  const statsCards: StatCardData[] = [
    {
      title: 'Tổng sản phẩm',
      value: stats.total.toLocaleString(),
      subtitle: 'Tất cả sản phẩm',
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Đang bán',
      value: stats.active.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Hết hàng',
      value: stats.out_of_stock.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.out_of_stock / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-rose-500',
    },
    {
      title: 'Sắp hết hàng',
      value: stats.low_stock.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.low_stock / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Nổi bật',
      value: stats.featured.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.featured / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: Star,
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý sản phẩm" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
                <p className="text-muted-foreground mt-2">
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
                <Link href="/admin/products/create">
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <AdminStatsCards stats={statsCards} cols={{ default: 1, md: 3, xl: 5 }} />

            {/* Filters */}
            <ProductFilters
              filters={{
                search: currentFilters.search || '',
                status: currentFilters.status || 'all',
                genre: currentFilters.genre || 'all',
                stock: currentFilters.stock || 'all',
                sort: currentFilters.sort || 'name_asc',
              }}
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
      </div>
    </div>
  );
};

export default AdminProducts;

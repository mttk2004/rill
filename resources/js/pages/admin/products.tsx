import { AdminNavigation } from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  Download,
  Upload,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Star,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  RotateCcw
} from "lucide-react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { toast } from 'react-toastify';
import type { Paginator, PaginationLink } from '@/types';
import { useRef, useCallback, useState } from 'react';

const AdminProducts = () => {

  type AdminProduct = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    detailed_description?: string;
    sku: string;
    price: number;
    cost_price?: number;
    compare_price?: number;
    stock_quantity: number;
    min_stock_level: number;
    genre?: string;
    label?: string;
    image?: string;
    is_featured: boolean;
    status: 'active' | 'inactive' | 'out_of_stock';
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    artists?: Array<{
      id: string;
      name: string;
      slug: string;
      pivot?: {
        role: string;
        sort_order: number;
      };
    }>;
    order_items_count?: number;
    total_sold?: number;
    total_revenue?: number;
    reviews_count?: number;
    recent_orders?: Array<{
      id: string;
      order_number: string;
      status: string;
      placed_at: string;
      quantity: number;
      unit_price: number;
    }>;
  };

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
  const productsPaginator = (page.products as Paginator<AdminProduct>) || { data: [], links: [], current_page: 1, last_page: 1, per_page: 20, total: 0, from: null, to: null } as Paginator<AdminProduct>;
  const stats = (page.stats as PageProps['stats']) || { total: 0, active: 0, out_of_stock: 0, low_stock: 0, featured: 0 };
  const genres = (page.genres as string[]) || [];
  const filters = (page.filters as Record<string, unknown>) || {};

  const products = productsPaginator.data;

  // Dialog state
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  // Debounce timer ref
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      handleFilterChange('search', searchTerm || undefined);
    }, 500);
  }, [handleFilterChange]);

  const handleStatusChange = useCallback((value: string) => {
    handleFilterChange('status', value === 'all-status' ? undefined : value);
  }, [handleFilterChange]);

  const handleGenreChange = useCallback((value: string) => {
    handleFilterChange('genre', value === 'all-genres' ? undefined : value);
  }, [handleFilterChange]);

  const handleStockChange = useCallback((value: string) => {
    handleFilterChange('stock', value === 'all-stock' ? undefined : value);
  }, [handleFilterChange]);

  const handleSortChange = useCallback((value: string) => {
    handleFilterChange('sort', value === 'newest' ? undefined : value);
  }, [handleFilterChange]);

  const handleDelete = (productId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
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

  const handleRestore = (productId: string) => {
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
  };

  const getStatusBadge = (status: string, deleted_at?: string) => {
    if (deleted_at) {
      return (
        <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">
          <Trash2 className="h-3 w-3 mr-1" />
          Đã xóa
        </Badge>
      );
    }

    const variants = {
      active: { label: "Đang bán", color: "bg-gradient-to-r from-green-500 to-green-600 text-white border-0", icon: CheckCircle },
      inactive: { label: "Không hoạt động", color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0", icon: XCircle },
      out_of_stock: { label: "Hết hàng", color: "bg-gradient-to-r from-red-500 to-red-600 text-white border-0", icon: AlertTriangle },
    };

    const config = variants[status as keyof typeof variants] || variants.inactive;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const calculateProfit = (price: number, cost_price?: number | null) => {
    if (!cost_price || cost_price === 0) return "—";
    const profit = ((price - cost_price) / cost_price * 100).toFixed(1);
    return `${profit}%`;
  };

  const getMainArtist = (artists?: AdminProduct['artists']) => {
    if (!artists || artists.length === 0) return "—";
    const mainArtist = artists.find(artist => artist.pivot?.role === "main");
    return mainArtist ? mainArtist.name : artists[0].name;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const isLowStock = (product: AdminProduct) => {
    return product.stock_quantity <= product.min_stock_level && product.stock_quantity > 0;
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100 mb-1">
                      Tổng sản phẩm
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {stats.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100 mb-1">
                      Đang bán
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {stats.active.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-100 mt-1">
                      {((stats.active / stats.total) * 100).toFixed(1)}% tổng số
                    </p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-100 mb-1">
                      Hết hàng
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {stats.out_of_stock.toLocaleString()}
                    </p>
                    <p className="text-xs text-red-100 mt-1">
                      {((stats.out_of_stock / stats.total) * 100).toFixed(1)}% tổng số
                    </p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-100 mb-1">
                      Sắp hết hàng
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {stats.low_stock.toLocaleString()}
                    </p>
                    <p className="text-xs text-amber-100 mt-1">
                      {((stats.low_stock / stats.total) * 100).toFixed(1)}% tổng số
                    </p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100 mb-1">
                      Nổi bật
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {stats.featured.toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-100 mt-1">
                      {((stats.featured / stats.total) * 100).toFixed(1)}% tổng số
                    </p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tìm kiếm
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Tên, SKU, nghệ sĩ, thể loại..."
                      defaultValue={typeof filters.search === 'string' ? filters.search : ''}
                      onChange={handleSearchChange}
                      className="pl-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Trạng thái
                  </Label>
                  <Select
                    defaultValue={(filters.status as string) || "all-status"}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">Tất cả</SelectItem>
                      <SelectItem value="active">Đang bán</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Thể loại
                  </Label>
                  <Select
                    defaultValue={(filters.genre as string) || "all-genres"}
                    onValueChange={handleGenreChange}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Thể loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-genres">Tất cả</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tồn kho
                  </Label>
                  <Select
                    defaultValue={(filters.stock as string) || "all-stock"}
                    onValueChange={handleStockChange}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Tồn kho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-stock">Tất cả</SelectItem>
                      <SelectItem value="low">Sắp hết</SelectItem>
                      <SelectItem value="out">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Sắp xếp
                  </Label>
                  <Select
                    defaultValue={(filters.sort as string) || "newest"}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="name-asc">Tên A-Z</SelectItem>
                      <SelectItem value="name-desc">Tên Z-A</SelectItem>
                      <SelectItem value="price-high">Giá cao → thấp</SelectItem>
                      <SelectItem value="price-low">Giá thấp → cao</SelectItem>
                      <SelectItem value="stock-low">Tồn kho thấp</SelectItem>
                      <SelectItem value="best-selling">Bán chạy nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-slate-600 dark:text-slate-400">
              Hiển thị <span className="font-medium text-slate-900 dark:text-white">{products.length}</span> trong <span className="font-medium text-slate-900 dark:text-white">{productsPaginator.total.toLocaleString()}</span> sản phẩm
            </p>
          </div>

          {/* Products Table */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Thể loại
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Giá bán
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Đã bán
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-amber-50/50 dark:hover:bg-slate-700/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-amber-200 dark:group-hover:ring-amber-900 transition-all">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                                <Package className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                            {product.is_featured && (
                              <div className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                              {getMainArtist(product.artists)}
                            </p>
                            {product.label && (
                              <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                                {product.label}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                          {product.sku}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900 dark:text-white">
                          {product.genre || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <p className="text-sm font-bold text-amber-600">
                            {formatPrice(product.price)}
                          </p>
                          {product.cost_price && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Lãi: {calculateProfit(product.price, product.cost_price)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <p className={`text-sm font-semibold ${product.stock_quantity === 0
                              ? 'text-red-600'
                              : isLowStock(product)
                                ? 'text-amber-600'
                                : 'text-slate-900 dark:text-white'
                            }`}>
                            {product.stock_quantity}
                          </p>
                          {isLowStock(product) && (
                            <Badge className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0 border-0">
                              Thấp
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ShoppingCart className="h-3.5 w-3.5 text-slate-400" />
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {product.total_sold || 0}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(product.status, product.deleted_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => fetchProductDetails(product.id)}
                            disabled={isLoadingProduct}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {product.deleted_at ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() => handleRestore(product.id)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="mt-8">
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                {productsPaginator.links && productsPaginator.links.map((link: PaginationLink, idx: number) => {
                  if (!link.url) {
                    return <span key={idx} className="px-3 py-1 text-slate-500" dangerouslySetInnerHTML={{ __html: link.label }} />;
                  }
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
          </div>
        </div>
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              Chi tiết Sản phẩm
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="orders">Lịch sử bán hàng</TabsTrigger>
              </TabsList>

              {/* Tab Thông tin */}
              <TabsContent value="info" className="space-y-4">
                <div className="flex items-start gap-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 relative ring-4 ring-slate-100 dark:ring-slate-700">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                        <Package className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    {selectedProduct.is_featured && (
                      <div className="absolute top-2 right-2 p-1.5 bg-amber-500 rounded-full">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                      {getMainArtist(selectedProduct.artists)}
                    </p>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {getStatusBadge(selectedProduct.status, selectedProduct.deleted_at)}
                      {selectedProduct.is_featured && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                          <Star className="h-3 w-3 mr-1" />
                          Nổi bật
                        </Badge>
                      )}
                    </div>
                    {selectedProduct.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedProduct.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">SKU</p>
                          <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                            {selectedProduct.sku}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Giá bán</p>
                          <p className="text-lg font-bold text-amber-600">
                            {formatPrice(selectedProduct.price)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedProduct.cost_price && (
                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tỷ suất lợi nhuận</p>
                            <p className="text-lg font-bold text-green-600">
                              {calculateProfit(selectedProduct.price, selectedProduct.cost_price)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Tồn kho</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {selectedProduct.stock_quantity} {isLowStock(selectedProduct) && <span className="text-xs text-amber-600">(Thấp)</span>}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Đã bán</p>
                          <p className="text-lg font-bold text-blue-600">
                            {selectedProduct.total_sold || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedProduct.total_revenue && (
                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Doanh thu</p>
                            <p className="text-lg font-bold text-green-600">
                              {formatPrice(selectedProduct.total_revenue)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Ngày tạo</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {new Date(selectedProduct.created_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedProduct.genre && (
                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Thể loại</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {selectedProduct.genre}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedProduct.label && (
                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                      <CardContent className="p-4">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Nhãn hiệu</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {selectedProduct.label}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Artists */}
                {selectedProduct.artists && selectedProduct.artists.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Nghệ sĩ
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.artists.map((artist) => (
                        <Badge key={artist.id} className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0">
                          {artist.name}
                          {artist.pivot?.role && artist.pivot.role !== 'main' && (
                            <span className="ml-1 text-xs text-slate-500">({artist.pivot.role})</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Description */}
                {selectedProduct.detailed_description && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Mô tả chi tiết
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedProduct.detailed_description}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Tab Lịch sử bán hàng */}
              <TabsContent value="orders">
                {!selectedProduct.recent_orders || selectedProduct.recent_orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      Sản phẩm chưa có lịch sử bán hàng
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedProduct.recent_orders.map((order) => (
                      <Card key={order.id} className="bg-slate-50 dark:bg-slate-800/50 border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-amber-600">#{order.order_number}</span>
                              <Badge className="bg-blue-500 text-white border-0">
                                {order.status}
                              </Badge>
                            </div>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Xem
                              </Button>
                            </Link>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-slate-600 dark:text-slate-400">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                              <span className="mx-2">•</span>
                              SL: {order.quantity}
                            </div>
                            <div className="font-bold text-lg text-slate-900 dark:text-white">
                              {formatPrice(order.unit_price * order.quantity)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;

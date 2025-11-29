import { AdminNavigation } from '@/components/admin-navigation';
import { AdminStatsCards, StatCardData } from '@/components/admin/common/admin-stats-cards';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link, router } from '@inertiajs/react';
import { useQueryFilters } from '@/hooks/use-query-filters';
import { useToastRouter } from '@/hooks/use-toast-router';
import {
  Ticket,
  Plus,
  Search,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Copy,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'react-toastify';

interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: string;
  value: number;
  minimum_amount: number | null;
  maximum_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  usage_limit_per_user: number | null;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  created_at: string;
  usages_count?: number;
}

interface Stats {
  total: number;
  active: number;
  expired: number;
  total_used: number;
}

interface Filters {
  search?: string;
  status?: string;
  sort?: string;
}

interface Props {
  vouchers: {
    data: Voucher[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: Stats;
  filters: Filters;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function AdminVouchers({ vouchers, stats, filters, flash }: Props) {
  const { filters: currentFilters, handleFilterChange } = useQueryFilters({
    routeOrPath: '/admin/vouchers',
    initialFilters: {
      search: filters.search || '',
      status: filters.status || '',
      sort: filters.sort || 'created_desc',
    },
  });

  const { delete: deleteVoucher } = useToastRouter();

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = (voucher: Voucher) => {
    const now = new Date();
    const validFrom = new Date(voucher.valid_from);
    const validTo = new Date(voucher.valid_to);

    if (!voucher.is_active) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Tạm dừng</Badge>;
    }

    if (now < validFrom) {
      return <Badge variant="outline" className="border-blue-200 text-blue-700">Chưa bắt đầu</Badge>;
    }

    if (now > validTo) {
      return <Badge variant="secondary" className="bg-red-100 text-red-700">Hết hạn</Badge>;
    }

    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Hết lượt</Badge>;
    }

    return <Badge variant="default" className="bg-green-100 text-green-700">Đang hoạt động</Badge>;
  };

  const getUsagePercentage = (voucher: Voucher) => {
    if (!voucher.usage_limit) return 0;
    return (voucher.used_count / voucher.usage_limit) * 100;
  };

  const isVoucherEditable = (voucher: Voucher) => {
    const now = new Date();
    const validTo = new Date(voucher.valid_to);

    // Không cho edit nếu đã được sử dụng hoặc đã hết hạn
    return voucher.used_count === 0 && now <= validTo;
  };

  const handleDeleteVoucher = (voucherId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      deleteVoucher(`/admin/vouchers/${voucherId}`, {
        pending: 'Đang xóa voucher...',
        success: 'Đã xóa voucher thành công!',
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // TODO: Show toast notification
  };

  // Calculate total discount given to customers
  const totalDiscount = vouchers.data.reduce((sum, voucher) => {
    return sum + (voucher.value * voucher.used_count);
  }, 0);

  // Stats cards configuration
  const statsCards: StatCardData[] = [
    {
      title: 'Đang hoạt động',
      value: stats.active,
      subtitle: 'Voucher có hiệu lực',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Tổng voucher',
      value: stats.total,
      subtitle: 'Tất cả voucher',
      icon: Ticket,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Lượt sử dụng',
      value: stats.total_used,
      subtitle: 'Tổng số lần dùng',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Tiết kiệm cho KH',
      value: formatVND(totalDiscount).replace('₫', '').trim(),
      subtitle: 'Tổng giảm giá',
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Head title="Quản lý Voucher - Admin" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Quản lý Voucher</h1>
                <p className="text-muted-foreground mt-2">
                  Tạo và quản lý mã giảm giá để thu hút khách hàng
                </p>
              </div>
              <Link href="/admin/vouchers/create">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm voucher
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <AdminStatsCards stats={statsCards} cols={{ default: 1, md: 2, xl: 4 }} />

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
              {/* Search Input */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo mã hoặc tên voucher..."
                  value={currentFilters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select
                value={currentFilters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Đang hoạt động
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Tạm dừng
                    </div>
                  </SelectItem>
                  <SelectItem value="expired">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Hết hạn
                    </div>
                  </SelectItem>
                  <SelectItem value="upcoming">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Chưa bắt đầu
                    </div>
                  </SelectItem>
                  <SelectItem value="exhausted">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Hết lượt
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select
                value={currentFilters.sort || 'created_desc'}
                onValueChange={(value) => handleFilterChange('sort', value === 'created_desc' ? undefined : value)}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_desc">Mới nhất</SelectItem>
                  <SelectItem value="created_asc">Cũ nhất</SelectItem>
                  <SelectItem value="code_asc">Mã A-Z</SelectItem>
                  <SelectItem value="code_desc">Mã Z-A</SelectItem>
                  <SelectItem value="value_desc">Giá trị giảm (Cao → Thấp)</SelectItem>
                  <SelectItem value="value_asc">Giá trị giảm (Thấp → Cao)</SelectItem>
                  <SelectItem value="usage_desc">Tiến độ sử dụng (Cao → Thấp)</SelectItem>
                  <SelectItem value="valid_to_asc">Sắp hết hạn</SelectItem>
                  <SelectItem value="valid_from_desc">Mới bắt đầu</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(currentFilters.status || currentFilters.sort !== 'created_desc') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleFilterChange('search', undefined);
                    handleFilterChange('status', undefined);
                    handleFilterChange('sort', undefined);
                  }}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(currentFilters.search || currentFilters.status || currentFilters.sort !== 'created_desc') && (
              <div className="flex flex-wrap gap-2 items-center text-sm">
                <span className="text-slate-600">Đang lọc:</span>
                {currentFilters.search && (
                  <Badge variant="secondary" className="gap-1">
                    Tìm kiếm: "{currentFilters.search}"
                  </Badge>
                )}
                {currentFilters.status && (
                  <Badge variant="secondary" className="gap-1">
                    Trạng thái: {
                      currentFilters.status === 'active' ? 'Đang hoạt động' :
                        currentFilters.status === 'inactive' ? 'Tạm dừng' :
                          currentFilters.status === 'expired' ? 'Hết hạn' :
                            currentFilters.status === 'upcoming' ? 'Chưa bắt đầu' :
                              currentFilters.status === 'exhausted' ? 'Hết lượt' : ''
                    }
                  </Badge>
                )}
                {currentFilters.sort && currentFilters.sort !== 'created_desc' && (
                  <Badge variant="secondary" className="gap-1">
                    Sắp xếp: {
                      currentFilters.sort === 'created_asc' ? 'Cũ nhất' :
                        currentFilters.sort === 'code_asc' ? 'Mã A-Z' :
                          currentFilters.sort === 'code_desc' ? 'Mã Z-A' :
                            currentFilters.sort === 'value_desc' ? 'Giá trị cao' :
                              currentFilters.sort === 'value_asc' ? 'Giá trị thấp' :
                                currentFilters.sort === 'usage_desc' ? 'Tiến độ cao' :
                                  currentFilters.sort === 'valid_to_asc' ? 'Sắp hết hạn' :
                                    currentFilters.sort === 'valid_from_desc' ? 'Mới bắt đầu' : ''
                    }
                  </Badge>
                )}
              </div>
            )}

            {/* Vouchers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {vouchers.data.map((voucher) => (
                <Card key={voucher.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-1 bg-slate-100 rounded-md font-mono font-bold text-sm">
                              {voucher.code}
                            </code>
                            <button
                              onClick={() => handleCopyCode(voucher.code)}
                              className="p-1 hover:bg-slate-100 rounded"
                              title="Copy mã voucher"
                            >
                              <Copy className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                          {getStatusBadge(voucher)}
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {voucher.name}
                        </h3>

                        <p className="text-slate-600 mb-4 line-clamp-2">
                          {voucher.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span>
                              <span className="font-medium">Giảm:</span> {formatVND(voucher.value)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>
                              <span className="font-medium">Đã dùng:</span> {voucher.used_count}
                              {voucher.usage_limit && ` / ${voucher.usage_limit}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span>
                              <span className="font-medium">Hết hạn:</span> {formatDate(voucher.valid_to)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span>
                              <span className="font-medium">Tối thiểu:</span> {
                                voucher.minimum_amount ? formatVND(voucher.minimum_amount) : 'Không'
                              }
                            </span>
                          </div>
                        </div>

                        {voucher.usage_limit && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-slate-600 mb-1">
                              <span>Tiến độ sử dụng</span>
                              <span>{getUsagePercentage(voucher).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(getUsagePercentage(voucher), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {isVoucherEditable(voucher) ? (
                          <Link href={`/admin/vouchers/${voucher.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            title="Không thể chỉnh sửa voucher đã được sử dụng hoặc đã hết hạn"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVoucher(voucher.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {vouchers.data.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    {currentFilters.search ? 'Không tìm thấy voucher' : 'Chưa có voucher nào'}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {currentFilters.search
                      ? `Không tìm thấy voucher nào với từ khóa "${currentFilters.search}"`
                      : 'Tạo voucher đầu tiên để bắt đầu thu hút khách hàng'
                    }
                  </p>
                  {!currentFilters.search && (
                    <Link href="/admin/vouchers/create">
                      <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo voucher đầu tiên
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {vouchers.last_page > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Hiển thị {vouchers.data.length > 0 ? ((vouchers.current_page - 1) * vouchers.per_page + 1) : 0} - {Math.min(vouchers.current_page * vouchers.per_page, vouchers.total)} trong tổng số {vouchers.total} voucher
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.get('/admin/vouchers', {
                      ...filters,
                      page: vouchers.current_page - 1
                    }, {
                      preserveState: true,
                      preserveScroll: true,
                    })}
                    disabled={vouchers.current_page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Trước
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: vouchers.last_page }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first page, last page, current page, and pages around current
                        return page === 1 ||
                          page === vouchers.last_page ||
                          (page >= vouchers.current_page - 1 && page <= vouchers.current_page + 1);
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;

                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showEllipsisBefore && (
                              <span className="px-2 text-slate-400">...</span>
                            )}
                            <Button
                              variant={page === vouchers.current_page ? "default" : "outline"}
                              size="sm"
                              onClick={() => router.get('/admin/vouchers', {
                                ...filters,
                                page
                              }, {
                                preserveState: true,
                                preserveScroll: true,
                              })}
                              className={page === vouchers.current_page ? "bg-amber-500 hover:bg-amber-600" : ""}
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.get('/admin/vouchers', {
                      ...filters,
                      page: vouchers.current_page + 1
                    }, {
                      preserveState: true,
                      preserveScroll: true,
                    })}
                    disabled={vouchers.current_page === vouchers.last_page}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

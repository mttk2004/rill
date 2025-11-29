import { AdminNavigation } from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, LayoutGrid, CheckCircle, Clock, XCircle } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AdminStatsCards, StatCardData } from "@/components/admin/common/admin-stats-cards";
import { AdminTable, Column } from "@/components/admin/common/admin-table";
import type { Paginator } from "@/types";
import { useQueryFilters } from "@/hooks/use-query-filters";
import { useToastRouter } from "@/hooks/use-toast-router";

interface Collection {
  id: number;
  name: string;
  slug: string;
  type: 'featured' | 'banner' | 'promotion' | 'curated';
  description: string | null;
  is_active: boolean;
  started_at: string | null;
  ended_at: string | null;
  display_order: number;
  products_count: number;
  created_at: string;
  updated_at: string;
}

interface CollectionsPageProps {
  collections: Paginator<Collection>;
  stats: {
    total: number;
    active: number;
    featured: number;
    expired: number;
  };
  filters?: Record<string, unknown>;
}

const getTypeLabel = (type: string) => {
  const labels = {
    featured: 'Nổi bật',
    banner: 'Banner',
    promotion: 'Khuyến mãi',
    curated: 'Tuyển chọn',
  };
  return labels[type as keyof typeof labels] || type;
};

const getTypeBadge = (type: string) => {
  const config = {
    featured: 'bg-amber-100 text-amber-700 border-amber-300',
    banner: 'bg-blue-100 text-blue-700 border-blue-300',
    promotion: 'bg-green-100 text-green-700 border-green-300',
    curated: 'bg-purple-100 text-purple-700 border-purple-300',
  };
  return (
    <Badge className={config[type as keyof typeof config] || 'bg-gray-100 text-gray-700'}>
      {getTypeLabel(type)}
    </Badge>
  );
};

const getStatusBadge = (collection: Collection) => {
  const now = new Date();
  const startedAt = collection.started_at ? new Date(collection.started_at) : null;
  const endedAt = collection.ended_at ? new Date(collection.ended_at) : null;

  if (!collection.is_active) {
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">
        <XCircle className="h-3 w-3 mr-1" />
        Không hoạt động
      </Badge>
    );
  }

  if (endedAt && endedAt < now) {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-300">
        <XCircle className="h-3 w-3 mr-1" />
        Đã hết hạn
      </Badge>
    );
  }

  if (startedAt && startedAt > now) {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-300">
        <Clock className="h-3 w-3 mr-1" />
        Chưa bắt đầu
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-100 text-green-700 border-green-300">
      <CheckCircle className="h-3 w-3 mr-1" />
      Đang hoạt động
    </Badge>
  );
};

export default function CollectionsIndex({ collections, stats, filters }: CollectionsPageProps) {
  const { delete: destroy } = useToastRouter();
  const { filters: currentFilters, handleFilterChange } = useQueryFilters({
    initialFilters: {
      search: (filters?.search as string) || '',
      type: (filters?.type as string) || 'all',
      status: (filters?.status as string) || 'all',
      sort: (filters?.sort as string) || 'display_order',
    },
    routeOrPath: '/admin/collections',
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa collection "${name}"?`)) {
      destroy(`/admin/collections/${id}`, {
        success: 'Collection đã được xóa thành công',
        error: 'Không thể xóa collection'
      });
    }
  };

  // Stats cards
  const statsCards: StatCardData[] = [
    {
      title: 'Tổng collections',
      value: stats.total,
      icon: LayoutGrid,
      gradient: 'from-slate-500 to-slate-600',
    },
    {
      title: 'Đang hoạt động',
      value: stats.active,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Nổi bật',
      value: stats.featured,
      icon: LayoutGrid,
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Đã hết hạn',
      value: stats.expired,
      icon: Clock,
      gradient: 'from-red-500 to-red-600',
    },
  ];

  // Table columns
  const columns: Column<Collection>[] = [
    {
      header: 'Collection',
      render: (collection) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {collection.name}
          </div>
          <div className="text-sm text-muted-foreground">
            {collection.slug}
          </div>
        </div>
      ),
    },
    {
      header: 'Loại',
      render: (collection) => getTypeBadge(collection.type),
    },
    {
      header: 'Sản phẩm',
      render: (collection) => (
        <span className="font-medium">{collection.products_count}</span>
      ),
    },
    {
      header: 'Trạng thái',
      render: (collection) => getStatusBadge(collection),
    },
    {
      header: 'Thứ tự',
      render: (collection) => (
        <span className="text-muted-foreground">{collection.display_order}</span>
      ),
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (collection) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={route('admin.collections.show', collection.id)}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={route('admin.collections.edit', collection.id)}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(collection.id, collection.name)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head title="Quản lý Collections - Admin" />
      <AdminNavigation />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto py-6 px-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Quản lý Collections</h1>
                <p className="text-muted-foreground mt-2">
                  Quản lý các bộ sưu tập sản phẩm nổi bật
                </p>
              </div>
              <Link href={route('admin.collections.create')}>
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Collection
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <AdminStatsCards stats={statsCards} cols={{ default: 2, md: 4 }} />

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Tìm kiếm collection..."
                  value={currentFilters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                />

                {/* Type Filter */}
                <select
                  value={currentFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="featured">Nổi bật</option>
                  <option value="banner">Banner</option>
                  <option value="promotion">Khuyến mãi</option>
                  <option value="curated">Tuyển chọn</option>
                </select>

                {/* Status Filter */}
                <select
                  value={currentFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>

                {/* Sort */}
                <select
                  value={currentFilters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="display_order">Thứ tự hiển thị</option>
                  <option value="name_asc">Tên A-Z</option>
                  <option value="name_desc">Tên Z-A</option>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>

            {/* Collections Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
              <AdminTable
                data={collections.data}
                columns={columns}
                loading={false}
                emptyMessage="Không tìm thấy collection nào"
                getRowKey={(collection) => collection.id.toString()}
              />

              {/* Pagination */}
              {collections.last_page > 1 && (
                <div className="p-4 border-t flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {collections.from} đến {collections.to} trong tổng số {collections.total} collections
                  </div>
                  <div className="flex gap-2">
                    {collections.links.map((link, idx) => {
                      if (!link.url) return null;
                      return (
                        <Link
                          key={idx}
                          href={link.url}
                          className={`px-3 py-1 rounded-md ${link.active
                            ? 'bg-amber-500 text-white'
                            : 'bg-white/80 dark:bg-slate-800/80 hover:bg-amber-100'
                            }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

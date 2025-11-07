import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AdminNavigation } from '@/components/admin-navigation';
import {
  AdminTable,
  AdminFilters,
  AdminStatsCards,
  AdminPagination,
  type AdminTableColumn,
  type FilterField,
  type StatCardData,
} from '@/components/admin/common';
import {
  type AdminArtist,
  getArtistStatusBadge,
  formatDate,
  truncateBio,
} from '@/lib/artist-helpers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Music2,
  Users,
  Globe,
  Eye,
  RotateCcw,
  Trash2,
  Package,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ArtistsPageProps {
  artists: {
    data: AdminArtist[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  filters: {
    search: string;
    country: string;
    status: string;
    sort: string;
  };
  stats: {
    total: number;
    with_products: number;
    without_products: number;
    total_products: number;
  };
  countries: string[];
}

export default function Artists({
  artists,
  filters,
  stats,
  countries,
}: ArtistsPageProps) {
  const [currentFilters, setCurrentFilters] = useState(filters);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats cards configuration
  const statsCards: StatCardData[] = [
    {
      title: 'Tổng nghệ sĩ',
      value: stats.total.toLocaleString(),
      subtitle: 'Tất cả nghệ sĩ',
      icon: Music2,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Có sản phẩm',
      value: stats.with_products.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.with_products / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: Package,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Chưa có sản phẩm',
      value: stats.without_products.toLocaleString(),
      subtitle: `${stats.total > 0 ? ((stats.without_products / stats.total) * 100).toFixed(1) : 0}% tổng số`,
      icon: Users,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Tổng sản phẩm',
      value: stats.total_products.toLocaleString(),
      subtitle: 'Tất cả sản phẩm',
      icon: Globe,
      gradient: 'from-blue-500 to-cyan-500',
    },
  ];

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      name: 'search',
      label: 'Tìm kiếm',
      type: 'search',
      value: currentFilters.search,
      onChange: (value) => handleFilterChange('search', value),
      placeholder: 'Tìm theo tên nghệ sĩ, mô tả, quốc gia...',
      className: 'md:col-span-2',
    },
    {
      name: 'country',
      label: 'Quốc gia',
      type: 'select',
      value: currentFilters.country || 'all',
      onChange: (value) => handleFilterChange('country', value),
      options: [
        { label: 'Tất cả quốc gia', value: 'all' },
        ...countries.map((country) => ({ label: country, value: country })),
      ],
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      value: currentFilters.status || 'all',
      onChange: (value) => handleFilterChange('status', value),
      options: [
        { label: 'Tất cả trạng thái', value: 'all' },
        { label: 'Hoạt động', value: 'active' },
        { label: 'Không hoạt động', value: 'inactive' },
        { label: 'Đã xóa', value: 'deleted' },
      ],
    },
    {
      name: 'sort',
      label: 'Sắp xếp',
      type: 'select',
      value: currentFilters.sort || 'name_asc',
      onChange: (value) => handleFilterChange('sort', value),
      options: [
        { label: 'Tên A-Z', value: 'name_asc' },
        { label: 'Tên Z-A', value: 'name_desc' },
        { label: 'Nhiều sản phẩm nhất', value: 'products_desc' },
        { label: 'Mới nhất', value: 'created_desc' },
        { label: 'Cũ nhất', value: 'created_asc' },
      ],
    },
  ];

  // Table columns configuration
  const columns: AdminTableColumn<AdminArtist>[] = [
    {
      header: 'Nghệ sĩ',
      accessor: 'name',
      render: (artist) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={artist.image_url || undefined} alt={artist.name} />
            <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{artist.name}</div>
            <div className="text-sm text-muted-foreground">
              {truncateBio(artist.description, 50)}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Quốc gia',
      accessor: 'country',
      className: 'text-sm',
    },
    {
      header: 'Sản phẩm',
      accessor: 'products_count',
      className: 'text-center',
      render: (artist) => (
        <div className="text-center">
          <span className="font-medium">{artist.products_count}</span>
        </div>
      ),
    },
    {
      header: 'Trạng thái',
      accessor: 'deleted_at',
      render: (artist) => getArtistStatusBadge(artist.is_active, artist.deleted_at),
    },
    {
      header: 'Ngày tạo',
      accessor: 'created_at',
      render: (artist) => (
        <div className="text-sm">{formatDate(artist.created_at)}</div>
      ),
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      className: 'text-right',
      render: (artist) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.visit(route('admin.artists.show', artist.id))}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Xem
          </Button>
          {artist.deleted_at ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRestore(artist.id)}
              className="gap-2 text-green-600 hover:text-green-700"
            >
              <RotateCcw className="h-4 w-4" />
              Khôi phục
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(artist.id)}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Xóa
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Handlers
  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...currentFilters, [name]: value };

    if (name === 'search') {
      // Debounce search
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      searchTimerRef.current = setTimeout(() => {
        setCurrentFilters(newFilters);
        router.get(route('admin.artists'), newFilters, { preserveState: true });
      }, 500);
    } else {
      setCurrentFilters(newFilters);
      router.get(route('admin.artists'), newFilters, { preserveState: true });
    }
  };

  const handleDelete = async (artistId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nghệ sĩ này?')) return;

    try {
      const response = await axios.delete(route('admin.artists.destroy', artistId));

      if (response.data.success) {
        toast.success(response.data.message || 'Đã xóa nghệ sĩ thành công');
        router.reload();
      }
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error('Không thể xóa nghệ sĩ');
    }
  };

  const handleRestore = async (artistId: number) => {
    try {
      const response = await axios.post(route('admin.artists.restore', artistId));

      if (response.data.success) {
        toast.success(response.data.message || 'Đã khôi phục nghệ sĩ thành công');
        router.reload();
      }
    } catch (error) {
      console.error('Error restoring artist:', error);
      toast.error('Không thể khôi phục nghệ sĩ');
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title="Quản lý nghệ sĩ" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Quản lý nghệ sĩ</h1>
              <p className="text-muted-foreground mt-2">
                Quản lý thông tin nghệ sĩ và sản phẩm của họ
              </p>
            </div>

            <AdminStatsCards stats={statsCards} />

            <AdminFilters fields={filterFields} />

            <Card className="p-6">
              <AdminTable
                data={artists.data}
                columns={columns}
                emptyMessage="Không tìm thấy nghệ sĩ nào"
                getRowKey={(artist) => artist.id.toString()}
              />

              <div className="mt-6">
                <AdminPagination
                  pagination={{
                    current_page: artists.current_page,
                    last_page: artists.last_page,
                    from: artists.from,
                    to: artists.to,
                    total: artists.total,
                    links: artists.links,
                  }}
                  itemName="nghệ sĩ"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

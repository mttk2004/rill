import { AdminFilters, FilterField } from "@/components/admin/common/admin-filters";

interface ProductFiltersProps {
  filters: {
    search: string;
    status: string;
    genre: string;
    stock: string;
    sort: string;
  };
  genres: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onStockChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export const ProductFilters = ({
  filters,
  genres,
  onSearchChange,
  onStatusChange,
  onGenreChange,
  onStockChange,
  onSortChange,
}: ProductFiltersProps) => {
  const filterFields: FilterField[] = [
    {
      name: 'search',
      label: 'Tìm kiếm',
      type: 'search',
      placeholder: 'Tên, SKU, nghệ sĩ, thể loại...',
      value: filters.search,
      onChange: onSearchChange,
      className: 'lg:col-span-2',
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      value: filters.status,
      onChange: onStatusChange,
      options: [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Đang bán' },
        { value: 'inactive', label: 'Ngừng bán' },
        { value: 'out_of_stock', label: 'Hết hàng' },
      ],
    },
    {
      name: 'genre',
      label: 'Thể loại',
      type: 'select',
      value: filters.genre,
      onChange: onGenreChange,
      options: [
        { value: 'all', label: 'Tất cả thể loại' },
        ...genres.map(genre => ({ value: genre, label: genre })),
      ],
    },
    {
      name: 'stock',
      label: 'Tồn kho',
      type: 'select',
      value: filters.stock,
      onChange: onStockChange,
      options: [
        { value: 'all', label: 'Tất cả' },
        { value: 'in_stock', label: 'Còn hàng' },
        { value: 'low_stock', label: 'Sắp hết' },
        { value: 'out_of_stock', label: 'Hết hàng' },
      ],
    },
    {
      name: 'sort',
      label: 'Sắp xếp',
      type: 'select',
      value: filters.sort,
      onChange: onSortChange,
      options: [
        { value: 'name_asc', label: 'Tên A-Z' },
        { value: 'name_desc', label: 'Tên Z-A' },
        { value: 'price_asc', label: 'Giá thấp đến cao' },
        { value: 'price_desc', label: 'Giá cao đến thấp' },
        { value: 'stock_asc', label: 'Tồn kho tăng dần' },
        { value: 'stock_desc', label: 'Tồn kho giảm dần' },
        { value: 'sold_desc', label: 'Bán chạy nhất' },
        { value: 'created_desc', label: 'Mới nhất' },
      ],
    },
  ];

  return <AdminFilters fields={filterFields} />;
};

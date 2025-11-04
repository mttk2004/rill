import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

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
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm sản phẩm, SKU, nghệ sĩ..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div>
          <Select value={filters.status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang bán</SelectItem>
              <SelectItem value="inactive">Ngừng bán</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={filters.genre} onValueChange={onGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder="Thể loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thể loại</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={filters.stock} onValueChange={onStockChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tồn kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="in_stock">Còn hàng</SelectItem>
              <SelectItem value="low_stock">Sắp hết</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={filters.sort} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Tên A-Z</SelectItem>
              <SelectItem value="name_desc">Tên Z-A</SelectItem>
              <SelectItem value="price_asc">Giá thấp đến cao</SelectItem>
              <SelectItem value="price_desc">Giá cao đến thấp</SelectItem>
              <SelectItem value="stock_asc">Tồn kho tăng dần</SelectItem>
              <SelectItem value="stock_desc">Tồn kho giảm dần</SelectItem>
              <SelectItem value="sold_desc">Bán chạy nhất</SelectItem>
              <SelectItem value="created_desc">Mới nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

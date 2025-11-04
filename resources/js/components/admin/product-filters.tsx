import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tìm kiếm
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Tên, SKU, nghệ sĩ, thể loại..."
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Trạng thái
            </Label>
            <Select value={filters.status} onValueChange={onStatusChange}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang bán</SelectItem>
                <SelectItem value="inactive">Ngừng bán</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Thể loại
            </Label>
            <Select value={filters.genre} onValueChange={onGenreChange}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Chọn thể loại" />
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

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tồn kho
            </Label>
            <Select value={filters.stock} onValueChange={onStockChange}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Chọn tồn kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="in_stock">Còn hàng</SelectItem>
                <SelectItem value="low_stock">Sắp hết</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Sắp xếp
            </Label>
            <Select value={filters.sort} onValueChange={onSortChange}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Chọn sắp xếp" />
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
      </CardContent>
    </Card>
  );
};

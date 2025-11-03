import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
}

interface ProductsFiltersProps {
  currentGenre?: string;
  currentLabel?: string;
  currentSort?: string;
  genres: string[];
  labels: string[];
  sortOptions: SortOption[];
  viewMode: 'grid' | 'list';
  onFilterChange: (key: string, value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ProductsFilters({
  currentGenre = 'all',
  currentLabel = 'all',
  currentSort = 'featured',
  genres,
  labels,
  sortOptions,
  viewMode,
  onFilterChange,
  onViewModeChange,
}: ProductsFiltersProps) {
  return (
    <div className="hidden md:flex items-center gap-4">
      <Select value={currentGenre} onValueChange={(value) => onFilterChange('genre', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Thể loại" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre === "Tất cả" ? "all" : genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentLabel} onValueChange={(value) => onFilterChange('label', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Hãng đĩa" />
        </SelectTrigger>
        <SelectContent>
          {labels.map((label) => (
            <SelectItem key={label} value={label === "Tất cả" ? "all" : label}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentSort} onValueChange={(value) => onFilterChange('sort', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 ml-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

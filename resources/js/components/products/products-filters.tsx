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
  currentArtist?: string;
  currentSort?: string;
  genres: string[];
  labels: string[];
  artists: string[];
  sortOptions: SortOption[];
  viewMode: 'grid' | 'list';
  onFilterChange: (key: string, value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ProductsFilters({
  currentGenre = 'all',
  currentLabel = 'all',
  currentArtist = 'all',
  currentSort = 'featured',
  genres,
  labels,
  artists,
  sortOptions,
  viewMode,
  onFilterChange,
  onViewModeChange,
}: ProductsFiltersProps) {
  // Get display values
  const getGenreDisplay = () => {
    if (!currentGenre || currentGenre === 'all') return 'Tất cả';
    return currentGenre;
  };

  const getLabelDisplay = () => {
    if (!currentLabel || currentLabel === 'all') return 'Tất cả';
    return currentLabel;
  };

  const getArtistDisplay = () => {
    if (!currentArtist || currentArtist === 'all') return 'Tất cả';
    return currentArtist;
  };

  const getSortDisplay = () => {
    const option = sortOptions.find(opt => opt.value === currentSort);
    return option?.label || 'Nổi bật';
  };

  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Thể loại
        </label>
        <Select value={currentGenre} onValueChange={(value) => onFilterChange('genre', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {getGenreDisplay()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre === "Tất cả" ? "all" : genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Hãng đĩa
        </label>
        <Select value={currentLabel} onValueChange={(value) => onFilterChange('label', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {getLabelDisplay()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {labels.map((label) => (
              <SelectItem key={label} value={label === "Tất cả" ? "all" : label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Nghệ sĩ
        </label>
        <Select value={currentArtist} onValueChange={(value) => onFilterChange('artist', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {getArtistDisplay()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {artists.map((artist) => (
              <SelectItem key={artist} value={artist === "Tất cả" ? "all" : artist}>
                {artist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Sắp xếp
        </label>
        <Select value={currentSort} onValueChange={(value) => onFilterChange('sort', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {getSortDisplay()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Hiển thị
        </label>
        <div className="flex items-center gap-2">
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
    </div>
  );
}

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
}

interface Collection {
  id: number;
  name: string;
  slug: string;
}

interface ProductsFiltersMobileProps {
  currentGenre?: string;
  currentLabel?: string;
  currentArtist?: string;
  currentCollection?: string;
  currentSort?: string;
  genres: string[];
  labels: string[];
  artists: string[];
  collections: Collection[];
  sortOptions: SortOption[];
  onFilterChange: (key: string, value: string) => void;
}

export function ProductsFiltersMobile({
  currentGenre = 'all',
  currentLabel = 'all',
  currentArtist = 'all',
  currentCollection,
  currentSort = 'newest',
  genres,
  labels,
  artists,
  collections,
  sortOptions,
  onFilterChange,
}: ProductsFiltersMobileProps) {
  // Normalize collection value
  const collectionValue = currentCollection || 'all';

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

  const getCollectionDisplay = () => {
    if (!collectionValue || collectionValue === 'all') return 'Tất cả';
    const collection = collections.find(c => c.slug === collectionValue);
    return collection?.name || 'Tất cả';
  };

  const getSortDisplay = () => {
    const option = sortOptions.find(opt => opt.value === currentSort);
    return option?.label || 'Mới nhất';
  };

  return (
    <div className="md:hidden flex items-center justify-between w-full">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Lọc & Sắp xếp
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Bộ lọc & Sắp xếp</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Thể loại
              </label>
              <Select value={currentGenre} onValueChange={(value) => onFilterChange('genre', value)}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Hãng đĩa
              </label>
              <Select value={currentLabel} onValueChange={(value) => onFilterChange('label', value)}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Nghệ sĩ
              </label>
              <Select value={currentArtist} onValueChange={(value) => onFilterChange('artist', value)}>
                <SelectTrigger>
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

            {collections.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Collection
                </label>
                <Select value={collectionValue} onValueChange={(value) => onFilterChange('collection', value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue>
                      {getCollectionDisplay()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {collections.map((collection) => (
                      <SelectItem key={collection.slug} value={collection.slug}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Sắp xếp theo
              </label>
              <Select value={currentSort} onValueChange={(value) => onFilterChange('sort', value)}>
                <SelectTrigger>
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

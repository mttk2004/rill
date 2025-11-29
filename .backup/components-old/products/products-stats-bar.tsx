import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ProductsStatsBarProps {
  from: number;
  to: number;
  total: number;
  activeFiltersCount: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ProductsStatsBar({
  from,
  to,
  total,
  activeFiltersCount,
  viewMode,
  onViewModeChange,
}: ProductsStatsBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Hiển thị {from}-{to} trong số {total} sản phẩm.
        {activeFiltersCount > 0 && ` (${activeFiltersCount} bộ lọc đang áp dụng)`}
      </p>
      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'outline'}
          size="icon"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'outline'}
          size="icon"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

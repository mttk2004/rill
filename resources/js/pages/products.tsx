import AppLayout from "@/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { ProductsHero } from "@/components/products/products-hero";
import { ProductsSearchBar } from "@/components/products/products-search-bar";
import { ProductsFilters } from "@/components/products/products-filters";
import { ProductsFiltersMobile } from "@/components/products/products-filters-mobile";
import { ProductsStatsBar } from "@/components/products/products-stats-bar";
import { ProductsGrid } from "@/components/products/products-grid";
import { ProductsEmpty } from "@/components/products/products-empty";
import { type ProductsPageData, type Pagination as PaginationType, type ProductFilters } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FormEvent, MouseEvent, useMemo } from 'react';
import * as React from 'react';
import { type SharedData } from '@/types';
import { useQueryFilters } from '@/hooks/use-query-filters';
import { useToastRouter } from '@/hooks/use-toast-router';

interface ProductsProps extends ProductsPageData {
  search?: string;
  genre?: string;
  label?: string;
  artist?: string;
  sort?: string;
  page?: number;
}

export default function Products({ products: productsData, pagination: paginationProp, filters: filtersProp, ...props }: ProductsProps) {
  const { cart } = usePage<SharedData>().props;
  const { post } = useToastRouter();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Normalize data - handle both direct data and wrapped { data: ... }
  const pagination = (paginationProp && typeof paginationProp === 'object' && 'data' in paginationProp ? paginationProp.data : paginationProp) as PaginationType;
  const filters = (filtersProp && typeof filtersProp === 'object' && 'data' in filtersProp ? filtersProp.data : filtersProp) as ProductFilters;

  const { filters: currentFilters, handleFilterChange } = useQueryFilters({
    routeOrPath: '/products',
    initialFilters: {
      search: props.search || '',
      genre: props.genre || '',
      label: props.label || '',
      artist: props.artist || '',
      sort: props.sort || '',
    },
  });

  const cartItemProductIds = useMemo(() => new Set(cart.items.map(item => item.product.id)), [cart.items]);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    post('/cart', { product_id: productId, quantity: 1 }, {
      pending: 'Đang thêm vào giỏ hàng...',
      success: 'Đã thêm sản phẩm vào giỏ hàng! 🎉',
    });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // Search is handled automatically by useQueryFilters debounce
  };

  const genres = filters?.genres ? ["Tất cả", ...filters.genres] : ["Tất cả"];
  const labels = filters?.labels ? ["Tất cả", ...filters.labels] : ["Tất cả"];
  const sortOptions = filters?.sort_options || [
    { value: 'featured', label: 'Nổi bật' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá: Thấp đến cao' },
    { value: 'price_desc', label: 'Giá: Cao đến thấp' },
  ];

  return (
    <AppLayout>
      <Head title="Sản phẩm - Rill" />
      <div className="min-h-screen bg-background">
        <ProductsHero />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <ProductsSearchBar
                    searchTerm={currentFilters.search || ''}
                    onSearchChange={(value) => handleFilterChange('search', value)}
                    onSubmit={handleSearch}
                  />

                  <ProductsFilters
                    currentGenre={props.genre}
                    currentLabel={props.label}
                    currentSort={props.sort}
                    genres={genres}
                    labels={labels}
                    sortOptions={sortOptions}
                    viewMode={viewMode}
                    onFilterChange={handleFilterChange}
                    onViewModeChange={setViewMode}
                  />

                  <ProductsFiltersMobile
                    currentGenre={props.genre}
                    currentLabel={props.label}
                    currentSort={props.sort}
                    genres={genres}
                    labels={labels}
                    sortOptions={sortOptions}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </CardContent>
            </Card>            {pagination && pagination.total > 0 && (
              <ProductsStatsBar
                from={pagination.from || 0}
                to={pagination.to || 0}
                total={pagination.total}
                activeFiltersCount={Object.values(currentFilters).filter(Boolean).length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}

            {productsData.data.length > 0 ? (
              <ProductsGrid
                products={productsData.data}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
                cartItemProductIds={cartItemProductIds}
              />
            ) : (
              <ProductsEmpty />
            )}

            {pagination && pagination.total > pagination.per_page && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  total={pagination.total}
                  from={pagination.from || 0}
                  to={pagination.to || 0}
                  filters={currentFilters}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </AppLayout>
  );
}

import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import ProductCard from '../components/ProductCard';
import { Filter, ArrowUpDown, X, Search, Disc } from 'lucide-react';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import FilterSidebar from '../components/product-list/FilterSidebar';
import ActiveFilters from '../components/product-list/ActiveFilters';
import type { Product, Artist, Collection } from '@/types';

interface ProductListProps {
  products: Product[];
  artists: Artist[];
  availableGenres: string[];
  availableLabels: string[];
  activeCollection?: Collection | null;
  filters: {
    search?: string;
    genre?: string;
    label?: string;
    artist?: string;
    collection?: string;
    sort?: string;
    page?: string;
    min_price?: string;
    max_price?: string;
  };
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export default function ProductList({
  products = [],
  artists = [],
  availableGenres = [],
  availableLabels = [],
  activeCollection = null,
  filters = {},
  pagination
}: ProductListProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Accordion States
  const [openSections, setOpenSections] = useState({
    genre: true,
    artist: true,
    label: false,
    price: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get current filter values from props
  const searchTerm = filters.search || '';
  const selectedGenre = filters.genre || 'all';
  const selectedLabel = filters.label || 'all';
  const selectedArtist = filters.artist || 'all';
  const sortOption = filters.sort || 'default';
  const minPrice = filters.min_price || '';
  const maxPrice = filters.max_price || '';

  // Local state for price inputs
  const [priceRange, setPriceRange] = useState({
    min: minPrice,
    max: maxPrice
  });

  // Extract unique filter options from available data
  const genres = useMemo(() => ['all', ...availableGenres], [availableGenres]);
  const labels = useMemo(() => ['all', ...availableLabels], [availableLabels]);

  // Get artists who actually have products (from props)
  const availableArtists = artists;

  // Helper function to update filters via Inertia
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams();
    const mergedFilters = { ...filters, ...newFilters };

    Object.entries(mergedFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'default') {
        params.set(key, value);
      }
    });

    // Scroll to top if changing page
    const isPageChange = 'page' in newFilters;

    router.visit(`/products${params.toString() ? '?' + params.toString() : ''}`, {
      preserveState: true,
      preserveScroll: !isPageChange,
      onSuccess: () => {
        if (isPageChange) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  };

  const setSelectedGenre = (genre: string) => updateFilters({ genre });
  const setSelectedLabel = (label: string) => updateFilters({ label });
  const setSelectedArtist = (artist: string) => updateFilters({ artist });
  const setSortOption = (sort: string) => updateFilters({ sort });

  const applyPriceFilter = () => {
    const newFilters: Partial<typeof filters> = {};

    if (priceRange.min) {
      const minValue = parseInt(priceRange.min.replace(/\D/g, ''));
      if (!isNaN(minValue) && minValue >= 0) {
        newFilters.min_price = minValue.toString();
      }
    }

    if (priceRange.max) {
      const maxValue = parseInt(priceRange.max.replace(/\D/g, ''));
      if (!isNaN(maxValue) && maxValue >= 0) {
        newFilters.max_price = maxValue.toString();
      }
    }

    updateFilters(newFilters);
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    const clearedFilters: Partial<typeof filters> = { min_price: '', max_price: '' };
    updateFilters(clearedFilters);
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    router.visit('/products', {
      preserveState: false,
    });
  };

  return (
    <AppLayout>
      <Head title={`Sản phẩm${searchTerm ? ` - ${searchTerm}` : ''} - Rill`} />
      <div className="bg-white min-h-screen pt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col mb-8 animate-fade-in-down">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-gray-100">
              <div>
                {searchTerm ? (
                  <h1 className="text-3xl font-serif font-bold text-gray-900">
                    Kết quả tìm kiếm: "{searchTerm}"
                  </h1>
                ) : activeCollection ? (
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-accent/10 rounded-full text-accent">
                      <Disc size={24} />
                    </span>
                    <div>
                      <span className="text-sm text-accent font-bold uppercase tracking-wider">Bộ sưu tập</span>
                      <h1 className="text-3xl font-serif font-bold text-gray-900">{activeCollection.name}</h1>
                    </div>
                  </div>
                ) : (
                  <h1 className="text-3xl font-serif font-bold text-gray-900">Sản phẩm</h1>
                )}
                <p className="text-gray-500 mt-2 text-sm">
                  {pagination.total > 0 ? (
                    <>
                      Hiển thị <span className="font-medium text-gray-700">{pagination.from}-{pagination.to}</span> trong <span className="font-medium text-gray-700">{pagination.total}</span> sản phẩm
                    </>
                  ) : (
                    'Không có sản phẩm'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Filter size={18} /> Bộ lọc
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 group relative">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer min-w-[180px]">
                    <ArrowUpDown size={16} className="text-gray-500" />
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="block w-full appearance-none bg-transparent text-sm focus:outline-none cursor-pointer"
                    >
                      <option value="default">Bán chạy nhất</option>
                      <option value="price_asc">Giá: Thấp đến Cao</option>
                      <option value="price_desc">Giá: Cao đến Thấp</option>
                      <option value="name_asc">Tên: A-Z</option>
                      <option value="name_desc">Tên: Z-A</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            <ActiveFilters
              activeCollection={activeCollection}
              selectedGenre={selectedGenre}
              selectedLabel={selectedLabel}
              selectedArtist={selectedArtist}
              availableArtists={availableArtists}
              setSelectedGenre={setSelectedGenre}
              setSelectedArtist={setSelectedArtist}
              setSelectedLabel={setSelectedLabel}
              clearFilters={clearFilters}
              priceRange={priceRange}
              clearPriceFilter={clearPriceFilter}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 animate-fade-in-up">
              <div className="sticky top-24">
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                  <Filter size={20} /> Bộ lọc
                </h3>
                <FilterSidebar
                  genres={genres}
                  labels={labels}
                  artists={availableArtists}
                  selectedGenre={selectedGenre}
                  selectedLabel={selectedLabel}
                  selectedArtist={selectedArtist}
                  onGenreChange={setSelectedGenre}
                  onLabelChange={setSelectedLabel}
                  onArtistChange={setSelectedArtist}
                  openSections={openSections}
                  toggleSection={toggleSection}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  onApplyPriceFilter={applyPriceFilter}
                  onClearPriceFilter={clearPriceFilter}
                />
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-[60] lg:hidden">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h2 className="font-serif font-bold text-lg text-gray-900">Bộ lọc sản phẩm</h2>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-gray-500 hover:text-gray-900">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <FilterSidebar
                      genres={genres}
                      labels={labels}
                      artists={availableArtists}
                      selectedGenre={selectedGenre}
                      selectedLabel={selectedLabel}
                      selectedArtist={selectedArtist}
                      onGenreChange={setSelectedGenre}
                      onLabelChange={setSelectedLabel}
                      onArtistChange={setSelectedArtist}
                      openSections={openSections}
                      toggleSection={toggleSection}
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      onApplyPriceFilter={applyPriceFilter}
                      onClearPriceFilter={clearPriceFilter}
                    />
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <Button fullWidth onClick={() => setIsMobileFilterOpen(false)}>
                      Xem {products.length} kết quả
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1" key={sortOption + selectedGenre + selectedLabel + selectedArtist + (filters.collection || "")}>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {products.map((product, index) => (
                    <Reveal key={product.id} delay={index * 0.05} threshold={0.05}>
                      <ProductCard
                        product={product}
                      />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <Reveal>
                  <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4 text-gray-400">
                      <Search size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">Rất tiếc, chúng tôi không tìm thấy đĩa than nào phù hợp với bộ lọc của bạn.</p>

                    <Button variant="outline" onClick={clearFilters}>
                      Xóa bộ lọc & Thử lại
                    </Button>
                  </div>
                </Reveal>
              )}

              {/* Pagination */}
              {products.length > 0 && pagination.last_page > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => updateFilters({ ...filters, page: String(pagination.current_page - 1) })}
                      disabled={pagination.current_page === 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.current_page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Trước
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page and adjacent pages
                      const showPage =
                        page === 1 ||
                        page === pagination.last_page ||
                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1);

                      // Show ellipsis
                      const showEllipsisBefore = page === pagination.current_page - 2 && pagination.current_page > 3;
                      const showEllipsisAfter = page === pagination.current_page + 2 && pagination.current_page < pagination.last_page - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => updateFilters({ ...filters, page: String(page) })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.current_page === page
                            ? 'bg-primary text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => updateFilters({ ...filters, page: String(pagination.current_page + 1) })}
                      disabled={pagination.current_page === pagination.last_page}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.current_page === pagination.last_page
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

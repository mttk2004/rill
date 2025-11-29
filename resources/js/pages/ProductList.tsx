import { Head, router } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
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
  };
}

export default function ProductList({
  products = [],
  artists = [],
  availableGenres = [],
  availableLabels = [],
  activeCollection = null,
  filters = {}
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

    router.visit(`/products${params.toString() ? '?' + params.toString() : ''}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const setSelectedGenre = (genre: string) => updateFilters({ genre });
  const setSelectedLabel = (label: string) => updateFilters({ label });
  const setSelectedArtist = (artist: string) => updateFilters({ artist });
  const setSortOption = (sort: string) => updateFilters({ sort });

  const clearFilters = () => {
    router.visit('/products', {
      preserveState: false,
    });
  };

  return (
    <>
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
                <p className="text-gray-500 mt-2 text-sm">{products.length} sản phẩm được tìm thấy</p>
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
                      <option value="default">Đề xuất</option>
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
                        artist={artists.find(a => a.id === product.artist_id)}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

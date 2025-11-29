
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, ARTISTS, COLLECTIONS, COLLECTION_ITEMS } from '../data';
import { Filter, ArrowUpDown, X, Search, Disc } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import FilterSidebar from '../components/product-list/FilterSidebar';
import ActiveFilters from '../components/product-list/ActiveFilters';

const ProductList = () => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedLabel, setSelectedLabel] = useState('all');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [sortOption, setSortOption] = useState('default');
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
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');
  const collectionSlug = searchParams.get('collection');
  
  // Get URL filters
  const urlGenre = searchParams.get('genre');
  const urlLabel = searchParams.get('label');
  const urlArtist = searchParams.get('artist'); // Slug or ID

  // Safety check for data
  const products = PRODUCTS || [];
  const artists = ARTISTS || [];

  // Apply URL params to state when they change
  useEffect(() => {
    if (urlGenre) setSelectedGenre(urlGenre); else setSelectedGenre('all');
    if (urlLabel) setSelectedLabel(urlLabel); else setSelectedLabel('all');

    if (urlArtist) {
      const artistBySlug = artists.find(a => a.slug === urlArtist);
      const artistById = artists.find(a => a.id === urlArtist);
      
      if (artistBySlug) setSelectedArtist(artistBySlug.id);
      else if (artistById) setSelectedArtist(artistById.id);
    } else {
      setSelectedArtist('all');
    }
  }, [urlGenre, urlLabel, urlArtist, artists]);

  // Extract unique filter options
  const genres = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.genre)))], [products]);
  const labels = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.label)))], [products]);
  
  // Get artists who actually have products
  const availableArtists = useMemo(() => {
    const artistIds = new Set(products.map(p => p.artist_id));
    return artists.filter(a => artistIds.has(a.id));
  }, [products, artists]);

  // Resolve Collection Name
  const activeCollection = useMemo(() => {
    if (!collectionSlug) return null;
    return COLLECTIONS.find(c => c.slug === collectionSlug);
  }, [collectionSlug]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (activeCollection) {
        const isInCollection = COLLECTION_ITEMS.some(
          item => item.collection_id === activeCollection.id && item.product_id === p.id
        );
        if (!isInCollection) return false;
      }

      let matchesSearch = true;
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        const artist = artists.find(a => a.id === p.artist_id);
        const nameMatch = p.name.toLowerCase().includes(lowerTerm);
        const artistMatch = artist?.name.toLowerCase().includes(lowerTerm) || false;
        matchesSearch = nameMatch || artistMatch;
      }

      const matchesGenre = selectedGenre === 'all' || p.genre === selectedGenre;
      const matchesLabel = selectedLabel === 'all' || p.label === selectedLabel;
      const matchesArtist = selectedArtist === 'all' || p.artist_id === selectedArtist;

      return matchesSearch && matchesGenre && matchesLabel && matchesArtist;
    });
  }, [products, searchTerm, collectionSlug, activeCollection, selectedGenre, selectedLabel, selectedArtist, artists]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    switch (sortOption) {
      case 'price_asc': return items.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price_desc': return items.sort((a, b) => Number(b.price) - Number(a.price));
      case 'name_asc': return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc': return items.sort((a, b) => b.name.localeCompare(a.name));
      default: return items;
    }
  }, [filteredProducts, sortOption]);

  const clearFilters = () => {
    setSelectedGenre('all');
    setSelectedLabel('all');
    setSelectedArtist('all');
    setSortOption('default');
  };

  return (
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
              <p className="text-gray-500 mt-2 text-sm">{sortedProducts.length} sản phẩm được tìm thấy</p>
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
                    Xem {sortedProducts.length} kết quả
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1" key={sortOption + selectedGenre + selectedLabel + selectedArtist + collectionSlug}>
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {sortedProducts.map((product, index) => (
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
  );
};

export default ProductList;


import React from 'react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import { Artist } from '../../types';

interface FilterSectionProps {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left font-medium text-gray-900 hover:text-primary transition-colors"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="mt-4 animate-in slide-in-from-top-2 duration-200">{children}</div>}
    </div>
  );
};

interface FilterSidebarProps {
  genres: string[];
  labels: string[];
  artists: Artist[];
  selectedGenre: string;
  selectedLabel: string;
  selectedArtist: string;
  onGenreChange: (genre: string) => void;
  onLabelChange: (label: string) => void;
  onArtistChange: (artistId: string) => void;
  openSections: { genre: boolean; artist: boolean; label: boolean; price: boolean };
  toggleSection: (section: 'genre' | 'artist' | 'label' | 'price') => void;
  priceRange: { min: string; max: string };
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  onApplyPriceFilter: () => void;
  onClearPriceFilter: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  genres,
  labels,
  artists,
  selectedGenre,
  selectedLabel,
  selectedArtist,
  onGenreChange,
  onLabelChange,
  onArtistChange,
  openSections,
  toggleSection,
  priceRange,
  onPriceRangeChange,
  onApplyPriceFilter,
  onClearPriceFilter
}) => {
  const formatPrice = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number ? parseInt(number).toLocaleString('vi-VN') : '';
  };

  const handlePriceInput = (field: 'min' | 'max', value: string) => {
    const cleaned = value.replace(/\D/g, '');
    onPriceRangeChange({ ...priceRange, [field]: cleaned });
  };
  return (
    <div className="space-y-1">
      {/* Genre Filter - Visual Chips */}
      <FilterSection
        title="Thể loại"
        isOpen={openSections.genre}
        onToggle={() => toggleSection('genre')}
      >
        <div className="flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedGenre === genre
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {genre === 'all' ? 'Tất cả' : genre}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Artist Filter - Custom List */}
      <FilterSection
        title="Nghệ sĩ"
        isOpen={openSections.artist}
        onToggle={() => toggleSection('artist')}
      >
        <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-2">
          <button
            onClick={() => onArtistChange('all')}
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${selectedArtist === 'all' ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedArtist === 'all' ? 'border-primary' : 'border-gray-300'}`}>
              {selectedArtist === 'all' && <div className="h-2 w-2 rounded-full bg-primary" />}
            </div>
            Tất cả nghệ sĩ
          </button>
          {artists.map(artist => (
            <button
              key={artist.id}
              onClick={() => onArtistChange(artist.name)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${selectedArtist === artist.name ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedArtist === artist.name ? 'border-primary' : 'border-gray-300'}`}>
                {selectedArtist === artist.name && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <span className="truncate">{artist.name}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Label Filter - Custom List */}
      <FilterSection
        title="Hãng đĩa"
        isOpen={openSections.label}
        onToggle={() => toggleSection('label')}
      >
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-2">
          <button
            onClick={() => onLabelChange('all')}
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${selectedLabel === 'all' ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <div className={`flex h-4 w-4 items-center justify-center rounded border ${selectedLabel === 'all' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
              {selectedLabel === 'all' && <Check size={10} />}
            </div>
            Tất cả hãng đĩa
          </button>
          {labels.map(label => (
            label !== 'all' && (
              <button
                key={label}
                onClick={() => onLabelChange(label)}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${selectedLabel === label ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <div className={`flex h-4 w-4 items-center justify-center rounded border ${selectedLabel === label ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                  {selectedLabel === label && <Check size={10} />}
                </div>
                <span className="truncate">{label}</span>
              </button>
            )
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection
        title="Khoảng giá"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="px-1 space-y-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Từ</label>
              <input
                type="text"
                placeholder="0"
                value={formatPrice(priceRange.min)}
                onChange={(e) => handlePriceInput('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
            <span className="text-gray-400 mt-5">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Đến</label>
              <input
                type="text"
                placeholder="5.000.000"
                value={formatPrice(priceRange.max)}
                onChange={(e) => handlePriceInput('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onApplyPriceFilter}
              className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Áp dụng
            </button>
            {(priceRange.min || priceRange.max) && (
              <button
                onClick={onClearPriceFilter}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="text-xs text-gray-400 text-center">
            Nhập giá theo đơn vị VNĐ
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;


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
  toggleSection
}) => {
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedGenre === genre
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
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${
              selectedArtist === 'all' ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
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
              onClick={() => onArtistChange(artist.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                selectedArtist === artist.id ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedArtist === artist.id ? 'border-primary' : 'border-gray-300'}`}>
                {selectedArtist === artist.id && <div className="h-2 w-2 rounded-full bg-primary" />}
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
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${
              selectedLabel === 'all' ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
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
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  selectedLabel === label ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
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

      {/* Price Range (Visual only) */}
      <FilterSection
        title="Khoảng giá"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="px-1">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>0đ</span>
            <span>5.000.000đ+</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-300 w-full rounded-full"></div>
          </div>
          <div className="flex gap-2 mt-4">
            <input type="text" placeholder="Thấp nhất" className="w-1/2 p-2 border border-gray-200 rounded text-sm text-center" readOnly />
            <input type="text" placeholder="Cao nhất" className="w-1/2 p-2 border border-gray-200 rounded text-sm text-center" readOnly />
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;

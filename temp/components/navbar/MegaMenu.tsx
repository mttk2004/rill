
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Music, Tag, Mic2 } from 'lucide-react';
import { PRODUCTS, ARTISTS } from '../../data';

interface MegaMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, closeMenu }) => {
  const [activeCategory, setActiveCategory] = useState<'genre' | 'label' | 'artist'>('genre');

  // Data Extraction
  const uniqueGenres = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.genre))).sort(), []);
  const uniqueLabels = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.label))).sort(), []);
  const featuredArtists = useMemo(() => ARTISTS.slice(0, 12), []);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full -left-16 lg:-left-48 w-[800px] max-w-[calc(100vw-2rem)] bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 grid grid-cols-12 z-50">
      {/* Left Sidebar: Categories */}
      <div className="col-span-4 bg-gray-50 py-4 border-r border-gray-100">
        <div className="flex flex-col">
          <button
            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${
              activeCategory === 'genre'
                ? 'bg-white text-primary border-l-4 border-primary shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
            }`}
            onMouseEnter={() => setActiveCategory('genre')}
          >
            <span className="flex items-center gap-3"><Music size={16} /> Thể loại</span>
            {activeCategory === 'genre' && <ChevronRight size={14} />}
          </button>
          <button
            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${
              activeCategory === 'label'
                ? 'bg-white text-primary border-l-4 border-primary shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
            }`}
            onMouseEnter={() => setActiveCategory('label')}
          >
            <span className="flex items-center gap-3"><Tag size={16} /> Hãng đĩa</span>
            {activeCategory === 'label' && <ChevronRight size={14} />}
          </button>
          <button
            className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${
              activeCategory === 'artist'
                ? 'bg-white text-primary border-l-4 border-primary shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
            }`}
            onMouseEnter={() => setActiveCategory('artist')}
          >
            <span className="flex items-center gap-3"><Mic2 size={16} /> Nghệ sĩ</span>
            {activeCategory === 'artist' && <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      {/* Right Content: Items */}
      <div className="col-span-8 p-6 min-h-[320px] bg-white">
        <div className="mb-5 border-b border-gray-100 pb-3 flex justify-between items-end">
          <h3 className="font-serif font-bold text-lg text-gray-900">
            {activeCategory === 'genre' && 'Khám phá theo Thể loại'}
            {activeCategory === 'label' && 'Hãng đĩa nổi bật'}
            {activeCategory === 'artist' && 'Nghệ sĩ hàng đầu'}
          </h3>
          <Link to="/products" onClick={closeMenu} className="text-xs font-medium text-primary hover:underline flex items-center">
            Xem tất cả <ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {activeCategory === 'genre' && uniqueGenres.map(genre => (
            <Link
              key={genre}
              to={`/products?genre=${encodeURIComponent(genre)}`}
              className="text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all py-1 flex items-center gap-2"
              onClick={closeMenu}
            >
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              {genre}
            </Link>
          ))}

          {activeCategory === 'label' && uniqueLabels.map(label => (
            <Link
              key={label}
              to={`/products?label=${encodeURIComponent(label)}`}
              className="text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all py-1 flex items-center gap-2"
              onClick={closeMenu}
            >
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              {label}
            </Link>
          ))}

          {activeCategory === 'artist' && featuredArtists.map(artist => (
            <Link
              key={artist.id}
              to={`/products?artist=${artist.slug}`}
              className="text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all py-1 flex items-center gap-2"
              onClick={closeMenu}
            >
              {artist.image ? (
                <img src={artist.image} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-100" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">
                  {artist.name.charAt(0)}
                </div>
              )}
              <span className="truncate">{artist.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;

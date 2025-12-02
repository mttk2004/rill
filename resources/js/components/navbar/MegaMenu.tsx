
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Music, Tag, Mic2 } from 'lucide-react';
import type { Artist } from '@/types';

interface MegaMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, closeMenu }) => {
  const [activeCategory, setActiveCategory] = useState<'genre' | 'label' | 'artist'>('genre');

  const { props } = usePage<{
    menuData: {
      genres: string[];
      labels: string[];
      artists: Artist[];
    };
  }>();

  const { genres = [], labels = [], artists = [] } = props.menuData || {};

  if (!isOpen) return null;

  return (
    <div className="absolute top-full -left-16 lg:-left-48 w-[900px] max-w-[calc(100vw-2rem)] bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 grid grid-cols-12 z-50">
      {/* Left Sidebar: Categories */}
      <div className="col-span-3 bg-gray-50 py-4 border-r border-gray-100">
        <div className="flex flex-col">
          <button
            className={`flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${activeCategory === 'genre'
              ? 'bg-white text-primary border-l-4 border-primary shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
              }`}
            onMouseEnter={() => setActiveCategory('genre')}
          >
            <span className="flex items-center gap-2.5"><Music size={16} /> Thể loại</span>
            {activeCategory === 'genre' && <ChevronRight size={14} />}
          </button>
          <button
            className={`flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${activeCategory === 'label'
              ? 'bg-white text-primary border-l-4 border-primary shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
              }`}
            onMouseEnter={() => setActiveCategory('label')}
          >
            <span className="flex items-center gap-2.5"><Tag size={16} /> Hãng đĩa</span>
            {activeCategory === 'label' && <ChevronRight size={14} />}
          </button>
          <button
            className={`flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${activeCategory === 'artist'
              ? 'bg-white text-primary border-l-4 border-primary shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
              }`}
            onMouseEnter={() => setActiveCategory('artist')}
          >
            <span className="flex items-center gap-2.5"><Mic2 size={16} /> Nghệ sĩ</span>
            {activeCategory === 'artist' && <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      {/* Right Content: Items */}
      <div className="col-span-9 bg-white">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-end">
            <h3 className="font-serif font-bold text-lg text-gray-900">
              {activeCategory === 'genre' && 'Khám phá theo Thể loại'}
              {activeCategory === 'label' && 'Hãng đĩa nổi bật'}
              {activeCategory === 'artist' && 'Nghệ sĩ hàng đầu'}
            </h3>
            <Link href="/products" onClick={closeMenu} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="px-6 py-5 max-h-[420px] overflow-y-auto">
          <div className="grid grid-cols-3 gap-x-5 gap-y-2.5">
            {activeCategory === 'genre' && genres.map(genre => (
              <Link
                key={genre}
                href={`/products?genre=${encodeURIComponent(genre)}`}
                className="text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md px-3 py-2 transition-all flex items-center gap-2.5 group"
                onClick={closeMenu}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors"></span>
                <span className="truncate">{genre}</span>
              </Link>
            ))}

            {activeCategory === 'label' && labels.map(label => (
              <Link
                key={label}
                href={`/products?label=${encodeURIComponent(label)}`}
                className="text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md px-3 py-2 transition-all flex items-center gap-2.5 group"
                onClick={closeMenu}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors"></span>
                <span className="truncate">{label}</span>
              </Link>
            ))}

            {activeCategory === 'artist' && artists.map(artist => (
              <Link
                key={artist.id}
                href={`/products?artist=${artist.slug}`}
                className="text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md px-3 py-2 transition-all flex items-center gap-2.5 group"
                onClick={closeMenu}
              >
                {artist.image_url ? (
                  <img src={artist.image_url} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {artist.name.charAt(0)}
                  </div>
                )}
                <span className="truncate">{artist.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;

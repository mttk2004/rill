
import React from 'react';
import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { Artist, Collection } from '../../types';

interface ActiveFiltersProps {
  activeCollection: Collection | undefined | null;
  selectedGenre: string;
  selectedLabel: string;
  selectedArtist: string;
  availableArtists: Artist[];
  setSelectedGenre: (val: string) => void;
  setSelectedArtist: (val: string) => void;
  setSelectedLabel: (val: string) => void;
  clearFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  activeCollection,
  selectedGenre,
  selectedLabel,
  selectedArtist,
  availableArtists,
  setSelectedGenre,
  setSelectedArtist,
  setSelectedLabel,
  clearFilters
}) => {
  const hasActiveFilters = selectedGenre !== 'all' || selectedLabel !== 'all' || selectedArtist !== 'all' || activeCollection;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-1">
      <span className="text-sm text-gray-500 mr-2">Đang lọc theo:</span>
      {activeCollection && (
        <Link
          to="/products"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-xs font-medium text-accent hover:bg-accent/20"
        >
          Bộ sưu tập: {activeCollection.name} <X size={12} />
        </Link>
      )}
      {selectedGenre !== 'all' && (
        <button
          onClick={() => setSelectedGenre('all')}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          Thể loại: {selectedGenre} <X size={12} />
        </button>
      )}
      {selectedArtist !== 'all' && (
        <button
          onClick={() => setSelectedArtist('all')}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          Nghệ sĩ: {selectedArtist} <X size={12} />
        </button>
      )}
      {selectedLabel !== 'all' && (
        <button
          onClick={() => setSelectedLabel('all')}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          Hãng: {selectedLabel} <X size={12} />
        </button>
      )}
      <button
        onClick={clearFilters}
        className="text-xs text-red-500 hover:text-red-700 font-medium ml-2 underline"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};

export default ActiveFilters;

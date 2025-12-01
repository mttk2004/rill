
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  onSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex h-16 items-center bg-white px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      <form onSubmit={onSearch} className="flex w-full items-center gap-4">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm nghệ sĩ, album, đĩa than..."
          className="flex-1 border-none bg-transparent text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
          autoFocus
        />
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchOverlay;

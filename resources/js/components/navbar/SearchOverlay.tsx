
import React, { useState, useEffect } from 'react';
import { Search, X, Clock, Disc, User as UserIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  price?: number;
  artists?: string;
  type: 'product' | 'artist';
}

const SEARCH_HISTORY_KEY = 'rill_search_history';
const MAX_HISTORY_ITEMS = 5;

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  onSearch,
}) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState<{ products: SearchSuggestion[]; artists: SearchSuggestion[] }>({
    products: [],
    artists: []
  });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Load search history on mount
  useEffect(() => {
    if (isOpen) {
      try {
        const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
        setSearchHistory(history);
        setShowHistory(true);
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, [isOpen]);

  // Fetch search suggestions with debounce
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsLoadingSuggestions(true);
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        } finally {
          setIsLoadingSuggestions(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions({ products: [], artists: [] });
    }
  }, [searchQuery]);

  const handleHistoryClick = (term: string) => {
    setSearchQuery(term);
    setShowHistory(false);
  };

  const clearHistory = () => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setSearchHistory([]);
  };

  if (!isOpen) return null;

  const showHistoryDropdown = showHistory && searchHistory.length > 0 && !searchQuery;
  const showSuggestionsDropdown = searchQuery.length >= 2 && (suggestions.products.length > 0 || suggestions.artists.length > 0);

  return (
    <div className="absolute inset-0 z-[60] flex h-16 items-center bg-white px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      <form onSubmit={onSearch} className="flex w-full items-center gap-4 relative">
        <Search className="text-gray-400" size={20} />
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowHistory(e.target.value === '');
            }}
            onFocus={() => setShowHistory(!searchQuery)}
            placeholder="Tìm kiếm nghệ sĩ, album, đĩa than..."
            className="w-full border-none bg-transparent text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            autoFocus
          />

          {/* Search History Dropdown */}
          {showHistoryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500 uppercase">Tìm kiếm gần đây</span>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Xóa
                </button>
              </div>
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleHistoryClick(term)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                >
                  <Clock size={16} className="text-gray-400 group-hover:text-gray-600" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions Dropdown */}
          {showSuggestionsDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-w-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Products */}
              {suggestions.products.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                      <Disc size={14} /> Sản phẩm
                    </span>
                  </div>
                  {suggestions.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        onClose();
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="h-12 w-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary truncate">
                          {product.name}
                        </p>
                        {product.artists && (
                          <p className="text-xs text-gray-500 truncate">{product.artists}</p>
                        )}
                      </div>
                      {product.price && (
                        <p className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* Artists */}
              {suggestions.artists.length > 0 && (
                <div>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                      <UserIcon size={14} /> Nghệ sĩ
                    </span>
                  </div>
                  {suggestions.artists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/products?artist=${encodeURIComponent(artist.name)}`}
                      onClick={() => {
                        onClose();
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
                        {artist.image_url && (
                          <img src={artist.image_url} alt={artist.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary">
                        {artist.name}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {isLoadingSuggestions && (
                <div className="px-4 py-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                  <p className="text-sm text-gray-500 mt-2">Đang tìm kiếm...</p>
                </div>
              )}
            </div>
          )}
        </div>
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

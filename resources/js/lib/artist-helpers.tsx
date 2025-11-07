import { Badge } from '@/components/ui/badge';
import { Music2, XCircle } from 'lucide-react';

// Type definitions
export interface AdminArtist {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  products_count: number;
  products?: Array<{
    id: number;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
    image_url: string | null;
    order_items_count: number;
  }>;
}

// Artist status badge (active/inactive/deleted)
export const getArtistStatusBadge = (is_active: boolean, deleted_at: string | null) => {
  if (deleted_at) {
    return (
      <Badge variant="outline" className="gap-1.5 text-red-600 border-red-300">
        <XCircle className="h-3.5 w-3.5" />
        Đã xóa
      </Badge>
    );
  }

  if (!is_active) {
    return (
      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-300 bg-amber-50">
        <XCircle className="h-3.5 w-3.5" />
        Không hoạt động
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 bg-green-100 text-green-700 border-green-300">
      <Music2 className="h-3.5 w-3.5" />
      Hoạt động
    </Badge>
  );
};

// Genre badge with different colors
export const getGenreBadge = (genre: string) => {
  const genreColors: Record<string, string> = {
    rock: 'bg-red-100 text-red-700 border-red-300',
    pop: 'bg-pink-100 text-pink-700 border-pink-300',
    jazz: 'bg-blue-100 text-blue-700 border-blue-300',
    classical: 'bg-purple-100 text-purple-700 border-purple-300',
    electronic: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    'hip-hop': 'bg-orange-100 text-orange-700 border-orange-300',
    country: 'bg-amber-100 text-amber-700 border-amber-300',
    blues: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    metal: 'bg-gray-100 text-gray-700 border-gray-300',
    folk: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  };

  const normalizedGenre = genre.toLowerCase();
  const className = genreColors[normalizedGenre] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <Badge variant="outline" className={`gap-1.5 ${className}`}>
      <Music2 className="h-3.5 w-3.5" />
      {genre}
    </Badge>
  );
};

// Format artist name with fallback
export const formatArtistName = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'Unknown Artist';
  }
  return name;
};

// Format product count
export const formatProductCount = (count: number): string => {
  if (count === 0) return 'Chưa có sản phẩm';
  if (count === 1) return '1 sản phẩm';
  return `${count} sản phẩm`;
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// Format currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Get country flag emoji (optional helper)
export const getCountryFlag = (country: string): string => {
  const countryFlags: Record<string, string> = {
    'united states': '🇺🇸',
    usa: '🇺🇸',
    'united kingdom': '🇬🇧',
    uk: '🇬🇧',
    canada: '🇨🇦',
    australia: '🇦🇺',
    germany: '🇩🇪',
    france: '🇫🇷',
    italy: '🇮🇹',
    spain: '🇪🇸',
    japan: '🇯🇵',
    'south korea': '🇰🇷',
    china: '🇨🇳',
    brazil: '🇧🇷',
    mexico: '🇲🇽',
    sweden: '🇸🇪',
    norway: '🇳🇴',
    denmark: '🇩🇰',
    netherlands: '🇳🇱',
    belgium: '🇧🇪',
    switzerland: '🇨🇭',
    austria: '🇦🇹',
    ireland: '🇮🇪',
    poland: '🇵🇱',
    russia: '🇷🇺',
    india: '🇮🇳',
    vietnam: '🇻🇳',
  };

  const normalizedCountry = country.toLowerCase();
  return countryFlags[normalizedCountry] || '🌍';
};

// Truncate description text
export const truncateBio = (description: string | null, maxLength: number = 100): string => {
  if (!description) return 'Chưa có mô tả';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};

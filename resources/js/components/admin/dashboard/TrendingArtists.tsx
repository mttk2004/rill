import React from 'react';
import { Link } from '@inertiajs/react';
import { TrendingUp, Users } from 'lucide-react';
import { getImageUrl } from '../../../utils/image';

interface Artist {
  id: string;
  name: string;
  country: string;
  sales: number;
  image?: string;
}

interface TrendingArtistsProps {
  artists: Artist[];
}

const TrendingArtists: React.FC<TrendingArtistsProps> = ({ artists }) => {
  return (
    <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" /> Nghệ sĩ đang Hot
        </h3>
        <Link href="/admin/artists" className="text-xs text-primary hover:underline font-medium">Tất cả</Link>
      </div>
      <div className="space-y-5">
        {artists.length > 0 ? artists.map((artist, idx) => (
          <div key={artist.id || idx} className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                {artist.image ? (
                  <img src={getImageUrl(artist.image) || ''} alt={artist.name} className="h-full w-full object-cover" />
                ) : (
                  <Users size={20} className="m-auto mt-3 text-gray-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100 text-[10px] font-bold w-5 h-5 flex items-center justify-center text-primary">
                #{idx + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{artist.name}</p>
              <p className="text-xs text-gray-500 truncate">{artist.country}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{artist.sales}</p>
              <span className="text-[10px] font-medium text-gray-400 uppercase">bản</span>
            </div>
          </div>
        )) : (
          <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingArtists;

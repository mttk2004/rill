
import React from 'react';
import { Link } from '@inertiajs/react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, X, Music, Tag } from 'lucide-react';
import { getImageUrl } from '../utils/image';

const MusicPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, closePlayer } = usePlayer();

  if (!currentTrack) return null;

  const artistNames = currentTrack.artists?.map(a => a.name).join(', ') || 'Unknown Artist';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] px-3 py-3 md:px-4 md:py-4 animate-in slide-in-from-bottom duration-500 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-3 md:gap-6">

        {/* Track Info */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          {/* Album Art */}
          <Link
            href={`/products/${currentTrack.slug}`}
            className="group relative flex-shrink-0"
          >
            <div className={`relative h-14 w-14 md:h-16 md:w-16 rounded-lg overflow-hidden border-2 border-gray-600 group-hover:border-accent transition-all shadow-lg ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
              <img
                src={getImageUrl(currentTrack.image) || ''}
                alt={currentTrack.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2.5 w-2.5 md:h-3 md:w-3 bg-gray-900 rounded-full border border-gray-400"></div>
              </div>
            </div>
          </Link>

          {/* Track Details */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${currentTrack.slug}`}
              className="block group"
            >
              <h4 className="font-bold text-white text-sm md:text-base truncate group-hover:text-accent transition-colors">
                {currentTrack.name}
              </h4>
            </Link>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span className="truncate">{artistNames}</span>
              {currentTrack.genre && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center gap-1 truncate">
                    <Music size={10} />
                    {currentTrack.genre}
                  </span>
                </>
              )}
            </div>

            {/* Additional Info - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 mt-1 text-xs">
              {currentTrack.label && (
                <span className="flex items-center gap-1 text-gray-500">
                  <Tag size={10} />
                  {currentTrack.label}
                </span>
              )}
              <span className="text-accent font-semibold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentTrack.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Price - Mobile only */}
          <div className="md:hidden text-accent font-bold text-sm whitespace-nowrap">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact',
              compactDisplay: 'short'
            }).format(currentTrack.price)}
          </div>

          <button
            onClick={togglePlay}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90 hover:scale-105 transition-all shadow-lg hover:shadow-accent/50"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          <button
            onClick={closePlayer}
            className="flex h-8 w-8 md:h-9 md:w-9 rounded-full bg-gray-700 text-gray-300 items-center justify-center hover:bg-gray-600 hover:text-red-400 transition-colors"
            aria-label="Đóng trình phát nhạc"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

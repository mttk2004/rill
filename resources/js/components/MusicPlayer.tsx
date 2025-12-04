
import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, X } from 'lucide-react';
import { getImageUrl } from '../utils/image';

const MusicPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, closePlayer } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-4 py-3 animate-in slide-in-from-bottom duration-500">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">

        {/* Track Info */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <div className={`relative h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <img src={getImageUrl(currentTrack.image) || ''} alt={currentTrack.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 md:h-3 md:w-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">{currentTrack.name}</h4>
            <p className="text-xs md:text-sm text-gray-500 truncate">Đang phát bản xem trước</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primaryHover hover:scale-105 transition-all shadow-md"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={closePlayer}
            className="flex h-8 w-8 rounded-full bg-gray-100 text-gray-500 items-center justify-center hover:bg-gray-200 hover:text-red-500 transition-colors"
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


import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Product } from '../types';

interface PlayerContextType {
  currentTrack: Product | null;
  isPlaying: boolean;
  playTrack: (product: Product) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children?: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Product | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element only once
    audioRef.current = new Audio();
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playTrack = (product: Product) => {
    if (!audioRef.current || !product.preview_url) return;

    if (currentTrack?.id === product.id) {
      togglePlay();
      return;
    }

    // New track
    audioRef.current.src = product.preview_url;
    audioRef.current.play().catch(e => console.log("Playback error", e));
    setCurrentTrack(product);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; 
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack, togglePlay, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};

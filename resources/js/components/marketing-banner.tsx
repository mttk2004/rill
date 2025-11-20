import { usePage } from '@inertiajs/react';
import { X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BannerSettings {
  enabled: boolean;
  content: string;
  type: 'info' | 'success' | 'warning';
}

export function MarketingBanner() {
  const { settings } = usePage<{ settings: { banner: BannerSettings } }>().props;
  const banner: BannerSettings = settings?.banner || { enabled: false, content: '', type: 'info' };

  // Check if banner was dismissed in localStorage
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate a simple hash from content for tracking dismissal
    const contentHash = banner.content.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0).toString();

    const dismissedHash = localStorage.getItem('banner_dismissed_hash');

    // Show banner if:
    // 1. Enabled by admin
    // 2. Has content
    // 3. Never dismissed OR content changed (different hash)
    if (banner.enabled && banner.content && dismissedHash !== contentHash) {
      setIsVisible(true);
    }
  }, [banner.enabled, banner.content]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store hash of current content
    const contentHash = banner.content.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0).toString();
    localStorage.setItem('banner_dismissed_hash', contentHash);
  };

  // Don't render if not visible or not enabled
  if (!banner.enabled || !isVisible || !banner.content) {
    return null;
  }

  // Define styles based on banner type
  const styles = {
    info: {
      bg: 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90',
      hoverBg: 'hover:bg-white/20',
      icon: Info,
    },
    success: {
      bg: 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90',
      hoverBg: 'hover:bg-white/20',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-gradient-to-r from-orange-500/90 to-amber-500/90',
      hoverBg: 'hover:bg-white/20',
      icon: AlertTriangle,
    },
  };

  const currentStyle = styles[banner.type] || styles.info;
  const Icon = currentStyle.icon;

  return (
    <div
      className={cn(
        'sticky top-0 z-50 px-4 py-4 text-white shadow-lg backdrop-blur-sm',
        'animate-in slide-in-from-top-5 duration-500',
        currentStyle.bg
      )}
      style={{
        animation: 'banner-shake 0.8s ease-in-out 0.5s 1, banner-glow 2s ease-in-out infinite'
      }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 pr-10">
          <Icon className="h-7 w-7 flex-shrink-0 animate-pulse drop-shadow-lg" />
          <p className="text-center text-lg md:text-xl font-bold tracking-wide animate-in fade-in duration-700 drop-shadow-md">
            {banner.content}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-300',
            'hover:scale-125 hover:rotate-90 active:scale-95',
            currentStyle.hoverBg
          )}
          aria-label="Đóng banner"
        >
          <X className="h-5 w-5 drop-shadow-lg" />
        </button>
      </div>
    </div>
  );
}

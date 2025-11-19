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
    // Only show if enabled and not dismissed
    const dismissed = localStorage.getItem('banner_dismissed');
    const dismissedContent = localStorage.getItem('banner_content');

    // Show banner if:
    // 1. Enabled by admin
    // 2. Never dismissed OR content changed
    if (banner.enabled && (!dismissed || dismissedContent !== banner.content)) {
      setIsVisible(true);
    }
  }, [banner.enabled, banner.content]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('banner_dismissed', 'true');
    localStorage.setItem('banner_content', banner.content);
  };

  // Don't render if not visible or not enabled
  if (!banner.enabled || !isVisible || !banner.content) {
    return null;
  }

  // Define styles based on banner type
  const styles = {
    info: {
      bg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-700',
      icon: Info,
    },
    success: {
      bg: 'bg-green-600',
      hoverBg: 'hover:bg-green-700',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-amber-600',
      hoverBg: 'hover:bg-amber-700',
      icon: AlertTriangle,
    },
  };

  const currentStyle = styles[banner.type] || styles.info;
  const Icon = currentStyle.icon;

  return (
    <div className={cn('relative px-4 py-3 text-white', currentStyle.bg)}>
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-2 pr-8">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <p className="text-center text-sm font-medium">
            {banner.content}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors',
            currentStyle.hoverBg
          )}
          aria-label="Đóng banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

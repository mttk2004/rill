import React from 'react';
import { usePage } from '@inertiajs/react';
import { Megaphone, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const AnnouncementBar = () => {
  const { props } = usePage<{
    settings: {
      banner: {
        enabled: boolean;
        content: string;
        type: string;
      };
    };
  }>();

  const { enabled: isEnabled, content, type } = props.settings?.banner || {};

  if (!isEnabled || !content) return null;

  const bannerStyles: Record<string, { bg: string; text: string; icon: typeof Info; border: string }> = {
    success: {
      bg: 'bg-gradient-to-r from-emerald-600 to-green-600',
      text: 'text-white',
      icon: CheckCircle,
      border: 'border-emerald-400/30'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      text: 'text-white',
      icon: Info,
      border: 'border-blue-400/30'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      text: 'text-white',
      icon: AlertTriangle,
      border: 'border-amber-400/30'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-600 to-rose-600',
      text: 'text-white',
      icon: XCircle,
      border: 'border-red-400/30'
    },
    default: {
      bg: 'bg-gradient-to-r from-gray-900 to-gray-800',
      text: 'text-white',
      icon: Megaphone,
      border: 'border-gray-600/30'
    }
  };

  const style = bannerStyles[type || 'default'] || bannerStyles.default;
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.text} border-b ${style.border} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <Icon size={18} className="flex-shrink-0 animate-pulse" />
          <p className="text-sm font-semibold tracking-wide text-center">
            {content}
          </p>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;

import React from 'react';
import { usePage } from '@inertiajs/react';

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

  const bgColors: Record<string, string> = {
    success: 'bg-green-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
    default: 'bg-black'
  };

  const bgColor = bgColors[type || 'default'] || bgColors.default;

  return (
    <div className={`${bgColor} text-white px-4 py-2 text-center text-xs font-medium tracking-wide`}>
      {content}
    </div>
  );
};

export default AnnouncementBar;
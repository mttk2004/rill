import React from 'react';
import { CONFIGS } from '../data';

const AnnouncementBar = () => {
  const isEnabled = CONFIGS.find(c => c.key === 'banner_enabled')?.value === '1';
  const content = CONFIGS.find(c => c.key === 'banner_content')?.value;
  const type = CONFIGS.find(c => c.key === 'banner_type')?.value;

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
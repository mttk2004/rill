import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: any;
  color: string;
}

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }: StatCardProps) => {
  // Extract base color name from Tailwind class (e.g., 'bg-emerald-600' -> 'emerald')
  const colorName = color?.split('-')[1] || 'gray';

  // Map colors to gradients
  const gradients: Record<string, string> = {
    emerald: 'from-emerald-50 via-white to-white border-emerald-100',
    blue: 'from-blue-50 via-white to-white border-blue-100',
    amber: 'from-amber-50 via-white to-white border-amber-100',
    slate: 'from-slate-50 via-white to-white border-slate-100',
    gray: 'from-gray-50 via-white to-white border-gray-100',
  };

  const gradientClass = gradients[colorName] || gradients.gray;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 border bg-gradient-to-br ${gradientClass} shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}>
      {/* Decorative Blur Blob */}
      <div className={`absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-10 blur-3xl ${color} group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={`p-3.5 rounded-xl ${color} text-white shadow-lg shadow-${colorName}-500/20 ring-4 ring-white/50`}>
          <Icon size={22} />
        </div>
        <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/50 ${trendUp ? 'bg-green-100/80 text-green-700' : 'bg-red-100/80 text-red-700'}`}>
          {trendUp ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

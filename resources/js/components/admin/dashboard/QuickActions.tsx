import React from 'react';
import { router } from '@inertiajs/react';
import { Plus, Music, Tag, Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <button
        onClick={() => router.visit('/admin/products/create')}
        className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
      >
        <div className="bg-primary/10 text-primary p-2.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
          <Plus size={20} />
        </div>
        <span className="font-semibold text-gray-700 text-sm">Thêm sản phẩm</span>
      </button>

      <button
        onClick={() => router.visit('/admin/artists/create')}
        className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
      >
        <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
          <Music size={20} />
        </div>
        <span className="font-semibold text-gray-700 text-sm">Thêm nghệ sĩ</span>
      </button>

      <button
        onClick={() => router.visit('/admin/vouchers/create')}
        className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
      >
        <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
          <Tag size={20} />
        </div>
        <span className="font-semibold text-gray-700 text-sm">Tạo khuyến mãi</span>
      </button>

      <button
        onClick={() => router.visit('/admin/settings')}
        className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
      >
        <div className="bg-slate-50 text-slate-600 p-2.5 rounded-lg group-hover:bg-slate-600 group-hover:text-white transition-colors">
          <Settings size={20} />
        </div>
        <span className="font-semibold text-gray-700 text-sm">Cấu hình</span>
      </button>
    </div>
  );
};

export default QuickActions;

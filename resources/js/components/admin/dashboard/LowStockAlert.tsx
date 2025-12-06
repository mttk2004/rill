import React from 'react';
import { Link, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../../../utils/image';

interface Product {
  id: string;
  name: string;
  image?: string;
  stock_quantity: number;
  min_stock_level: number;
}

interface LowStockAlertProps {
  products: Product[];
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ products }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-500" /> Cảnh báo tồn kho
        </h3>
        <Link href="/admin/products" className="text-xs text-primary hover:underline font-medium">Quản lý kho</Link>
      </div>
      <div className="space-y-3">
        {products.length > 0 ? products.map(product => (
          <div key={product.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 p-2 -mx-2 rounded-lg transition-colors">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
              {product.image ? (
                <img src={getImageUrl(product.image) || ''} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">Còn: {product.stock_quantity}</span>
                <span className="text-[10px] text-gray-400">Min: {product.min_stock_level || 5}</span>
              </div>
            </div>
            <button
              onClick={() => router.visit(`/admin/products/${product.id}/edit`)}
              className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-gray-200 shadow-none hover:shadow-sm transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )) : (
          <div className="text-center py-8 text-green-600 text-sm flex flex-col items-center bg-green-50/30 rounded-xl border border-dashed border-green-200">
            <CheckCircle size={32} className="mb-2 opacity-50" />
            Kho hàng ổn định
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;

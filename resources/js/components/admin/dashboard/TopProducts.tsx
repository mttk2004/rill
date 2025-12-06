import React from 'react';
import { router } from '@inertiajs/react';
import { Trophy } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import { getImageUrl } from '../../../utils/image';

interface Product {
  id: string;
  name: string;
  sku: string;
  image?: string;
  sales: number;
  revenue: number;
}

interface TopProductsProps {
  products: Product[];
}

const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100/50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Trophy size={20} className="text-accent" /> Top sản phẩm bán chạy
        </h3>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-3">Sản phẩm</th>
              <th className="px-6 py-3 text-center">Đã bán</th>
              <th className="px-6 py-3 text-right">Doanh thu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {products.length > 0 ? products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 cursor-pointer group hover:shadow-sm"
                onClick={() => router.visit(`/admin/products/${product.id}/edit`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm group-hover:border-primary/30 transition-colors">
                      {product.image ? (
                        <img src={getImageUrl(product.image) || ''} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 group-hover:text-primary truncate max-w-[200px] transition-colors">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">{product.sales}</span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-primary">
                  {formatCurrency(product.revenue)}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="text-center py-4 text-gray-500">Chưa có dữ liệu bán hàng.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;

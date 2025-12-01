
import React from 'react';
import { X, Package, Tag, DollarSign, Layers, Image as ImageIcon, FileText, Globe, User } from 'lucide-react';
import { Product, Artist } from '../../../types';
import { ARTISTS } from '../../../data';

interface ProductDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  artist?: Artist; // Deprecated prop, will verify
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const formatCurrency = (val: string | number | undefined) => {
    if (!val) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));
  };

  const getStatusColor = (status: string = 'active') => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusLabel = (status: string = 'active') => {
    switch (status) {
      case 'active': return 'Đang bán';
      case 'inactive': return 'Ngừng kinh doanh';
      case 'out_of_stock': return 'Hết hàng';
      default: return status;
    }
  };

  const getArtistName = (id: string) => {
    return ARTISTS.find(a => a.id === id)?.name || 'Unknown';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Chi tiết sản phẩm</h2>
            <p className="text-sm text-gray-500">ID: {product.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Image & Key Info */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-50 relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon size={48} className="mb-2" />
                    <span className="text-sm">Không có ảnh</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(product.status)}`}>
                    {getStatusLabel(product.status)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign size={18} className="text-primary" /> Giá & Chi phí
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giá bán:</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giá vốn:</span>
                  <span className="font-medium text-gray-700">{formatCurrency(product.cost_price)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lợi nhuận ước tính:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(Number(product.price) - Number(product.cost_price || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="w-full lg:w-2/3 space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-primary" /> Thông tin chung
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tên sản phẩm</label>
                    <p className="text-gray-900 font-medium">{product.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Mã SKU</label>
                    <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">{product.sku}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Slug (URL)</label>
                    <p className="text-gray-600 text-sm">{product.slug}</p>
                  </div>
                </div>
              </div>

              {/* Artists */}
              <div>
                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} className="text-primary" /> Nghệ sĩ
                 </h3>
                 <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    {product.artists && product.artists.length > 0 ? (
                       <div className="flex flex-wrap gap-2">
                          {product.artists.map((a, idx) => (
                             <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-700 shadow-sm">
                                <span className="font-medium mr-2">{getArtistName(a.artist_id)}</span>
                                <span className="text-[10px] uppercase bg-gray-100 px-1.5 rounded text-gray-500 tracking-wide">{a.role}</span>
                             </span>
                          ))}
                       </div>
                    ) : (
                       <p className="text-sm text-gray-500">Chưa có thông tin nghệ sĩ</p>
                    )}
                 </div>
              </div>

              {/* Inventory & Classification */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-primary" /> Kho & Phân loại
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <label className="block text-xs font-medium text-blue-600 uppercase mb-1">Tồn kho hiện tại</label>
                    <p className="text-blue-900 font-bold text-xl">{product.stock_quantity}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <label className="block text-xs font-medium text-amber-600 uppercase mb-1">Cảnh báo tồn kho thấp</label>
                    <p className="text-amber-900 font-bold text-xl">{product.min_stock_level || 0}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Thể loại</label>
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-gray-400" />
                      <span className="text-gray-900">{product.genre}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Hãng đĩa</label>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-gray-400" />
                      <span className="text-gray-900">{product.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-primary" /> Mô tả
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Mô tả ngắn</label>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {product.description}
                    </p>
                  </div>
                  {product.detailed_description && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Mô tả chi tiết</label>
                      <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-line">
                        {product.detailed_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-4">SEO Metadata</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Meta Title</label>
                    <p className="text-gray-900 text-sm">{product.meta_title || product.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Meta Description</label>
                    <p className="text-gray-600 text-sm">{product.meta_description || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailDialog;

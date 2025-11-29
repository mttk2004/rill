
import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  stock, 
  onIncrease, 
  onDecrease,
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Số lượng:</span>
      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
         <button 
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
          aria-label="Giảm số lượng"
         >-</button>
         <div className="w-12 text-center text-gray-900 font-semibold border-x border-gray-100 py-2">
            {quantity}
         </div>
         <button 
          onClick={onIncrease}
          disabled={quantity >= stock}
          className="px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
          aria-label="Tăng số lượng"
         >+</button>
      </div>
      <span className="text-sm text-gray-500">
        (Còn {stock} sản phẩm)
      </span>
    </div>
  );
};

export default QuantitySelector;

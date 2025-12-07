import React from 'react';
import { Truck } from 'lucide-react';

interface FreeShippingProgressProps {
  currentAmount: number;
  freeShippingThreshold: number;
  className?: string;
}

const FreeShippingProgress: React.FC<FreeShippingProgressProps> = ({
  currentAmount,
  freeShippingThreshold,
  className = '',
}) => {
  const progress = Math.min((currentAmount / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - currentAmount, 0);
  const isQualified = currentAmount >= freeShippingThreshold;

  return (
    <div className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 ${className}`}>
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${isQualified ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'
            }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Message */}
      <div className="flex items-start gap-2">
        <Truck
          size={18}
          className={`flex-shrink-0 mt-0.5 ${isQualified ? 'text-green-600' : 'text-orange-500'}`}
        />
        <div className="flex-1">
          {isQualified ? (
            <p className="text-sm font-medium text-green-700">
              🎉 Bạn được <span className="font-bold">miễn phí vận chuyển</span>!
            </p>
          ) : (
            <p className="text-sm text-gray-700">
              Mua thêm{' '}
              <span className="font-bold text-orange-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(remaining)}
              </span>{' '}
              để được <span className="font-semibold">miễn phí vận chuyển</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeShippingProgress;

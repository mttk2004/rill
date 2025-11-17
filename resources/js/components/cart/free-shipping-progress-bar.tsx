import { formatVND } from '@/lib/utils';
import { Truck } from 'lucide-react';

interface FreeShippingProgressBarProps {
  currentAmount: number;
  threshold?: number;
}

export function FreeShippingProgressBar({
  currentAmount,
  threshold = 1000000
}: FreeShippingProgressBarProps) {
  const progress = Math.min((currentAmount / threshold) * 100, 100);
  const remaining = Math.max(threshold - currentAmount, 0);
  const isEligible = currentAmount >= threshold;

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Animated shimmer effect when eligible */}
        {isEligible && (
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        )}
      </div>

      {/* Message */}
      <div className="flex items-center gap-2 text-sm">
        <Truck className={`h-4 w-4 ${isEligible ? 'text-green-600' : 'text-slate-500'}`} />
        {isEligible ? (
          <p className="text-green-600 dark:text-green-500 font-medium">
            🎉 Bạn được miễn phí vận chuyển!
          </p>
        ) : (
          <p className="text-slate-600 dark:text-slate-400">
            Mua thêm <span className="font-semibold text-amber-600">{formatVND(remaining)}</span> để được{' '}
            <span className="font-semibold text-green-600">Miễn phí vận chuyển</span>!
          </p>
        )}
      </div>
    </div>
  );
}

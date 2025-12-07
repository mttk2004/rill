import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0-5, có thể là số thập phân như 4.3
  size?: number;
  showRating?: boolean;
  className?: string;
}

/**
 * StarRating Component
 * Hiển thị rating với sao đầy, nửa sao và sao rỗng
 */
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 16,
  showRating = false,
  className = ''
}) => {
  // Làm tròn đến 1 chữ số thập phân
  const roundedRating = Math.round(rating * 10) / 10;

  const renderStar = (index: number) => {
    const difference = roundedRating - index;

    if (difference >= 1) {
      // Sao đầy
      return (
        <Star
          key={index}
          size={size}
          fill="currentColor"
          className="text-yellow-400"
        />
      );
    } else if (difference > 0 && difference < 1) {
      // Nửa sao - sử dụng gradient
      return (
        <div key={index} className="relative inline-block">
          {/* Sao nền (rỗng) */}
          <Star
            size={size}
            fill="none"
            className="text-gray-300"
          />
          {/* Sao đầy với clip */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${difference * 100}%` }}
          >
            <Star
              size={size}
              fill="currentColor"
              className="text-yellow-400"
            />
          </div>
        </div>
      );
    } else {
      // Sao rỗng
      return (
        <Star
          key={index}
          size={size}
          fill="none"
          className="text-gray-300"
        />
      );
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, i) => renderStar(i))}
      </div>
      {showRating && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {roundedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;


import React, { useState } from 'react';
import { Product, Artist } from '../types';
import { ShoppingCart, Play, Loader2, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { usePlayer } from '../context/PlayerContext';
import { Link } from '@inertiajs/react';
import { flyToCart } from '../utils/cartAnimation';

interface ProductCardProps {
  product: Product;
  artist?: Artist;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, artist }) => {
  const { addToCart } = useShop();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const [btnState, setBtnState] = useState<'idle' | 'loading' | 'success'>('idle');

  const isCurrentTrack = currentTrack?.id === product.id;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigating to product detail

    // Prevent double clicks
    if (btnState !== 'idle') return;

    // 1. Capture Rect IMMEDIATELY (before async/await)
    const btnRect = e.currentTarget.getBoundingClientRect();

    // 2. Loading State
    setBtnState('loading');

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Fly Animation (Wrapped in try-catch so it doesn't block adding to cart)
      try {
        flyToCart(product.image, btnRect);
      } catch (animError) {
        console.error("Animation failed", animError);
      }

      // 4. Add Data (CRITICAL: Must happen regardless of animation)
      addToCart(product, 1);

      // 5. Success State
      setBtnState('success');

      // 6. Reset
      setTimeout(() => {
        setBtnState('idle');
      }, 1500);

    } catch (error) {
      console.error("Add to cart error:", error);
      setBtnState('idle');
    }
  };

  const handlePlayClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    playTrack(product);
  };

  // Get main artist from product.artists array
  const mainArtist = artist || (product.artists && product.artists.length > 0 ? product.artists.find((a: any) => a.role === 'main') || product.artists[0] : undefined);

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            <span className="text-sm">Chưa có ảnh</span>
          </div>
        )}

        {/* Play Button - Only shows if preview_url exists */}
        {product.preview_url && (
          <button
            onClick={handlePlayClick}
            className={`absolute bottom-3 left-3 lg:bottom-4 lg:left-4 z-20 rounded-full p-2.5 lg:p-3 shadow-lg transition-all duration-300 hover:scale-110 ${isThisPlaying
              ? 'bg-accent text-white translate-y-0'
              : 'bg-white text-gray-900 translate-y-0 lg:translate-y-full group-hover:translate-y-0'
              }`}
            aria-label={isThisPlaying ? "Tạm dừng" : "Nghe thử"}
          >
            {isThisPlaying ? (
              <div className="flex items-center gap-1">
                <span className="block h-3 w-1 bg-white animate-[music-bar_0.6s_ease-in-out_infinite]"></span>
                <span className="block h-4 w-1 bg-white animate-[music-bar_0.6s_ease-in-out_0.2s_infinite]"></span>
                <span className="block h-2 w-1 bg-white animate-[music-bar_0.6s_ease-in-out_0.4s_infinite]"></span>
              </div>
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5" />
            )}
          </button>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={btnState !== 'idle'}
          className={`absolute bottom-3 right-3 lg:bottom-4 lg:right-4 z-20 rounded-full p-2.5 lg:p-3 shadow-lg transition-all duration-300 flex items-center justify-center
            ${btnState === 'success' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-gray-900 hover:bg-primary hover:text-white'}
            ${btnState !== 'idle' ? 'translate-y-0 opacity-100' : 'translate-y-0 lg:translate-y-full group-hover:translate-y-0'}
          `}
          aria-label="Thêm vào giỏ"
        >
          {btnState === 'loading' ? (
            <Loader2 size={20} className="animate-spin" />
          ) : btnState === 'success' ? (
            <Check size={20} className="animate-in zoom-in duration-200" />
          ) : (
            <ShoppingCart size={20} />
          )}
        </button>
      </div>
      <div className="space-y-1">
        <h3 className={`text-base font-semibold transition-colors line-clamp-1 ${isThisPlaying ? 'text-accent' : 'text-gray-900 group-hover:text-primary'}`}>
          {product.name}
        </h3>
        {mainArtist && (
          <p className="text-sm text-gray-500">{mainArtist.name}</p>
        )}
        <p className="text-sm font-medium text-gray-900">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;

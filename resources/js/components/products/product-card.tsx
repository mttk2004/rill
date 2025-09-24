import { Link } from '@inertiajs/react';
import { Product } from '@/types';
import { Music, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const mainArtistsText = product.main_artists.length > 0 
        ? product.main_artists.join(', ') 
        : 'Unknown Artist';

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Product Image */}
            <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                {product.image ? (
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Music className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                    </div>
                )}
                
                {/* Featured Badge */}
                {product.is_featured && (
                    <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Nổi bật</span>
                    </div>
                )}

                {/* Discount Badge */}
                {product.discount_percentage && product.discount_percentage > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{product.discount_percentage}%
                    </div>
                )}

                {/* Stock Status */}
                {!product.in_stock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">Hết hàng</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Artist(s) */}
                <p className="text-sm text-accent font-medium mb-1 truncate">
                    {mainArtistsText}
                </p>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    <Link 
                        href={`/products/${product.slug}`}
                        className="hover:text-accent transition-colors"
                    >
                        {product.name}
                    </Link>
                </h3>

                {/* Genre and Label */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 space-y-1">
                    <p>Genre: {product.genre}</p>
                    <p>Label: {product.label}</p>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.compare_price)}
                        </span>
                    )}
                </div>

                {/* Stock Info */}
                {product.in_stock && product.low_stock && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                        Chỉ còn {product.stock_quantity} sản phẩm
                    </p>
                )}

                {/* Add to Cart Button */}
                <button 
                    className="w-full bg-accent text-white py-2 px-4 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!product.in_stock}
                >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{product.in_stock ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
                </button>
            </div>
        </div>
    );
}

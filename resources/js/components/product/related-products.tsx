import { Product } from '@/types';
import { ProductCard } from '@/components/product-card';
import { MouseEvent } from 'react';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
  products: Product[];
  onAddToCart: (e: MouseEvent<HTMLButtonElement>, productId: string) => void;
  isInCart: (productId: string) => boolean;
}

export function RelatedProducts({ products, onAddToCart, isInCart }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-amber-500" />
        <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onAddToCart={onAddToCart}
            isInCart={isInCart(product.id)}
            className="h-full"
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Các sản phẩm tương tự dựa trên nghệ sĩ và thể loại nhạc
        </p>
      </div>
    </div>
  );
}

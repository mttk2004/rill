import { ProductCard } from "@/components/product-card";
import { type Product } from "@/types";
import { MouseEvent } from "react";

interface ProductsGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onAddToCart: (e: MouseEvent<HTMLButtonElement>, productId: string) => void;
  cartItemProductIds: Set<string>;
}

export function ProductsGrid({
  products,
  viewMode,
  onAddToCart,
  cartItemProductIds,
}: ProductsGridProps) {
  return (
    <div
      className={`grid gap-4 ${viewMode === 'grid'
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
        : 'grid-cols-1'
        }`}
    >
      {products.map((product: Product, index: number) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          index={index}
          showActions={true}
          onAddToCart={onAddToCart}
          isInCart={cartItemProductIds.has(product.id)}
        />
      ))}
    </div>
  );
}

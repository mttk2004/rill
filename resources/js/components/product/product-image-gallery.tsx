import { Disc3 } from "lucide-react";
import { Product } from "@/types";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  return (
    <div className="sticky top-4">
      <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-lg border bg-muted flex items-center justify-center shadow-sm">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Disc3 className="h-20 w-20 mb-3" />
            <p className="text-sm">Chưa có hình ảnh</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Disc3 } from "lucide-react";
import { Product } from "@/types";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  return (
    <div className="sticky top-4">
      <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-lg border bg-muted flex items-center justify-center shadow-sm">
        {product.image ? (
          <img
            src={product.image}
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
      {/* Thumbnails - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:grid grid-cols-4 gap-2 mt-3 max-w-md mx-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md border bg-muted/50 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-accent transition-all"
          >
            <Disc3 className="h-5 w-5 text-muted-foreground/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

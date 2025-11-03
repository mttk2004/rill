import { Disc3 } from "lucide-react";
import { Product } from "@/types";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg border bg-muted flex items-center justify-center shadow-lg">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Disc3 className="h-24 w-24 mb-4" />
            <p className="text-sm">Chưa có hình ảnh</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md border bg-muted/50 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-accent transition-all"
          >
            <Disc3 className="h-6 w-6 text-muted-foreground/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

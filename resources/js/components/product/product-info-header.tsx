import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Product } from "@/types";

interface ProductInfoHeaderProps {
  product: Product & {
    average_rating?: number;
    reviews_count?: number;
  };
}

export function ProductInfoHeader({ product }: ProductInfoHeaderProps) {
  const averageRating = product.average_rating || 0;
  const reviewCount = product.reviews_count || 0;

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
        {product.name}
      </h1>
      <div className="flex items-center gap-2 mb-4">
        {product.artists?.map((artist, index) => (
          <span key={artist.id}>
            <span className="text-xl text-accent hover:underline cursor-pointer">
              {artist.name}
            </span>
            {index < product.artists.length - 1 && (
              <span className="text-muted-foreground">, </span>
            )}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < Math.floor(averageRating)
                  ? 'fill-accent text-accent'
                  : 'text-muted-foreground/30'
                }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {averageRating.toFixed(1)} ({reviewCount} đánh giá)
        </span>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge variant="outline">{product.genre}</Badge>
        <Badge variant="outline">{product.label}</Badge>
      </div>
    </div>
  );
}

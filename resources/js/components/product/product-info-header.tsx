import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Product } from "@/types";
import ReactMarkdown from 'react-markdown';
import { Link } from '@inertiajs/react';

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
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
        {product.name}
      </h1>
      <div className="flex items-center gap-2">
        {product.artists?.map((artist, index) => (
          <span key={artist.id}>
            <Link
              href={`/products?artist=${encodeURIComponent(artist.name)}`}
              className="text-lg text-accent hover:underline cursor-pointer"
            >
              {artist.name}
            </Link>
            {index < product.artists.length - 1 && (
              <span className="text-muted-foreground">, </span>
            )}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(averageRating)
                ? 'fill-accent text-accent'
                : 'text-muted-foreground/30'
                }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {averageRating.toFixed(1)} ({reviewCount})
        </span>
        <div className="flex items-center gap-2">
          <Link href={`/products?label=${encodeURIComponent(product.label)}`}>
            <Badge variant="outline" className="text-xs hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              {product.label}
            </Badge>
          </Link>
          <Link href={`/products?genre=${encodeURIComponent(product.genre)}`}>
            <Badge variant="outline" className="text-xs hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              {product.genre}
            </Badge>
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="pt-2 border-t">
        <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>
            {product.detailed_description || product.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Disc3, Heart, ShoppingCart } from "lucide-react";
import { Link } from '@inertiajs/react';
import { type Product } from '@/types';
import { MouseEvent } from 'react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  index?: number;
  showActions?: boolean;
  className?: string;
  onAddToCart?: (e: MouseEvent<HTMLButtonElement>, productId: string) => void;
  isInCart?: boolean;
}

export function ProductCard({
  product,
  viewMode = 'grid',
  index = 0,
  showActions = true,
  className = "",
  onAddToCart,
  isInCart = false
}: ProductCardProps) {
  return (
    <Card
      className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in bg-gradient-to-br from-white to-accent/5 ${viewMode === "list" ? "flex-row" : ""
        } ${className}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className={`p-0 relative z-10 ${viewMode === "list" ? "flex" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
          <Link href={`/products/${product.slug}`}>
            <div className={`relative w-full bg-gradient-to-br from-slate-100 to-accent/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500 ${viewMode === "list" ? "h-32" : "aspect-square"
              } ${viewMode === "list" ? "rounded-l-xl" : "rounded-t-xl"
              }`}>
              <Disc3 className="h-12 w-12 text-accent/40 animate-spin-slow group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
          {product.is_featured && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-accent text-white shadow-lg text-[10px] px-1.5 py-0.5"
            >
              Nổi bật
            </Badge>
          )}
          {showActions && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 bg-white/90 hover:bg-accent hover:text-white rounded-full shadow-lg"
              >
                <Heart className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        <div className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
          <Link href={`/products/${product.slug}`}>
            <div className={viewMode === "list" ? "flex justify-between items-start" : ""}>
              <div className={viewMode === "list" ? "flex-1" : ""}>
                <h3 className="font-bold text-base mb-1 line-clamp-1 hover:text-accent transition-colors group-hover:text-accent">
                  {product.name}
                </h3>
                <p className="text-slate-600 mb-1.5 text-xs font-medium line-clamp-1">
                  {product.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                </p>

                {viewMode === "list" && (
                  <div className="text-sm text-slate-500 mb-4 space-y-1">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full" />
                      Thể loại: {product.genre}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full" />
                      Hãng đĩa: {product.label}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">4.8</span>
                  <span className="text-[10px] text-slate-500">(125)</span>
                </div>
              </div>

              <div className={`flex ${viewMode === "list" ? "flex-col items-end" : "items-center justify-between"}`}>
                <div className={`flex items-center gap-2 ${viewMode === "list" ? "mb-4" : "mb-2"}`}>
                  <span className="text-lg font-bold bg-gradient-to-r from-accent to-orange-600 bg-clip-text text-transparent">
                    {product.price?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {showActions && (
            <div className="flex gap-1.5">
              {product.status === 'out_of_stock' ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-[10px] px-2"
                  disabled
                >
                  Hết hàng
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="default"
                  className="bg-accent hover:bg-accent/90 shadow-sm flex-1 h-7 text-[10px] px-2"
                  onClick={(e) => {
                    if (onAddToCart) {
                      onAddToCart(e, product.id);
                    }
                  }}
                  disabled={isInCart}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  {isInCart ? 'Đã thêm' : 'Thêm'}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-accent/30 text-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-sm h-7 text-[10px] px-2"
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  Chi tiết
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="absolute bottom-2 right-2 w-2 h-2 bg-accent rounded-full opacity-60 group-hover:animate-pulse" />
      </CardContent>
    </Card>
  );
}

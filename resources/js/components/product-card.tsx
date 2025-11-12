import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Disc3, ShoppingCart } from "lucide-react";
import { Link } from '@inertiajs/react';
import { type Product } from '@/types';
import { MouseEvent } from 'react';
import { formatVND } from "@/lib/utils";

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
      className={`group relative overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in bg-white ${viewMode === "list" ? "flex-row" : ""
        } ${className}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className={`p-0 relative z-10 ${viewMode === "list" ? "flex" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
          <Link href={`/products/${product.slug}`}>
            <div className={`relative w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "h-32" : "aspect-[3/2]"
              } ${viewMode === "list" ? "rounded-l-xl" : "rounded-t-xl"
              }`}>
              <Disc3 className="h-10 w-10 text-slate-300 animate-spin-slow group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>
          {product.is_featured && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md text-[10px] px-1.5 py-0.5 border-0"
            >
              Nổi bật
            </Badge>
          )}
        </div>

        <div className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
          <Link href={`/products/${product.slug}`}>
            <div className={viewMode === "list" ? "flex justify-between items-start" : ""}>
              <div className={viewMode === "list" ? "flex-1" : ""}>
                <h3 className="font-bold text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-600 mb-1.5 text-xs font-medium line-clamp-1">
                  {product.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                </p>

                {viewMode === "list" && (
                  <div className="text-sm text-slate-500 mb-4 space-y-1">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-400 rounded-full" />
                      Thể loại: {product.genre}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-400 rounded-full" />
                      Hãng đĩa: {product.label}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(product.average_rating ?? 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                          }`}
                      />
                    ))}
                  </div>
                  {(product.reviews_count ?? 0) > 0 ? (
                    <>
                      <span className="text-[10px] font-semibold text-slate-700">
                        {(product.average_rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({product.reviews_count})
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      Chưa có đánh giá
                    </span>
                  )}
                </div>
              </div>

              <div className={`flex ${viewMode === "list" ? "flex-col items-end" : "items-center justify-between"}`}>
                <div className={`flex items-center gap-2 ${viewMode === "list" ? "mb-4" : "mb-2"}`}>
                  <span className="text-lg font-bold text-slate-900">
                    {formatVND(product.price)}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {showActions && (
            <div className="space-y-1.5">
              {product.status === 'out_of_stock' ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-8 text-xs px-2"
                  disabled
                >
                  Hết hàng
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="default"
                  className="bg-accent hover:bg-accent/90 shadow-sm w-full h-8 text-xs px-2"
                  onClick={(e) => {
                    if (onAddToCart) {
                      onAddToCart(e, product.id);
                    }
                  }}
                  disabled={isInCart}
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  {isInCart ? 'Đã thêm' : 'Thêm vào giỏ'}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="w-full hover:bg-slate-100 transition-colors h-8 text-xs px-2"
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  Xem chi tiết
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

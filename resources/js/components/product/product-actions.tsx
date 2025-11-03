import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";
import { MouseEvent } from "react";

interface ProductActionsProps {
  product: Product;
  quantity: number;
  isInCart: boolean;
  isWishlisted: boolean;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: (e: MouseEvent<HTMLButtonElement>) => void;
  onWishlist: () => void;
}

export function ProductActions({
  product,
  quantity,
  isInCart,
  isWishlisted,
  onQuantityChange,
  onAddToCart,
  onWishlist,
}: ProductActionsProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-lg bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="h-9 px-3"
          >
            -
          </Button>
          <span className="px-4 py-2 text-center font-semibold min-w-[3rem]">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQuantityChange(Math.min(product.stock_quantity, quantity + 1))}
            disabled={quantity >= product.stock_quantity}
            className="h-9 px-3"
          >
            +
          </Button>
        </div>
        <Button
          size="sm"
          className="flex-1 h-9"
          onClick={onAddToCart}
          disabled={!product.in_stock || isInCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isInCart
            ? 'Đã trong giỏ'
            : (product.in_stock ? 'Thêm vào giỏ' : 'Hết hàng')
          }
        </Button>
        <Button variant="outline" size="sm" onClick={onWishlist} className="h-9 px-3">
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
    </div>
  );
}

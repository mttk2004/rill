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
    <div className="space-y-4 pt-6 border-t">
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="px-6 py-2 text-center font-bold text-lg">{quantity}</span>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onQuantityChange(Math.min(product.stock_quantity, quantity + 1))}
            disabled={quantity >= product.stock_quantity}
          >
            +
          </Button>
        </div>
        <Button
          size="lg"
          className="flex-1"
          onClick={onAddToCart}
          disabled={!product.in_stock || isInCart}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isInCart
            ? 'Đã có trong giỏ'
            : (product.in_stock ? 'Thêm vào giỏ hàng' : 'Hết hàng')
          }
        </Button>
        <Button variant="outline" size="lg" onClick={onWishlist}>
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
    </div>
  );
}

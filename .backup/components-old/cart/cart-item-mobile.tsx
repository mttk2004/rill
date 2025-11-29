import { Button } from "@/components/ui/button";
import { Disc3, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { formatVND } from '@/lib/utils';

interface CartItemMobileProps {
  item: {
    id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      image_url: string | null;
      stock_quantity: number;
      artists: Array<{
        id: string;
        name: string;
        slug: string;
      }>;
    };
  };
  isUpdating: boolean;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemMobile({ item, isUpdating, onUpdateQuantity, onRemove }: CartItemMobileProps) {
  return (
    <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-md overflow-hidden">
            {item.product.image_url ? (
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Disc3 className="h-12 w-12 text-amber-500" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.slug}`}>
                <h3 className="font-semibold text-base text-slate-900 dark:text-white hover:text-amber-600 transition-colors line-clamp-1">
                  {item.product.name}
                </h3>
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                {item.product.artists.map(artist => artist.name).join(', ')}
              </p>

              {/* Mobile: Price & Quantity */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="w-10 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.quantity + 1)}
                    disabled={isUpdating || item.quantity >= item.product.stock_quantity}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-lg font-bold text-amber-600">
                    {formatVND(item.total_price)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatVND(item.unit_price)}/cái
                  </p>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
              onClick={onRemove}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

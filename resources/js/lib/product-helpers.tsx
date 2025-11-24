import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  detailed_description?: string;
  sku: string;
  price: number;
  cost_price?: number;
  stock_quantity: number;
  min_stock_level: number;
  genre?: string;
  label?: string;
  image?: string;
  image_url?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  artists?: Array<{
    id: string;
    name: string;
    slug: string;
    pivot?: {
      role: string;
      sort_order: number;
    };
  }>;
  order_items_count?: number;
  total_sold?: number;
  total_revenue?: number;
  reviews_count?: number;
  recent_orders?: Array<{
    id: string;
    order_number: string;
    status: string;
    placed_at: string;
    quantity: number;
    unit_price: number;
  }>;
};

export const getStatusBadge = (status: string, deleted_at?: string) => {
  if (deleted_at) {
    return (
      <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">
        <Trash2 className="h-3 w-3 mr-1" />
        Đã xóa
      </Badge>
    );
  }

  const variants = {
    active: { label: "Đang bán", color: "bg-gradient-to-r from-green-500 to-green-600 text-white border-0", icon: CheckCircle },
    inactive: { label: "Không hoạt động", color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0", icon: XCircle },
    out_of_stock: { label: "Hết hàng", color: "bg-gradient-to-r from-red-500 to-red-600 text-white border-0", icon: AlertTriangle },
  };

  const config = variants[status as keyof typeof variants] || variants.inactive;
  const Icon = config.icon;

  return (
    <Badge className={config.color}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export const calculateProfit = (price: number, cost_price?: number | null) => {
  if (!cost_price || cost_price === 0) return "—";
  const profit = ((price - cost_price) / cost_price * 100).toFixed(1);
  return `${profit}%`;
};

export const getMainArtist = (artists?: AdminProduct['artists']) => {
  if (!artists || artists.length === 0) return "—";
  const mainArtist = artists.find(artist => artist.pivot?.role === "main");
  return mainArtist ? mainArtist.name : artists[0].name;
};

// formatPrice has been removed. Use formatVND from @/lib/utils instead

export const isLowStock = (product: AdminProduct) => {
  return product.stock_quantity <= product.min_stock_level && product.stock_quantity > 0;
};

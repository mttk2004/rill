import { Link } from "@inertiajs/react";
import { Eye, Edit, Trash2, RotateCcw, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTable, Column } from "@/components/admin/common/admin-table";
import { AdminProduct, getStatusBadge, calculateProfit, getMainArtist, isLowStock } from "@/lib/product-helpers";
import { formatVND } from '@/lib/utils';
import { getCollectionBadgeClasses } from "@/lib/collection-colors";

interface ProductTableProps {
  products: AdminProduct[];
  loading: boolean;
  onViewDetails: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onRestore: (id: string, name: string) => void;
}

export const ProductTable = ({
  products,
  loading,
  onViewDetails,
  onDelete,
  onRestore,
}: ProductTableProps) => {
  const columns: Column<AdminProduct>[] = [
    {
      header: "Sản phẩm",
      className: "w-[350px]",
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="relative rounded-lg overflow-hidden group/product-img">
            <img
              src={product.image_url || "/placeholder.png"}
              alt={product.name}
              className="w-16 h-16 object-cover"
            />
            {product.collection && (
              <div className="absolute top-0 right-0 z-10">
                <div
                  className={`${getCollectionBadgeClasses(product.collection.id)} rounded-bl-lg shadow-md transition-all duration-300 ease-out overflow-hidden`}
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 3px 0)'
                  }}
                >
                  <div className="flex items-center gap-1 px-1.5 py-0.5 group-hover/product-img:px-2">
                    <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-wide whitespace-nowrap max-w-0 group-hover/product-img:max-w-[100px] transition-all duration-300 ease-out overflow-hidden">
                      {product.collection.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-gray-500">
              {getMainArtist(product.artists)}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "SKU",
      render: (product) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {product.sku}
        </code>
      ),
    },
    {
      header: "Thể loại",
      accessor: "genre",
      render: (product) => <span className="text-sm">{product.genre}</span>,
    },
    {
      header: "Giá bán",
      render: (product) => (
        <div>
          <div className="font-medium">{formatVND(product.price)}</div>
          <div className="text-xs text-gray-500">
            Lãi: {calculateProfit(product.price, product.cost_price)}
          </div>
        </div>
      ),
    },
    {
      header: "Tồn kho",
      render: (product) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {product.stock_quantity.toLocaleString()}
          </span>
          {isLowStock(product) && (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </div>
      ),
    },
    {
      header: "Đã bán",
      render: (product) => (
        <span className="font-medium">
          {product.total_sold?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Trạng thái",
      render: (product) => getStatusBadge(product.status, product.deleted_at),
    },
    {
      header: "Hành động",
      className: "text-right",
      render: (product) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(product.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          {product.deleted_at ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRestore(product.id, product.name)}
            >
              <RotateCcw className="h-4 w-4 text-green-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id, product.name)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      data={products}
      columns={columns}
      loading={loading}
      emptyMessage="Không tìm thấy sản phẩm nào"
      getRowKey={(product) => product.id}
    />
  );
};

import { Link } from "@inertiajs/react";
import { Eye, Edit, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTable, Column } from "@/components/admin/common/admin-table";
import { AdminProduct, getStatusBadge, calculateProfit, getMainArtist, formatPrice, isLowStock } from "@/lib/product-helpers";

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
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
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
          <div className="font-medium">{formatPrice(product.price)}</div>
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

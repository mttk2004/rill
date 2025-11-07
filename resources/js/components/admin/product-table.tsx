import { Eye, Edit, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminProduct, getStatusBadge, calculateProfit, getMainArtist, formatPrice, isLowStock } from "@/lib/product-helpers";

interface ProductTableProps {
  products: AdminProduct[];
  loading: boolean;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onRestore: (id: string, name: string) => void;
}

export const ProductTable = ({
  products,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
  onRestore,
}: ProductTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px]">Sản phẩm</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Thể loại</TableHead>
            <TableHead>Giá bán</TableHead>
            <TableHead>Tồn kho</TableHead>
            <TableHead>Đã bán</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Đang tải...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Không tìm thấy sản phẩm nào
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {product.sku}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{product.genre}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Lãi: {calculateProfit(product.price, product.cost_price)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {product.stock_quantity.toLocaleString()}
                    </span>
                    {isLowStock(product) && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {product.total_sold?.toLocaleString() || 0}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(product.status, product.deleted_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(product.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product.id)}
                    >
                      <Edit className="h-4 w-4" />
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

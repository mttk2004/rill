import { Link } from "@inertiajs/react";
import { Package, DollarSign, TrendingUp, ShoppingCart, Calendar, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProduct, getStatusBadge, calculateProfit, getMainArtist, isLowStock } from "@/lib/product-helpers";
import { formatVND } from '@/lib/utils';
import { getCollectionBadgeClasses } from "@/lib/collection-colors";

interface ProductDetailDialogProps {
  product: AdminProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailDialog = ({
  product,
  isOpen,
  onClose,
}: ProductDetailDialogProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            Chi tiết Sản phẩm
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="orders">Lịch sử bán hàng</TabsTrigger>
          </TabsList>

          {/* Tab Thông tin */}
          <TabsContent value="info" className="space-y-4">
            <div className="flex items-start gap-6">
              {/* Product Image */}
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 relative ring-4 ring-slate-100 dark:ring-slate-700">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                    <Package className="h-12 w-12 text-slate-400" />
                  </div>
                )}
                {/* Collection Badge */}
                {product.collection && (
                  <div className="absolute top-1 left-1">
                    <Badge
                      className={`${getCollectionBadgeClasses(product.collection.id)} text-[9px] px-1.5 py-0.5 font-semibold shadow-sm backdrop-blur-sm flex items-center gap-1`}
                    >
                      <Sparkles className="w-2 h-2" />
                      {product.collection.name}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                  {getMainArtist(product.artists)}
                </p>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {getStatusBadge(product.status, product.deleted_at)}
                </div>
                {product.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {product.description}
                  </p>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">SKU</p>
                      <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                        {product.sku}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Giá bán</p>
                      <p className="text-lg font-bold text-amber-600">
                        {formatVND(product.price)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {product.cost_price && (
                <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tỷ suất lợi nhuận</p>
                        <p className="text-lg font-bold text-green-600">
                          {calculateProfit(product.price, product.cost_price)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tồn kho</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {product.stock_quantity} {isLowStock(product) && <span className="text-xs text-amber-600">(Thấp)</span>}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Đã bán</p>
                      <p className="text-lg font-bold text-blue-600">
                        {product.total_sold || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Doanh thu</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatVND(product.total_revenue || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ngày tạo</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {new Date(product.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                <CardContent className="p-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Thể loại</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {product.genre || '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                <CardContent className="p-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Nhãn hiệu</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {product.label || '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Artists */}
            {product.artists && product.artists.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Nghệ sĩ
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.artists.map((artist) => (
                    <Badge key={artist.id} className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0">
                      {artist.name}
                      {artist.pivot?.role && artist.pivot.role !== 'main' && (
                        <span className="ml-1 text-xs text-slate-500">({artist.pivot.role})</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Description */}
            {product.detailed_description && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Mô tả chi tiết
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.detailed_description}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Tab Lịch sử bán hàng */}
          <TabsContent value="orders">
            {!product.recent_orders || product.recent_orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  Sản phẩm chưa có lịch sử bán hàng
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {product.recent_orders.map((order) => (
                  <Card key={order.id} className="bg-slate-50 dark:bg-slate-800/50 border-0 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-600">#{order.order_number}</span>
                          <Badge className="bg-blue-500 text-white border-0">
                            {order.status}
                          </Badge>
                        </div>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-slate-600 dark:text-slate-400">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(order.placed_at).toLocaleDateString('vi-VN')}
                          <span className="mx-2">•</span>
                          SL: {order.quantity}
                        </div>
                        <div className="font-bold text-lg text-slate-900 dark:text-white">
                          {formatVND(order.unit_price * order.quantity)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

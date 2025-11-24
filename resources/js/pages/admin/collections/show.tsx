import { AdminNavigation } from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ArrowLeft, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import type { Product } from "@/types";

interface Collection {
  id: number;
  name: string;
  slug: string;
  type: 'featured' | 'banner' | 'promotion' | 'curated';
  description: string | null;
  is_active: boolean;
  started_at: string | null;
  ended_at: string | null;
  display_order: number;
  products_count: number;
  products: Array<Product & { pivot: { position: number } }>;
  created_at: string;
  updated_at: string;
}

interface ShowCollectionProps {
  collection: Collection;
}

const getTypeLabel = (type: string) => {
  const labels = {
    featured: 'Nổi bật',
    banner: 'Banner',
    promotion: 'Khuyến mãi',
    curated: 'Tuyển chọn',
  };
  return labels[type as keyof typeof labels] || type;
};

const getTypeBadge = (type: string) => {
  const config = {
    featured: 'bg-amber-100 text-amber-700 border-amber-300',
    banner: 'bg-blue-100 text-blue-700 border-blue-300',
    promotion: 'bg-green-100 text-green-700 border-green-300',
    curated: 'bg-purple-100 text-purple-700 border-purple-300',
  };
  return (
    <Badge className={config[type as keyof typeof config] || 'bg-gray-100 text-gray-700'}>
      {getTypeLabel(type)}
    </Badge>
  );
};

const getStatusBadge = (collection: Collection) => {
  const now = new Date();
  const startedAt = collection.started_at ? new Date(collection.started_at) : null;
  const endedAt = collection.ended_at ? new Date(collection.ended_at) : null;

  if (!collection.is_active) {
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">
        <XCircle className="h-3 w-3 mr-1" />
        Không hoạt động
      </Badge>
    );
  }

  if (endedAt && endedAt < now) {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-300">
        <XCircle className="h-3 w-3 mr-1" />
        Đã hết hạn
      </Badge>
    );
  }

  if (startedAt && startedAt > now) {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-300">
        <Clock className="h-3 w-3 mr-1" />
        Chưa bắt đầu
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-100 text-green-700 border-green-300">
      <CheckCircle className="h-3 w-3 mr-1" />
      Đang hoạt động
    </Badge>
  );
};

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return 'Không giới hạn';
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ShowCollection({ collection }: ShowCollectionProps) {
  const sortedProducts = [...collection.products].sort(
    (a, b) => a.pivot.position - b.pivot.position
  );

  return (
    <>
      <Head title={`${collection.name} - Admin`} />
      <AdminNavigation />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto py-6 px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={route('admin.collections.index')}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">{collection.name}</h1>
                  <p className="text-muted-foreground mt-2">
                    Chi tiết collection
                  </p>
                </div>
              </div>
              <Link href={route('admin.collections.edit', collection.id)}>
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </Link>
            </div>

            {/* Collection Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin Collection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tên
                    </Label>
                    <div className="text-lg font-semibold">{collection.name}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Slug
                    </Label>
                    <div className="text-lg font-mono text-muted-foreground">
                      {collection.slug}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Loại
                    </Label>
                    <div className="mt-1">{getTypeBadge(collection.type)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </Label>
                    <div className="mt-1">{getStatusBadge(collection)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Thứ tự hiển thị
                    </Label>
                    <div className="text-lg font-semibold">
                      {collection.display_order}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Số sản phẩm
                    </Label>
                    <div className="text-lg font-semibold">
                      {collection.products_count}
                    </div>
                  </div>
                </div>

                {collection.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mô tả
                    </Label>
                    <div className="mt-1 text-slate-700 dark:text-slate-300">
                      {collection.description}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày bắt đầu
                    </Label>
                    <div className="text-slate-700 dark:text-slate-300">
                      {formatDateTime(collection.started_at)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày kết thúc
                    </Label>
                    <div className="text-slate-700 dark:text-slate-300">
                      {formatDateTime(collection.ended_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm trong Collection</CardTitle>
                <CardDescription>
                  {sortedProducts.length > 0
                    ? `${sortedProducts.length} sản phẩm (sắp xếp theo vị trí)`
                    : 'Chưa có sản phẩm nào'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-slate-800"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold">
                          {product.pivot.position + 1}
                        </div>
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.price.toLocaleString('vi-VN')}₫
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Tồn kho: {product.stock_quantity}
                          </div>
                        </div>
                        <Link href={route('admin.products.show', product.id)}>
                          <Button variant="ghost" size="sm">
                            Xem
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Chưa có sản phẩm nào trong collection này
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Ngày tạo</Label>
                    <div className="text-slate-700 dark:text-slate-300">
                      {new Date(collection.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Cập nhật lần cuối</Label>
                    <div className="text-slate-700 dark:text-slate-300">
                      {new Date(collection.updated_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

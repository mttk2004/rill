import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AdminNavigation } from '@/components/admin-navigation';
import {
  type AdminArtist,
  getArtistStatusBadge,
  formatProductCount,
  formatDate,
  formatPrice,
} from '@/lib/artist-helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Music2,
  Globe,
  Calendar,
  Package,
  ShoppingCart,
  RotateCcw,
  Trash2,
  Edit,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ArtistDetailProps {
  artist: AdminArtist;
}

export default function ArtistDetail({ artist }: ArtistDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa nghệ sĩ này?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(route('admin.artists.destroy', artist.id));
      toast.success('Đã xóa nghệ sĩ thành công');
      router.visit(route('admin.artists'));
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error('Không thể xóa nghệ sĩ');
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await axios.post(route('admin.artists.restore', artist.id));
      toast.success('Đã khôi phục nghệ sĩ thành công');
      router.reload();
    } catch (error) {
      console.error('Error restoring artist:', error);
      toast.error('Không thể khôi phục nghệ sĩ');
      setIsRestoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title={`Chi tiết nghệ sĩ - ${artist.name}`} />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href={route('admin.artists')}>
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Quay lại danh sách
              </Button>
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Chi tiết nghệ sĩ</h1>
                <p className="text-muted-foreground">
                  Thông tin chi tiết về nghệ sĩ và sản phẩm
                </p>
              </div>

              <div className="flex gap-2">
                {artist.deleted_at ? (
                  <Button
                    onClick={handleRestore}
                    disabled={isRestoring}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {isRestoring ? 'Đang khôi phục...' : 'Khôi phục'}
                  </Button>
                ) : (
                  <>
                    <Link href={route('admin.artists.edit', artist.id)}>
                      <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Artist Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Artist Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music2 className="h-5 w-5" />
                    Thông tin nghệ sĩ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage
                        src={artist.image_url || undefined}
                        alt={artist.name}
                      />
                      <AvatarFallback className="text-3xl">
                        {artist.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold text-center mb-2">
                      {artist.name}
                    </h2>
                    {getArtistStatusBadge(artist.is_active, artist.deleted_at)}
                  </div>

                  <Separator />

                  {/* Artist Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Quốc gia</div>
                        <div className="font-medium">{artist.country}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Sản phẩm</div>
                        <div className="font-medium">
                          {formatProductCount(artist.products_count)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Ngày tạo</div>
                        <div className="font-medium">{formatDate(artist.created_at)}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          Cập nhật lần cuối
                        </div>
                        <div className="font-medium">{formatDate(artist.updated_at)}</div>
                      </div>
                    </div>

                    {artist.deleted_at && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">Ngày xóa</div>
                          <div className="font-medium text-red-600">
                            {formatDate(artist.deleted_at)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description Card */}
              {artist.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Mô tả
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {artist.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Products */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Sản phẩm ({artist.products?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {artist.products && artist.products.length > 0 ? (
                    <div className="space-y-4">
                      {artist.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-20 w-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1 truncate">
                              {product.name}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                              <span>SKU: {product.sku}</span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3.5 w-3.5" />
                                Tồn kho: {product.stock_quantity}
                              </span>
                              <span className="flex items-center gap-1">
                                <ShoppingCart className="h-3.5 w-3.5" />
                                Đã bán: {product.order_items_count}
                              </span>
                            </div>
                            <div className="text-lg font-semibold text-green-600">
                              {formatPrice(product.price)}
                            </div>
                          </div>

                          {/* View Button */}
                          <div className="flex-shrink-0">
                            <Link href={route('admin.products.show', product.id)}>
                              <Button variant="outline" size="sm" className="gap-2">
                                Xem chi tiết
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nghệ sĩ này chưa có sản phẩm nào
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

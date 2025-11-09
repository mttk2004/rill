import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Music2,
  Globe,
  Package,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { AdminArtist, getArtistStatusBadge, formatDate } from '@/lib/artist-helpers';

interface ArtistDetailDialogProps {
  artist: AdminArtist | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArtistDetailDialog = ({
  artist,
  isOpen,
  onClose,
}: ArtistDetailDialogProps) => {
  if (!artist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết nghệ sĩ</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Artist Profile */}
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage
                src={artist.image_url || undefined}
                alt={artist.name}
              />
              <AvatarFallback className="text-2xl">
                {artist.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">{artist.name}</h2>
            {getArtistStatusBadge(artist.is_active, artist.deleted_at)}
          </div>

          <Separator />

          {/* Artist Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Quốc gia</p>
                <p className="text-sm text-muted-foreground">
                  {artist.country || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Số sản phẩm</p>
                <p className="text-sm text-muted-foreground">
                  {artist.products_count || 0} sản phẩm
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Ngày tạo</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(artist.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Cập nhật lần cuối</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(artist.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {artist.deleted_at && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-200">
                  Đã xóa
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {formatDate(artist.deleted_at)}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {artist.description && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Music2 className="h-4 w-4" />
                  Mô tả
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {artist.description}
                </p>
              </div>
            </>
          )}

          {/* Products */}
          {artist.products && artist.products.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Sản phẩm ({artist.products.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {artist.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={product.image_url || '/placeholder-product.png'}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {product.pivot?.role === 'main' && 'Chính'}
                            {product.pivot?.role === 'featured' && 'Khách mời'}
                            {product.pivot?.role === 'composer' && 'Sáng tác'}
                            {product.pivot?.role === 'producer' && 'Sản xuất'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Number(product.price).toLocaleString()}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

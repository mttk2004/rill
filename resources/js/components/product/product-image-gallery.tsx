import { Disc3, ZoomIn, ZoomOut, X, Maximize2, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getCollectionBadgeClasses } from "@/lib/collection-colors";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
    if (zoomLevel <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoom50 = () => {
    setZoomLevel(0.5);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoom25 = () => {
    setZoomLevel(0.25);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    handleReset();
  };

  return (
    <>
      <div className="sticky top-4">
        <div
          className="aspect-square max-w-md mx-auto overflow-hidden rounded-lg border bg-muted flex items-center justify-center shadow-sm relative group cursor-pointer"
          onClick={() => product.image_url && setIsDialogOpen(true)}
        >
          {product.image_url ? (
            <>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white">
                  <Maximize2 className="h-6 w-6" />
                  <span className="text-sm font-medium">Xem ảnh</span>
                </div>
              </div>
              
              {/* Collection Corner Sticker with Hover Effect */}
              {product.collection && (
                <div className="absolute top-0 right-0 z-10">
                  <div
                    className={`${getCollectionBadgeClasses(product.collection.id)} rounded-bl-xl shadow-lg transition-all duration-300 ease-out overflow-hidden`}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 0)'
                    }}
                  >
                    <div className="flex items-center gap-1.5 px-2 py-1.5 group-hover:px-3">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-wide whitespace-nowrap max-w-0 group-hover:max-w-[200px] transition-all duration-300 ease-out overflow-hidden">
                        {product.collection.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Disc3 className="h-20 w-20 mb-3" />
              <p className="text-sm">Chưa có hình ảnh</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent
          className="max-w-screen max-h-screen w-screen h-screen p-0 bg-black/95 border-0"
          onInteractOutside={handleDialogClose}
        >
          <VisuallyHidden>
            <DialogTitle>{product.name} - Xem ảnh</DialogTitle>
          </VisuallyHidden>

          {/* Control Bar */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2 pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.25}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm font-medium min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              {zoomLevel !== 1 && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-white hover:bg-white/20 text-xs"
                    onClick={handleZoom25}
                    disabled={zoomLevel === 0.25}
                  >
                    25%
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-white hover:bg-white/20 text-xs"
                    onClick={handleZoom50}
                    disabled={zoomLevel === 0.5}
                  >
                    50%
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-white hover:bg-white/20 text-xs"
                    onClick={handleReset}
                  >
                    100%
                  </Button>
                </>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-black/80 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg"
              onClick={handleDialogClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Image Container */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain transition-transform duration-200 select-none"
              style={{
                transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                transformOrigin: 'center center'
              }}
              draggable={false}
            />
          </div>

          {/* Product Info Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white rounded-lg px-4 py-3 max-w-md pointer-events-none">
            <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
            <p className="text-xs text-white/70">
              {product.artists?.map(a => a.name).join(', ')}
            </p>
          </div>

          {/* Zoom Hint */}
          {zoomLevel === 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white/70 rounded-lg px-3 py-2 text-xs pointer-events-none">
              💡 Dùng nút +/- để phóng to/thu nhỏ
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

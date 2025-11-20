import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, X, Download, MessageCircle, Disc3, Music2, Star, AlertTriangle, Camera } from "lucide-react";
import { Link, Head } from "@inertiajs/react";
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/ui/page-header';
import { formatVND } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';
import { useToastRouter } from '@/hooks/use-toast-router';
import imageCompression from 'browser-image-compression';

interface Product {
  id: number;
  title: string;
  artist_name: string;
  price: number;
  image_url?: string;
  quantity: number;
  sku: string;
  slug: string;
  user_review?: {
    id: number;
    rating: number;
    comment: string;
    images?: string[];
  } | null;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

interface TimelineEvent {
  status: string;
  date: string;
  description: string;
  notes?: string | null;
  created_by?: string | null;
}

interface Order {
  id: string;
  order_id: string; // Database primary key
  date: string;
  status: string;
  total: number;
  delivered_date?: string;
  payment_method: string;
  payment_status?: string | null;
  items: Product[];
  shipping_address: ShippingAddress;
  timeline: TimelineEvent[];
}

interface OrderDetailProps {
  order?: Order | { data: Order };
}

// Helper functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "confirmed":
      return <Package className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "delivered":
      return <CheckCircle className="h-4 w-4" />;
    case "cancelled":
      return <X className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "shipped":
      return "Đang giao";
    case "delivered":
      return "Đã giao";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Chưa xác định";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    case "confirmed":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    case "shipped":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
    case "delivered":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "cancelled":
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-400";
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "pending":
      return "secondary";
    case "confirmed":
      return "default";
    case "shipped":
      return "outline";
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const OrderDetail = ({ order: orderProp }: OrderDetailProps) => {
  // Normalize the order data - handle both direct Order and wrapped { data: Order }
  const order = orderProp && typeof orderProp === 'object' && 'data' in orderProp ? orderProp.data : orderProp as Order;
  const toastRouter = useToastRouter();

  // State for dialogs
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<Product | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // Track existing server images
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle cancel order
  const handleCancelOrder = () => {
    toastRouter.post(
      route('orders.cancel', { order: order.order_id }),
      {},
      {
        pending: 'Đang hủy đơn hàng...',
        success: 'Đơn hàng đã được hủy thành công!',
        error: 'Không thể hủy đơn hàng. Vui lòng thử lại!',
      },
      {
        onSuccess: () => {
          setShowCancelDialog(false);
        },
      }
    );
  };

  // Handle retry payment
  const handleRetryPayment = async () => {
    setIsSubmitting(true);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch(route('orders.retry-payment', { order: order.order_id }), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate payment URL');
      }

      const data = await response.json();

      if (data.error) {
        // Server returned an error
        toast.error(data.error);
        setIsSubmitting(false);
      } else if (data.payment_url) {
        // Redirect to VNPAY
        window.location.href = data.payment_url;
      } else {
        toast.error('Không thể tạo link thanh toán. Vui lòng thử lại!');
        setIsSubmitting(false);
      }
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
      setIsSubmitting(false);
    }
  };

  // Handle submit review
  const handleSubmitReview = () => {
    if (!selectedProductForReview) return;

    const isUpdating = !!selectedProductForReview.user_review;
    setIsSubmitting(true);

    // Create FormData to support file uploads
    // Include existing image URLs that should be kept
    const formData = {
      rating: reviewRating,
      comment: reviewComment,
      images: reviewImages,
      existing_images: existingImageUrls,
    };

    toastRouter.post(
      route('products.reviews.store', { product: selectedProductForReview.slug }),
      formData,
      {
        pending: 'Đang gửi đánh giá...',
        success: isUpdating
          ? 'Đánh giá đã được cập nhật thành công!'
          : 'Cảm ơn bạn đã đánh giá sản phẩm!',
        error: 'Có lỗi xảy ra. Vui lòng thử lại!',
      },
      {
        onSuccess: () => {
          setShowReviewDialog(false);
          setSelectedProductForReview(null);
          setReviewRating(5);
          setReviewComment('');
          setReviewImages([]);
          setImagePreviews([]);
          setExistingImageUrls([]);
        },
        onError: () => {
          // Error is already handled by toast
        },
        onFinish: () => {
          // Always reset submitting state regardless of success or error
          setIsSubmitting(false);
        }
      }
    );
  };

  // Open review dialog for a product
  const openReviewDialog = (product: Product) => {
    setSelectedProductForReview(product);
    // If user has already reviewed, pre-fill the form
    if (product.user_review) {
      setReviewRating(product.user_review.rating);
      setReviewComment(product.user_review.comment);
      // Show existing images as previews
      if (product.user_review.images && product.user_review.images.length > 0) {
        setExistingImageUrls(product.user_review.images);
        setImagePreviews([]); // Clear new image previews
      } else {
        setExistingImageUrls([]);
        setImagePreviews([]);
      }
      setReviewImages([]); // No new images yet
    } else {
      setReviewRating(5);
      setReviewComment('');
      setReviewImages([]);
      setImagePreviews([]);
      setExistingImageUrls([]);
    }
    setShowReviewDialog(true);
  };

  if (!order) {
    return (
      <AppLayout>
        <Head title="Không tìm thấy đơn hàng - Rill" />
        <PageHeader
          title="Không tìm thấy đơn hàng"
          subtitle="Đơn hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa"
          size="md"
          actions={
            <Link href="/orders">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại đơn hàng
              </Button>
            </Link>
          }
        />
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mb-6 shadow-2xl">
            <Music2 className="h-10 w-10 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ nếu bạn cần giúp đỡ
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head title={`Đơn hàng #${order.id} - Rill`} />

      {/* Page Header */}
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold">Đơn hàng #{order.id || 'N/A'}</span>
            <Badge
              variant={getStatusVariant(order.status || 'pending')}
              className={`text-sm px-3 py-1 ${(order.status || 'pending') === 'delivered'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : (order.status || 'pending') === 'shipped'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : (order.status || 'pending') === 'confirmed'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : ''
                }`}
            >
              {getStatusIcon(order.status || 'pending')}
              <span className="ml-1.5">{getStatusLabel(order.status || 'pending')}</span>
            </Badge>
          </div>
        }
        subtitle={`Đặt ngày ${new Date(order.date || Date.now()).toLocaleDateString('vi-VN')}`}
        size="md"
        actions={
          <Link href="/orders">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách đơn hàng
            </Button>
          </Link>
        }
      />

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Timeline */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Trạng thái đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {(order.timeline || []).filter(Boolean).length > 0 ? (
                      (order.timeline || []).filter(Boolean).map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`p-2 rounded-full ${getStatusColor(event.status)}`}>
                              {getStatusIcon(event.status)}
                            </div>
                            {index < order.timeline.length - 1 && (
                              <div className="w-px h-full min-h-[2rem] bg-slate-200 dark:bg-slate-700 my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-slate-900 dark:text-white text-sm">
                              {event.description}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {new Date(event.date).toLocaleString('vi-VN')}
                            </p>
                            {event.notes && (
                              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                                <span className="font-medium">Ghi chú:</span> {event.notes}
                              </div>
                            )}
                            {event.created_by && (
                              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">
                                <span className="font-medium">Bởi:</span> {event.created_by}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <Clock className="h-12 w-12 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm">Chưa có lịch sử trạng thái</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-amber-500" />
                    Sản phẩm ({(order.items || []).length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {(order.items || []).length > 0 ? (order.items || []).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Disc3 className="h-8 w-8 text-amber-500" />
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.slug}`}>
                            <h4 className="font-semibold text-slate-900 dark:text-white hover:text-amber-600 transition-colors truncate">
                              {item.title}
                            </h4>
                          </Link>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            {item.artist_name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              SKU: {item.sku}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              SL: {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Price & Review Button */}
                        <div className="text-right flex-shrink-0 space-y-2">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {formatVND(item.price)}
                          </p>
                          {order.status === "delivered" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReviewDialog(item)}
                              className="text-xs h-7 px-2"
                            >
                              <Star className={`h-3 w-3 mr-1 ${item.user_review ? 'fill-amber-500 text-amber-500' : ''}`} />
                              {item.user_review ? 'Chỉnh sửa' : 'Đánh giá'}
                            </Button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <Package className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm">Không có sản phẩm nào trong đơn hàng này</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-4 bg-amber-50 dark:bg-amber-950/20">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Tạm tính</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatVND(order.total || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900 dark:text-white">Tổng cộng</span>
                      <span className="text-lg font-bold text-amber-600">
                        {formatVND(order.total || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Thanh toán</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {order.payment_method || 'N/A'}
                      </span>
                    </div>
                  </div>
                  {order.payment_status && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Trạng thái</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${order.payment_status === 'completed'
                            ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : order.payment_status === 'pending'
                              ? order.payment_method === 'COD'
                                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                              : order.payment_status === 'failed'
                                ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                          {order.payment_status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {order.payment_status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {order.payment_status === 'failed' && <X className="h-3 w-3 mr-1" />}
                          {order.payment_status === 'completed' ? 'Đã thanh toán'
                            : order.payment_status === 'pending'
                              ? order.payment_method === 'COD'
                                ? 'Thanh toán khi nhận hàng'
                                : 'Chờ thanh toán'
                              : order.payment_status === 'failed' ? 'Thất bại'
                                : order.payment_status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="h-5 w-5 text-amber-500" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {(order.shipping_address || {}).name || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {(order.shipping_address || {}).phone || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {(order.shipping_address || {}).address || 'N/A'}
                  </p>
                  {(order.shipping_address || {}).notes && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                      <p className="text-xs text-amber-900 dark:text-amber-200">
                        <span className="font-medium">Ghi chú:</span> {(order.shipping_address || {}).notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 space-y-2">
                  {order.payment_status === "completed" && (
                    <>
                      <a href={route('orders.invoice', { order: order.order_id })}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Tải hóa đơn
                        </Button>
                      </a>
                    </>
                  )}
                  {order.status === "pending" && order.payment_status === "pending" && order.payment_method === "VNPAY" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                      onClick={handleRetryPayment}
                      disabled={isSubmitting}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Đang xử lý...' : 'Thanh toán lại'}
                    </Button>
                  )}
                  {order.status === "pending" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hủy đơn hàng
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Liên hệ hỗ trợ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Order Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Xác nhận hủy đơn hàng
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng #{order.id}? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không, giữ đơn hàng</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-red-500 hover:bg-red-600"
            >
              Có, hủy đơn hàng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Product Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              {selectedProductForReview?.user_review ? 'Chỉnh sửa đánh giá' : 'Đánh giá sản phẩm'}
            </DialogTitle>
            <DialogDescription>
              {selectedProductForReview?.user_review
                ? 'Cập nhật đánh giá của bạn về sản phẩm này'
                : 'Chia sẻ trải nghiệm của bạn về sản phẩm này'}
            </DialogDescription>
          </DialogHeader>

          {selectedProductForReview && (
            <div className="space-y-4 py-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-12 h-12 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedProductForReview.image_url ? (
                    <img
                      src={selectedProductForReview.image_url}
                      alt={selectedProductForReview.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Disc3 className="h-6 w-6 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{selectedProductForReview.title}</p>
                  <p className="text-xs text-slate-500 truncate">{selectedProductForReview.artist_name}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Đánh giá của bạn</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${star <= reviewRating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-slate-300 dark:text-slate-600'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="review-comment">Nhận xét của bạn</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-slate-500">
                  Tối thiểu 10 ký tự, tối đa 5000 ký tự
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Hình ảnh sản phẩm (tùy chọn)</Label>
                <div className="flex flex-wrap gap-2">
                  {/* Upload button */}
                  {(existingImageUrls.length + reviewImages.length) < 5 && (
                    <label className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col items-center justify-center w-20 h-20">
                      <Camera className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-400">Thêm ảnh</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files) return;

                          const newImages = [...reviewImages];
                          const newPreviews = [...imagePreviews];
                          const currentTotal = existingImageUrls.length + newImages.length;

                          for (let i = 0; i < files.length; i++) {
                            if (currentTotal + i >= 5) {
                              toast.warning('Bạn chỉ có thể tải lên tối đa 5 ảnh');
                              break;
                            }

                            const file = files[i];

                            try {
                              // Compress image
                              const compressedFile = await imageCompression(file, {
                                maxSizeMB: 1,
                                maxWidthOrHeight: 1920,
                              });

                              newImages.push(compressedFile);
                              newPreviews.push(URL.createObjectURL(compressedFile));
                            } catch (error) {
                              console.error('Error compressing image:', error);
                              // If compression fails, use original file
                              newImages.push(file);
                              newPreviews.push(URL.createObjectURL(file));
                            }
                          }

                          setReviewImages(newImages);
                          setImagePreviews(newPreviews);

                          // Reset input
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        disabled={isSubmitting}
                      />
                    </label>
                  )}

                  {/* Existing images from server */}
                  {existingImageUrls.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-amber-300 dark:border-amber-700">
                      <img
                        src={url}
                        alt={`Existing ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newExisting = existingImageUrls.filter((_, i) => i !== idx);
                          setExistingImageUrls(newExisting);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                        disabled={isSubmitting}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* New image previews */}
                  {imagePreviews.map((src, idx) => (
                    <div key={`new-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                      <img
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = reviewImages.filter((_, i) => i !== idx);
                          const newPreviews = imagePreviews.filter((_, i) => i !== idx);

                          // Revoke object URL to free memory
                          URL.revokeObjectURL(imagePreviews[idx]);

                          setReviewImages(newImages);
                          setImagePreviews(newPreviews);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                        disabled={isSubmitting}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Tối đa 5 ảnh, mỗi ảnh không quá 2MB (JPEG, PNG, WebP)
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || reviewComment.length < 10}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {isSubmitting
                ? (selectedProductForReview?.user_review ? 'Đang cập nhật...' : 'Đang gửi...')
                : (selectedProductForReview?.user_review ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default OrderDetail;

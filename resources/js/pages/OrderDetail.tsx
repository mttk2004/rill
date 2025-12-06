import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, MapPin, CreditCard, Package, Truck, CheckCircle, Star, Download, RefreshCw, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import Button from '../components/Button';
import { formatDate } from '../utils/date';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  product_slug: string | null;
  product_deleted: boolean;
  quantity: number;
  unit_price: string;
  total_price: string;
  product?: {
    id: string;
    slug: string;
    reviews?: Array<{
      id: string;
      rating: number;
      comment: string;
    }>;
  };
}

interface ShippingAddress {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  ward: string;
  district: string;
  province: string;
}

interface Payment {
  payment_method: string | { [key: string]: string };
  payment_status: string | { [key: string]: string };
}

interface StatusHistory {
  status: string;
  created_at: string;
  notes: string | null;
  created_by?: {
    id: string;
    name: string;
    is_admin: boolean;
  } | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string | { [key: string]: string };
  subtotal: string;
  shipping_fee: string;
  discount_amount: string;
  total_amount: string;
  placed_at: string;
  tracking_number?: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment?: Payment;
  status_histories?: StatusHistory[];
}

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const { showToast } = useToast();
  const [reviewingProduct, setReviewingProduct] = useState<{ id: string; name: string; slug: string } | null>(null);

  const reviewForm = useForm<{
    rating: number;
    comment: string;
    images?: File[];
  }>({
    rating: 5,
    comment: '',
    images: [],
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleDownloadInvoice = () => {
    if (!canDownloadInvoice) {
      showToast('Chỉ có thể tải hóa đơn cho đơn hàng đã thanh toán', 'error');
      return;
    }

    // Download invoice PDF
    window.location.href = `/orders/${order.id}/invoice`;
    showToast('Đang tải hóa đơn...', 'success');
  };

  const handleRetryPayment = async () => {
    if (isRetryingPayment) return;

    setIsRetryingPayment(true);

    try {
      const response = await axios.post(`/orders/${order.id}/retry-payment`);

      if (response.data.payment_url) {
        showToast('Đang chuyển đến trang thanh toán...', 'success');
        // Redirect to VNPAY payment page
        window.location.href = response.data.payment_url;
      } else {
        showToast('Không thể lấy link thanh toán. Vui lòng thử lại!', 'error');
        setIsRetryingPayment(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        showToast(error.response.data.error, 'error');
      } else {
        showToast('Không thể thanh toán lại. Vui lòng thử lại!', 'error');
      }
      setIsRetryingPayment(false);
    }
  };

  const handleCancelOrder = () => {
    if (isCancelling) return;

    setIsCancelling(true);

    router.post(`/orders/${order.id}/cancel`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Đơn hàng đã được hủy thành công', 'success');
        setShowCancelModal(false);
        setIsCancelling(false);
      },
      onError: (errors) => {
        const errorMessage = errors.error || Object.values(errors)[0] || 'Không thể hủy đơn hàng. Vui lòng thử lại!';
        showToast(errorMessage as string, 'error');
        setIsCancelling(false);
      },
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate: max 5 images
    if (selectedImages.length + files.length > 5) {
      showToast('Chỉ được tải tối đa 5 ảnh', 'error');
      return;
    }

    // Validate: each image max 512KB
    const invalidFiles = files.filter(f => f.size > 512 * 1024);
    if (invalidFiles.length > 0) {
      showToast('Mỗi ảnh không được vượt quá 512KB', 'error');
      return;
    }

    // Validate: only images
    const nonImages = files.filter(f => !f.type.startsWith('image/'));
    if (nonImages.length > 0) {
      showToast('Chỉ chấp nhận file ảnh', 'error');
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);
    reviewForm.setData('images', newImages);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
    reviewForm.setData('images', newImages);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingProduct) return;

    reviewForm.post(`/products/${reviewingProduct.slug}/reviews`, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        showToast('Đánh giá sản phẩm thành công!', 'success');
        setReviewingProduct(null);
        setSelectedImages([]);
        setImagePreviews([]);
        reviewForm.reset();
      },
      onError: (errors) => {
        if (errors.comment) {
          showToast(errors.comment, 'error');
        } else if (errors.images) {
          showToast(typeof errors.images === 'string' ? errors.images : 'Lỗi tải ảnh', 'error');
        } else {
          showToast('Đánh giá thất bại, vui lòng thử lại', 'error');
        }
      },
    });
  };

  const canDownloadInvoice = order.payment &&
    (typeof order.payment.payment_status === 'string'
      ? order.payment.payment_status === 'completed'
      : Object.values(order.payment.payment_status)[0] === 'completed');

  const canRetryPayment = order.payment &&
    (typeof order.payment.payment_method === 'string'
      ? order.payment.payment_method === 'vnpay'
      : Object.values(order.payment.payment_method)[0] === 'vnpay') &&
    (typeof order.payment.payment_status === 'string'
      ? (order.payment.payment_status === 'pending' || order.payment.payment_status === 'failed')
      : (Object.values(order.payment.payment_status)[0] === 'pending' || Object.values(order.payment.payment_status)[0] === 'failed')) &&
    (typeof order.status === 'string' ? order.status : Object.values(order.status)[0]) === 'pending';

  const canCancelOrder = (typeof order.status === 'string' ? order.status : Object.values(order.status)[0]) === 'pending';

  const isDelivered = (typeof order.status === 'string' ? order.status : Object.values(order.status)[0]) === 'delivered';

  // Definition of steps with specific colors
  const steps = [
    {
      id: 'pending',
      label: 'Đặt hàng',
      icon: Package,
      activeColor: 'bg-blue-600 text-white shadow-blue-200',
      textColor: 'text-blue-700'
    },
    {
      id: 'processing',
      label: 'Đang xử lý',
      icon: CreditCard,
      activeColor: 'bg-purple-600 text-white shadow-purple-200',
      textColor: 'text-purple-700'
    },
    {
      id: 'shipping',
      label: 'Đang giao',
      icon: Truck,
      activeColor: 'bg-orange-500 text-white shadow-orange-200',
      textColor: 'text-orange-700'
    },
    {
      id: 'delivered',
      label: 'Hoàn tất',
      icon: CheckCircle,
      activeColor: 'bg-emerald-600 text-white shadow-emerald-200',
      textColor: 'text-emerald-700'
    },
  ];

  // Map status_histories to steps with real data
  const statusMap: { [key: string]: string } = {
    pending: 'pending',
    confirmed: 'processing',
    shipped: 'shipping',
    delivered: 'delivered',
  };

  // Find current step based on order status
  const currentStatus = typeof order.status === 'string' ? order.status : Object.values(order.status)[0];
  const currentStepIndex = steps.findIndex(s => s.id === statusMap[currentStatus]);

  // Helper to get real timestamp from status_histories
  const getStepTime = (stepId: string) => {
    if (!order.status_histories) return null;

    // Map step id back to status
    const reverseMap: { [key: string]: string } = {
      pending: 'pending',
      processing: 'confirmed',
      shipping: 'shipped',
      delivered: 'delivered',
    };

    const statusToFind = reverseMap[stepId];
    const history = order.status_histories.find(h => h.status === statusToFind);

    if (history) {
      return formatDate(history.created_at);
    }

    return null;
  };

  const isCancelled = (typeof order.status === 'string' ? order.status : Object.values(order.status)[0]) === 'cancelled';

  return (
    <AppLayout>
      <Head title={`Đơn hàng #${order.id} - Rill`} />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Quay lại danh sách
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl font-bold text-gray-900">Chi Tiết Đơn Hàng</h1>
                {isCancelled && <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">ĐÃ HỦY</span>}
              </div>
              <p className="text-gray-500 mt-1">Mã đơn: <span className="font-mono font-medium text-gray-900">#{order.order_number}</span> - {formatDate(order.placed_at, false)}</p>
            </div>
            {order.tracking_number && (
              <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm shadow-sm">
                <span className="text-gray-500">Mã vận đơn:</span> <span className="font-bold text-primary ml-2 tracking-wide">{order.tracking_number}</span>
              </div>
            )}
          </div>

          {/* Progress Stepper */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 overflow-x-auto shadow-sm">
            {isCancelled ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <XCircle size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Đơn hàng đã bị hủy</h3>
                {order.status_histories && (() => {
                  const cancelHistory = order.status_histories.find(h => h.status === 'cancelled');
                  if (!cancelHistory) return null;

                  const creatorLabel = cancelHistory.created_by
                    ? (cancelHistory.created_by.is_admin ? 'Admin' : cancelHistory.created_by.name)
                    : 'Hệ thống';

                  return (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">{formatDate(cancelHistory.created_at)}</p>
                      {cancelHistory.notes && (
                        <p className="text-sm text-gray-700 mb-1">{cancelHistory.notes}</p>
                      )}
                      <p className="text-xs text-gray-500">bởi {creatorLabel}</p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex items-start justify-between min-w-[600px]">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const Icon = step.icon;
                  const time = getStepTime(step.id);

                  // Determine styles
                  let circleClass = 'bg-gray-100 text-gray-400';
                  let textClass = 'text-gray-400';

                  if (isCompleted) {
                    circleClass = `${step.activeColor} shadow-lg ring-4 ring-white`;
                    textClass = `font-bold ${step.textColor}`;
                  }

                  return (
                    <div key={step.id} className="flex flex-col items-center relative z-10 w-1/4 group">

                      {/* Circle Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-20 ${circleClass}`}>
                        <Icon size={20} />
                      </div>

                      {/* Text Label */}
                      <span className={`mt-4 text-sm transition-colors duration-300 ${textClass}`}>{step.label}</span>

                      {/* Timestamp */}
                      {time && (
                        <span className="mt-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{time}</span>
                      )}

                      {/* Notes & Creator */}
                      {isCompleted && (() => {
                        const reverseMap: { [key: string]: string } = {
                          pending: 'pending',
                          processing: 'confirmed',
                          shipping: 'shipped',
                          delivered: 'delivered',
                        };
                        const statusToFind = reverseMap[step.id];
                        const history = order.status_histories?.find(h => h.status === statusToFind);

                        if (!history) return null;

                        const creatorLabel = history.created_by
                          ? (history.created_by.is_admin ? 'Admin' : history.created_by.name)
                          : 'Hệ thống';

                        return (
                          <>
                            {history.notes && (
                              <p className="mt-2 text-xs text-gray-600 text-center max-w-[120px] line-clamp-2">{history.notes}</p>
                            )}
                            <p className="mt-1 text-[10px] text-gray-400 text-center">bởi {creatorLabel}</p>
                          </>
                        );
                      })()}

                      {/* Connector Line */}
                      {idx !== steps.length - 1 && (
                        <div className="absolute top-6 left-[50%] w-full h-[3px] -z-10 bg-gray-100">
                          <div
                            className={`h-full transition-all duration-700 ease-out ${idx < currentStepIndex ? 'bg-primary' : 'w-0'}`}
                            style={{ width: idx < currentStepIndex ? '100%' : '0%' }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-900 flex justify-between">
                  <span>Sản phẩm</span>
                  <span className="text-sm font-normal text-gray-500">{order.items?.length || 0} món</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items?.map((item: OrderItem, idx: number) => {
                    const hasReviewed = item.product?.reviews && item.product.reviews.length > 0;
                    const existingReview = hasReviewed && item.product?.reviews ? item.product.reviews[0] : null;
                    const canReview = isDelivered;

                    return (
                      <div key={idx} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 relative">
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                          )}
                          {item.product_deleted && (
                            <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded">Ngừng KD</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                                {item.product_deleted && (
                                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">Ngừng kinh doanh</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                {item.product_slug && !item.product_deleted && (
                                  <Link href={`/products/${item.product_slug}`} className="text-xs text-primary hover:underline font-medium">Xem sản phẩm</Link>
                                )}
                                {item.product_deleted && (
                                  <span className="text-xs text-gray-400 cursor-not-allowed">Sản phẩm không còn kinh doanh</span>
                                )}
                                {canReview && item.product && !item.product_deleted && (
                                  <button
                                    onClick={() => {
                                      setReviewingProduct({ id: item.product!.id, name: item.product_name, slug: item.product!.slug });
                                      if (existingReview) {
                                        reviewForm.setData({
                                          rating: existingReview.rating,
                                          comment: existingReview.comment,
                                          images: [],
                                        });
                                      } else {
                                        reviewForm.setData({ rating: 5, comment: '', images: [] });
                                      }
                                    }}
                                    className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                                  >
                                    <Star size={12} /> {hasReviewed ? 'Chỉnh sửa đánh giá' : 'Đánh giá'}
                                  </button>
                                )}
                                {hasReviewed && existingReview && (
                                  <span className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle size={12} /> Đã đánh giá ({existingReview.rating}/5 ⭐)
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="font-bold text-gray-900">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(item.total_price))}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded text-xs">x{item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between mb-3 text-sm text-gray-600">
                  <span>Tổng tiền hàng</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.subtotal))}</span>
                </div>
                <div className="flex justify-between mb-3 text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.shipping_fee))}</span>
                </div>
                {parseFloat(order.discount_amount) > 0 && (
                  <div className="flex justify-between mb-3 text-sm text-green-600 font-medium">
                    <span>Giảm giá</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.discount_amount))}</span>
                  </div>
                )}
                <div className="flex justify-between pt-4 border-t border-gray-100 text-lg font-bold text-gray-900">
                  <span>Tổng thanh toán</span>
                  <span className="text-primary text-xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(order.total_amount))}</span>
                </div>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <MapPin size={18} className="text-accent" /> Địa chỉ nhận hàng
                </h3>
                <div className="text-sm text-gray-600 space-y-1.5">
                  <p className="font-bold text-gray-900 text-base">{order.shipping_address.full_name}</p>
                  <p className="text-gray-500">{order.shipping_address.phone}</p>
                  <p>{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                  <p>{order.shipping_address.ward}, {order.shipping_address.district}</p>
                  <p className="font-medium text-gray-800">{order.shipping_address.province}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CreditCard size={18} className="text-accent" /> Thanh toán
                </h3>
                <div className="text-sm text-gray-600">
                  {order.payment ? (
                    <>
                      <p className="mb-2">Phương thức: <span className="font-medium text-gray-900">{typeof order.payment.payment_method === 'string' ? order.payment.payment_method : Object.values(order.payment.payment_method)[0].toUpperCase()}</span></p>
                      <p className={`text-xs font-bold inline-block px-2.5 py-1 rounded border ${(typeof order.payment.payment_status === 'string' ? order.payment.payment_status : Object.values(order.payment.payment_status)[0]) === 'completed'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : (typeof order.payment.payment_status === 'string' ? order.payment.payment_status : Object.values(order.payment.payment_status)[0]) === 'failed'
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}>
                        {(typeof order.payment.payment_status === 'string' ? order.payment.payment_status : Object.values(order.payment.payment_status)[0]) === 'completed'
                          ? 'ĐÃ THANH TOÁN'
                          : (typeof order.payment.payment_status === 'string' ? order.payment.payment_status : Object.values(order.payment.payment_status)[0]) === 'failed'
                            ? 'THANH TOÁN THẤT BẠI'
                            : 'CHƯA THANH TOÁN'}
                      </p>
                    </>
                  ) : (
                    <p>Chưa có thông tin thanh toán</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {canRetryPayment && (
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={handleRetryPayment}
                    disabled={isRetryingPayment}
                    className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <RefreshCw size={18} className={isRetryingPayment ? 'animate-spin' : ''} />
                    {isRetryingPayment ? 'Đang xử lý...' : 'Thanh toán lại'}
                  </Button>
                )}
                <Button
                  fullWidth
                  variant="primary"
                  disabled={!canDownloadInvoice}
                  onClick={handleDownloadInvoice}
                  className="flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  {canDownloadInvoice ? 'Tải hóa đơn' : 'Chưa thể tải hóa đơn'}
                </Button>
                {canCancelOrder && (
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <XCircle size={18} />
                    Hủy đơn hàng
                  </Button>
                )}
                <Button fullWidth variant="outline">Yêu cầu hỗ trợ</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận hủy đơn hàng</h3>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn hủy đơn hàng <span className="font-mono font-medium text-gray-900">#{order.order_number}</span> không?
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                fullWidth
              >
                Đóng
              </Button>
              <Button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                fullWidth
                className="bg-red-600 hover:bg-red-700 text-white border-transparent"
              >
                {isCancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {reviewForm.data.rating > 0 && reviewForm.data.comment ? 'Chỉnh sửa đánh giá' : 'Đánh giá sản phẩm'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">{reviewingProduct.name}</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => reviewForm.setData('rating', star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${star <= reviewForm.data.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét (tối thiểu 10 ký tự)</label>
                <textarea
                  value={reviewForm.data.comment}
                  onChange={(e) => reviewForm.setData('comment', e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  required
                  minLength={10}
                />
                {reviewForm.data.comment.length > 0 && reviewForm.data.comment.length < 10 && (
                  <p className="text-xs text-red-600 mt-1">
                    Nhận xét phải có ít nhất 10 ký tự (còn {10 - reviewForm.data.comment.length} ký tự)
                  </p>
                )}
                {reviewForm.errors.comment && (
                  <p className="text-xs text-red-600 mt-1">{reviewForm.errors.comment}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh (tùy chọn, tối đa 5 ảnh, mỗi ảnh ≤ 512KB)
                </label>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {selectedImages.length < 5 && (
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-xs text-gray-500">Nhấn để chọn ảnh</p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
                {reviewForm.errors.images && (
                  <p className="text-xs text-red-600 mt-1">{reviewForm.errors.images}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setReviewingProduct(null);
                    setSelectedImages([]);
                    setImagePreviews([]);
                    reviewForm.reset();
                  }}
                  fullWidth
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={reviewForm.processing}
                  fullWidth
                >
                  {reviewForm.processing ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

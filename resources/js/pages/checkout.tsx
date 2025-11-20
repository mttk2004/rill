import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import { MapPin, CreditCard, ShieldCheck, Loader2, Tag, X, Sparkles } from "lucide-react";
import { Head, usePage } from "@inertiajs/react";
import { type SharedData } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from "react-toastify";
import { formatVND } from '@/lib/utils';
import { useToastRouter } from '@/hooks/use-toast-router';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

interface CheckoutSettings {
  shipping: {
    free_threshold: number;
  };
}

// Define TypeScript interfaces for props
interface CartItem {
  id: number;
  product: {
    name: string;
    image_url: string | null;
    artists: Array<{ name: string }>;
  };
  quantity: number;
  total_price: number;
}

interface CartSummary {
  total_items: number;
  total_amount: number;
}

interface ShippingAddress {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  province: string;
  district: string;
  ward: string;
  is_default: boolean;
}

interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string | null;
  value: number;
  minimum_amount: number | null;
  maximum_discount: number | null;
  valid_from: string;
  valid_to: string;
  discount_amount: number | null;
}

interface CheckoutPageProps extends SharedData {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  shippingAddresses: ShippingAddress[];
  defaultShippingAddress: ShippingAddress;
}

// Zod schema for form validation
const checkoutSchema = z.object({
  shipping_address_id: z.string().min(1, "Vui lòng chọn một địa chỉ giao hàng."),
  payment_method: z.enum(['cod', 'vnpay']).default('cod'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const pageProps = usePage<CheckoutPageProps & { settings: CheckoutSettings }>().props;
  const { auth, cartItems, cartSummary, shippingAddresses, defaultShippingAddress, errors, settings } = pageProps;
  const toastRouter = useToastRouter();

  // Shipping fee state
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [isFreeShipping, setIsFreeShipping] = useState(false);

  // Voucher states
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [showVoucherSuggestions, setShowVoucherSuggestions] = useState(false);

  const form = useForm<CheckoutFormValues>({
    // @ts-expect-error - Type mismatch between zod .default() and react-hook-form
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address_id: defaultShippingAddress?.id,
      payment_method: 'cod' as const,
    },
  });

  const { control, handleSubmit, watch, formState: { isSubmitting } } = form;
  const selectedAddressId = watch('shipping_address_id');

  // Calculate shipping fee when address changes
  useEffect(() => {
    const calculateShippingFee = async () => {
      if (!selectedAddressId) {
        setShippingFee(null);
        return;
      }

      setIsCalculatingFee(true);
      try {
        const response = await axios.post('/checkout/shipping-fee', {
          address_id: selectedAddressId,
        });

        setShippingFee(response.data.shipping_fee);
        setIsFreeShipping(response.data.is_free_shipping);
      } catch (error) {
        console.error('Error calculating shipping fee:', error);
        toast.error('Không thể tính phí vận chuyển. Vui lòng thử lại.');
        setShippingFee(50000); // Fallback fee
        setIsFreeShipping(false);
      } finally {
        setIsCalculatingFee(false);
      }
    };

    calculateShippingFee();
  }, [selectedAddressId]);

  // Fetch available vouchers
  useEffect(() => {
    const fetchAvailableVouchers = async () => {
      setIsLoadingVouchers(true);
      try {
        const response = await axios.get('/api/vouchers/available', {
          params: { order_total: cartSummary.total_amount },
        });
        console.log('Vouchers API Response:', response.data);
        console.log('Available vouchers:', response.data.data.vouchers);
        setAvailableVouchers(response.data.data.vouchers);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      } finally {
        setIsLoadingVouchers(false);
      }
    };

    if (auth.user) {
      fetchAvailableVouchers();
    }
  }, [cartSummary.total_amount, auth.user]);

  // Apply voucher
  const handleApplyVoucher = async (code: string) => {
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsValidatingVoucher(true);
    try {
      const response = await axios.post('/api/vouchers/validate', {
        code: code,
        order_total: cartSummary.total_amount,
      });

      const voucherData = response.data.data.voucher;
      setAppliedVoucher({
        id: '',
        code: voucherData.code,
        name: voucherData.name,
        description: null,
        value: 0,
        minimum_amount: null,
        maximum_discount: null,
        valid_from: '',
        valid_to: '',
        discount_amount: voucherData.discount_amount,
      });
      setVoucherCode('');
      setShowVoucherSuggestions(false);
      toast.success(response.data.message || 'Áp dụng mã giảm giá thành công!');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'Mã giảm giá không hợp lệ';
      toast.error(errorMessage);
    } finally {
      setIsValidatingVoucher(false);
    }
  };  // Remove applied voucher
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
  };

  // Apply suggested voucher
  const handleApplySuggestedVoucher = (voucher: Voucher) => {
    setAppliedVoucher(voucher);
    setVoucherCode('');
    setShowVoucherSuggestions(false);
    toast.success('Đã áp dụng mã giảm giá!');
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    // Nếu là VNPAY, cần xử lý khác
    if (data.payment_method === 'vnpay') {
      try {
        // Lấy CSRF token từ meta tag
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

        const response = await fetch('/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.payment_url) {
          // Chuyển hướng đến VNPAY
          window.location.href = result.payment_url;
        } else {
          // Xử lý lỗi validation hoặc lỗi khác
          const errorMessage = result.message ||
            (result.errors ? Object.values(result.errors).flat().join(', ') : null) ||
            "Không thể tạo link thanh toán. Vui lòng thử lại.";
          toast.error(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
        toast.error(errorMessage);
      }
    } else {
      // COD: Sử dụng useToastRouter
      toastRouter.post(
        '/orders',
        data,
        {
          pending: 'Đang xử lý đơn hàng...',
          success: 'Đặt hàng thành công!',
          error: 'Đã có lỗi xảy ra, vui lòng thử lại.',
        }
      );
    }
  };

  return (
    <>
      <Head title="Thanh toán - Rill" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Navigation user={auth.user} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Hoàn tất đơn hàng</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">Kiểm tra thông tin và hoàn tất việc đặt hàng của bạn.</p>

            {/* @ts-expect-error - Type mismatch between zod schema and react-hook-form */}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Shipping and Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address Selection */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-slate-900 dark:text-white">
                      <MapPin className="text-amber-500" />
                      Địa chỉ giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Controller
                      name="shipping_address_id"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                          {shippingAddresses.map((address) => (
                            <Label key={address.id} htmlFor={`address-${address.id}`} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${field.value === address.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                              <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mr-4" />
                              <div className="flex-1">
                                <div className="flex justify-between items-center font-bold">
                                  <span>{address.full_name}</span>
                                  {address.is_default && <Badge variant="outline" className="text-xs">Mặc định</Badge>}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">{address.phone}</p>
                                <p className="text-slate-600 dark:text-slate-300">{`${address.address_line_1}, ${address.ward}, ${address.district}, ${address.province}`}</p>
                              </div>
                            </Label>
                          ))}
                        </RadioGroup>
                      )}
                    />
                    {errors.shipping_address_id && <p className="text-red-500 text-sm mt-2">{errors.shipping_address_id}</p>}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-slate-900 dark:text-white">
                      <CreditCard className="text-amber-500" />
                      Phương thức thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Controller
                      name="payment_method"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                          <Label htmlFor="cod" className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${field.value === 'cod' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                            <RadioGroupItem value="cod" id="cod" className="mr-4" />
                            <div className="flex-1">
                              <p className="font-bold">Thanh toán khi nhận hàng (COD)</p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">Trả tiền mặt khi nhân viên giao hàng đến.</p>
                            </div>
                          </Label>
                          {/* VNPAY Option - Now Active */}
                          <Label htmlFor="vnpay" className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${field.value === 'vnpay' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                            <RadioGroupItem value="vnpay" id="vnpay" className="mr-4" />
                            <div className="flex-1">
                              <p className="font-bold">Thanh toán qua VNPAY</p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">Thanh toán trực tuyến qua cổng VNPAY.</p>
                            </div>
                          </Label>
                        </RadioGroup>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Voucher Section */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-slate-900 dark:text-white">
                      <Tag className="text-amber-500" />
                      Mã giảm giá
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appliedVoucher ? (
                      // Applied voucher display
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border-2 border-amber-300 dark:border-amber-700">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Tag className="h-4 w-4 text-amber-600" />
                              <span className="font-bold text-amber-900 dark:text-amber-100">{appliedVoucher.code}</span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{appliedVoucher.name}</p>
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">
                              Giảm {formatVND(appliedVoucher.discount_amount || 0)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveVoucher}
                            className="text-slate-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Voucher input and suggestions
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập mã giảm giá"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            onFocus={() => setShowVoucherSuggestions(true)}
                            className="text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplyVoucher(voucherCode)}
                            disabled={isValidatingVoucher || !voucherCode.trim()}
                            className="border-amber-200 text-amber-600 hover:bg-amber-50"
                          >
                            {isValidatingVoucher ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Áp dụng'}
                          </Button>
                        </div>

                        {/* Voucher suggestions */}
                        {showVoucherSuggestions && availableVouchers.length > 0 && (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                              <Sparkles className="h-4 w-4 text-amber-500" />
                              <span className="font-medium">Mã giảm giá khả dụng</span>
                            </div>
                            {availableVouchers.map((voucher) => (
                              <button
                                key={voucher.id}
                                onClick={() => handleApplySuggestedVoucher(voucher)}
                                className="w-full text-left p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all"
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-bold text-amber-600 dark:text-amber-400">{voucher.code}</span>
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    -{formatVND(voucher.discount_amount || 0)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{voucher.name}</p>
                                {voucher.minimum_amount && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Đơn tối thiểu: {formatVND(voucher.minimum_amount)}
                                  </p>
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {isLoadingVouchers && (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                            <span className="ml-2 text-sm text-slate-500">Đang tải mã giảm giá...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Order Summary */}
              <div className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                    <CardTitle>Tóm tắt đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                            <img
                              src={item.product.image_url || '/placeholder-vinyl.jpg'}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-vinyl.jpg';
                              }}
                            />
                            <Badge className="absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{item.product.name}</p>
                            <p className="text-sm text-slate-500">{item.product.artists.map(a => a.name).join(', ')}</p>
                          </div>
                          <p className="font-semibold">{formatVND(item.total_price)}</p>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-6" />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tạm tính</span>
                        <span>{formatVND(cartSummary.total_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phí vận chuyển</span>
                        {isCalculatingFee ? (
                          <span className="text-slate-500 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang tính...
                          </span>
                        ) : shippingFee === null ? (
                          <span className="text-slate-500">Chọn địa chỉ</span>
                        ) : isFreeShipping || shippingFee === 0 ? (
                          <span className="font-semibold text-green-600">Miễn phí</span>
                        ) : (
                          <span>{formatVND(shippingFee)}</span>
                        )}
                      </div>
                      {isFreeShipping && (
                        <p className="text-xs text-green-600">🎉 Miễn phí vận chuyển cho đơn hàng trên {settings.shipping.free_threshold.toLocaleString('vi-VN')}₫</p>
                      )}
                      {appliedVoucher && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Giảm giá</span>
                          <span className="font-semibold">-{formatVND(appliedVoucher.discount_amount || 0)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Tổng cộng</span>
                        <span className="text-amber-600">
                          {(() => {
                            const subtotal = cartSummary.total_amount;
                            const shipping = shippingFee || 0;
                            const discount = appliedVoucher?.discount_amount || 0;
                            const total = subtotal + shipping - discount;
                            return formatVND(total);
                          })()}
                        </span>
                      </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" size="lg">
                      {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
                    </Button>
                    <div className="flex items-center justify-center mt-4 text-sm text-slate-500">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                      <span>Thông tin của bạn được bảo mật an toàn.</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

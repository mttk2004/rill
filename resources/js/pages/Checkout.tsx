import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useShop } from '../context/ShopContext';
import AppLayout from '@/layouts/app-layout';
import Button from '../components/Button';
import { CheckCircle, CreditCard, MapPin, Ticket } from 'lucide-react';
import type { UserAddress } from '@/types';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  value: number;
  minimum_amount: number | null;
  maximum_discount: number | null;
  discount_amount: number | null;
}

interface CheckoutProps {
  addresses: UserAddress[];
}

function CheckoutContent({ addresses = [] }: CheckoutProps) {
  const { cart, cartTotal } = useShop();
  const defaultAddress = addresses.find(a => a.is_default) || addresses[0];
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const { data, setData, post, processing } = useForm<{
    shipping_address_id: string | null;
    payment_method: 'cod' | 'vnpay';
    voucher_code: string;
  }>({
    shipping_address_id: defaultAddress?.id || null,
    payment_method: 'cod',
    voucher_code: '',
  });

  const [selectedAddress, setSelectedAddress] = useState<string | null>(defaultAddress?.id || null);
  const [isVoucherFocused, setIsVoucherFocused] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const finalTotal = cartTotal + shippingCost - discountAmount;

  // Fetch shipping cost when address changes
  useEffect(() => {
    const fetchShippingCost = async () => {
      if (!selectedAddress || cartTotal === 0) {
        setShippingCost(0);
        return;
      }

      setLoadingShipping(true);
      try {
        const response = await axios.post('/checkout/shipping-fee', {
          address_id: selectedAddress,
          order_total: cartTotal
        });

        const fee = response.data.shipping_fee ?? 0;
        setShippingCost(fee);
      } catch (error) {
        console.error('Failed to fetch shipping cost:', error);
        setShippingCost(35000);
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingCost();
  }, [selectedAddress, cartTotal]);

  // Fetch available vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get('/api/vouchers/available', {
          params: { order_total: cartTotal }
        });
        if (response.data.success && response.data.data.vouchers) {
          setAvailableVouchers(response.data.data.vouchers);
        }
      } catch (error) {
        console.error('Failed to fetch vouchers:', error);
      }
    };

    if (cartTotal > 0) {
      fetchVouchers();
    }
  }, [cartTotal]);

  const handleApplyVoucher = (voucher: Voucher) => {
    setData('voucher_code', voucher.code);
    setAppliedVoucher(voucher);
    setIsVoucherFocused(false);

    // Calculate discount
    let discount = 0;
    if (voucher.discount_amount) {
      discount = voucher.discount_amount;
    } else {
      discount = (cartTotal * voucher.value) / 100;
      if (voucher.maximum_discount && discount > voucher.maximum_discount) {
        discount = voucher.maximum_discount;
      }
    }
    setDiscountAmount(discount);
  };

  const handleRemoveVoucher = () => {
    setData('voucher_code', '');
    setAppliedVoucher(null);
    setDiscountAmount(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate address selected
    if (!data.shipping_address_id) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    // For VNPAY: Use axios because backend returns JSON
    if (data.payment_method === 'vnpay') {
      setData('voucher_code', data.voucher_code); // Trigger processing state
      try {
        const response = await axios.post('/orders', {
          shipping_address_id: data.shipping_address_id,
          payment_method: data.payment_method,
          voucher_code: data.voucher_code || null,
        });

        if (response.data.payment_url) {
          // Redirect to VNPAY
          window.location.href = response.data.payment_url;
        }
      } catch (error: unknown) {
        console.error('Checkout error:', error);
        if (axios.isAxiosError(error) && error.response?.data) {
          const errorData = error.response.data;
          if (errorData.message) {
            toast.error(errorData.message);
          } else if (errorData.errors) {
            // Handle validation errors
            const firstError = Object.values(errorData.errors)[0];
            toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
          } else {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
          }
        } else {
          toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
      }
      return;
    }

    // For COD: Use Inertia post (backend does redirect)
    // useForm's post() automatically sends data from form state
    post('/orders', {
      preserveScroll: true,
      onSuccess: () => {
        // Backend will redirect to thank-you page
        toast.success('Đặt hàng thành công!');
      },
      onError: (errors: Record<string, string>) => {
        console.error('Checkout error:', errors);
        if (errors.stock) {
          toast.error(errors.stock);
        } else if (errors.order) {
          toast.error(errors.order);
        } else {
          const firstError = Object.values(errors)[0];
          toast.error(Array.isArray(firstError) ? firstError : String(firstError));
        }
      }
    });
  };

  // Only show empty cart message if we are NOT processing a checkout
  if (cart.length === 0 && !processing) {
    return (
      <>
        <Head title="Thanh toán - Rill" />
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Giỏ hàng trống</h2>
          <Link href="/products">
            <Button>Tiếp tục mua sắm</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Thanh toán - Rill" />
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-center font-serif text-3xl font-bold text-gray-900">Thanh toán</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Shipping & Payment */}
            <div className="space-y-8 lg:col-span-7">

              {/* Address Section */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <MapPin className="text-accent" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h2>
                </div>

                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${selectedAddress === addr.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="mt-1 text-primary focus:ring-primary"
                        checked={selectedAddress === addr.id}
                        onChange={() => {
                          setSelectedAddress(addr.id);
                          setData('shipping_address_id', addr.id);
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{addr.full_name}</span>
                          <span className="text-sm text-gray-500">{addr.phone}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{addr.address_line_1}</p>
                        <p className="text-sm text-gray-600">{addr.ward}, {addr.district}, {addr.province}</p>
                        {addr.is_default && (
                          <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Mặc định</span>
                        )}
                      </div>
                    </label>
                  ))}
                  <Link href="/addresses">
                    <button className="mt-2 text-sm font-medium text-accent hover:text-primary hover:underline">
                      + Thêm địa chỉ mới
                    </button>
                  </Link>
                </div>
              </div>

              {/* Payment Section */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <CreditCard className="text-accent" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h2>
                </div>

                <div className="space-y-3">
                  <label className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all ${data.payment_method === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="payment"
                      className="text-primary focus:ring-primary"
                      checked={data.payment_method === 'cod'}
                      onChange={() => setData('payment_method', 'cod')}
                    />
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 font-bold text-gray-600 text-xs">C.O.D</div>
                      <span className="font-medium text-gray-900">Thanh toán khi nhận hàng</span>
                    </div>
                  </label>

                  <label className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all ${data.payment_method === 'vnpay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="payment"
                      className="text-primary focus:ring-primary"
                      checked={data.payment_method === 'vnpay'}
                      onChange={() => setData('payment_method', 'vnpay')}
                    />
                    <div className="flex items-center gap-3">
                      {/* Placeholder VNPAY logo style */}
                      <div className="flex h-10 w-14 items-center justify-center rounded bg-blue-50 text-xs font-bold text-blue-600">VNPAY</div>
                      <span className="font-medium text-gray-900">VNPAY QR / Thẻ ATM</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">Đơn hàng của bạn</h2>

                <div className="mb-6 max-h-80 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                        {item.product?.image_url ? (
                          <img src={item.product.image_url} alt={item.product?.name || 'Product'} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.name || 'Unnamed Product'}</h4>
                          <p className="text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.unit_price) * item.quantity)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">{item.quantity} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.unit_price))}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Voucher Input */}
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Ticket size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={data.voucher_code}
                      onChange={(e) => setData('voucher_code', e.target.value)}
                      onFocus={() => setIsVoucherFocused(true)}
                      onBlur={() => setTimeout(() => setIsVoucherFocused(false), 200)}
                      className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Chọn hoặc nhập mã voucher"
                      readOnly={!!appliedVoucher}
                    />
                    {appliedVoucher && (
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Xóa
                      </button>
                    )}
                  </div>

                  {/* Dropdown Suggestions */}
                  {isVoucherFocused && (
                    <div className="absolute z-10 mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-100 py-1 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                        Mã giảm giá dành cho bạn
                      </div>
                      {availableVouchers.length > 0 ? (
                        availableVouchers.map((v) => (
                          <button
                            key={v.code}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
                            onClick={() => handleApplyVoucher(v)}
                            type="button"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-primary group-hover:text-accent">{v.code}</span>
                              <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {v.discount_amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.discount_amount) : `${v.value}%`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{v.description}</p>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-sm text-gray-500">
                          Không có mã giảm giá khả dụng
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Phí vận chuyển</span>
                    {loadingShipping ? (
                      <span className="text-gray-400">Đang tính...</span>
                    ) : shippingCost === 0 ? (
                      <span className="font-medium text-green-600">Miễn phí</span>
                    ) : (
                      <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingCost)}</span>
                    )}
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá {appliedVoucher && `(${appliedVoucher.code})`}</span>
                      <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
                    <span>Tổng cộng</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  fullWidth
                  className="mt-8"
                  onClick={handleSubmit}
                  disabled={processing}
                >
                  {processing ? 'Đang xử lý...' : 'Đặt Hàng'}
                </Button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>Giao dịch được mã hóa an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Checkout({ addresses = [] }: CheckoutProps) {
  return (
    <AppLayout>
      <CheckoutContent addresses={addresses} />
    </AppLayout>
  );
}

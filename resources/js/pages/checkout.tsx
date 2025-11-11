import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import { Disc3, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import { Head, usePage, router } from "@inertiajs/react";
import { type SharedData } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from "react-toastify";
import { formatVND } from '@/lib/utils';

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
  city: string;
  district: string;
  ward: string;
  is_default: boolean;
}

interface CheckoutPageProps extends SharedData {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  shippingAddresses: ShippingAddress[];
  defaultShippingAddress: ShippingAddress;
}

// Zod schema for form validation
const checkoutSchema = z.object({
  shipping_address_id: z.string({
    required_error: "Vui lòng chọn một địa chỉ giao hàng.",
  }),
  payment_method: z.string().default('cod'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const pageProps = usePage<CheckoutPageProps>().props;
  const { auth, cartItems, cartSummary, shippingAddresses, defaultShippingAddress, errors } = pageProps;

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address_id: defaultShippingAddress?.id,
      payment_method: 'cod',
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    router.post('/orders', data, {
      onSuccess: () => {
        toast.success("Đặt hàng thành công!");
      },
      onError: (serverErrors) => {
        const firstError = Object.values(serverErrors)[0];
        toast.error(firstError || "Đã có lỗi xảy ra, vui lòng thử lại.");
      }
    });
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
                                <p className="text-slate-600 dark:text-slate-300">{`${address.address_line_1}, ${address.ward}, ${address.district}, ${address.city}`}</p>
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
                          {/* Disabled VNPAY Option */}
                          <Label htmlFor="vnpay" className="flex items-center p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50">
                            <RadioGroupItem value="vnpay" id="vnpay" className="mr-4" disabled />
                            <div className="flex-1">
                              <p className="font-bold">Thanh toán qua VNPAY</p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">Chức năng này sẽ sớm được ra mắt.</p>
                            </div>
                          </Label>
                        </RadioGroup>
                      )}
                    />
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
                          <div className="relative w-16 h-16 rounded-full bg-slate-800 flex-shrink-0">
                            {item.product.image_url ? (
                              <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <Disc3 className="w-10 h-10 text-amber-500 m-auto" />
                            )}
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
                        <span className="font-semibold text-green-600">Miễn phí</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Tổng cộng</span>
                        <span className="text-amber-600">{formatVND(cartSummary.total_amount)}</span>
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

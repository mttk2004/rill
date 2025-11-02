import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { route } from 'ziggy-js';
import { Plus, Edit, Trash, MapPin, Phone, User, Star, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Navigation } from '@/components/navigation';
import { type SharedData } from '@/types';

interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  district: string;
  ward: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface AddressesPageProps {
  addresses: ShippingAddress[];
}

const addressSchema = z.object({
  full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự.').max(255, 'Họ tên không được vượt quá 255 ký tự.'),
  phone: z.string().regex(/^(03|05|07|08|09)[0-9]{8}$/, 'Số điện thoại không đúng định dạng Việt Nam.').max(10, 'Số điện thoại không được vượt quá 10 ký tự.'),
  address_line_1: z.string().min(1, 'Địa chỉ dòng 1 là bắt buộc.').max(255, 'Địa chỉ dòng 1 không được vượt quá 255 ký tự.'),
  address_line_2: z.string().max(255, 'Địa chỉ dòng 2 không được vượt quá 255 ký tự.').nullable(),
  city: z.string().min(1, 'Thành phố là bắt buộc.').max(100, 'Thành phố không được vượt quá 100 ký tự.'),
  district: z.string().min(1, 'Quận/Huyện là bắt buộc.').max(100, 'Quận/Huyện không được vượt quá 100 ký tự.'),
  ward: z.string().min(1, 'Phường/Xã là bắt buộc.').max(100, 'Phường/Xã không được vượt quá 100 ký tự.'),
  postal_code: z.string().max(20, 'Mã bưu điện không được vượt quá 20 ký tự.').nullable(),
  is_default: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function Addresses({ addresses }: AddressesPageProps) {
  const { auth, flash } = usePage<SharedData>().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      district: '',
      ward: '',
      postal_code: '',
      is_default: false,
    },
  });

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  useEffect(() => {
    if (!isModalOpen) {
      setEditingAddress(null);
      form.reset();
    }
  }, [isModalOpen, form]);

  const onSubmit = (values: AddressFormValues) => {
    const url = editingAddress
      ? route('addresses.update', editingAddress.id)
      : route('addresses.store');
    const method = editingAddress ? 'put' : 'post';

    router[method](url, values, {
      onSuccess: () => {
        setIsModalOpen(false);
        // Inertia will automatically re-render with new addresses
      },
      onError: (errors) => {
        for (const key in errors) {
          form.setError(key as keyof AddressFormValues, { message: errors[key] });
        }
        toast.error('Có lỗi xảy ra khi lưu địa chỉ.');
      },
    });
  };

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address);
    form.reset({
      full_name: address.full_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      city: address.city,
      district: address.district,
      ward: address.ward,
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (addressId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này không?')) {
      router.delete(route('addresses.destroy', addressId), {
        onSuccess: () => {
          toast.success('Địa chỉ đã được xóa thành công.');
        },
        onError: (errors) => {
          toast.error(errors.address || 'Không thể xóa địa chỉ này.');
        },
      });
    }
  };

  const handleSetDefault = (addressId: string) => {
    router.put(route('addresses.set-default', addressId), {}, {
      onSuccess: () => {
        toast.success('Địa chỉ mặc định đã được cập nhật.');
      },
      onError: (errors) => {
        toast.error(errors.address || 'Không thể đặt địa chỉ này làm mặc định.');
      },
    });
  };

  return (
    <>
      <Head title="Địa chỉ của tôi - Rill" />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Navigation user={auth.user} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-accent" />
                  Địa chỉ của tôi
                </h1>
                <p className="text-muted-foreground mt-2">
                  Quản lý địa chỉ giao hàng để có trải nghiệm mua sắm tốt nhất
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="shadow-lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Thêm địa chỉ mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
                    <DialogDescription>
                      {editingAddress ? 'Cập nhật thông tin địa chỉ của bạn.' : 'Thêm một địa chỉ giao hàng mới.'}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Row 1: Full Name and Phone in 2 columns */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ tên người nhận</FormLabel>
                              <FormControl>
                                <Input placeholder="Nguyễn Văn A" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số điện thoại</FormLabel>
                              <FormControl>
                                <Input placeholder="09xxxxxxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 2: Address Line 1 (full width) */}
                      <FormField
                        control={form.control}
                        name="address_line_1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ dòng 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Số nhà, tên đường" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Row 3: Address Line 2 (full width, optional) */}
                      <FormField
                        control={form.control}
                        name="address_line_2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ dòng 2 (Tùy chọn)</FormLabel>
                            <FormControl>
                              <Input placeholder="Tòa nhà, tầng, căn hộ" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Row 4: City and District in 2 columns */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thành phố</FormLabel>
                              <FormControl>
                                <Input placeholder="Hồ Chí Minh" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quận/Huyện</FormLabel>
                              <FormControl>
                                <Input placeholder="Quận 1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 5: Ward and Postal Code in 2 columns */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ward"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phường/Xã</FormLabel>
                              <FormControl>
                                <Input placeholder="Phường Đa Kao" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mã bưu điện (Tùy chọn)</FormLabel>
                              <FormControl>
                                <Input placeholder="70000" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 6: Default Address Setting */}
                      <FormField
                        control={form.control}
                        name="is_default"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 border-accent/20 bg-accent/5 p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">Đặt làm mặc định</FormLabel>
                              <DialogDescription>
                                Đặt địa chỉ này làm địa chỉ giao hàng mặc định của bạn.
                              </DialogDescription>
                            </div>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => field.onChange(value === 'true')}
                                value={field.value ? 'true' : 'false'}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="true" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">Có</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="false" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">Không</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                          Hủy
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Address Cards */}
            {addresses.length === 0 ? (
              <Card className="border-2 border-dashed border-accent/30">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-accent/10 p-6 mb-4">
                    <Home className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Chưa có địa chỉ nào</h3>
                  <p className="text-muted-foreground mb-6 text-center">
                    Hãy thêm địa chỉ giao hàng để trải nghiệm mua sắm thuận tiện hơn
                  </p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm địa chỉ đầu tiên
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {addresses.map((address) => (
                  <Card
                    key={address.id}
                    className={`group transition-all hover:shadow-lg ${address.is_default
                        ? 'border-2 border-accent shadow-md ring-2 ring-accent/20'
                        : 'border-2 border-transparent hover:border-accent/30'
                      }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Address Info */}
                        <div className="flex-1 space-y-3">
                          {/* Name & Default Badge */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <User className="h-5 w-5 text-accent" />
                              <h4 className="font-bold text-lg">{address.full_name}</h4>
                            </div>
                            {address.is_default && (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                                <Star className="h-3 w-3 fill-white" />
                                Mặc định
                              </div>
                            )}
                          </div>

                          {/* Phone */}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4 text-accent/70" />
                            <span className="text-sm font-medium">{address.phone}</span>
                          </div>

                          {/* Address */}
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-accent/70 mt-0.5 flex-shrink-0" />
                            <div className="text-sm space-y-1">
                              <p className="font-medium text-foreground">
                                {address.address_line_1}
                                {address.address_line_2 && `, ${address.address_line_2}`}
                              </p>
                              <p className="text-muted-foreground">
                                {address.ward}, {address.district}, {address.city}
                              </p>
                              {address.postal_code && (
                                <p className="text-muted-foreground text-xs">
                                  Mã bưu điện: {address.postal_code}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(address)}
                            className="w-full"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Sửa
                          </Button>

                          {!address.is_default && (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSetDefault(address.id)}
                                className="w-full"
                              >
                                <Star className="mr-2 h-4 w-4" />
                                Đặt mặc định
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(address.id)}
                                className="w-full"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Xóa
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Info Note */}
            {addresses.length > 0 && addresses.length < 3 && (
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground text-center">
                  💡 Bạn có thể lưu tối đa 3 địa chỉ giao hàng
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

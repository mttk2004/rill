import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { route } from 'ziggy-js';
import { Plus, Edit, Trash, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="min-h-screen bg-background">
        <Navigation user={auth.user} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Địa chỉ của tôi</CardTitle>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" />Thêm địa chỉ mới</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
                      <DialogDescription>
                        {editingAddress ? 'Cập nhật thông tin địa chỉ của bạn.' : 'Thêm một địa chỉ giao hàng mới.'}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thành phố</FormLabel>
                              <FormControl>
                                <Input placeholder="TP. Hồ Chí Minh" {...field} />
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
                        <FormField
                          control={form.control}
                          name="ward"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phường/Xã</FormLabel>
                              <FormControl>
                                <Input placeholder="Phường Bến Nghé" {...field} />
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
                        <FormField
                          control={form.control}
                          name="is_default"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Đặt làm mặc định</FormLabel>
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
                                    <FormLabel className="font-normal">Có</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="false" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Không</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Bạn chưa có địa chỉ nào. Hãy thêm một địa chỉ mới!
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map((address) => (
                      <Card key={address.id} className={address.is_default ? 'border-amber-500 ring-2 ring-amber-500' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{address.full_name}</h4>
                                {address.is_default && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                              <p className="text-sm">{address.address_line_1}{address.address_line_2 && `, ${address.address_line_2}`}</p>
                              <p className="text-sm text-muted-foreground">{address.ward}, {address.district}, {address.city}</p>
                              {address.postal_code && <p className="text-sm text-muted-foreground">Mã bưu điện: {address.postal_code}</p>}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" onClick={() => handleEdit(address)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!address.is_default && (
                                <Button variant="outline" size="icon" onClick={() => handleDelete(address.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                              {!address.is_default && (
                                <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                                  Đặt làm mặc định
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

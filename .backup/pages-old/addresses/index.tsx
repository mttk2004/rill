import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from '@inertiajs/react';
import { useToastRouter } from '@/hooks/use-toast-router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { type SharedData } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  province: string;
  province_id: number;
  district: string;
  district_id: number;
  ward: string;
  ward_id: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface AddressesPageProps {
  addresses: ShippingAddress[];
}

interface Province {
  ProvinceID: number;
  ProvinceName: string;
  Code?: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
}

interface Ward {
  WardCode: string;
  WardName: string;
  DistrictID: number;
}

const addressSchema = z.object({
  full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự.').max(255, 'Họ tên không được vượt quá 255 ký tự.'),
  phone: z.string().regex(/^(03|05|07|08|09)[0-9]{8}$/, 'Số điện thoại không đúng định dạng Việt Nam.').max(10, 'Số điện thoại không được vượt quá 10 ký tự.'),
  address_line_1: z.string().min(1, 'Địa chỉ dòng 1 là bắt buộc.').max(255, 'Địa chỉ dòng 1 không được vượt quá 255 ký tự.'),
  address_line_2: z.string().max(255, 'Địa chỉ dòng 2 không được vượt quá 255 ký tự.').nullable(),
  province: z.string().min(1, 'Tỉnh/Thành phố là bắt buộc.').max(100, 'Tỉnh/Thành phố không được vượt quá 100 ký tự.'),
  province_id: z.number(),
  district: z.string().min(1, 'Quận/Huyện là bắt buộc.').max(100, 'Quận/Huyện không được vượt quá 100 ký tự.'),
  district_id: z.number(),
  ward: z.string().min(1, 'Phường/Xã là bắt buộc.').max(100, 'Phường/Xã không được vượt quá 100 ký tự.'),
  ward_id: z.string(),
  is_default: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function Addresses({ addresses }: AddressesPageProps) {
  const { flash } = usePage<SharedData>().props;
  const { post, put } = useToastRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);

  // Address data state
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Selected IDs for API calls
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

  // Initialize form first before using it in useEffects
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      address_line_1: '',
      address_line_2: null,
      province: '',
      province_id: 0,
      district: '',
      district_id: 0,
      ward: '',
      ward_id: '',
      is_default: false,
    },
  });

  // Handle flash messages (only for delete/setDefault which use router directly)
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash?.success, flash?.error]);

  // Load provinces when modal opens
  useEffect(() => {
    if (isModalOpen && provinces.length === 0) {
      setLoadingProvinces(true);
      fetch('/api/provinces')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setProvinces(data.data);
          }
        })
        .catch(err => {
          console.error('Error loading provinces:', err);
          toast.error('Không thể tải danh sách tỉnh/thành phố');
        })
        .finally(() => setLoadingProvinces(false));
    }
  }, [isModalOpen, provinces.length]);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      setLoadingDistricts(true);
      setDistricts([]);
      setWards([]);
      setSelectedDistrictId(null);
      form.setValue('district', '');
      form.setValue('ward', '');

      fetch(`/api/districts?province_id=${selectedProvinceId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setDistricts(data.data);
          }
        })
        .catch(err => {
          console.error('Error loading districts:', err);
          toast.error('Không thể tải danh sách quận/huyện');
        })
        .finally(() => setLoadingDistricts(false));
    }
  }, [selectedProvinceId, form]);

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrictId) {
      setLoadingWards(true);
      setWards([]);
      form.setValue('ward', '');

      fetch(`/api/wards?district_id=${selectedDistrictId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setWards(data.data);
          }
        })
        .catch(err => {
          console.error('Error loading wards:', err);
          toast.error('Không thể tải danh sách phường/xã');
        })
        .finally(() => setLoadingWards(false));
    }
  }, [selectedDistrictId, form]);

  useEffect(() => {
    if (!isModalOpen) {
      setEditingAddress(null);
      form.reset();
      setDistricts([]);
      setWards([]);
      setSelectedProvinceId(null);
      setSelectedDistrictId(null);
    }
  }, [isModalOpen, form]);

  const onSubmit = (values: AddressFormValues) => {
    const url = editingAddress
      ? route('addresses.update', editingAddress.id)
      : route('addresses.store');
    const method = editingAddress ? put : post;
    const successMessage = editingAddress
      ? 'Địa chỉ đã được cập nhật thành công.'
      : 'Địa chỉ đã được thêm thành công.';

    method(url, values, {
      pending: 'Đang lưu địa chỉ...',
      success: successMessage,
      error: 'Có lỗi xảy ra khi lưu địa chỉ.',
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsModalOpen(false);
      },
      onError: (errors: Record<string, unknown>) => {
        for (const key in errors) {
          const message = errors[key];
          form.setError(key as keyof AddressFormValues, {
            message: typeof message === 'string' ? message : String(message)
          });
        }
      },
    });
  }; const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address);
    form.reset({
      full_name: address.full_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      province: address.province,
      province_id: address.province_id,
      district: address.district,
      district_id: address.district_id,
      ward: address.ward,
      ward_id: address.ward_id,
      is_default: address.is_default,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (addressId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này không?')) {
      router.delete(route('addresses.destroy', addressId), {
        preserveScroll: true,
      });
    }
  };

  const handleSetDefault = (addressId: string) => {
    router.put(route('addresses.set-default', addressId), {}, {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout>
      <Head title="Địa chỉ của tôi - Rill" />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">

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

                      {/* Row 4: Province and District in 2 columns */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tỉnh/Thành phố</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  const province = provinces.find(p => p.ProvinceName === value);
                                  if (province) {
                                    field.onChange(value);
                                    form.setValue('province_id', province.ProvinceID);
                                    setSelectedProvinceId(province.ProvinceID);
                                  }
                                }}
                                value={field.value || ''}
                                disabled={loadingProvinces}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={loadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {provinces.map((province) => (
                                    <SelectItem key={province.ProvinceID} value={province.ProvinceName}>
                                      {province.ProvinceName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                              <Select
                                onValueChange={(value) => {
                                  const district = districts.find(d => d.DistrictName === value);
                                  if (district) {
                                    field.onChange(value);
                                    form.setValue('district_id', district.DistrictID);
                                    setSelectedDistrictId(district.DistrictID);
                                  }
                                }}
                                value={field.value}
                                disabled={!selectedProvinceId || loadingDistricts}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={
                                      !selectedProvinceId ? "Chọn tỉnh/thành phố trước" :
                                        loadingDistricts ? "Đang tải..." : "Chọn quận/huyện"
                                    } />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {districts.map((district) => (
                                    <SelectItem key={district.DistrictID} value={district.DistrictName}>
                                      {district.DistrictName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 5: Ward */}
                      <FormField
                        control={form.control}
                        name="ward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phường/Xã</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const ward = wards.find(w => w.WardName === value);
                                if (ward) {
                                  field.onChange(value);
                                  form.setValue('ward_id', ward.WardCode);
                                }
                              }}
                              value={field.value || ''}
                              disabled={!selectedDistrictId || loadingWards}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={
                                    !selectedDistrictId ? "Chọn quận/huyện trước" :
                                      loadingWards ? "Đang tải..." : "Chọn phường/xã"
                                  } />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {wards.map((ward) => (
                                  <SelectItem key={ward.WardCode} value={ward.WardName}>
                                    {ward.WardName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                                {address.ward}, {address.district}, {address.province}
                              </p>
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
          </div>
        </main>
      </div>
    </AppLayout>
  );
}

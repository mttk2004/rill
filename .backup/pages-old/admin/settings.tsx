import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AdminNavigation } from '@/components/admin-navigation';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { useToastRouter } from '@/hooks/use-toast-router';

interface Setting {
  key: string;
  value: string;
  type: string;
  label: string;
}

interface SettingsGroup {
  [key: string]: Setting;
}

interface SettingsPageProps {
  settings: {
    banner: SettingsGroup;
    shipping: SettingsGroup;
    policy: SettingsGroup;
  };
}

export default function SettingsPage({ settings }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('banner');
  const { post } = useToastRouter();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState({
    settings: {
      // Banner settings
      banner_enabled: settings.banner.banner_enabled?.value || '0',
      banner_content: settings.banner.banner_content?.value || '',
      banner_type: settings.banner.banner_type?.value || 'info',
      // Shipping settings
      shipping_free_threshold: settings.shipping.shipping_free_threshold?.value || '1000000',
      shipping_estimate_min_days: settings.shipping.shipping_estimate_min_days?.value || '2',
      shipping_estimate_max_days: settings.shipping.shipping_estimate_max_days?.value || '5',
      // Policy settings
      return_policy_days: settings.policy.return_policy_days?.value || '7',
      return_policy_condition: settings.policy.return_policy_condition?.value || 'lỗi nhà sản xuất',
    },
  });

  const reset = () => {
    setData({
      settings: {
        banner_enabled: settings.banner.banner_enabled?.value || '0',
        banner_content: settings.banner.banner_content?.value || '',
        banner_type: settings.banner.banner_type?.value || 'info',
        shipping_free_threshold: settings.shipping.shipping_free_threshold?.value || '1000000',
        shipping_estimate_min_days: settings.shipping.shipping_estimate_min_days?.value || '2',
        shipping_estimate_max_days: settings.shipping.shipping_estimate_max_days?.value || '5',
        return_policy_days: settings.policy.return_policy_days?.value || '7',
        return_policy_condition: settings.policy.return_policy_condition?.value || 'lỗi nhà sản xuất',
      },
    });
    setErrors({});
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    post('/admin/settings', data, {
      pending: 'Đang cập nhật cài đặt...',
      success: 'Cài đặt đã được cập nhật thành công!',
      error: 'Có lỗi xảy ra khi cập nhật cài đặt. Vui lòng kiểm tra lại thông tin.',
    }, {
      preserveScroll: true,
      onError: (responseErrors) => {
        setErrors(responseErrors as Record<string, string>);
      },
      onFinish: () => {
        setProcessing(false);
      },
    });
  };

  const formatCurrency = (value: string) => {
    const number = parseInt(value.replace(/\D/g, ''));
    return isNaN(number) ? '' : number.toLocaleString('vi-VN');
  };

  return (
    <>
      <Head title="Quản lý cài đặt" />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Quản lý cài đặt
          </h1>
          <p className="text-muted-foreground mt-2">
            Cấu hình các thông số hệ thống như banner, vận chuyển và chính sách đổi trả
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="banner">Banner</TabsTrigger>
              <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
              <TabsTrigger value="policy">Chính sách</TabsTrigger>
            </TabsList>

            {/* Banner Settings */}
            <TabsContent value="banner" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt Banner Marketing</CardTitle>
                  <CardDescription>
                    Banner hiển thị ở đầu trang để thông báo khuyến mãi hoặc tin tức quan trọng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="banner_enabled">Bật/Tắt Banner</Label>
                      <p className="text-sm text-muted-foreground">
                        Hiển thị banner trên trang chủ
                      </p>
                    </div>
                    <Switch
                      id="banner_enabled"
                      checked={data.settings.banner_enabled === '1'}
                      onCheckedChange={(checked) =>
                        setData({
                          settings: {
                            ...data.settings,
                            banner_enabled: checked ? '1' : '0',
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner_content">Nội dung Banner</Label>
                    <Textarea
                      id="banner_content"
                      placeholder="Nhập nội dung thông báo..."
                      value={data.settings.banner_content}
                      onChange={(e) =>
                        setData({
                          settings: {
                            ...data.settings,
                            banner_content: e.target.value,
                          },
                        })
                      }
                      rows={3}
                      className={errors['settings.banner_content'] ? 'border-red-500' : ''}
                    />
                    {errors['settings.banner_content'] && (
                      <p className="text-sm text-red-500">{errors['settings.banner_content']}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Khi bạn thay đổi nội dung, banner sẽ tự động hiện lại cho tất cả người dùng
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner_type">Kiểu Banner</Label>
                    <Select
                      value={data.settings.banner_type}
                      onValueChange={(value) =>
                        setData({
                          settings: {
                            ...data.settings,
                            banner_type: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger id="banner_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span>Thông tin (Xanh dương)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="success">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span>Thành công (Xanh lá)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="warning">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-orange-500" />
                            <span>Cảnh báo (Cam)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping Settings */}
            <TabsContent value="shipping" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt Vận chuyển</CardTitle>
                  <CardDescription>
                    Cấu hình phí vận chuyển và thời gian giao hàng dự kiến
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="shipping_free_threshold">
                      Giá trị đơn hàng tối thiểu để miễn phí vận chuyển
                    </Label>
                    <div className="relative">
                      <Input
                        id="shipping_free_threshold"
                        type="text"
                        value={formatCurrency(data.settings.shipping_free_threshold)}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, '');
                          setData({
                            settings: {
                              ...data.settings,
                              shipping_free_threshold: rawValue,
                            },
                          });
                        }}
                        className={errors['settings.shipping_free_threshold'] ? 'border-red-500 pr-12' : 'pr-12'}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ₫
                      </span>
                    </div>
                    {errors['settings.shipping_free_threshold'] && (
                      <p className="text-sm text-red-500">{errors['settings.shipping_free_threshold']}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Đơn hàng từ giá trị này sẽ được miễn phí vận chuyển
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping_estimate_min_days">Thời gian giao hàng tối thiểu</Label>
                      <div className="relative">
                        <Input
                          id="shipping_estimate_min_days"
                          type="number"
                          min="1"
                          value={data.settings.shipping_estimate_min_days}
                          onChange={(e) =>
                            setData({
                              settings: {
                                ...data.settings,
                                shipping_estimate_min_days: e.target.value,
                              },
                            })
                          }
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          ngày
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping_estimate_max_days">Thời gian giao hàng tối đa</Label>
                      <div className="relative">
                        <Input
                          id="shipping_estimate_max_days"
                          type="number"
                          min="1"
                          value={data.settings.shipping_estimate_max_days}
                          onChange={(e) =>
                            setData({
                              settings: {
                                ...data.settings,
                                shipping_estimate_max_days: e.target.value,
                              },
                            })
                          }
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          ngày
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Policy Settings */}
            <TabsContent value="policy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chính sách đổi trả</CardTitle>
                  <CardDescription>
                    Cấu hình thời gian và điều kiện đổi trả sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="return_policy_days">Thời gian đổi trả</Label>
                    <div className="relative">
                      <Input
                        id="return_policy_days"
                        type="number"
                        min="1"
                        value={data.settings.return_policy_days}
                        onChange={(e) =>
                          setData({
                            settings: {
                              ...data.settings,
                              return_policy_days: e.target.value,
                            },
                          })
                        }
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ngày
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Khách hàng có thể đổi trả trong vòng bao nhiêu ngày
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="return_policy_condition">Điều kiện đổi trả</Label>
                    <Input
                      id="return_policy_condition"
                      type="text"
                      placeholder="Ví dụ: lỗi nhà sản xuất"
                      value={data.settings.return_policy_condition}
                      onChange={(e) =>
                        setData({
                          settings: {
                            ...data.settings,
                            return_policy_condition: e.target.value,
                          },
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Điều kiện để được đổi trả sản phẩm
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={processing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
            <Button type="submit" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

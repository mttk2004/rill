import { AdminNavigation } from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useState } from "react";
import { toast } from "react-toastify";
import { X, Plus, Search } from "lucide-react";
import type { Product } from "@/types";

interface CreateCollectionProps {
  products: Product[];
}

interface CollectionForm {
  name: string;
  slug: string;
  type: 'featured' | 'banner' | 'promotion' | 'curated';
  description: string;
  is_active: boolean;
  started_at: string;
  ended_at: string;
  display_order: number;
  products: Array<{ id: string; position: number }>;
}

export default function CreateCollection({ products }: CreateCollectionProps) {
  const { data, setData, post, processing, errors } = useForm<CollectionForm>({
    name: '',
    slug: '',
    type: 'featured',
    description: '',
    is_active: true,
    started_at: '',
    ended_at: '',
    display_order: 0,
    products: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setData('name', name);
    if (!data.slug || data.slug === generateSlug(data.name)) {
      setData('slug', generateSlug(name));
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const filteredProducts = products.filter(
    (product) =>
      !selectedProducts.find((p) => p.id === product.id) &&
      (searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addProduct = (product: Product) => {
    const newSelected = [...selectedProducts, product];
    setSelectedProducts(newSelected);
    setData(
      'products',
      newSelected.map((p, idx) => ({ id: p.id, position: idx }))
    );
    setSearchTerm('');
  };

  const removeProduct = (productId: string) => {
    const newSelected = selectedProducts.filter((p) => p.id !== productId);
    setSelectedProducts(newSelected);
    setData(
      'products',
      newSelected.map((p, idx) => ({ id: p.id, position: idx }))
    );
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newSelected = [...selectedProducts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSelected.length) return;

    [newSelected[index], newSelected[targetIndex]] = [newSelected[targetIndex], newSelected[index]];
    setSelectedProducts(newSelected);
    setData(
      'products',
      newSelected.map((p, idx) => ({ id: p.id, position: idx }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.collections.store'), {
      onSuccess: () => {
        toast.success('Collection đã được tạo thành công!');
      },
      onError: (errors) => {
        toast.error('Có lỗi xảy ra khi tạo collection');
        console.error('Validation errors:', errors);
      },
    });
  };

  return (
    <>
      <Head title="Tạo Collection - Admin" />
      <AdminNavigation />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto py-6 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Tạo Collection mới</h1>
              <p className="text-muted-foreground mt-2">
                Tạo bộ sưu tập sản phẩm nổi bật
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>
                    Nhập thông tin cho collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Tên collection <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="VD: Sản phẩm nổi bật"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug (tuỳ chọn)
                    </Label>
                    <Input
                      id="slug"
                      value={data.slug}
                      onChange={(e) => setData('slug', e.target.value)}
                      placeholder="Để trống để tự động tạo từ tên"
                    />
                    <p className="text-sm text-muted-foreground">
                      Slug sẽ được tự động tạo từ tên nếu bỏ trống
                    </p>
                    {errors.slug && (
                      <p className="text-sm text-red-600">{errors.slug}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Loại collection <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="type"
                      value={data.type}
                      onChange={(e) =>
                        setData('type', e.target.value as CollectionForm['type'])
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="featured">Nổi bật</option>
                      <option value="banner">Banner</option>
                      <option value="promotion">Khuyến mãi</option>
                      <option value="curated">Tuyển chọn</option>
                    </select>
                    {errors.type && (
                      <p className="text-sm text-red-600">{errors.type}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Mô tả về collection này..."
                      rows={3}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Display Order */}
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={data.display_order}
                      onChange={(e) =>
                        setData('display_order', parseInt(e.target.value) || 0)
                      }
                      placeholder="0"
                    />
                    <p className="text-sm text-muted-foreground">
                      Số thứ tự càng nhỏ sẽ hiển thị càng trước
                    </p>
                    {errors.display_order && (
                      <p className="text-sm text-red-600">{errors.display_order}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activation Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt kích hoạt</CardTitle>
                  <CardDescription>
                    Cấu hình thời gian và trạng thái hiển thị
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Is Active */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_active">Kích hoạt</Label>
                      <p className="text-sm text-muted-foreground">
                        Bật/tắt collection này
                      </p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked)}
                    />
                  </div>

                  {/* Started At */}
                  <div className="space-y-2">
                    <Label htmlFor="started_at">Ngày bắt đầu (tuỳ chọn)</Label>
                    <Input
                      id="started_at"
                      type="datetime-local"
                      value={data.started_at}
                      onChange={(e) => setData('started_at', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Để trống nếu muốn kích hoạt ngay lập tức
                    </p>
                    {errors.started_at && (
                      <p className="text-sm text-red-600">{errors.started_at}</p>
                    )}
                  </div>

                  {/* Ended At */}
                  <div className="space-y-2">
                    <Label htmlFor="ended_at">Ngày kết thúc (tuỳ chọn)</Label>
                    <Input
                      id="ended_at"
                      type="datetime-local"
                      value={data.ended_at}
                      onChange={(e) => setData('ended_at', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Để trống nếu không có thời hạn
                    </p>
                    {errors.ended_at && (
                      <p className="text-sm text-red-600">{errors.ended_at}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Products Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm</CardTitle>
                  <CardDescription>
                    Chọn và sắp xếp các sản phẩm trong collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search Products */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm sản phẩm để thêm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Search Results */}
                  {searchTerm && filteredProducts.length > 0 && (
                    <div className="border rounded-lg max-h-60 overflow-y-auto">
                      {filteredProducts.slice(0, 10).map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => addProduct(product)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b last:border-b-0"
                        >
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          )}
                          <div className="text-left flex-1">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.price.toLocaleString('vi-VN')}₫
                            </div>
                          </div>
                          <Plus className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Products */}
                  {selectedProducts.length > 0 ? (
                    <div className="space-y-2">
                      <Label>Đã chọn ({selectedProducts.length})</Label>
                      <div className="border rounded-lg">
                        {selectedProducts.map((product, index) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 p-3 border-b last:border-b-0"
                          >
                            <div className="flex flex-col gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moveProduct(index, 'up')}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                ↑
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moveProduct(index, 'down')}
                                disabled={index === selectedProducts.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                ↓
                              </Button>
                            </div>
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Vị trí: {index + 1}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProduct(product.id)}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có sản phẩm nào. Tìm kiếm để thêm sản phẩm.
                    </div>
                  )}

                  {errors.products && (
                    <p className="text-sm text-red-600">{errors.products}</p>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                >
                  {processing ? 'Đang lưu...' : 'Tạo Collection'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

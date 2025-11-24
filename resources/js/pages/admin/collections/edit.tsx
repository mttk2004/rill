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
import { X, Plus, Search, GripVertical } from "lucide-react";
import type { Product } from "@/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Collection {
  id: number;
  name: string;
  slug: string;
  type: 'featured' | 'banner' | 'promotion' | 'curated';
  description: string | null;
  is_active: boolean;
  started_at: string | null;
  ended_at: string | null;
  display_order: number;
  products: Array<Product & { pivot: { position: number } }>;
}

interface EditCollectionProps {
  collection: Collection;
  allProducts: Product[];
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

interface SortableProductItemProps {
  product: Product;
  index: number;
  onRemove: (id: string) => void;
}

function SortableProductItem({ product, index, onRemove }: SortableProductItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border rounded-lg"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
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
        onClick={() => onRemove(product.id)}
      >
        <X className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
}

export default function EditCollection({ collection, allProducts }: EditCollectionProps) {
  const { data, setData, put, processing, errors } = useForm<CollectionForm>({
    name: collection.name,
    slug: collection.slug,
    type: collection.type,
    description: collection.description || '',
    is_active: collection.is_active,
    started_at: collection.started_at
      ? new Date(collection.started_at).toISOString().slice(0, 16)
      : '',
    ended_at: collection.ended_at
      ? new Date(collection.ended_at).toISOString().slice(0, 16)
      : '',
    display_order: collection.display_order,
    products: collection.products.map((p) => ({ id: p.id, position: p.pivot.position })),
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    collection.products.sort((a, b) => a.pivot.position - b.pivot.position)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setData('name', name);
    if (!data.slug || data.slug === generateSlug(collection.name)) {
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

  const filteredProducts = allProducts.filter(
    (product: Product) =>
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        setData(
          'products',
          newItems.map((p, idx) => ({ id: p.id, position: idx }))
        );

        return newItems;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.collections.update', collection.id), {
      onSuccess: () => {
        // Navigate handled by Inertia
      },
    });
  };

  return (
    <>
      <Head title={`Chỉnh sửa Collection: ${collection.name} - Admin`} />
      <AdminNavigation />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto py-6 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Chỉnh sửa Collection</h1>
              <p className="text-muted-foreground mt-2">
                Cập nhật thông tin collection: {collection.name}
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

              {/* Products Selection with Drag & Drop */}
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm</CardTitle>
                  <CardDescription>
                    Chọn và sắp xếp các sản phẩm trong collection (kéo thả để sắp xếp)
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

                  {/* Selected Products with Drag & Drop */}
                  {selectedProducts.length > 0 ? (
                    <div className="space-y-2">
                      <Label>Đã chọn ({selectedProducts.length}) - Kéo thả để sắp xếp</Label>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={selectedProducts.map(p => p.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2">
                            {selectedProducts.map((product, index) => (
                              <SortableProductItem
                                key={product.id}
                                product={product}
                                index={index}
                                onRemove={removeProduct}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
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
                  {processing ? 'Đang lưu...' : 'Cập nhật Collection'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, FormEvent, ChangeEvent } from 'react';
import { router, Head } from '@inertiajs/react';
import { Save, Loader2, X, RefreshCw, Plus, Trash, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminNavigation } from '@/components/admin-navigation';

interface Artist {
  id: string;
  name: string;
  pivot?: {
    role: 'main' | 'featured' | 'composer' | 'producer';
    sort_order: number;
  };
}

interface Product {
  id: string;
  name: string;
  sku: string;
  genre: string | null;
  label: string | null;
  description: string | null;
  price: string;
  cost_price: string | null;
  stock_quantity: number;
  min_stock_level: number;
  is_featured: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  image_url: string | null;
  artists: Artist[];
}

interface PageProps {
  product: Product;
  genres: string[];
  labels: string[];
  artists: Array<{
    id: string;
    name: string;
  }>;
}

interface FormData {
  name: string;
  sku: string;
  genre: string;
  label: string;
  description: string;
  price: string;
  cost_price: string;
  stock_quantity: string;
  min_stock_level: string;
  is_featured: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: File | null;
  artists: Array<{
    artist_id: string;
    role: 'main' | 'featured' | 'composer' | 'producer';
  }>;
}

interface FormErrors {
  name?: string;
  sku?: string;
  genre?: string;
  label?: string;
  description?: string;
  price?: string;
  cost_price?: string;
  stock_quantity?: string;
  status?: string;
  image?: string;
}

const ProductEdit = ({ product, genres, labels, artists }: PageProps) => {
  const generateSKU = () => {
    const letters = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
    const digits = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    return `VINYL-${letters}${digits}`;
  };

  const [formData, setFormData] = useState<FormData>({
    name: product.name,
    sku: product.sku,
    genre: product.genre || '',
    label: product.label || '',
    description: product.description || '',
    price: product.price,
    cost_price: product.cost_price || '',
    stock_quantity: product.stock_quantity.toString(),
    min_stock_level: product.min_stock_level.toString(),
    is_featured: product.is_featured,
    status: product.status,
    image: null,
    artists: product.artists.map((artist) => ({
      artist_id: artist.id,
      role: artist.pivot?.role || 'main',
    })),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (500KB = 512000 bytes)
      const maxSize = 512000;
      if (file.size > maxSize) {
        toast.error(`Kích thước ảnh không được vượt quá 500KB. Ảnh hiện tại: ${(file.size / 1024).toFixed(0)}KB`);
        e.target.value = ''; // Reset input
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const addArtist = () => {
    setFormData(prev => ({
      ...prev,
      artists: [...prev.artists, { artist_id: '', role: 'main' }]
    }));
  };

  const removeArtist = (index: number) => {
    setFormData(prev => ({
      ...prev,
      artists: prev.artists.filter((_, i) => i !== index)
    }));
  };

  const updateArtist = (index: number, field: 'artist_id' | 'role', value: string) => {
    setFormData(prev => ({
      ...prev,
      artists: prev.artists.map((artist, i) =>
        i === index ? { ...artist, [field]: value } : artist
      )
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrors({});
    setIsSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('_method', 'PUT');
      submitData.append('name', formData.name);
      submitData.append('sku', formData.sku);
      submitData.append('genre', formData.genre);
      submitData.append('label', formData.label);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('cost_price', formData.cost_price);
      submitData.append('stock_quantity', formData.stock_quantity);
      submitData.append('min_stock_level', formData.min_stock_level);
      submitData.append('is_featured', formData.is_featured ? '1' : '0');
      submitData.append('status', formData.status);

      // Add artists data
      formData.artists.forEach((artist, index) => {
        submitData.append(`artists[${index}][artist_id]`, artist.artist_id);
        submitData.append(`artists[${index}][role]`, artist.role);
      });

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await axios.post(`/admin/products/${product.id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Cập nhật sản phẩm thành công');
        router.visit('/admin/products');
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response
      ) {
        const responseData = error.response.data as {
          errors?: Record<string, string[]>;
          message?: string;
        };

        if (responseData.errors) {
          const formattedErrors: FormErrors = {};
          Object.keys(responseData.errors).forEach((key) => {
            formattedErrors[key as keyof FormErrors] =
              responseData.errors![key][0];
          });
          setErrors(formattedErrors);
        }

        toast.error(
          responseData.message || 'Có lỗi xảy ra khi cập nhật sản phẩm'
        );
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Head title={`Chỉnh sửa: ${product.name}`} />
      <AdminNavigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.visit('/admin/products')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold">Chỉnh sửa sản phẩm</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Cập nhật thông tin cho sản phẩm: {product.name}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Product Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'border-red-500' : ''}
                        placeholder="Nhập tên sản phẩm"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* SKU */}
                    <div className="space-y-2">
                      <Label htmlFor="sku">
                        SKU <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="sku"
                          name="sku"
                          value={formData.sku}
                          onChange={handleInputChange}
                          className={errors.sku ? 'border-red-500' : ''}
                          placeholder="VD: VINYL-001"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFormData(prev => ({ ...prev, sku: generateSKU() }))}
                          title="Tạo SKU mới"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={errors.description ? 'border-red-500' : ''}
                        placeholder="Mô tả sản phẩm"
                        rows={4}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Genre & Label */}
                <Card>
                  <CardHeader>
                    <CardTitle>Phân loại</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Genre */}
                    <div className="space-y-2">
                      <Label htmlFor="genre">Thể loại</Label>
                      <Select
                        value={formData.genre || undefined}
                        onValueChange={(value) => handleSelectChange('genre', value)}
                      >
                        <SelectTrigger className={errors.genre ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Chọn thể loại" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.genre && (
                        <p className="text-sm text-red-500">{errors.genre}</p>
                      )}
                    </div>

                    {/* Label */}
                    <div className="space-y-2">
                      <Label htmlFor="label">
                        Nhãn <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex flex-col gap-2">
                        <Select
                          value={labels.includes(formData.label) ? formData.label : undefined}
                          onValueChange={(value) => handleSelectChange('label', value)}
                        >
                          <SelectTrigger className={errors.label ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Chọn nhãn có sẵn" />
                          </SelectTrigger>
                          <SelectContent>
                            {labels.map((label) => (
                              <SelectItem key={label} value={label}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="label"
                          name="label"
                          value={formData.label}
                          onChange={handleInputChange}
                          className={errors.label ? 'border-red-500' : ''}
                          placeholder="Hoặc nhập nhãn mới"
                        />
                      </div>
                      {errors.label && (
                        <p className="text-sm text-red-500">{errors.label}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Chọn từ danh sách bên trên hoặc nhập nhãn mới ở ô dưới.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Artists */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Nghệ sĩ</CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addArtist}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Thêm nghệ sĩ
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {formData.artists.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Chưa có nghệ sĩ nào được chọn.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {formData.artists.map((artistData, index) => (
                          <div key={index} className="flex gap-2 p-3 border rounded-lg">
                            <div className="flex-1">
                              <Select
                                value={artistData.artist_id || undefined}
                                onValueChange={(value) => updateArtist(index, 'artist_id', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn nghệ sĩ" />
                                </SelectTrigger>
                                <SelectContent>
                                  {artists.map((artist) => (
                                    <SelectItem key={artist.id} value={artist.id}>
                                      {artist.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="w-32">
                              <Select
                                value={artistData.role}
                                onValueChange={(value) => updateArtist(index, 'role', value as 'main' | 'featured' | 'composer' | 'producer')}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="main">Chính</SelectItem>
                                  <SelectItem value="featured">Khách mời</SelectItem>
                                  <SelectItem value="composer">Sáng tác</SelectItem>
                                  <SelectItem value="producer">Sản xuất</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeArtist(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pricing & Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle>Giá và Tồn kho</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Price */}
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Giá bán <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={errors.price ? 'border-red-500' : ''}
                          placeholder="0.00"
                        />
                        {errors.price && (
                          <p className="text-sm text-red-500">{errors.price}</p>
                        )}
                      </div>

                      {/* Cost Price */}
                      <div className="space-y-2">
                        <Label htmlFor="cost_price">Giá gốc</Label>
                        <Input
                          id="cost_price"
                          name="cost_price"
                          type="number"
                          step="0.01"
                          value={formData.cost_price}
                          onChange={handleInputChange}
                          className={errors.cost_price ? 'border-red-500' : ''}
                          placeholder="0.00"
                        />
                        {errors.cost_price && (
                          <p className="text-sm text-red-500">{errors.cost_price}</p>
                        )}
                      </div>

                      {/* Stock Quantity */}
                      <div className="space-y-2">
                        <Label htmlFor="stock_quantity">
                          Tồn kho <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="stock_quantity"
                          name="stock_quantity"
                          type="number"
                          value={formData.stock_quantity}
                          onChange={handleInputChange}
                          className={errors.stock_quantity ? 'border-red-500' : ''}
                          placeholder="0"
                        />
                        {errors.stock_quantity && (
                          <p className="text-sm text-red-500">{errors.stock_quantity}</p>
                        )}
                      </div>

                      {/* Min Stock Level */}
                      <div className="space-y-2">
                        <Label htmlFor="min_stock_level">Mức tồn tối thiểu</Label>
                        <Input
                          id="min_stock_level"
                          name="min_stock_level"
                          type="number"
                          value={formData.min_stock_level}
                          onChange={handleInputChange}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trạng thái</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái sản phẩm</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Không hoạt động</SelectItem>
                          <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_featured">Sản phẩm nổi bật</Label>
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) =>
                          handleSwitchChange('is_featured', checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Product Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hình ảnh sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-change"
                        />
                        <Label htmlFor="image-change" className="block">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            asChild
                          >
                            <span className="cursor-pointer">Thay đổi ảnh</span>
                          </Button>
                        </Label>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <div className="text-muted-foreground">
                            <p>Click để tải ảnh lên</p>
                            <p className="text-sm">PNG, JPG, GIF up to 500KB</p>
                          </div>
                        </Label>
                      </div>
                    )}
                    {errors.image && (
                      <p className="text-sm text-red-500">{errors.image}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-2">
                      <Button type="submit" className="w-full" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Cập nhật sản phẩm
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => router.visit('/admin/products')}
                        disabled={isSaving}
                      >
                        Hủy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductEdit;

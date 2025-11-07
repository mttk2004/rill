import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Save, Loader2, X, RefreshCw } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ProductCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  genres: string[];
}

interface FormData {
  name: string;
  sku: string;
  genre: string;
  description: string;
  price: string;
  cost_price: string;
  stock_quantity: string;
  min_stock_level: string;
  is_featured: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: File | null;
}

interface FormErrors {
  name?: string;
  sku?: string;
  genre?: string;
  description?: string;
  price?: string;
  cost_price?: string;
  stock_quantity?: string;
  min_stock_level?: string;
  status?: string;
  image?: string;
}

export const ProductCreateDialog = ({
  isOpen,
  onClose,
  genres,
}: ProductCreateDialogProps) => {
  // Function to generate SKU in format VINYL-{3 letters}{3 digits}
  const generateSKU = () => {
    // Generate 3 random uppercase letters
    const letters = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');

    // Generate 3 random digits
    const digits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `VINYL-${letters}${digits}`;
  };

  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: generateSKU(),
    genre: '',
    description: '',
    price: '',
    cost_price: '',
    stock_quantity: '',
    min_stock_level: '10',
    is_featured: false,
    status: 'active',
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generate new SKU when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, sku: generateSKU() }));
    }
  }, [isOpen]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Vui lòng chọn file hình ảnh' }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'Kích thước file không được vượt quá 2MB',
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: undefined }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: generateSKU(),
      genre: '',
      description: '',
      price: '',
      cost_price: '',
      stock_quantity: '',
      min_stock_level: '10',
      is_featured: false,
      status: 'active',
      image: null,
    });
    setImagePreview(null);
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrors({});
    setIsSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('sku', formData.sku);
      submitData.append('genre', formData.genre);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('cost_price', formData.cost_price);
      submitData.append('stock_quantity', formData.stock_quantity);
      submitData.append('min_stock_level', formData.min_stock_level);
      submitData.append('is_featured', formData.is_featured ? '1' : '0');
      submitData.append('status', formData.status);

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await axios.post('/admin/products', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Tạo sản phẩm mới thành công');
        resetForm();
        onClose();
        router.reload();
      }
    } catch (error: unknown) {
      console.error('Error creating product:', error);

      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'errors' in error.response.data
      ) {
        setErrors(error.response.data.errors as FormErrors);
      } else {
        toast.error('Không thể tạo sản phẩm mới');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Image */}
            <div className="md:col-span-2 space-y-2">
              <Label>Hình ảnh sản phẩm</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={errors.image ? 'border-red-500' : ''}
                  />
                  {formData.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="mt-2"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Xóa ảnh
                    </Button>
                  )}
                  {errors.image && (
                    <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG, GIF, WEBP. Tối đa 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="md:col-span-2 space-y-2">
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
              <p className="text-sm text-muted-foreground">
                SKU được tạo tự động. Bạn có thể chỉnh sửa hoặc tạo mã mới.
              </p>
            </div>

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
              <Label htmlFor="cost_price">
                Giá vốn <span className="text-red-500">*</span>
              </Label>
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
                Số lượng tồn kho <span className="text-red-500">*</span>
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
              <Label htmlFor="min_stock_level">
                Mức tồn kho tối thiểu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="min_stock_level"
                name="min_stock_level"
                type="number"
                value={formData.min_stock_level}
                onChange={handleInputChange}
                className={errors.min_stock_level ? 'border-red-500' : ''}
                placeholder="10"
              />
              {errors.min_stock_level && (
                <p className="text-sm text-red-500">{errors.min_stock_level}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
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

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Featured */}
            <div className="md:col-span-2 flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Sản phẩm nổi bật
                </Label>
                <p className="text-sm text-muted-foreground">
                  Hiển thị sản phẩm này ở vị trí nổi bật
                </p>
              </div>
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Tạo sản phẩm
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

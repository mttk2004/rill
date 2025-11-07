import { useState, FormEvent, ChangeEvent } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AdminNavigation } from '@/components/admin-navigation';
import { type AdminArtist } from '@/lib/artist-helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ArtistEditProps {
  artist: AdminArtist;
  countries: string[];
}

interface FormData {
  name: string;
  description: string;
  country: string;
  is_active: boolean;
  image: File | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  country?: string;
  image?: string;
}

export default function ArtistEdit({ artist, countries }: ArtistEditProps) {
  const [formData, setFormData] = useState<FormData>({
    name: artist.name,
    description: artist.description || '',
    country: artist.country || '',
    is_active: artist.is_active,
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    artist.image_url || null
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
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
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Vui lòng chọn file hình ảnh' }));
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Kích thước file không được vượt quá 2MB' }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: undefined }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(artist.image_url || null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('country', formData.country);
      submitData.append('is_active', formData.is_active ? '1' : '0');

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // Laravel needs _method for PUT requests with FormData
      submitData.append('_method', 'PUT');

      const response = await axios.post(
        route('admin.artists.update', artist.id),
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Cập nhật nghệ sĩ thành công');
        router.visit(route('admin.artists.show', artist.id));
      }
    } catch (error: unknown) {
      console.error('Error updating artist:', error);

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
        toast.error('Không thể cập nhật nghệ sĩ');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Head title={`Chỉnh sửa nghệ sĩ - ${artist.name}`} />
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href={route('admin.artists.show', artist.id)}>
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Quay lại chi tiết
              </Button>
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Chỉnh sửa nghệ sĩ</h1>
                <p className="text-muted-foreground">
                  Cập nhật thông tin nghệ sĩ {artist.name}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Tên nghệ sĩ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên nghệ sĩ"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Quốc gia</Label>
                    <Select
                      value={formData.country || undefined}
                      onValueChange={(value) => handleSelectChange('country', value)}
                    >
                      <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p className="text-sm text-red-500">{errors.country}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Nhập mô tả về nghệ sĩ"
                      rows={6}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="is_active" className="cursor-pointer">
                        Trạng thái hoạt động
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Nghệ sĩ có thể hiển thị trên trang web
                      </p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-6">
                    {/* Preview */}
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={imagePreview || undefined} alt={formData.name} />
                      <AvatarFallback className="text-3xl">
                        {formData.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label htmlFor="image">Chọn hình ảnh mới</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Định dạng: JPG, PNG, GIF, WEBP. Kích thước tối đa: 2MB
                        </p>
                        <div className="flex gap-2">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={errors.image ? 'border-red-500' : ''}
                          />
                          {formData.image && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleRemoveImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {errors.image && (
                          <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Link href={route('admin.artists.show', artist.id)}>
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </Link>
                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

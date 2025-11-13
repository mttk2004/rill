import { useState, FormEvent, ChangeEvent } from 'react';
import { router, Head } from '@inertiajs/react';
import { Save, Loader2, X, ArrowLeft } from 'lucide-react';
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
  slug: string;
  country: string | null;
  description: string | null;
  is_active: boolean;
  image_url: string | null;
}

interface PageProps {
  artist: Artist;
  countries: string[];
}

interface FormData {
  name: string;
  country: string;
  description: string;
  is_active: boolean;
  image: File | null;
}

interface FormErrors {
  name?: string;
  country?: string;
  description?: string;
  image?: string;
}

const ArtistEdit = ({ artist, countries }: PageProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: artist.name,
    country: artist.country || '',
    description: artist.description || '',
    is_active: artist.is_active,
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(artist.image_url);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrors({});
    setIsSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('_method', 'PUT');
      submitData.append('name', formData.name);
      submitData.append('country', formData.country);
      submitData.append('description', formData.description);
      submitData.append('is_active', formData.is_active ? '1' : '0');

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await axios.post(`/admin/artists/${artist.id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Cập nhật nghệ sĩ thành công');
        router.visit('/admin/artists');
      }
    } catch (error: unknown) {
      console.error('Error updating artist:', error);

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
          responseData.message || 'Có lỗi xảy ra khi cập nhật nghệ sĩ'
        );
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật nghệ sĩ');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Head title={`Chỉnh sửa: ${artist.name}`} />
      <AdminNavigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.visit('/admin/artists')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold">Chỉnh sửa nghệ sĩ</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Cập nhật thông tin cho nghệ sĩ: {artist.name}
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
                    {/* Artist Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Tên nghệ sĩ <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'border-red-500' : ''}
                        placeholder="Nhập tên nghệ sĩ"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country">Quốc gia</Label>
                      <div className="flex flex-col gap-2">
                        <Select
                          value={countries.includes(formData.country) ? formData.country : undefined}
                          onValueChange={(value) => handleSelectChange('country', value)}
                        >
                          <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Chọn quốc gia có sẵn" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={errors.country ? 'border-red-500' : ''}
                          placeholder="Hoặc nhập quốc gia mới"
                        />
                      </div>
                      {errors.country && (
                        <p className="text-sm text-red-500">{errors.country}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Chọn từ danh sách bên trên hoặc nhập quốc gia mới ở ô dưới.
                      </p>
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
                        placeholder="Tiểu sử nghệ sĩ, thông tin về sự nghiệp..."
                        rows={6}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active">Trạng thái hoạt động</Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          handleSwitchChange('is_active', checked)
                        }
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.is_active ? 'Nghệ sĩ đang hoạt động' : 'Nghệ sĩ không hoạt động'}
                    </p>
                  </CardContent>
                </Card>

                {/* Artist Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hình ảnh nghệ sĩ</CardTitle>
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
                            Cập nhật nghệ sĩ
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => router.visit('/admin/artists')}
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

export default ArtistEdit;

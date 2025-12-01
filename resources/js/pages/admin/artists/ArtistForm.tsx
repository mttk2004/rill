import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, UploadCloud, Globe, User } from 'lucide-react';
import { Artist } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/admin/AdminLayout';

interface ArtistFormProps {
  artist?: Artist;
  countries: string[];
}

const ArtistForm = ({ artist, countries }: ArtistFormProps) => {
  const { showToast } = useToast();
  const isEditMode = Boolean(artist);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { data, setData, post, processing } = useForm<{
    name: string;
    slug: string;
    description: string;
    country: string;
    image: string | File;
    is_active: boolean;
  }>({
    name: artist?.name || '',
    slug: artist?.slug || '',
    description: artist?.description || '',
    country: artist?.country || '',
    image: artist?.image || '',
    is_active: artist?.is_active ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleSlugGen = () => {
    if (data.name) {
      const slug = data.name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      setData('slug', slug);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setData('image', file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && artist) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: Record<string, any> = { ...data, _method: 'put' };

      // If image is a string (not a File), remove it from payload
      if (typeof data.image === 'string') {
        delete updateData.image;
      }

      router.post(`/admin/artists/${artist.id}`, updateData, {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          showToast(`Đã cập nhật nghệ sĩ "${data.name}"`, 'success');
        },
        onError: (errors: Record<string, string>) => {
          const firstError = Object.values(errors)[0];
          showToast(firstError || 'Có lỗi xảy ra khi cập nhật nghệ sĩ', 'error');
        },
      });
    } else {
      post('/admin/artists', {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          showToast(`Đã thêm nghệ sĩ mới "${data.name}"`, 'success');
        },
        onError: (errors: Record<string, string>) => {
          const firstError = Object.values(errors)[0];
          showToast(firstError || 'Có lỗi xảy ra khi tạo nghệ sĩ', 'error');
        },
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.visit('/admin/artists')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                {isEditMode ? 'Chỉnh sửa nghệ sĩ' : 'Thêm nghệ sĩ mới'}
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.visit('/admin/artists')} className="h-10 px-4 py-2">
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit} disabled={processing} className="h-10 px-4 py-2 flex items-center gap-2">
              <Save size={18} /> {processing ? 'Đang lưu...' : 'Lưu thông tin'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" /> Thông tin chung
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên nghệ sĩ (Name)</label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    onBlur={handleSlugGen}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Ví dụ: Trịnh Công Sơn"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    value={data.slug}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500 bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="trinh-cong-son"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia (Country)</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="country"
                      value={data.country || ''}
                      onChange={handleChange}
                      list="countries"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="Nhập hoặc chọn quốc gia"
                    />
                    <Globe className="absolute right-3 top-2.5 text-gray-400" size={18} />
                  </div>
                  <datalist id="countries">
                    {countries.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu (Description)</label>
                  <textarea
                    name="description"
                    value={data.description || ''}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Tiểu sử, phong cách âm nhạc..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hình ảnh</h3>
              <div className="mb-4">
                <div className="aspect-square rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group hover:border-primary hover:text-primary transition-colors cursor-pointer w-48 h-48 mx-auto">
                  {imagePreview || data.image ? (
                    <>
                      <img src={imagePreview || (typeof data.image === 'string' ? data.image : '')} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">Thay đổi</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} className="mb-2" />
                      <span className="text-xs font-medium text-center px-2">Upload Avatar</span>
                    </>
                  )}
                  <input type="file" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
                <input
                  type="text"
                  name="image"
                  value={typeof data.image === 'string' ? data.image : ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng thái</h3>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={data.is_active}
                  onChange={(e) => setData('is_active', e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <span className="text-gray-900 font-medium">Đang hoạt động</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ArtistForm;

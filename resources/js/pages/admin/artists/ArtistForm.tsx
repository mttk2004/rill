
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, Globe, FileText, User } from 'lucide-react';
import { ARTISTS } from '../../../data';
import { Artist } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/Button';

const ArtistForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditMode = Boolean(id);

  // Mock DB structure
  const [formData, setFormData] = useState<Partial<Artist>>({
    name: '',
    slug: '',
    description: '',
    country: '',
    image: '',
    // is_active: 1, // Assume handled
  });

  useEffect(() => {
    if (isEditMode && id) {
      const artist = ARTISTS.find(a => a.id === id);
      if (artist) {
        setFormData(artist);
      } else {
        showToast('Không tìm thấy nghệ sĩ', 'error');
        navigate('/admin/artists');
      }
    }
  }, [isEditMode, id, navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlugGen = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      showToast(`Đã cập nhật nghệ sĩ "${formData.name}"`, 'success');
    } else {
      showToast(`Đã thêm nghệ sĩ mới "${formData.name}"`, 'success');
    }
    navigate('/admin/artists');
  };

  const commonCountries = [
    "Việt Nam", "United States", "United Kingdom", "France", "Germany",
    "Japan", "South Korea", "China", "Australia", "Canada"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/artists')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {isEditMode ? 'Chỉnh sửa nghệ sĩ' : 'Thêm nghệ sĩ mới'}
            </h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/admin/artists')} className="h-10 px-4 py-2">
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} className="h-10 px-4 py-2 flex items-center gap-2">
            <Save size={18} /> Lưu thông tin
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
                  value={formData.name}
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
                  value={formData.slug}
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
                    value={formData.country || ''}
                    onChange={handleChange}
                    list="countries"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Nhập hoặc chọn quốc gia"
                  />
                  <Globe className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
                <datalist id="countries">
                  {commonCountries.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu (Description)</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
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
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
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
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
              <input
                type="text"
                name="image"
                value={formData.image || ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng thái</h3>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded focus:ring-primary" />
              <span className="text-gray-900 font-medium">Đang hoạt động</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArtistForm;

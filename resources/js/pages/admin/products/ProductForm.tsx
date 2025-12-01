
import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Image as ImageIcon, UploadCloud, Plus, Trash2, User } from 'lucide-react';
import { PRODUCTS, ARTISTS } from '../../../data';
import { Product, ArtistRole, ProductArtist } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/Button';

const ProductForm = () => {
  const { props } = usePage<{ id?: string }>();
  const id = props.id;
  const { showToast } = useToast();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    sku: '',
    price: '',
    cost_price: '',
    stock_quantity: 0,
    min_stock_level: 0,
    status: 'active',
    genre: '',
    label: '',
    artists: [], // Start with empty artists array
    description: '',
    detailed_description: '',
    image: '',
    meta_title: '',
    meta_description: '',
  });

  // Local state for new artist entry
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedRole, setSelectedRole] = useState<ArtistRole>('main');

  useEffect(() => {
    if (isEditMode && id) {
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        setFormData({ ...product, artists: product.artists || [] });
      } else {
        showToast('Không tìm thấy sản phẩm', 'error');
        router.visit('/admin/products');
      }
    }
  }, [isEditMode, id, showToast]);

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

  const handleAddArtist = () => {
    if (!selectedArtistId) {
      showToast('Vui lòng chọn nghệ sĩ', 'info');
      return;
    }

    if (formData.artists?.some(a => a.artist_id === selectedArtistId)) {
      showToast('Nghệ sĩ này đã được thêm', 'info');
      return;
    }

    const newArtistLink: ProductArtist = {
      artist_id: selectedArtistId,
      role: selectedRole,
      sort_order: formData.artists ? formData.artists.length : 0
    };

    setFormData(prev => ({
      ...prev,
      artists: [...(prev.artists || []), newArtistLink]
    }));

    // Reset selection
    setSelectedArtistId('');
    setSelectedRole('main');
  };

  const handleRemoveArtist = (artistId: string) => {
    setFormData(prev => ({
      ...prev,
      artists: prev.artists?.filter(a => a.artist_id !== artistId)
    }));
  };

  const getArtistName = (id: string) => {
    return ARTISTS.find(a => a.id === id)?.name || 'Unknown';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sync deprecated artist_id with the first 'main' artist for compatibility
    const mainArtist = formData.artists?.find(a => a.role === 'main') || formData.artists?.[0];
    const submissionData = {
      ...formData,
      artist_id: mainArtist?.artist_id
    };

    // Mock Submit
    console.log("Submitting:", submissionData);
    if (isEditMode) {
      showToast(`Đã cập nhật sản phẩm "${formData.name}"`, 'success');
    } else {
      showToast(`Đã tạo sản phẩm mới "${formData.name}"`, 'success');
    }
    router.visit('/admin/products');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.visit('/admin/products')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEditMode ? `ID: ${id}` : 'Điền thông tin chi tiết cho đĩa than mới'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.visit('/admin/products')} className="h-10 px-4 py-2">
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} className="h-10 px-4 py-2 flex items-center gap-2">
            <Save size={18} /> Lưu sản phẩm
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleSlugGen}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Ví dụ: Abbey Road"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Mã hàng)</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono"
                    placeholder="VINYL-XXXXXX"
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-500"
                    placeholder="abbey-road"
                  />
                </div>
              </div>

              {/* Artists Section - UPDATED */}
              <div className="border rounded-lg p-4 bg-gray-50 border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={16} /> Nghệ sĩ tham gia
                </h4>

                {/* Add Artist Form */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex-1">
                    <select
                      value={selectedArtistId}
                      onChange={(e) => setSelectedArtistId(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="">-- Chọn nghệ sĩ --</option>
                      {ARTISTS.map(artist => (
                        <option key={artist.id} value={artist.id}>{artist.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-40">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as ArtistRole)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="main">Main (Chính)</option>
                      <option value="featured">Featured (Hợp tác)</option>
                      <option value="composer">Composer (Sáng tác)</option>
                      <option value="producer">Producer (Sản xuất)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddArtist}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary flex items-center justify-center gap-1"
                  >
                    <Plus size={16} /> Thêm
                  </button>
                </div>

                {/* Artist List */}
                {formData.artists && formData.artists.length > 0 ? (
                  <div className="space-y-2">
                    {formData.artists.map((artistLink, idx) => (
                      <div key={`${artistLink.artist_id}-${idx}`} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{getArtistName(artistLink.artist_id)}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${artistLink.role === 'main' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {artistLink.role}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveArtist(artistLink.artist_id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-2">Chưa có nghệ sĩ nào được chọn.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Tóm tắt về sản phẩm..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  name="detailed_description"
                  value={formData.detailed_description || ''}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Chi tiết về album, danh sách bài hát, lịch sử..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Giá & Kho hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá vốn (VNĐ)</label>
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cảnh báo tồn kho thấp</label>
                <input
                  type="number"
                  name="min_stock_level"
                  value={formData.min_stock_level || 0}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="10"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Attributes & Media */}
        <div className="lg:col-span-1 space-y-8">
          {/* Media */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Hình ảnh</h3>
            <div className="mb-4">
              <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group hover:border-primary hover:text-primary transition-colors cursor-pointer">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Thay đổi ảnh</span>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud size={32} className="mb-2" />
                    <span className="text-sm font-medium">Tải ảnh lên</span>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hoặc nhập URL ảnh</label>
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

          {/* Classification */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Phân loại</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status || 'active'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="active">Đang bán (Active)</option>
                  <option value="inactive">Ngừng kinh doanh (Inactive)</option>
                  <option value="out_of_stock">Hết hàng (Out of Stock)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Rock, Jazz..."
                  list="genres"
                />
                <datalist id="genres">
                  <option value="Rock" />
                  <option value="Jazz" />
                  <option value="Pop" />
                  <option value="Electronic" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hãng phát hành</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Sony Music..."
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">SEO Metadata</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Tiêu đề hiển thị trên Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Mô tả ngắn gọn cho công cụ tìm kiếm"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

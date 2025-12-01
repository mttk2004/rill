
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, UploadCloud, Plus, Trash2, User } from 'lucide-react';
import { Product, Artist } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/admin/AdminLayout';

type ArtistRole = 'main' | 'featured' | 'composer' | 'producer';

interface ProductArtist {
  artist_id: string;
  role: ArtistRole;
  sort_order: number;
}

interface ProductFormProps {
  product?: Product;
  genres: string[];
  labels: string[];
  artists: Artist[];
}

const ProductForm = ({ product, genres, labels, artists }: ProductFormProps) => {
  const { showToast } = useToast();
  const isEditMode = Boolean(product);

  const { data, setData, post, put, processing, errors } = useForm({
    name: product?.name || '',
    slug: product?.slug || '',
    sku: product?.sku || '',
    price: product?.price || '',
    cost_price: product?.cost_price || '',
    stock_quantity: product?.stock_quantity || 0,
    min_stock_level: product?.min_stock_level || 0,
    status: product?.status || 'active',
    genre: product?.genre || '',
    label: product?.label || '',
    artists: product?.artists?.map((a: Artist & { pivot?: { role?: string; sort_order?: number } }) => ({
      artist_id: a.id,
      role: (a.pivot?.role as ArtistRole) || 'main',
      sort_order: a.pivot?.sort_order || 0
    })) || [],
    description: product?.description || '',
    detailed_description: product?.detailed_description || '',
    image: product?.image || '',
    meta_title: product?.meta_title || '',
    meta_description: product?.meta_description || '',
  });

  // Local state for new artist entry
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedRole, setSelectedRole] = useState<ArtistRole>('main');

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

  const handleAddArtist = () => {
    if (!selectedArtistId) {
      showToast('Vui lòng chọn nghệ sĩ', 'info');
      return;
    }

    if (data.artists?.some(a => a.artist_id === selectedArtistId)) {
      showToast('Nghệ sĩ này đã được thêm', 'info');
      return;
    }

    const newArtistLink: ProductArtist = {
      artist_id: selectedArtistId,
      role: selectedRole,
      sort_order: data.artists ? data.artists.length : 0
    };

    setData('artists', [...(data.artists || []), newArtistLink]);

    // Reset selection
    setSelectedArtistId('');
    setSelectedRole('main');
  };

  const handleRemoveArtist = (artistId: string) => {
    setData('artists', data.artists?.filter(a => a.artist_id !== artistId));
  };

  const getArtistName = (id: string) => {
    return artists.find(a => a.id === id)?.name || 'Unknown';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && product) {
      put(`/admin/products/${product.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          showToast(`Đã cập nhật sản phẩm "${data.name}"`, 'success');
          router.visit('/admin/products');
        },
        onError: () => {
          showToast('Có lỗi xảy ra khi cập nhật sản phẩm', 'error');
        },
      });
    } else {
      post('/admin/products', {
        preserveScroll: true,
        onSuccess: () => {
          showToast(`Đã tạo sản phẩm mới "${data.name}"`, 'success');
          router.visit('/admin/products');
        },
        onError: () => {
          showToast('Có lỗi xảy ra khi tạo sản phẩm', 'error');
        },
      });
    }
  };

  return (
    <AdminLayout>
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
                {isEditMode ? `ID: ${product?.id}` : 'Điền thông tin chi tiết cho đĩa than mới'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.visit('/admin/products')} className="h-10 px-4 py-2">
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit} disabled={processing} className="h-10 px-4 py-2 flex items-center gap-2">
              <Save size={18} /> {processing ? 'Đang lưu...' : 'Lưu sản phẩm'}
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
                    value={data.name}
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
                      value={data.sku}
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
                      value={data.slug}
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
                        {artists.map(artist => (
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
                  {data.artists && data.artists.length > 0 ? (
                    <div className="space-y-2">
                      {data.artists.map((artistLink, idx) => (
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
                    value={data.description}
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
                    value={data.detailed_description || ''}
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
                    value={data.price}
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
                    value={data.cost_price || ''}
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
                    value={data.stock_quantity}
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
                    value={data.min_stock_level || 0}
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
                  {data.image ? (
                    <>
                      <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
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
                  value={data.image || ''}
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
                    value={data.status || 'active'}
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
                    value={data.genre}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Rock, Jazz..."
                    list="genres"
                  />
                  <datalist id="genres">
                    {genres.map(g => <option key={g} value={g} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hãng phát hành</label>
                  <input
                    type="text"
                    name="label"
                    value={data.label}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Sony Music..."
                    list="labels"
                  />
                  <datalist id="labels">
                    {labels.map(l => <option key={l} value={l} />)}
                  </datalist>
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
                    value={data.meta_title || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Tiêu đề hiển thị trên Google"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={data.meta_description || ''}
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
    </AdminLayout>
  );
};

export default ProductForm;

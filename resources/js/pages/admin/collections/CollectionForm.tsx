
import React, { useState, useEffect, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Layers, Plus, X, GripVertical, Search } from 'lucide-react';
import { COLLECTIONS, COLLECTION_ITEMS, PRODUCTS } from '../../../data';
import { Collection, CollectionItem, CollectionType, Product } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/Button';

// DnD Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Row Component
const SortableRow = ({ item, product, onRemove, onPositionChange }: {
  item: CollectionItem,
  product: Product,
  onRemove: (id: string) => void,
  onPositionChange: (id: string, pos: string) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.product_id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? 'relative' as const : undefined,
    boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : undefined,
    backgroundColor: isDragging ? 'white' : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? 'opacity-80' : 'hover:bg-gray-50'}`}
    >
      <td className="px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing rounded hover:bg-gray-100 transition-colors touch-none"
          type="button"
          style={{ touchAction: 'none' }}
        >
          <GripVertical size={18} />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
            <img src={product.image || ''} alt="" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
            <p className="text-xs text-gray-500">{product.sku}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {/* Position is primarily controlled by DnD, but keeping input for manual override/visibility */}
        <span className="inline-block w-8 text-center text-sm font-mono text-gray-500">
          {item.position}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onRemove(item.product_id)}
          className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          type="button"
        >
          <X size={16} />
        </button>
      </td>
    </tr>
  );
};

// Product Selection Sub-component
const ProductSelector = ({
  currentItems,
  onAdd
}: {
  currentItems: CollectionItem[],
  onAdd: (product: Product) => void
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const availableProducts = useMemo(() => {
    const currentIds = new Set(currentItems.map(i => i.product_id));
    return PRODUCTS.filter(p => !currentIds.has(p.id) && (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    )).slice(0, 5); // Limit suggestions
  }, [currentItems, search]);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm và thêm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            value={search}
            onChange={e => { setSearch(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
          />
        </div>
      </div>

      {isOpen && search && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-10 max-h-60 overflow-y-auto">
          {availableProducts.length > 0 ? (
            availableProducts.map(p => (
              <button
                key={p.id}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 flex items-center gap-3"
                onClick={() => {
                  onAdd(p);
                  setSearch('');
                  setIsOpen(false);
                }}
                type="button"
              >
                <div className="h-8 w-8 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img src={p.image || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.sku}</p>
                </div>
                <Plus size={16} className="text-primary" />
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">Không tìm thấy sản phẩm</div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
};

const CollectionForm = () => {
  const { props } = usePage<{ id?: string }>();
  const id = props.id ? Number(props.id) : undefined;
  const { showToast } = useToast();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<Collection>>({
    name: '',
    slug: '',
    type: 'featured',
    description: '',
    is_active: 1,
    display_order: 0,
    started_at: '',
    ended_at: ''
  });

  const [items, setItems] = useState<CollectionItem[]>([]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px movement to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isEditMode && id) {
      const collection = COLLECTIONS.find(c => c.id === Number(id));
      if (collection) {
        setFormData(collection);
        // Load items sorted by position
        const linkedItems = COLLECTION_ITEMS
          .filter(i => i.collection_id === collection.id)
          .sort((a, b) => a.position - b.position);
        setItems(linkedItems);
      } else {
        showToast('Không tìm thấy bộ sưu tập', 'error');
        router.visit('/admin/collections');
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

  const handleAddProduct = (product: Product) => {
    const newItem: CollectionItem = {
      collection_id: Number(id) || 0, // Mock ID if new
      product_id: product.id,
      position: items.length
    };
    setItems([...items, newItem]);
  };

  const handleRemoveProduct = (productId: string) => {
    setItems(items.filter(i => i.product_id !== productId));
  };

  const handlePositionChange = (productId: string, newPos: string) => {
    // Allow manual input if needed, but primarily for sorting
    const pos = parseInt(newPos) || 0;
    setItems(prev => prev.map(i => i.product_id === productId ? { ...i, position: pos } : i));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.product_id === active.id);
        const newIndex = currentItems.findIndex((item) => item.product_id === over.id);

        const newItems = arrayMove(currentItems, oldIndex, newIndex);

        // Recalculate positions based on new index
        return newItems.map((item, index) => ({
          ...item,
          position: index
        }));
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      items: items
    };
    console.log("Submitting Collection:", payload);
    if (isEditMode) {
      showToast(`Đã cập nhật bộ sưu tập "${formData.name}"`, 'success');
    } else {
      showToast(`Đã tạo bộ sưu tập mới "${formData.name}"`, 'success');
    }
    router.visit('/admin/collections');
  };

  const toInputDate = (isoString?: string | null) => {
    if (!isoString) return '';
    return isoString.slice(0, 16);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.visit('/admin/collections')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {isEditMode ? 'Chỉnh sửa bộ sưu tập' : 'Tạo bộ sưu tập mới'}
            </h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.visit('/admin/collections')} className="h-10 px-4 py-2">
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} className="h-10 px-4 py-2 flex items-center gap-2">
            <Save size={18} /> Lưu lại
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: General Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Layers size={20} className="text-primary" /> Thông tin chung
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên bộ sưu tập</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleSlugGen}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Ví dụ: Giáng Sinh 2025"
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
                  placeholder="giang-sinh-2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại (Type)</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="featured">Featured (Nổi bật)</option>
                  <option value="curated">Curated (Tuyển chọn)</option>
                  <option value="banner">Banner</option>
                  <option value="promotion">Promotion (Khuyến mãi)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Mô tả về bộ sưu tập này..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sản phẩm trong bộ sưu tập</h3>
              <span className="text-xs text-gray-500 italic">Kéo thả để sắp xếp vị trí</span>
            </div>

            <div className="mb-4">
              <ProductSelector currentItems={items} onAdd={handleAddProduct} />
            </div>

            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">Vị trí</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-10"></th>
                  </tr>
                </thead>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <tbody className="bg-white divide-y divide-gray-100">
                    <SortableContext
                      items={items.map(i => i.product_id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {items.length > 0 ? items.map((item) => {
                        const product = PRODUCTS.find(p => p.id === item.product_id);
                        if (!product) return null;
                        return (
                          <SortableRow
                            key={item.product_id}
                            item={item}
                            product={product}
                            onRemove={handleRemoveProduct}
                            onPositionChange={handlePositionChange}
                          />
                        );
                      }) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                            Chưa có sản phẩm nào.
                          </td>
                        </tr>
                      )}
                    </SortableContext>
                  </tbody>
                </DndContext>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thiết lập</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  name="is_active"
                  value={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value={1}>Hoạt động (Active)</option>
                  <option value={0}>Ẩn (Inactive)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  min="0"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="datetime-local"
                    name="started_at"
                    value={toInputDate(formData.started_at)}
                    onChange={(e) => setFormData(prev => ({ ...prev, started_at: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    name="ended_at"
                    value={toInputDate(formData.ended_at)}
                    onChange={(e) => setFormData(prev => ({ ...prev, ended_at: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;

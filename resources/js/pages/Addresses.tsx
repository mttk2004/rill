import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Button from '../components/Button';
import AppLayout from '@/layouts/app-layout';
import AlertDialog from '../components/AlertDialog';
import AddressFormDialog from '../components/address/AddressFormDialog';
import AddressCard from '../components/address/AddressCard';
import { Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface UserAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  province: string;
  province_id?: number;
  district: string;
  district_id?: number;
  ward: string;
  ward_id?: string;
  is_default: boolean;
}

interface AddressesProps {
  addresses: UserAddress[];
}

export default function Addresses({ addresses: propsAddresses = [] }: AddressesProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>(propsAddresses);

  // Sync with props when they change (from Inertia)
  React.useEffect(() => {
    setAddresses(propsAddresses);
  }, [propsAddresses]);

  // Modal States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Data States
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserAddress>>({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    province: '',
    province_id: undefined,
    district: '',
    district_id: undefined,
    ward: '',
    ward_id: undefined,
    is_default: false
  });

  const { showToast } = useToast();

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      full_name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      province: '',
      province_id: undefined,
      district: '',
      district_id: undefined,
      ward: '',
      ward_id: undefined,
      is_default: false
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (addr: UserAddress) => {
    setEditingAddress(addr);
    setFormData({ ...addr });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      router.delete(`/addresses/${deleteId}`, {
        onSuccess: () => {
          setAddresses((prev) => prev.filter((a) => a.id !== deleteId));
          showToast('Đã xóa địa chỉ thành công', 'success');
          setDeleteId(null);
        },
      });
    }
  };

  const handleSetDefault = (id: string) => {
    router.put(`/addresses/${id}/set-default`, {}, {
      onSuccess: () => {
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            is_default: addr.id === id
          }))
        );
        showToast('Đã đặt làm địa chỉ mặc định', 'success');
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddress) {
      // Update existing
      router.put(`/addresses/${editingAddress.id}`, formData, {
        onSuccess: () => {
          setAddresses((prev) => prev.map((a) =>
            a.id === editingAddress.id ? { ...a, ...formData } as UserAddress : a
          ));
          showToast('Cập nhật địa chỉ thành công', 'success');
          setIsDialogOpen(false);
        },
        onError: (errors) => {
          console.error('Update failed:', errors);
          showToast('Cập nhật thất bại: ' + (errors.message || 'Unknown error'), 'error');
        },
      });
    } else {
      router.post('/addresses', formData, {
        onSuccess: () => {
          showToast('Thêm địa chỉ mới thành công', 'success');
          setIsDialogOpen(false);
          // Inertia will automatically update props.addresses, useEffect will sync state
        },
        onError: (errors) => {
          console.error('Add failed:', errors);
          showToast('Thêm địa chỉ thất bại: ' + (errors.message || 'Unknown error'), 'error');
        },
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Địa chỉ giao hàng - Rill" />
      <div className="bg-gray-50 min-h-screen py-12 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-4">
              <ArrowLeft size={16} className="mr-2" /> Quay lại trang chủ
            </Link>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-serif text-3xl font-bold text-gray-900">Sổ Địa Chỉ</h1>
            <Button className="flex items-center gap-2" onClick={handleAddNew}>
              <Plus size={18} /> Thêm mới
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                addr={addr}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        </div>

        {/* Edit/Add Dialog */}
        <AddressFormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleInputChange}
          isEditing={!!editingAddress}
        />

        {/* Confirmation Dialog */}
        <AlertDialog
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xóa địa chỉ?"
          description="Bạn có chắc chắn muốn xóa địa chỉ này khỏi danh sách không? Hành động này không thể hoàn tác."
          confirmText="Xóa ngay"
          type="danger"
        />
      </div>
    </AppLayout>
  );
}

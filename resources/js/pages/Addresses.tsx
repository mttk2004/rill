
import React, { useState } from 'react';
import { ADDRESSES } from '../data';
import { UserAddress } from '../types';
import Button from '../components/Button';
import AlertDialog from '../components/AlertDialog';
import AddressFormDialog from '../components/address/AddressFormDialog';
import AddressCard from '../components/address/AddressCard';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Addresses = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>(ADDRESSES);
  
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
    district: '',
    ward: '',
    is_default: 0
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
      district: '',
      ward: '',
      is_default: 0
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
      setAddresses((prev) => prev.filter((a) => a.id !== deleteId));
      showToast('Đã xóa địa chỉ thành công', 'success');
      setDeleteId(null);
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => 
      prev.map((addr) => ({
        ...addr,
        is_default: addr.id === id ? 1 : 0
      }))
    );
    showToast('Đã đặt làm địa chỉ mặc định', 'success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setAddresses((prev) => {
      let updatedList;
      if (editingAddress) {
        // Update existing
        updatedList = prev.map((a) =>
          a.id === editingAddress.id ? { ...a, ...formData } as UserAddress : a
        );
        showToast('Cập nhật địa chỉ thành công', 'success');
      } else {
        // Add new
        const newAddress = {
          ...formData,
          id: Date.now().toString(),
          user_id: 'current-user', // Mock user ID
        } as UserAddress;
        updatedList = [...prev, newAddress];
        showToast('Thêm địa chỉ mới thành công', 'success');
      }

      // Handle default address logic
      if (formData.is_default === 1) {
        const targetId = editingAddress ? editingAddress.id : updatedList[updatedList.length - 1].id;
        updatedList = updatedList.map((a) => ({
          ...a,
          is_default: a.id === targetId ? 1 : 0,
        }));
      }

      return updatedList;
    });

    setIsDialogOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
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
  );
};

export default Addresses;

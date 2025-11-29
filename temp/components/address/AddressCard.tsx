
import React from 'react';
import { MapPin, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { UserAddress } from '../../types';

interface AddressCardProps {
  addr: UserAddress;
  onEdit: (addr: UserAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ addr, onEdit, onDelete, onSetDefault }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border ${addr.is_default ? 'border-primary ring-1 ring-primary/20' : 'border-gray-100'}`}
    >
      {addr.is_default === 1 && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
          <CheckCircle size={12} /> Mặc định
        </div>
      )}

      <div className="mb-4 flex items-start gap-3">
        <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${addr.is_default ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
          <MapPin size={16} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{addr.full_name}</h3>
          <p className="text-sm text-gray-500">{addr.phone}</p>
        </div>
      </div>

      <div className="mb-6 space-y-1 text-sm text-gray-600">
        <p>{addr.address_line_1}</p>
        {addr.address_line_2 && <p>{addr.address_line_2}</p>}
        <p>{addr.ward}, {addr.district}</p>
        <p className="font-medium text-gray-900">{addr.province}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
        <button
          onClick={() => onEdit(addr)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
        >
          <Edit2 size={14} /> Sửa
        </button>
        <button
          onClick={() => onDelete(addr.id)}
          className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={14} /> Xóa
        </button>

        {addr.is_default !== 1 && (
          <button
            onClick={() => onSetDefault(addr.id)}
            className="ml-auto text-xs font-medium text-primary hover:text-primaryHover hover:underline transition-colors"
          >
            Đặt làm mặc định
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;

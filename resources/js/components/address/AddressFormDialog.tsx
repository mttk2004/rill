
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../Button';
import { UserAddress } from '../../types';
import axios from 'axios';

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: string;
  WardName: string;
}

interface AddressFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Partial<UserAddress>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

const AddressFormDialog: React.FC<AddressFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  isEditing
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

  // Fetch provinces on mount
  useEffect(() => {
    if (isOpen) {
      axios.get('/api/provinces')
        .then(response => {
          if (response.data.success) {
            setProvinces(response.data.data);
          }
        })
        .catch(error => console.error('Failed to fetch provinces:', error));
    }
  }, [isOpen]);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      axios.get('/api/districts', { params: { province_id: selectedProvinceId } })
        .then(response => {
          if (response.data.success) {
            setDistricts(response.data.data);
            setWards([]);
          }
        })
        .catch(error => console.error('Failed to fetch districts:', error));
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvinceId]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrictId) {
      axios.get('/api/wards', { params: { district_id: selectedDistrictId } })
        .then(response => {
          if (response.data.success) {
            setWards(response.data.data);
          }
        })
        .catch(error => console.error('Failed to fetch wards:', error));
    } else {
      setWards([]);
    }
  }, [selectedDistrictId]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = parseInt(e.target.value);
    const province = provinces.find(p => p.ProvinceID === provinceId);

    setSelectedProvinceId(provinceId);
    setSelectedDistrictId(null);

    // Update formData with province name
    const syntheticEvent = {
      target: {
        name: 'province',
        value: province?.ProvinceName || '',
        type: 'text'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);

    // Update formData with province ID
    const idEvent = {
      target: {
        name: 'province_id',
        value: provinceId.toString(),
        type: 'text'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(idEvent);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = parseInt(e.target.value);
    const district = districts.find(d => d.DistrictID === districtId);

    setSelectedDistrictId(districtId);

    // Update formData with district name
    const syntheticEvent = {
      target: {
        name: 'district',
        value: district?.DistrictName || '',
        type: 'text'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);

    // Update formData with district ID
    const idEvent = {
      target: {
        name: 'district_id',
        value: districtId.toString(),
        type: 'text'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(idEvent);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    const ward = wards.find(w => w.WardCode === wardCode);

    // Update formData with ward name
    const syntheticEvent = {
      target: {
        name: 'ward',
        value: ward?.WardName || '',
        type: 'text'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);

    // Update formData with ward ID
    const idEvent = {
      target: {
        name: 'ward_id',
        value: wardCode,
        type: 'text'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(idEvent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200" role="dialog">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={onChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={onChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0912..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ (Số nhà, đường)</label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1 || ''}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="123 Đường ABC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Căn hộ, tầng (Tùy chọn)</label>
            <input
              type="text"
              name="address_line_2"
              value={formData.address_line_2 || ''}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Tòa nhà X, Tầng Y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành</label>
              <select
                name="province"
                value={selectedProvinceId || ''}
                onChange={handleProvinceChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Chọn Tỉnh/Thành</option>
                {provinces.map(province => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
              <select
                name="district"
                value={selectedDistrictId || ''}
                onChange={handleDistrictChange}
                required
                disabled={!selectedProvinceId}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(district => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phường / Xã</label>
              <select
                name="ward"
                onChange={handleWardChange}
                required
                disabled={!selectedDistrictId}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map(ward => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default === 1}
              onChange={onChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" fullWidth>
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormDialog;


import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, Settings as SettingsIcon, Truck, ShieldCheck, Layout } from 'lucide-react';
import Button from '../../components/Button';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/admin/AdminLayout';

interface SettingGroup {
  [key: string]: {
    key: string;
    value: string;
    type: string;
    label: string;
  };
}

interface SettingsProps {
  settings: {
    banner: SettingGroup;
    shipping: SettingGroup;
    policy: SettingGroup;
  };
}

const AdminSettings = ({ settings }: SettingsProps) => {
  const { showToast } = useToast();
  const [activeGroup, setActiveGroup] = useState<'banner' | 'shipping' | 'policy'>('banner');

  // Initialize form data from settings
  const initialData: Record<string, string> = {};
  Object.keys(settings).forEach(group => {
    Object.values(settings[group as keyof typeof settings]).forEach(setting => {
      initialData[setting.key] = setting.value;
    });
  });

  const { data, setData, post, processing } = useForm({
    settings: initialData
  });

  // Group definitions with icons
  const groups = [
    { id: 'banner', label: 'Banner & Giao diện', icon: Layout },
    { id: 'shipping', label: 'Vận chuyển', icon: Truck },
    { id: 'policy', label: 'Chính sách', icon: ShieldCheck },
  ];

  // Helper to handle change
  const handleChange = (key: string, value: string) => {
    setData('settings', {
      ...data.settings,
      [key]: value
    });
  };

  // Render Input based on Type
  const renderInput = (setting: { key: string; value: string; type: string; label: string }) => {
    const currentValue = data.settings[setting.key];

    switch (setting.type) {
      case 'boolean':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={currentValue === '1'}
              onChange={(e) => handleChange(setting.key, e.target.checked ? '1' : '0')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">{currentValue === '1' ? 'Bật' : 'Tắt'}</span>
          </label>
        );

      case 'number':
        return (
          <input
            type="number"
            value={currentValue}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        );

      case 'text':
        // Special handling for 'banner_type' which acts like a select
        if (setting.key === 'banner_type') {
          return (
            <select
              value={currentValue}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="info">Info (Xanh dương)</option>
              <option value="success">Success (Xanh lá)</option>
              <option value="warning">Warning (Vàng)</option>
            </select>
          )
        }
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        );

      default:
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        );
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings', {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Đã lưu cấu hình thành công', 'success');
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0] as string;
        showToast(firstError || 'Có lỗi xảy ra', 'error');
      }
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
              <SettingsIcon className="text-primary" /> Cấu hình hệ thống
            </h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý các tham số vận hành của website</p>
          </div>
          <Button onClick={handleSave} disabled={processing} className="flex items-center gap-2">
            <Save size={18} /> {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <nav className="flex flex-col p-2 space-y-1">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setActiveGroup(group.id as 'banner' | 'shipping' | 'policy')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeGroup === group.id
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <group.icon size={18} />
                    {group.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {groups.find(g => g.id === activeGroup)?.label}
              </h2>

              <div className="space-y-6">
                {settings[activeGroup] && Object.values(settings[activeGroup]).map((setting) => (
                  <div key={setting.key} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-900">
                        {setting.label || setting.key}
                      </label>
                      <p className="text-xs text-gray-500 mt-1 break-all font-mono opacity-70">{setting.key}</p>
                    </div>
                    <div className="md:col-span-2">
                      {renderInput(setting)}
                    </div>
                  </div>
                ))}

                {(!settings[activeGroup] || Object.keys(settings[activeGroup]).length === 0) && (
                  <div className="text-center py-8 text-gray-500 text-sm italic">
                    Không có cấu hình nào trong nhóm này.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;


import React, { useState, useMemo } from 'react';
import { CONFIGS } from '../../data';
import { Config } from '../../types';
import { Save, Settings as SettingsIcon, Truck, ShieldCheck, Layout } from 'lucide-react';
import Button from '../../components/Button';
import { useToast } from '../../context/ToastContext';

const AdminSettings = () => {
  const { showToast } = useToast();
  const [configs, setConfigs] = useState<Config[]>(CONFIGS);
  const [activeGroup, setActiveGroup] = useState('banner');

  // Group definitions with icons
  const groups = [
    { id: 'banner', label: 'Banner & Giao diện', icon: Layout },
    { id: 'shipping', label: 'Vận chuyển', icon: Truck },
    { id: 'policy', label: 'Chính sách', icon: ShieldCheck },
  ];

  // Helper to handle change
  const handleChange = (key: string, value: string) => {
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
  };

  // Render Input based on Type
  const renderInput = (config: Config) => {
    switch (config.type) {
      case 'boolean':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={config.value === '1'}
              onChange={(e) => handleChange(config.key, e.target.checked ? '1' : '0')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">{config.value === '1' ? 'Bật' : 'Tắt'}</span>
          </label>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={config.value}
            onChange={(e) => handleChange(config.key, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        );

      case 'text':
        // Special handling for 'banner_type' which acts like a select
        if (config.key === 'banner_type') {
           return (
             <select
                value={config.value}
                onChange={(e) => handleChange(config.key, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
             >
                <option value="info">Info (Xanh dương)</option>
                <option value="success">Success (Xanh lá)</option>
                <option value="warning">Warning (Vàng)</option>
                <option value="error">Error (Đỏ)</option>
             </select>
           )
        }
        return (
          <input
            type="text"
            value={config.value}
            onChange={(e) => handleChange(config.key, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        );

      default:
        return (
          <input
            type="text"
            value={config.value}
            onChange={(e) => handleChange(config.key, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        );
    }
  };

  const handleSave = () => {
    // API Call Simulation
    console.log("Saving Configs:", configs);
    showToast('Đã lưu cấu hình thành công', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="text-primary" /> Cấu hình hệ thống
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các tham số vận hành của website</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save size={18} /> Lưu thay đổi
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
                  onClick={() => setActiveGroup(group.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeGroup === group.id
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
              {configs.filter(c => c.group === activeGroup).map((config) => (
                <div key={config.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900">
                      {config.label || config.key}
                    </label>
                    <p className="text-xs text-gray-500 mt-1 break-all font-mono opacity-70">{config.key}</p>
                  </div>
                  <div className="md:col-span-2">
                    {renderInput(config)}
                  </div>
                </div>
              ))}
              
              {configs.filter(c => c.group === activeGroup).length === 0 && (
                 <div className="text-center py-8 text-gray-500 text-sm italic">
                    Không có cấu hình nào trong nhóm này.
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

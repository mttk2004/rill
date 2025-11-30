import React, { useState, useRef } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import Button from '../components/Button';
import AppLayout from '@/layouts/app-layout';
import { User, Lock, Bell, LogOut } from 'lucide-react';
import type { SharedData } from '@/types';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { auth } = usePage<SharedData>().props;
  const user = auth?.user;
  const [activeTab, setActiveTab] = useState('profile');
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form
  const profileForm = useForm<{
    name: string;
    phone: string;
    email: string;
    avatar?: File;
  }>({
    name: user?.name || '',
    phone: (user?.phone as string) || '',
    email: user?.email || '',
  });

  // Password form
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.patch('/settings/profile', {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Cập nhật thông tin thành công', 'success');
      },
      onError: () => {
        showToast('Cập nhật thất bại, vui lòng thử lại', 'error');
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put('/settings/password', {
      preserveScroll: true,
      onSuccess: () => {
        passwordForm.reset();
        showToast('Đổi mật khẩu thành công', 'success');
      },
      onError: () => {
        showToast('Đổi mật khẩu thất bại, vui lòng kiểm tra lại', 'error');
      },
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (500KB max)
    if (file.size > 500 * 1024) {
      showToast('Ảnh không được vượt quá 500KB', 'error');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
      showToast('Chỉ chấp nhận file JPG, PNG hoặc GIF', 'error');
      return;
    }

    // Submit with avatar file using PATCH method
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('name', profileForm.data.name);
    formData.append('phone', profileForm.data.phone);
    formData.append('email', profileForm.data.email);
    formData.append('_method', 'PATCH');

    router.post('/settings/profile', formData, {
      preserveScroll: true,
      onSuccess: () => {
        showToast('Cập nhật ảnh đại diện thành công', 'success');
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: () => {
        showToast('Cập nhật ảnh thất bại, vui lòng thử lại', 'error');
      },
    });
  };

  const tabs = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Lock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  return (
    <AppLayout>
      <Head title="Cài đặt tài khoản - Rill" />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Cài Đặt Tài Khoản</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <nav className="flex flex-col p-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                        ? 'bg-primary/5 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
                <div className="border-t border-gray-100 p-2 mt-2">
                  <button
                    onClick={() => router.post('/logout')}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} /> Đăng xuất
                  </button>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold overflow-hidden">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.charAt(0)?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" type="button" onClick={handleAvatarClick}>
                          Thay đổi ảnh đại diện
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">JPG, GIF hoặc PNG. Tối đa 500KB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input
                          type="text"
                          value={profileForm.data.name}
                          onChange={e => profileForm.setData('name', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {profileForm.errors.name && (
                          <p className="text-xs text-red-600 mt-1">{profileForm.errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input
                          type="tel"
                          value={profileForm.data.phone}
                          onChange={e => profileForm.setData('phone', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {profileForm.errors.phone && (
                          <p className="text-xs text-red-600 mt-1">{profileForm.errors.phone}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={profileForm.data.email}
                          disabled
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Liên hệ CSKH để thay đổi email.</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <Button type="submit" disabled={profileForm.processing}>
                        {profileForm.processing ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Bảo mật & Mật khẩu</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={e => passwordForm.setData('current_password', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {passwordForm.errors.current_password && (
                        <p className="text-xs text-red-600 mt-1">{passwordForm.errors.current_password}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                      <input
                        type="password"
                        value={passwordForm.data.password}
                        onChange={e => passwordForm.setData('password', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {passwordForm.errors.password && (
                        <p className="text-xs text-red-600 mt-1">{passwordForm.errors.password}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <Button type="submit" disabled={passwordForm.processing}>
                        {passwordForm.processing ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Cài đặt thông báo</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                      <div>
                        <h4 className="font-medium text-gray-900">Thông báo đơn hàng</h4>
                        <p className="text-sm text-gray-500">Nhận cập nhật về trạng thái vận chuyển và giao hàng.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                      <div>
                        <h4 className="font-medium text-gray-900">Khuyến mãi & Ưu đãi</h4>
                        <p className="text-sm text-gray-500">Nhận thông tin về các đợt giảm giá và sản phẩm mới.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Tin tức Rill Store</h4>
                        <p className="text-sm text-gray-500">Cập nhật blog và bài viết về văn hóa đĩa than.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

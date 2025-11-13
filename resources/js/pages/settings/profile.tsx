import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { User, Calendar, Upload, Mail, Phone, UserCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings-layout';

interface ProfilePageProps extends SharedData {
  user: {
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    date_of_birth?: string;
    avatar_url?: string;
  };
  mustVerifyEmail: boolean;
  status?: string;
}

interface AuthUser {
  name?: string;
  email?: string;
  avatar_url?: string;
  email_verified_at?: string | null;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth, user } = usePage<ProfilePageProps>().props;
  const authUser = auth.user as AuthUser;

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    name: user?.name || authUser?.name || '',
    email: user?.email || authUser?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    date_of_birth: user?.date_of_birth || '',
    avatar: null as File | null,
    _method: 'patch',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (500KB = 512000 bytes)
      const maxSize = 512000;
      if (file.size > maxSize) {
        toast.error(`Kích thước ảnh không được vượt quá 500KB. Ảnh hiện tại: ${(file.size / 1024).toFixed(0)}KB`);
        e.target.value = ''; // Reset input
        return;
      }
      setData('avatar', file);
    } else {
      setData('avatar', null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/settings/profile', {
      preserveScroll: true,
      forceFormData: true,
    });
  }; return (
    <SettingsLayout
      title="Cài đặt hồ sơ"
      description="Quản lý và cập nhật thông tin cá nhân của bạn"
    >
      <Head title="Cài đặt hồ sơ - Rill" />

      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {(user?.avatar_url || authUser?.avatar_url) ? (
                <img
                  src={user?.avatar_url || authUser?.avatar_url}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
              <UserCircle className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
              {user?.name || authUser?.name || 'Chưa có tên'}
            </h3>
            <p className="text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user?.email || authUser?.email || 'Chưa có email'}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Thông tin cá nhân
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Nhập họ và tên"
                />
                <InputError className="text-red-500 text-sm" message={errors.name} />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Địa chỉ email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  name="email"
                  required
                  autoComplete="username"
                  placeholder="Nhập địa chỉ email"
                />
                <InputError className="text-red-500 text-sm" message={errors.email} />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  name="phone"
                  placeholder="Nhập số điện thoại"
                />
                <InputError className="text-red-500 text-sm" message={errors.phone} />
              </div>

              {/* Gender Field */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Giới tính
                </Label>
                <select
                  id="gender"
                  name="gender"
                  value={data.gender}
                  onChange={(e) => setData('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                <InputError className="text-red-500 text-sm" message={errors.gender} />
              </div>

              {/* Date of Birth Field */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="date_of_birth" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ngày sinh
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  className="w-full md:w-1/2 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400"
                  value={data.date_of_birth}
                  onChange={(e) => setData('date_of_birth', e.target.value)}
                  name="date_of_birth"
                />
                <InputError className="text-red-500 text-sm" message={errors.date_of_birth} />
              </div>
            </div>
          </div>

          {/* Avatar Upload Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Ảnh đại diện
              </h4>
            </div>

            <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
              {(user?.avatar_url || authUser?.avatar_url) && (
                <div className="relative group">
                  <img
                    src={user?.avatar_url || authUser?.avatar_url}
                    alt="Avatar hiện tại"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Hiện tại</span>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  onChange={handleAvatarChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-amber-500 file:to-amber-600 file:text-white hover:file:from-amber-600 hover:file:to-amber-700 file:cursor-pointer file:transition-all file:duration-300"
                />
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  📸 Chọn ảnh định dạng JPG, PNG hoặc GIF. Kích thước tối đa 500KB.
                </p>
              </div>
            </div>
            <InputError className="text-red-500 text-sm" message={errors.avatar} />
          </div>

          {/* Email verification notice */}
          {mustVerifyEmail && authUser.email_verified_at === null && (
            <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                    Email chưa được xác thực
                  </h5>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Địa chỉ email của bạn chưa được xác thực.{' '}
                    <Link
                      href={send()}
                      as="button"
                      className="font-semibold underline decoration-yellow-500 underline-offset-4 transition-colors duration-300 hover:decoration-current hover:text-yellow-900 dark:hover:text-yellow-100"
                    >
                      Bấm vào đây để gửi lại email xác thực.
                    </Link>
                  </p>
                </div>
              </div>

              {status === 'verification-link-sent' && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    ✅ Một liên kết xác thực mới đã được gửi đến địa chỉ email của bạn.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-600">
            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out duration-300"
              enterFrom="opacity-0 transform translate-x-2"
              leave="transition ease-in-out duration-300"
              leaveTo="opacity-0 transform -translate-x-2"
            >
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium">Đã lưu thành công</p>
              </div>
            </Transition>

            <Button
              disabled={processing}
              type="submit"
              data-test="update-profile-button"
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>

        {/* Delete User Section */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-600">
          <DeleteUser />
        </div>
      </div>
    </SettingsLayout>
  );
}

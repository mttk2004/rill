import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Button from '../components/Button';
import AppLayout from '@/layouts/app-layout';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, User } from 'lucide-react';

interface LoginProps {
  canResetPassword?: boolean;
  status?: string;
}

export default function Login({ canResetPassword, status }: LoginProps) {
  const { showToast } = useToast();

  const { data, setData, post, processing } = useForm<{
    email: string;
    password: string;
    remember: boolean;
  }>({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login', {
      onSuccess: () => {
        showToast('Đăng nhập thành công! Chào mừng trở lại.', 'success');
      },
      onError: (errors) => {
        if (errors.email) {
          showToast(errors.email, 'error');
        } else if (errors.password) {
          showToast(errors.password, 'error');
        } else {
          showToast('Thông tin đăng nhập không chính xác', 'error');
        }
      },
    });
  };

  const handleQuickLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setData({
        email: 'admin@rill.local',
        password: 'password',
        remember: false,
      });
    } else {
      setData({
        email: 'nguyenvananh@gmail.com',
        password: 'password',
        remember: false,
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Đăng nhập - Rill" />
      <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-lg">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900">Chào Mừng Trở Lại</h2>
            <p className="mt-2 text-sm text-gray-600">
              Đăng nhập vào tài khoản của bạn để tiếp tục
            </p>
          </div>

          {/* Status Message */}
          {status && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {status}
            </div>
          )}

          {/* Quick Login Buttons (Dev Only) */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 text-center">Đăng nhập nhanh (Demo)</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('customer')}
                className="flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <User size={16} /> Customer
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primaryHover transition-colors"
              >
                <ShieldCheck size={16} /> Admin
              </button>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Địa chỉ Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              {canResetPassword && (
                <div className="text-sm">
                  <Link href="/password/reset" className="font-medium text-gray-600 hover:text-primary">
                    Quên mật khẩu?
                  </Link>
                </div>
              )}
            </div>

            <div>
              <Button fullWidth type="submit" disabled={processing}>
                {processing ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-medium text-accent hover:text-primary">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

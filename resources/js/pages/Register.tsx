import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Button from '../components/Button';
import CustomerLayout from '@/layouts/customer-layout';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { showToast } = useToast();

  const { data, setData, post, processing } = useForm<{
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
  }>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register', {
      onSuccess: () => {
        showToast('Tạo tài khoản thành công!', 'success');
      },
    });
  };

  return (
    <CustomerLayout>
      <Head title="Đăng ký - Rill" />
      <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-lg">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900">Tạo Tài Khoản</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tham gia Rill để quản lý đơn hàng và nhận ưu đãi độc quyền
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>
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
                  placeholder="ban@example.com"
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
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirm-password"
                  name="password_confirmation"
                  type="password"
                  required
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={data.terms}
                onChange={(e) => setData('terms', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Tôi đồng ý với <a href="#" className="underline">Điều khoản dịch vụ</a> và <a href="#" className="underline">Chính sách bảo mật</a>
              </label>
            </div>

            <div>
              <Button fullWidth type="submit" disabled={processing}>
                {processing ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-medium text-accent hover:text-primary">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}

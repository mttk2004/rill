
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation
    showToast('Đăng nhập thành công! Chào mừng trở lại.', 'success');
    navigate('/');
  };

  const handleQuickLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      showToast('Đăng nhập quyền Admin thành công', 'info');
      navigate('/admin');
    } else {
      showToast('Đăng nhập quyền Khách hàng thành công', 'success');
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-lg">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900">Chào Mừng Trở Lại</h2>
          <p className="mt-2 text-sm text-gray-600">
            Đăng nhập vào tài khoản của bạn để tiếp tục
          </p>
        </div>

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
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-gray-600 hover:text-primary">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <Button fullWidth type="submit">
              Đăng nhập
            </Button>
          </div>
        </form>

        <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                   Google
                </button>
                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                   Facebook
                </button>
            </div>
        </div>

        <p className="text-center text-sm text-gray-600">
           Chưa có tài khoản?{' '}
           <Link to="/register" className="font-medium text-accent hover:text-primary">
             Đăng ký ngay
           </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
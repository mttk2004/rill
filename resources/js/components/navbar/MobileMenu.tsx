
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { MapPin, FileText, Settings, LogOut } from 'lucide-react';
import Button from '../Button';
import { COLLECTIONS } from '../../data';

interface MobileMenuProps {
  isOpen: boolean;
  isSearchOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isSearchOpen,
  onClose,
  isLoggedIn,
  onLogout,
}) => {
  const { url } = usePage();

  if (!isOpen || isSearchOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-5 duration-200">
      <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        <Link
          href="/"
          className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-primary ${url === '/' ? 'text-primary bg-gray-50' : 'text-gray-700'}`}
          onClick={onClose}
        >
          Trang chủ
        </Link>
        <Link
          href="/products"
          className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-primary ${url.startsWith('/products') ? 'text-primary bg-gray-50' : 'text-gray-700'}`}
          onClick={onClose}
        >
          Sản phẩm
        </Link>

        <div className="px-3 py-2 text-gray-700 font-medium">
          Bộ sưu tập
          <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-100 pl-2">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={`/products?collection=${col.slug}`}
                className="block text-sm text-gray-600 hover:text-primary py-1"
                onClick={onClose}
              >
                {col.name}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/about"
          className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-primary ${url === '/about' ? 'text-primary bg-gray-50' : 'text-gray-700'}`}
          onClick={onClose}
        >
          Giới thiệu
        </Link>
        <Link
          href="/support"
          className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-primary ${url === '/support' ? 'text-primary bg-gray-50' : 'text-gray-700'}`}
          onClick={onClose}
        >
          Hỗ trợ
        </Link>

        <div className="border-t border-gray-100 my-2 pt-2">
          {isLoggedIn ? (
            <>
              <div className="px-3 py-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tài khoản</span>
              </div>
              <Link
                href="/addresses"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                onClick={onClose}
              >
                <MapPin size={18} /> Sổ địa chỉ
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                onClick={onClose}
              >
                <FileText size={18} /> Lịch sử đơn hàng
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                onClick={onClose}
              >
                <Settings size={18} /> Cài đặt
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} /> Đăng xuất
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 px-3 mt-2">
              <Link href="/login" onClick={onClose}>
                <Button fullWidth variant="ghost">Đăng nhập</Button>
              </Link>
              <Link href="/register" onClick={onClose}>
                <Button fullWidth>Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

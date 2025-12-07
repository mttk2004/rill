
import React, { useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingBag, MapPin, FileText, Settings, LogOut } from 'lucide-react';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: any;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ isOpen, onClose, onLogout, user }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden z-50">
      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Người dùng'}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
        </div>
      </div>
      <div className="py-1">
        <Link
          href="/cart"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
          onClick={onClose}
        >
          <ShoppingBag size={16} /> Giỏ hàng
        </Link>
        <Link
          href="/addresses"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
          onClick={onClose}
        >
          <MapPin size={16} /> Địa chỉ
        </Link>
        <Link
          href="/orders"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
          onClick={onClose}
        >
          <FileText size={16} /> Lịch sử đơn hàng
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
          onClick={onClose}
        >
          <Settings size={16} /> Cài đặt
        </Link>
      </div>
      <div className="border-t border-gray-100 py-1">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;

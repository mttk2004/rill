
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, LayoutGrid } from 'lucide-react';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Sản phẩm', path: '/admin/products' },
    { name: 'Đơn hàng', path: '/admin/orders' },
    { name: 'Khách hàng', path: '/admin/customers' },
    { name: 'Mã giảm giá', path: '/admin/vouchers' },
    { name: 'Nghệ sĩ', path: '/admin/artists' },
    { name: 'Bộ sưu tập', path: '/admin/collections' },
    { name: 'Cấu hình', path: '/admin/settings' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link to="/admin" className="text-xl font-serif font-bold tracking-tight text-primary flex items-center gap-2">
              RILL<span className="text-accent">.</span> 
              <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-sans font-bold border border-gray-200">
                Admin Panel
              </span>
            </Link>
            
            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
               <span className="text-sm font-semibold text-gray-900 leading-none">Administrator</span>
               <span className="text-xs text-gray-400 mt-1">admin@rill.local</span>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              title="Đăng xuất"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Thoát</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

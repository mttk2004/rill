
import React from 'react';
import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tight text-white">
              RILL<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
              Đĩa than cao cấp dành cho audiophile đích thực. Bộ sưu tập tuyển chọn những kiệt tác cổ điển và hiện đại.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Cửa hàng</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/products" className="hover:text-white transition-colors">Tất cả đĩa nhạc</Link></li>
              <li><Link to="/products?genre=Jazz" className="hover:text-white transition-colors">Jazz</Link></li>
              <li><Link to="/products?genre=Rock" className="hover:text-white transition-colors">Rock</Link></li>
              <li><Link to="/products?genre=Vietnamese" className="hover:text-white transition-colors">Nhạc Việt</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/addresses" className="hover:text-white transition-colors">Tài khoản</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Trung tâm hỗ trợ</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Chính sách vận chuyển</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Đổi trả hàng</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Đăng ký nhận tin</h4>
            <p className="text-sm text-gray-300 mb-4">Đăng ký để nhận thông báo về sản phẩm mới và ưu đãi độc quyền.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="bg-white/10 border-none rounded px-3 py-2 text-sm w-full focus:ring-1 focus:ring-accent text-white placeholder:text-gray-400"
              />
              <button type="submit" className="bg-white text-primary px-4 py-2 rounded text-sm font-bold hover:bg-gray-100 transition-colors">
                Gửi
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Rill Store. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4 mt-4 md:mt-0 text-sm text-gray-400">
            <Link to="/support" className="hover:text-gray-200">Quyền riêng tư</Link>
            <Link to="/support" className="hover:text-gray-200">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

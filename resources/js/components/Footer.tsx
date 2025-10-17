import { Link } from "@inertiajs/react";
import { Disc3, Facebook, Youtube, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Rill Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Disc3 className="h-8 w-8 text-amber-500" />
              <span className="text-xl font-bold text-white tracking-tight">Rill</span>
            </Link>
            <p className="text-sm text-slate-400">
              Cửa hàng đĩa than trực tuyến dành cho những tâm hồn yêu âm nhạc. Khám phá bộ sưu tập vinyl độc đáo của chúng tôi.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Liên kết nhanh</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm text-slate-400 hover:text-amber-500 transition-colors">Trang chủ</Link></li>
              <li><Link href="/products" className="text-sm text-slate-400 hover:text-amber-500 transition-colors">Sản phẩm</Link></li>
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-amber-500 transition-colors">Về chúng tôi</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Hỗ trợ</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-slate-400 hover:text-amber-500 transition-colors">Chính sách giao hàng</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-amber-500 transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="/support" className="text-sm text-slate-400 hover:text-amber-500 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Mạng xã hội</h3>
            <div className="flex items-center space-x-4 mt-4">
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Github className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Rill. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

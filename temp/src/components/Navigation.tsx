import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Disc3,
  User,
  Menu,
  Search,
  Heart,
  Settings,
  Package,
  LogOut,
  UserCircle,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "Trang chủ", path: "/", icon: null },
    { label: "Sản phẩm", path: "/products", icon: null },
    { label: "Về chúng tôi", path: "/about", icon: null }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Disc3 className="h-8 w-8 text-accent vinyl-spin group-hover:animate-vinyl-spin" />
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-smooth" />
            </div>
            <span className="text-xl font-bold tracking-tight">Rill</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isActive(item.path)
                    ? "text-accent border-b-2 border-accent pb-1"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Wishlist with Hover Card */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/wishlist">
                    <Heart className="h-4 w-4" />
                  </Link>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Danh sách yêu thích</h4>
                  <p className="text-sm text-muted-foreground">
                    6 sản phẩm đang chờ bạn
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-8 h-8 bg-muted rounded"></div>
                      <span>Rumours - Fleetwood Mac</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-8 h-8 bg-muted rounded"></div>
                      <span>Hotel California - Eagles</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">Xem tất cả</Button>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Cart with Hover Card */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/cart">
                    <ShoppingBag className="h-4 w-4" />
                  </Link>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Giỏ hàng</h4>
                  <p className="text-sm text-muted-foreground">
                    3 sản phẩm • 1.550.000₫
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded"></div>
                        <span>Rumours</span>
                      </div>
                      <span>490.000₫</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded"></div>
                        <span>Hotel California</span>
                      </div>
                      <span>420.000₫</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">Thanh toán</Button>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/settings/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Đơn hàng của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings/appearance">
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Hỗ trợ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-accent ${
                    isActive(item.path) ? "text-accent bg-accent/10" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-2 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

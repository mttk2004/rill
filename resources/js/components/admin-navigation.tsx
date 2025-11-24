import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutGrid,
  Package,
  Users,
  Music,
  ShoppingBag,
  BarChart3,
  Settings,
  User,
  LogOut,
  Disc,
  Ticket
} from "lucide-react";
import { type SharedData } from '@/types';

const adminNavItems = [
  { name: "Tổng quan", href: "/admin/statistics", icon: LayoutGrid },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingBag },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },
  { name: "Sản phẩm", href: "/admin/products", icon: Package },
  { name: "Nghệ sĩ", href: "/admin/artists", icon: Music },
  { name: "Collections", href: "/admin/collections", icon: LayoutGrid },
  { name: "Voucher", href: "/admin/vouchers", icon: Ticket },
  { name: "Thống kê", href: "/admin/statistics", icon: BarChart3 },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export const AdminNavigation = () => {
  const { auth } = usePage<SharedData>().props;
  const user = auth.user;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin/statistics" className="flex items-center space-x-2">
            <Disc className="h-8 w-8 text-accent animate-vinyl-spin" />
            <span className="text-2xl font-bold text-primary">Rill Admin</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/appearance" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/logout" method="post" className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

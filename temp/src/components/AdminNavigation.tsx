import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Disc3, 
  Users, 
  Package,
  Music,
  ArrowLeft,
  Settings,
  LogOut
} from "lucide-react";

export const AdminNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const adminNavItems = [
    { label: "Thống kê", path: "/admin/statistics", icon: BarChart3 },
    { label: "Sản phẩm", path: "/admin/products", icon: Package },
    { label: "Nghệ sĩ", path: "/admin/artists", icon: Music },
    { label: "Khách hàng", path: "/admin/customers", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with Admin indicator */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
              <span className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                Về trang chủ
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Disc3 className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold">Rill Admin</span>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-accent ${
                    isActive(item.path) 
                      ? "text-accent" 
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
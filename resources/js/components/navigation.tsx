import { Link, usePage } from "@inertiajs/react";
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
  Music,
  Headphones,
  Mic,
  Star,
  TrendingUp,
  Clock,
  Filter
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { Badge } from "@/components/ui/badge";
import { type FlyoutCartItem, type SharedData } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { useCategoryMenu } from "@/hooks/use-category-menu";
import { Loader2 } from 'lucide-react';

interface NavigationProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

const getIconForCategory = (slug: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        'rock': Music, 'pop': Mic, 'jazz': Headphones, 'classical': Music,
        'electronic': Disc, 'hip-hop': Mic, 'country': Music, 'reggae': Music,
        'featured': Star, 'new': TrendingUp, 'sale': Clock,
    };
    return iconMap[slug] || Disc;
};

export const Navigation = ({ user }: NavigationProps) => {
  const { cartSummary, cartItems } = useCart();
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useCategoryMenu();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Trang chủ", path: "/", icon: null },
    { label: "Sản phẩm", path: "/products", icon: null },
    { label: "Về chúng tôi", path: "/about", icon: null },
    { label: "Hỗ trợ", path: "/support", icon: null }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Disc3 className="h-8 w-8 text-accent vinyl-spin group-hover:animate-vinyl-spin" />
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-smooth" />
              </div>
              <span className="text-xl font-bold tracking-tight">Rill</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button key={item.path} variant="ghost" asChild>
                  <Link href={item.path} className="text-sm font-medium">{item.label}</Link>
                </Button>
              ))}
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="h-9 px-3 text-sm font-medium">
                                Danh mục
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="w-[420px] p-4">
                                    {categoryLoading ? (
                                        <div className="flex items-center justify-center py-6">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
                                        </div>
                                    ) : categoryError ? (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-red-500 mb-1">Không thể tải danh mục</p>
                                            <p className="text-xs text-muted-foreground">{categoryError}</p>
                                        </div>
                                    ) : categoryData ? (
                                        <div className="space-y-4">
                                            {categoryData.special.length > 0 && (
                                                <div>
                                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Đặc biệt</div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {categoryData.special.map((special) => {
                                                            const Icon = getIconForCategory(special.slug);
                                                            return (
                                                                <NavigationMenuLink key={special.slug} asChild>
                                                                    <Link href={`/products?filter=${special.slug}`} className="flex flex-col items-center gap-2 rounded-lg p-3 text-center hover:bg-accent hover:text-accent-foreground transition-colors group">
                                                                        <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors"><Icon className="h-4 w-4" /></div>
                                                                        <div>
                                                                            <div className="text-xs font-medium leading-tight">{special.name.replace('Sản phẩm ', '')}</div>
                                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto mt-1">{special.count}</Badge>
                                                                        </div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex gap-4">
                                                {categoryData.genres.length > 0 && (
                                                    <div className="flex-1">
                                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Thể loại</div>
                                                        <div className="space-y-1">
                                                            {categoryData.genres.slice(0, 7).map((genre) => {
                                                                const Icon = getIconForCategory(genre.slug);
                                                                return (
                                                                    <NavigationMenuLink key={genre.slug} asChild>
                                                                        <Link href={`/products?genre=${genre.slug}`} className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors group">
                                                                            <div className="flex items-center gap-2 min-w-0"><Icon className="h-3.5 w-3.5 flex-shrink-0" /><span className="truncate">{genre.name}</span></div>
                                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto ml-2 flex-shrink-0">{genre.count}</Badge>
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                );
                                                            })}
                                                            {categoryData.genres.length > 7 && (
                                                                <div className="px-2.5 py-1.5">
                                                                    <Link href="/products" className="text-xs text-accent hover:text-accent/80 font-medium">Xem tất cả ({categoryData.genres.length - 7}+)</Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {categoryData.labels.length > 0 && (
                                                    <div className="flex-1">
                                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Hãng</div>
                                                        <div className="space-y-1">
                                                            {categoryData.labels.slice(0, 7).map((label) => (
                                                                <NavigationMenuLink key={label.slug} asChild>
                                                                    <Link href={`/products?label=${label.slug}`} className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors group">
                                                                        <div className="flex items-center gap-2 min-w-0"><Disc className="h-3.5 w-3.5 flex-shrink-0" /><span className="truncate">{label.name}</span></div>
                                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto ml-2 flex-shrink-0">{label.count}</Badge>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            ))}
                                                            {categoryData.labels.length > 7 && (
                                                                <div className="px-2.5 py-1.5">
                                                                    <Link href="/products" className="text-xs text-accent hover:text-accent/80 font-medium">Xem tất cả ({categoryData.labels.length - 7}+)</Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6"><p className="text-sm text-muted-foreground">Không có dữ liệu</p></div>
                                    )}
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              {user && (
                <>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/wishlist"><Heart className="h-5 w-5" /></Link>
                  </Button>

                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="relative">
                              {cartSummary.total_items > 0 && (
                                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">{cartSummary.total_items}</Badge>
                              )}
                              <ShoppingBag className="h-5 w-5" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80 p-0">
                          {/* Flyout content here */}
                      </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/settings/profile"><UserCircle className="mr-2 h-4 w-4" />Hồ sơ</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/orders"><Package className="mr-2 h-4 w-4" />Đơn hàng</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/settings/appearance"><Settings className="mr-2 h-4 w-4" />Cài đặt</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/logout" method="post" as="button"><LogOut className="mr-2 h-4 w-4" />Đăng xuất</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild><Link href="/login">Đăng nhập</Link></Button>
                <Button size="sm" asChild><Link href="/register">Đăng ký</Link></Button>
              </div>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
            <div className="md:hidden border-t bg-background/95 backdrop-blur">
                {/* Mobile nav content here */}
            </div>
        )}
      </div>
    </header>
  );
};

import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Disc3,
  Menu,
  Search,
  Settings,
  Package,
  LogOut,
  UserCircle,
  X,
  Home,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react"; // Import useRef, useEffect
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Import Input
import { ProductsFlyoutMenu } from "@/components/products-flyout-menu";
import { CartFlyout } from "@/components/cart/cart-flyout";

interface NavigationProps {
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
  } | null;
}

const NavLink = ({
  href,
  children,
  hasDropdown = false
}: {
  href: string;
  children: React.ReactNode;
  hasDropdown?: boolean;
}) => {
  const { url } = usePage();
  const isActive = href === "/" ? url === "/" : url.startsWith(href);

  if (hasDropdown) {
    return null; // Will be handled by NavigationMenu
  }

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-all duration-300 hover:text-amber-500 relative group",
        "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px]",
        "after:bg-gradient-to-r after:from-amber-500 after:to-amber-600",
        "after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
        "hover:after:scale-x-100",
        isActive && "text-amber-500 after:scale-x-100 font-semibold"
      )}
    >
      <span className="relative">
        {children}
        {isActive && (
          <span className="absolute -inset-1 bg-amber-500/10 rounded-md -z-10 animate-pulse"></span>
        )}
      </span>
    </Link>
  );
};


export const Navigation = ({ user }: NavigationProps) => {
  const { cartSummary, cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false); // State for search input visibility
  const [searchInputValue, setSearchInputValue] = useState(''); // State for search input value
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for focusing input

  useEffect(() => {
    if (showSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchInput]);

  const handleSearchSubmit = () => {
    if (searchInputValue.trim()) {
      router.get('/products', { search: searchInputValue.trim() });
      setShowSearchInput(false); // Hide input after search
      setSearchInputValue(''); // Clear input
    }
  };

  const navItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sản phẩm", path: "/products" },
    { label: "Về chúng tôi", path: "/about" },
    { label: "Hỗ trợ", path: "/support" },
  ];

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between relative"> {/* Added relative here */}
          {/* Logo */}
          {!showSearchInput && (
            <Link href="/" className="flex items-center space-x-2 group mr-8 md:mr-16">
              <div className="relative">
                <Disc3 className="h-8 w-8 text-amber-500 transition-all duration-500 group-hover:rotate-180 group-hover:scale-110 drop-shadow-lg" />
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300">Rill</span>
            </Link>
          )}

          {/* Desktop Navigation */}
          {!showSearchInput && ( // Conditionally render desktop nav
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-8">
                <NavigationMenuItem>
                  <NavLink href="/">Trang chủ</NavLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onClick={() => router.visit('/products')}
                    className="h-auto bg-transparent px-0 py-0 text-sm font-medium transition-all duration-300 hover:bg-transparent hover:text-amber-500 focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-amber-500 data-[state=open]:font-semibold relative group after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-amber-500 after:to-amber-600 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 data-[state=open]:after:scale-x-100 cursor-pointer"
                  >
                    <span className="relative">
                      Sản phẩm
                      <Sparkles className="inline-block ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ProductsFlyoutMenu />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavLink href="/about">Về chúng tôi</NavLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavLink href="/support">Hỗ trợ</NavLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Search Input Field */}
          <div
            className={cn(
              "absolute inset-x-0 md:relative md:inset-x-auto flex-grow flex items-center transition-all duration-300 ease-in-out",
              showSearchInput ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full md:opacity-0 md:translate-x-0 pointer-events-none"
            )}
          >
            {showSearchInput && (
              <div className="relative w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                    onBlur={() => {
                      if (!searchInputValue.trim()) {
                        setShowSearchInput(false);
                      }
                    }}
                    className="w-full pl-10 pr-10 bg-background/50 backdrop-blur-sm border-amber-500/20 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchInputValue('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>


          {/* Actions */}
          <div className="flex items-center space-x-1">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "hidden sm:flex hover:bg-amber-500/10 hover:text-amber-500 transition-all duration-300",
                      showSearchInput && "hidden"
                    )}
                    onClick={() => setShowSearchInput(!showSearchInput)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-background/95 backdrop-blur-sm border-amber-500/20">
                  <p className="text-foreground">Tìm kiếm</p>
                </TooltipContent>
              </Tooltip>

              {user && (
                <>
                  <HoverCard>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-amber-500/10 hover:text-amber-500 transition-all duration-300" asChild>
                            <Link href="/cart" className="relative group">
                              {cartSummary.items_count > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-xs font-bold text-white shadow-lg animate-in zoom-in-50 duration-300">
                                  <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-75"></span>
                                  <span className="relative">{cartSummary.items_count}</span>
                                </span>
                              )}
                              <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                            </Link>
                          </Button>
                        </HoverCardTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-background/95 backdrop-blur-sm border-amber-500/20">
                        <p className="text-foreground">Giỏ hàng ({cartSummary.items_count})</p>
                      </TooltipContent>
                    </Tooltip>
                    <HoverCardContent className="w-80 bg-background/95 backdrop-blur-xl border-amber-500/20 shadow-xl" align="end">
                      <CartFlyout cartItems={cartItems} cartSummary={cartSummary} />
                    </HoverCardContent>
                  </HoverCard>
                </>
              )}
            </TooltipProvider>

            {/* User Dropdown */}
            {!showSearchInput && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9 hover:bg-amber-500/10 transition-all duration-300 group">
                    <Avatar className="h-6 w-6 ring-2 ring-transparent group-hover:ring-amber-500/50 transition-all duration-300">
                      <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xs">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium group-hover:text-amber-500 transition-colors">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-amber-500/20">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-amber-500/10 hover:text-amber-600 focus:bg-amber-500/10 focus:text-amber-600 transition-colors">
                    <Link href="/settings/profile"><UserCircle className="mr-2 h-4 w-4 text-amber-500" />Hồ sơ cá nhân</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-amber-500/10 hover:text-amber-600 focus:bg-amber-500/10 focus:text-amber-600 transition-colors">
                    <Link href="/addresses"><Home className="mr-2 h-4 w-4 text-amber-500" />Địa chỉ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-amber-500/10 hover:text-amber-600 focus:bg-amber-500/10 focus:text-amber-600 transition-colors">
                    <Link href="/orders"><Package className="mr-2 h-4 w-4 text-amber-500" />Đơn hàng của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-amber-500/10 hover:text-amber-600 focus:bg-amber-500/10 focus:text-amber-600 transition-colors">
                    <Link href="/settings/appearance"><Settings className="mr-2 h-4 w-4 text-amber-500" />Cài đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors hover:text-red-600 focus:text-red-600">
                    <Link href="/logout" method="post" as="button" className="w-full">
                      <LogOut className="mr-2 h-4 w-4 text-red-600" />Đăng xuất
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !showSearchInput && (
                <div className="flex items-center space-x-2 pl-2">
                  <Button variant="ghost" size="sm" className="hover:bg-amber-500/10 hover:text-amber-500 transition-all duration-300" asChild>
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105" asChild>
                    <Link href="/register">Đăng ký</Link>
                  </Button>
                </div>
              )
            )}

            {/* Mobile menu button */}
            {!showSearchInput && ( // Conditionally render mobile menu button
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block px-4 py-2 text-sm font-medium transition-colors hover:text-amber-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-2 border-t">
                {/* Mobile search button - now toggles the main search input */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  onClick={() => {
                    setShowSearchInput(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
                {user && (
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-amber-500/10 hover:text-amber-500 transition-colors" asChild>
                    <Link href="/cart">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Giỏ hàng
                      {cartSummary.items_count > 0 && (
                        <span className="ml-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {cartSummary.items_count}
                        </span>
                      )}
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

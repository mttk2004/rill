import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Disc3,
  Menu,
  Search,
  Heart,
  Settings,
  Package,
  LogOut,
  UserCircle,
  X, // Import X icon
  Home, // Import Home icon
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
import { type FlyoutCartItem } from "@/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Import Input

interface NavigationProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const { url } = usePage();
  const isActive = href === "/" ? url === "/" : url.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-amber-500 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-amber-500 after:scale-x-0 after:origin-left after:transition-transform",
        isActive && "text-amber-500 after:scale-x-100"
      )}
    >
      {children}
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between relative"> {/* Added relative here */}
          {/* Logo */}
          {!showSearchInput && ( // Conditionally render logo
            <Link href="/" className="flex items-center space-x-2 group mr-8 md:mr-16">
              <div className="relative">
                <Disc3 className="h-8 w-8 text-amber-500 transition-transform group-hover:rotate-180" />
              </div>
              <span className="text-xl font-bold tracking-tight">Rill</span>
            </Link>
          )}

          {/* Desktop Navigation */}
          {!showSearchInput && ( // Conditionally render desktop nav
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <NavLink key={item.path} href={item.path}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
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
                    // Hide input if empty and loses focus
                    if (!searchInputValue.trim()) {
                      setShowSearchInput(false);
                    }
                  }}
                  className="w-full pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchInputValue('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
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
                    className={cn("hidden sm:flex", showSearchInput && "hidden")} // Hide search icon when input is shown
                    onClick={() => setShowSearchInput(!showSearchInput)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Tìm kiếm</p></TooltipContent>
              </Tooltip>

              {user && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/wishlist"><Heart className="h-4 w-4" /></Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Danh sách yêu thích</p></TooltipContent>
                  </Tooltip>

                  <HoverCard>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href="/cart" className="relative">
                              {cartSummary.items_count > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                                  {cartSummary.items_count}
                                </span>
                              )}
                              <ShoppingBag className="h-4 w-4" />
                            </Link>
                          </Button>
                        </HoverCardTrigger>
                      </TooltipTrigger>
                      <TooltipContent><p>Giỏ hàng</p></TooltipContent>
                    </Tooltip>
                    <HoverCardContent className="w-80" align="end">
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Giỏ hàng ({cartSummary.items_count})</h4>

                        {cartItems.length === 0 ? (
                          <div className="text-center text-sm text-muted-foreground py-4">
                            Giỏ hàng của bạn đang trống.
                          </div>
                        ) : (
                          <>
                            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 -mr-3">
                              {cartItems.map((item: FlyoutCartItem) => (
                                <div key={item.id} className="flex items-start justify-between text-xs">
                                  <div className="flex-grow overflow-hidden pr-4">
                                    <p className="font-medium truncate">{item.product.name}</p>
                                    <p className="text-muted-foreground">SL: {item.quantity}</p>
                                  </div>
                                  <span className="font-semibold">{item.unit_price.toLocaleString('vi-VN')}₫</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t pt-4 space-y-3">
                              <div className="flex justify-between items-center text-sm font-semibold">
                                <span>Tổng cộng</span>
                                <span>{cartSummary.formatted_total}</span>
                              </div>
                              <Button size="sm" className="w-full" asChild>
                                <Link href="/cart">Đến giỏ hàng</Link>
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </>
              )}
            </TooltipProvider>

            {/* User Dropdown */}
            {!showSearchInput && user ? ( // Conditionally render user dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
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
                  <DropdownMenuItem asChild>
                    <Link href="/settings/profile"><UserCircle className="mr-2 h-4 w-4" />Hồ sơ cá nhân</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/addresses"><Home className="mr-2 h-4 w-4" />Địa chỉ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders"><Package className="mr-2 h-4 w-4" />Đơn hàng của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/appearance"><Settings className="mr-2 h-4 w-4" />Cài đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/logout" method="post" as="button" className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />Đăng xuất
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !showSearchInput && ( // Conditionally render login/register buttons
                <div className="flex items-center space-x-2 pl-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                  <Button size="sm" asChild>
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
                  className="w-full justify-start"
                  onClick={() => {
                    setShowSearchInput(true); // Show search input
                    setIsMenuOpen(false); // Close mobile menu
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
                {user && (
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link href="/wishlist">
                        <Heart className="h-4 w-4 mr-2" />
                        Danh sách yêu thích
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link href="/cart">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Giỏ hàng
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

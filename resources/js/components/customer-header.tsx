import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import {
    type BreadcrumbItem as BreadcrumbItemType
} from '@/types';
import {
    ShoppingCart,
    Heart,
    Search,
    Music,
    Disc,
    Headphones,
    Mic,
    Star,
    TrendingUp,
    Clock,
    Filter,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useCategoryMenu } from '@/hooks/use-category-menu';
import { useCart } from '@/hooks/use-cart';
import { Loader2 } from 'lucide-react';

interface CustomerHeaderProps {
    breadcrumbs?: BreadcrumbItemType[];
}

// Icon mapping for different categories
const getIconForCategory = (slug: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        // Genres
        'rock': Music,
        'pop': Mic,
        'jazz': Headphones,
        'classical': Music,
        'electronic': Disc,
        'hip-hop': Mic,
        'country': Music,
        'reggae': Music,
        // Special categories
        'featured': Star,
        'new': TrendingUp,
        'sale': Clock,
    };
    return iconMap[slug] || Disc;
};

export function CustomerHeader({ breadcrumbs = [] }: CustomerHeaderProps) {
    const { data: categoryData, loading: categoryLoading, error: categoryError } = useCategoryMenu();
    const { cartSummary, cartItems, fetchCartItems } = useCart();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Left side - Sidebar trigger and breadcrumbs */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Center - Categories Navigation */}
            <div className="hidden md:flex items-center">
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
                                            {/* Special Categories - Featured at top */}
                                            {categoryData.special.length > 0 && (
                                                <div>
                                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                                        Đặc biệt
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {categoryData.special.map((special) => {
                                                            const Icon = getIconForCategory(special.slug);
                                                            return (
                                                                <NavigationMenuLink key={special.slug} asChild>
                                                                    <Link
                                                                        href={`/products?filter=${special.slug}`}
                                                                        className="flex flex-col items-center gap-2 rounded-lg p-3 text-center hover:bg-accent hover:text-accent-foreground transition-colors group"
                                                                    >
                                                                        <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                                                                            <Icon className="h-4 w-4" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-xs font-medium leading-tight">
                                                                                {special.name.replace('Sản phẩm ', '')}
                                                                            </div>
                                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto mt-1">
                                                                                {special.count}
                                                                            </Badge>
                                                                        </div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-4">
                                                {/* Genres Column */}
                                                {categoryData.genres.length > 0 && (
                                                    <div className="flex-1">
                                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                                            Thể loại
                                                        </div>
                                                        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                            {categoryData.genres.slice(0, 12).map((genre) => {
                                                                const Icon = getIconForCategory(genre.slug);
                                                                return (
                                                                    <NavigationMenuLink key={genre.slug} asChild>
                                                                        <Link
                                                                            href={`/products?genre=${genre.slug}`}
                                                                            className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
                                                                        >
                                                                            <div className="flex items-center gap-2 min-w-0">
                                                                                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                                                                <span className="truncate">{genre.name}</span>
                                                                            </div>
                                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto ml-2 flex-shrink-0">
                                                                                {genre.count}
                                                                            </Badge>
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                );
                                                            })}
                                                            {categoryData.genres.length > 12 && (
                                                                <div className="px-2.5 py-1.5">
                                                                    <Link
                                                                        href="/products"
                                                                        className="text-xs text-accent hover:text-accent/80 font-medium"
                                                                    >
                                                                        Xem tất cả ({categoryData.genres.length - 12}+)
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Labels Column */}
                                                {categoryData.labels.length > 0 && (
                                                    <div className="flex-1">
                                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                                            Hãng
                                                        </div>
                                                        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                            {categoryData.labels.slice(0, 12).map((label) => {
                                                                return (
                                                                    <NavigationMenuLink key={label.slug} asChild>
                                                                        <Link
                                                                            href={`/products?label=${label.slug}`}
                                                                            className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
                                                                        >
                                                                            <div className="flex items-center gap-2 min-w-0">
                                                                                <Disc className="h-3.5 w-3.5 flex-shrink-0" />
                                                                                <span className="truncate">{label.name}</span>
                                                                            </div>
                                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto ml-2 flex-shrink-0">
                                                                                {label.count}
                                                                            </Badge>
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                );
                                                            })}
                                                            {categoryData.labels.length > 12 && (
                                                                <div className="px-2.5 py-1.5">
                                                                    <Link
                                                                        href="/products"
                                                                        className="text-xs text-accent hover:text-accent/80 font-medium"
                                                                    >
                                                                        Xem tất cả ({categoryData.labels.length - 12}+)
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-muted-foreground">Không có dữ liệu danh mục</p>
                                        </div>
                                    )}
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
                {/* Search Button */}
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2" asChild>
                    <Link href="/products">
                        <Search className="h-4 w-4" />
                        <span className="hidden lg:inline">Tìm kiếm</span>
                    </Link>
                </Button>

                {/* Filter Button */}
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2" asChild>
                    <Link href="/products">
                        <Filter className="h-4 w-4" />
                        <span className="hidden lg:inline">Bộ lọc</span>
                    </Link>
                </Button>

                {/* Wishlist with flyout */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="relative">
                            <Heart className="h-4 w-4" />
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                            >
                                3
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-0">
                        <div className="p-4 border-b bg-gradient-to-r from-accent/5 to-accent/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-accent" />
                                    <h3
                                        className="font-bold text-vintage-primary dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Yêu thích
                                    </h3>
                                </div>
                                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                    3 sản phẩm
                                </Badge>
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            <div className="flex items-center gap-3 p-4 border-b hover:bg-accent/5 transition-colors">
                                <div className="h-12 w-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg flex items-center justify-center">
                                    <Disc className="h-6 w-6 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">The Dark Side of the Moon - Pink Floyd</p>
                                    <p className="text-sm text-accent font-medium">
                                        380,000đ
                                    </p>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs px-2">
                                    Thêm
                                </Button>
                            </div>
                            <div className="flex items-center gap-3 p-4 border-b hover:bg-accent/5 transition-colors">
                                <div className="h-12 w-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg flex items-center justify-center">
                                    <Disc className="h-6 w-6 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">Abbey Road - The Beatles</p>
                                    <p className="text-sm text-accent font-medium">
                                        450,000đ
                                    </p>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs px-2">
                                    Thêm
                                </Button>
                            </div>
                            <div className="flex items-center gap-3 p-4 hover:bg-accent/5 transition-colors">
                                <div className="h-12 w-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg flex items-center justify-center">
                                    <Disc className="h-6 w-6 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">Kind of Blue - Miles Davis</p>
                                    <p className="text-sm text-accent font-medium">
                                        420,000đ
                                    </p>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs px-2">
                                    Thêm
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-gradient-to-r from-accent/5 to-accent/10">
                            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                                <Link href="/wishlist">Xem tất cả yêu thích</Link>
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Cart with flyout */}
                <DropdownMenu onOpenChange={(open) => open && fetchCartItems()}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="relative">
                            <ShoppingCart className="h-4 w-4" />
                            {cartSummary.total_items > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                >
                                    {cartSummary.total_items}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-0">
                        <div className="p-4 border-b bg-gradient-to-r from-accent/5 to-accent/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-accent" />
                                    <h3
                                        className="font-bold text-vintage-primary dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Giỏ hàng
                                    </h3>
                                </div>
                                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                    {cartSummary.total_items} sản phẩm
                                </Badge>
                            </div>
                        </div>

                        {cartItems.length > 0 ? (
                            <>
                                <div className="max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-4 border-b hover:bg-accent/5 transition-colors">
                                            <div className="h-12 w-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg flex items-center justify-center">
                                                <Disc className="h-6 w-6 text-accent" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.product.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{item.product.artists.map(a => a.name).join(', ')}</p>
                                                <p className="text-sm text-accent font-medium mt-1">
                                                    {item.quantity} x {item.unit_price.toLocaleString('vi-VN')}đ
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t bg-gradient-to-r from-accent/5 to-accent/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <span
                                            className="font-bold text-vintage-primary dark:text-white"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            Tổng cộng:
                                        </span>
                                        <span
                                            className="font-black text-xl text-accent"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {cartSummary.formatted_total}
                                        </span>
                                    </div>
                                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium" asChild>
                                        <Link href="/cart">Xem giỏ hàng</Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="h-16 w-16 bg-gradient-to-br from-accent/10 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ShoppingCart className="h-8 w-8 text-accent" />
                                </div>
                                <p
                                    className="text-vintage-tertiary dark:text-vintage-tertiary mb-2"
                                    style={{ fontFamily: "'Crimson Text', serif" }}
                                >
                                    Giỏ hàng trống
                                </p>
                                <Button size="sm" variant="outline" className="text-xs" asChild>
                                    <Link href="/products">Khám phá sản phẩm</Link>
                                </Button>
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

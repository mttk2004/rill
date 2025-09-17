import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard, products } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    ShoppingBag, 
    Users, 
    Music, 
    Package,
    BarChart3,
    Settings,
    Heart,
    ShoppingCart,
    User,
    History,
    Disc
} from 'lucide-react';
import AppLogo from './app-logo';

// Admin navigation items
const getAdminNavItems = (): NavItem[] => [
    {
        title: 'Tổng quan',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Sản phẩm',
        href: '/admin/products',
        icon: Disc,
    },
    {
        title: 'Nghệ sĩ',
        href: '/admin/artists',
        icon: Music,
    },
    {
        title: 'Đơn hàng',
        href: '/admin/orders',
        icon: Package,
    },
    {
        title: 'Khách hàng',
        href: '/admin/customers',
        icon: Users,
    },
    {
        title: 'Thống kê',
        href: '/admin/analytics',
        icon: BarChart3,
    },
    {
        title: 'Cài đặt',
        href: '/admin/settings',
        icon: Settings,
    },
];

// Customer navigation items
const getCustomerNavItems = (): NavItem[] => [
    {
        title: 'Sản phẩm',
        href: products(),
        icon: ShoppingBag,
    },
    {
        title: 'Yêu thích',
        href: '/customer/wishlist',
        icon: Heart,
    },
    {
        title: 'Giỏ hàng',
        href: '/customer/cart',
        icon: ShoppingCart,
    },
    {
        title: 'Đơn hàng của tôi',
        href: '/customer/orders',
        icon: History,
    },
    {
        title: 'Tài khoản',
        href: '/customer/profile',
        icon: User,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Hỗ trợ',
        href: '/support',
        icon: null,
    },
    {
        title: 'Về Rill',
        href: '/about',
        icon: null,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';
    
    // Get navigation items based on user role
    const navItems = isAdmin ? getAdminNavItems() : getCustomerNavItems();
    
    // Determine the home link based on user role
    const homeHref = isAdmin ? dashboard() : products();
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch className="flex items-center space-x-3">
                                <div className="relative">
                                    <Disc 
                                        className="h-8 w-8 text-accent" 
                                        style={{ 
                                            animation: 'spin 8s linear infinite',
                                            filter: 'drop-shadow(0 2px 4px rgba(217, 119, 6, 0.3))'
                                        }} 
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-vintage-primary dark:bg-white" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span 
                                        className="text-xl font-black text-vintage-primary dark:text-white tracking-tight leading-none" 
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Rill
                                    </span>
                                    <span 
                                        className="text-xs text-accent font-semibold tracking-[0.1em] uppercase -mt-1"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        {isAdmin ? 'Admin Panel' : 'Vinyl Store'}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

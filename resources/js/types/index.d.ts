import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Artist {
    id: string;
    name: string;
    slug: string;
    role?: string;
    sort_order?: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    detailed_description?: string;
    price: number;
    compare_price?: number;
    stock_quantity: number;
    genre: string;
    label: string;
    image?: string;
    is_featured: boolean;
    status: 'active' | 'inactive' | 'out_of_stock';
    artists: Artist[];
    main_artists: string[];
    featured_artists: string[];
    in_stock: boolean;
    low_stock: boolean;
    discount_percentage?: number;
}

export interface ProductFilters {
    genres: string[];
    labels: string[];
    artists: { name: string; slug: string }[];
    sort_options: { value: string; label: string }[];
}

export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface ProductsPageData {
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
    filters: ProductFilters;
    pagination: Pagination;
}

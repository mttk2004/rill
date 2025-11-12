import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// Ziggy types
interface ZiggyConfig {
  url: string;
  port: number | null;
  defaults: Record<string, unknown>;
  routes: Record<string, {
    uri: string;
    methods: string[];
    parameters?: string[];
    bindings?: Record<string, string>;
    wheres?: Record<string, string>;
  }>;
}

declare global {
  interface Window {
    Ziggy: ZiggyConfig;
  }

  // Ziggy route helper function
  function route(name: string, params?: unknown): string;
}

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

export interface CartSummary {
  total_items: number;
  total_amount: number;
  items_count: number;
  formatted_total: string;
}

export interface FlyoutCartItem {
  id: number;
  quantity: number;
  unit_price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
  };
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  cart: {
    summary: CartSummary;
    items: FlyoutCartItem[];
  };
  flash?: {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
  };
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
  sku: string;
  price: number;
  cost_price?: number;
  compare_price?: number;
  stock_quantity: number;
  min_stock_level: number;
  genre: string;
  label: string;
  image?: string;
  is_featured: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  meta_title?: string;
  meta_description?: string;
  artists: Artist[];
  main_artists?: Artist[];
  in_stock?: boolean;
  low_stock?: boolean;
  discount_percentage?: number;
  reviews_count?: number;
  average_rating?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
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

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Paginator<T> {
  data: T[];
  links: PaginationLink[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ProductsPageData {
  products: {
    data: Product[];
    links: PaginationLink[];
    meta: Pagination;
  };
  filters: ProductFilters;
  pagination: Pagination;
}



export interface Artist {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  image: string | null;
}

export type ArtistRole = 'main' | 'featured' | 'composer' | 'producer';

export interface ProductArtist {
  artist_id: string;
  role: ArtistRole;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  detailed_description: string | null;
  sku: string;
  price: string; // decimal(12,2) in DB
  cost_price?: string; // decimal(12,2) in DB, nullable
  stock_quantity: number;
  min_stock_level?: number;
  genre: string;
  label: string;
  image: string | null;
  artist_id?: string; // Deprecated: Kept for backward compatibility
  artists?: ProductArtist[]; // Many-to-Many relationship
  status?: 'active' | 'inactive' | 'out_of_stock'; // enum
  meta_title?: string | null;
  meta_description?: string | null;
  preview_url?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface UserAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  province: string;
  district: string;
  ward: string;
  is_default: number;
}

export type CollectionType = 'featured' | 'banner' | 'promotion' | 'curated';

export interface Collection {
  id: number;
  name: string;
  slug: string;
  type: CollectionType;
  description: string | null;
  is_active: number; // 1 or 0
  started_at: string | null;
  ended_at: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionItem {
  id?: number; // Primary key of pivot table
  collection_id: number;
  product_id: string;
  position: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Config {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
  label?: string; // Added label for UI display
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  product_image?: string | null; // Added for UI convenience, though not in DB strictly
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export type PaymentMethod = 'cod' | 'vnpay';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  amount: number;
  currency: string;
  transaction_id: string | null;
  gateway_response: string | null; // JSON string in DB
  processed_at: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: UserAddress; // Stored as JSON in DB
  notes: string | null;
  placed_at: string;
  created_at: string;
  updated_at: string;
  tracking_number?: string;
  
  // Relations (for UI)
  items: OrderItem[];
  histories?: OrderStatusHistory[];
  payment?: Payment;
}

// Updated to match Database Schema exactly
export interface Voucher {
  id: string;
  code: string;
  name: string; // varchar(255)
  description: string | null; // text, nullable
  type: 'fixed' | 'percentage'; // enum in DB (currently shows 'fixed', but keeping logical flexibility)
  value: number; // decimal(10,2) - Amount to discount
  minimum_amount: number | null; // decimal(10,2) - Min order value
  maximum_discount: number | null; // decimal(10,2) - Max cap for percentage
  usage_limit: number | null; // int
  used_count: number; // int
  usage_limit_per_user: number | null; // int
  valid_from: string; // timestamp
  valid_to: string; // timestamp
  is_active: number; // tinyint(1): 1 = active, 0 = inactive
  created_at: string; // timestamp
  updated_at?: string; // timestamp
}

export interface VoucherUsage {
  id: string;
  voucher_id: string;
  user_id: string;
  order_id: string;
  discount_amount: number;
  used_at: string;
}

// Added User Interface based on Schema
export interface User {
  id: string; // varchar(19)
  name: string; // varchar(255)
  email: string; // varchar(255)
  email_verified_at: string | null; // timestamp
  password?: string; // varchar(255) - optional for UI handling
  role: 'admin' | 'customer'; // enum
  phone: string | null; // varchar(10)
  gender: 'male' | 'female' | 'other' | null; // enum
  date_of_birth: string | null; // date
  avatar: string | null; // varchar(255)
  is_active: number; // tinyint(1)
  remember_token?: string | null; // varchar(100)
  created_at: string; // timestamp
  updated_at?: string; // timestamp
  deleted_at?: string | null; // timestamp
}

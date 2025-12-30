
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  isFeatured?: boolean;
  stock: number;
  reviews?: Review[];
}

export interface ShippingZone {
  id: string;
  name: string;
  fee: number;
  estimatedDays: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedStyle?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type OrderStatus = 'Pending' | 'Paid' | 'Dispatched' | 'Delivered';
export type UserRole = 'admin' | 'staff' | 'customer';

export interface StaffPermissions {
  access_orders: boolean;
  access_inventory: boolean;
  access_revenue_data: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: StaffPermissions;
  lastActive?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  location: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  mpesaCode?: string;
  createdAt: string;
  shippingMethod: string;
}

export interface TenderInquiry {
  id: string;
  orgName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productCategory: string;
  estimatedQuantity: number;
  requirements: string;
  createdAt: string;
  status: 'New' | 'Reviewed' | 'Closed';
}

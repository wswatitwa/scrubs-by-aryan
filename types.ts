
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
  subCategory?: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  isFeatured?: boolean;
  stock: number;
  reviews?: Review[];
  styles?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  model?: string;
  warranty?: string;
  material?: string;
  includes?: string[];
  packageSize?: string;
  materials?: string[];
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
  selectedMaterial?: string;
  specialInstructions?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type OrderStatus = 'Pending' | 'Paid' | 'Dispatched' | 'Delivered' | 'Sent' | 'In Transit';
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
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'email' | 'phone';
  phoneNumber?: string;
  password?: string; // For mock auth
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
  notes?: string;
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

export interface SocialMediaLinks {
  whatsapp: string;
  facebook: string;
  instagram: string;
  facebookPageId?: string; // For Facebook Feed
  instagramToken?: string; // For Instagram Feed
}

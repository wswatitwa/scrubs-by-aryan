
import { Product, Order, TenderInquiry, ShippingZone } from './types';

export const SHIPPING_ZONES: ShippingZone[] = [
  { id: 'sz-1', name: 'Nyahururu (Local Pickup)', fee: 0, estimatedDays: 'Same Day' },
  { id: 'sz-2', name: 'Nairobi CBD (G4S)', fee: 450, estimatedDays: '1-2 Days' },
  { id: 'sz-3', name: 'Nakuru Town', fee: 300, estimatedDays: '1 Day' },
  { id: 'sz-4', name: 'Mombasa / Coast', fee: 650, estimatedDays: '2-3 Days' },
  { id: 'sz-5', name: 'Kisumu / Western', fee: 550, estimatedDays: '2 Days' },
  { id: 'sz-6', name: 'Other Major Towns (Parcels)', fee: 500, estimatedDays: '2-3 Days' }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Elite Comfort Scrubs (Set)',
    category: 'Apparel',
    price: 3500.00,
    description: 'High-performance, moisture-wicking fabric designed for long shifts. Antimicrobial finish.',
    image: 'https://images.unsplash.com/photo-1599493356621-1969311a7692?auto=format&fit=crop&q=80&w=1200',
    isFeatured: true,
    stock: 45,
    reviews: [
      { id: 'r1', userName: 'Nurse Joy', rating: 5, comment: 'Best scrubs in Kenya! So breathable.', date: '2024-03-10', isVerified: true },
      { id: 'r2', userName: 'Dr. Peter', rating: 4, comment: 'Great quality, but the size runs slightly large.', date: '2024-03-12', isVerified: true }
    ]
  },
  {
    id: '2',
    name: 'Classic White Lab Coat',
    category: 'Apparel',
    price: 2800.00,
    description: 'Crisp, professional lab coats with reinforced pockets and embroidery options.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200',
    isFeatured: true,
    stock: 30,
    reviews: [
      { id: 'r3', userName: 'Student Mary', rating: 5, comment: 'Perfect for my clinical rotations.', date: '2024-03-15', isVerified: true }
    ]
  },
  {
    id: '3',
    name: 'Littmann Classic III Stethoscope',
    category: 'Equipment',
    price: 12500.00,
    description: 'The industry standard for diagnostic excellence. High acoustic sensitivity.',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=1200',
    isFeatured: true,
    stock: 12,
    reviews: [
      { id: 'r4', userName: 'Dr. Omondi', rating: 5, comment: 'Authentic product. Crystal clear sound.', date: '2024-03-01', isVerified: true }
    ]
  },
  {
    id: '4',
    name: 'Digital Blood Pressure Monitor',
    category: 'Diagnostics',
    price: 4500.00,
    description: 'Portable, highly accurate BP machine with memory storage for up to 90 readings.',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446f8a?auto=format&fit=crop&q=80&w=1200',
    isFeatured: false,
    stock: 25,
    reviews: []
  },
  {
    id: '5',
    name: 'Theater Net Caps (Bulk Pack)',
    category: 'Accessories',
    price: 1200.00,
    description: 'Pack of 50 breathable, comfortable hair covers for surgical environments.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    isFeatured: false,
    stock: 100,
    reviews: []
  },
  {
    id: '6',
    name: 'Medical Grade Clogs',
    category: 'Footwear',
    price: 4200.00,
    description: 'Anti-slip, ergonomic footwear designed for 12+ hour medical shifts.',
    image: 'https://images.unsplash.com/photo-1631548210082-65860628659b?auto=format&fit=crop&q=80&w=1200',
    isFeatured: false,
    stock: 18,
    reviews: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7721',
    customerName: 'Dr. Jane Mugo',
    customerPhone: '0712345678',
    location: 'Nairobi',
    items: [{ ...PRODUCTS[0], quantity: 2 }],
    subtotal: 7000,
    shippingFee: 450,
    total: 7450,
    status: 'Pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    shippingMethod: 'G4S Courier'
  }
];

export const INITIAL_TENDERS: TenderInquiry[] = [
  {
    id: 'TDR-001',
    orgName: 'Laikipia County Health Board',
    contactPerson: 'Director Kamau',
    email: 'kamau@laikipia.go.ke',
    phone: '0711223344',
    productCategory: 'Staff Scrubs & Lab Coats',
    estimatedQuantity: 500,
    requirements: 'Need navy blue scrubs with county emblem embroidery.',
    createdAt: new Date().toISOString(),
    status: 'New'
  }
];


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
  // APPAREL
  {
    id: 'app-scr-1',
    name: 'Elite Comfort Scrubs (Set)',
    category: 'Apparel',
    price: 3500.00,
    description: 'High-performance, moisture-wicking fabric designed for long shifts. Antimicrobial finish.',
    image: 'https://images.unsplash.com/photo-1599493356621-1969311a7692?auto=format&fit=crop&q=80&w=1200',
    isFeatured: true,
    stock: 45,
    reviews: [
      { id: 'r1', userName: 'Nurse Joy', rating: 5, comment: 'Best scrubs in Kenya! So breathable.', date: '2024-03-10', isVerified: true }
    ]
  },
  {
    id: 'app-lab-1',
    name: 'Classic White Lab Coat',
    category: 'Apparel',
    price: 2800.00,
    description: 'Crisp, professional lab coats with reinforced pockets and embroidery options.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200',
    isFeatured: true,
    stock: 30
  },

  // EQUIPMENT
  {
    id: 'eq-bp-1',
    name: 'Digital Arm BP Monitor',
    category: 'Equipment',
    price: 4500,
    description: 'Fully automatic blood pressure monitor with arrhythmia detection.',
    image: 'https://images.unsplash.com/photo-1623944889288-cd147dbb517c?auto=format&fit=crop&q=80&w=600',
    stock: 30
  },
  {
    id: 'eq-bp-2',
    name: 'Manual Sphygmomanometer',
    category: 'Equipment',
    price: 2800,
    description: 'Professional aneroid sphygmomanometer with nylon cuff.',
    image: 'https://images.unsplash.com/photo-1542884748-2b87b3664b42?auto=format&fit=crop&q=80&w=600',
    stock: 45
  },
  {
    id: 'eq-spo2-1',
    name: 'Fingertip Pulse Oximeter',
    category: 'Equipment',
    price: 1800,
    description: 'Accurate SpO2 and pulse rate measurement with OLED display.',
    image: 'https://images.unsplash.com/photo-1596766468729-e88941f17fc4?auto=format&fit=crop&q=80&w=600',
    stock: 120
  },
  {
    id: 'eq-steth-1',
    name: 'Classic III Stethoscope',
    category: 'Equipment',
    price: 12500,
    description: 'High acoustic sensitivity for performing general physical assessments.',
    image: 'https://images.unsplash.com/photo-1631217868269-dfec8a9fe306?auto=format&fit=crop&q=80&w=600',
    stock: 15
  },
  {
    id: 'eq-steth-2',
    name: 'Cardiology IV',
    category: 'Equipment',
    price: 28000,
    description: 'Outstanding acoustics with better audibility of high-frequency sounds.',
    image: 'https://images.unsplash.com/photo-1631217868269-dfec8a9fe306?auto=format&fit=crop&q=80&w=600',
    stock: 8
  },
  {
    id: 'eq-therm-ir',
    name: 'Infrared Thermometer',
    category: 'Equipment',
    price: 2500,
    description: 'Non-contact digital infrared thermometer gun.',
    image: 'https://images.unsplash.com/photo-1585842378081-5c0203cc740c?auto=format&fit=crop&q=80&w=600',
    stock: 80
  },
  {
    id: 'eq-oto-1',
    name: 'Pocket Otoscope',
    category: 'Equipment',
    price: 6500,
    description: 'Fiber optic illumination for cool, obstruction-free viewing.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
    stock: 15
  },

  // PPE
  {
    id: 'ppe-gum-1',
    name: 'Medical Grade Gumboots',
    category: 'PPE',
    price: 2500,
    description: 'Heavy-duty, fluid-resistant gumboots designed for theatre.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    stock: 50
  },
  {
    id: 'ppe-cap-1',
    name: 'Disposable Bouffant Caps',
    category: 'PPE',
    price: 1200,
    description: 'Breathable, non-woven spunbond fabric. Pack of 100.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 200
  },
  {
    id: 'ppe-mask-1',
    name: 'N95 High-Filtration Respirator',
    category: 'PPE',
    price: 3500,
    description: 'NIOSH certified N95 respirator. Box of 20.',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600',
    stock: 150
  },
  {
    id: 'ppe-glov-1',
    name: 'Sterile Surgical Gloves',
    category: 'PPE',
    price: 2500,
    description: 'Latex-free, powder-free, individually packed sterile gloves. Box of 50.',
    image: 'https://images.unsplash.com/photo-1583912267550-d0d9f64a1324?auto=format&fit=crop&q=80&w=600',
    stock: 100
  },
  {
    id: 'ppe-gown-iso',
    name: 'Disposable Isolation Gown',
    category: 'PPE',
    price: 350,
    description: 'Fluid-resistant, non-woven SMS fabric.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 300
  },
  {
    id: 'ppe-overall',
    name: 'Full Body Coverall',
    category: 'PPE',
    price: 1800,
    description: 'Type 5/6 chemical and particle protection.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 100
  },

  // ACCESSORIES
  {
    id: 'acc-watch-1',
    name: 'Silicone Fob Watch',
    category: 'Accessories',
    price: 850,
    description: 'Hygienic silicone infection-control fob watch.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=600',
    stock: 60
  },
  {
    id: 'acc-watch-2',
    name: 'Clip-On Digital Watch',
    category: 'Accessories',
    price: 1200,
    description: 'Digital display with stopwatch function.',
    image: 'https://images.unsplash.com/photo-1595995252818-1c4b752df25b?auto=format&fit=crop&q=80&w=600',
    stock: 40
  },
  {
    id: 'acc-org-pouch',
    name: 'Pocket Organizer',
    category: 'Accessories',
    price: 1500,
    description: 'Nylon pocket organizer for keeping essentials handy.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    stock: 80
  },
  {
    id: 'acc-penlight',
    name: 'LED Penlight',
    category: 'Accessories',
    price: 850,
    description: 'Reusable medical penlight with pupil gauge.',
    image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=600',
    stock: 100
  },

  // DIAGNOSTICS
  {
    id: 'diag-glu-1',
    name: 'Accu-Chek Active Kit',
    category: 'Diagnostics',
    price: 3500,
    description: 'Reliable blood glucose monitoring system.',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
    stock: 50
  },
  {
    id: 'diag-test-malaria',
    name: 'Malaria Antigen Test (25s)',
    category: 'Diagnostics',
    price: 2500,
    description: 'Rapid immunoassay for qualitative detection.',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=600',
    stock: 100
  },

  // FOOTWEAR
  {
    id: 'foot-clog-1',
    name: 'Elite Ventilation Clogs',
    category: 'Footwear',
    price: 4200,
    description: 'Anti-fatigue sole system with superior arch support.',
    image: 'https://images.unsplash.com/photo-1631548210082-65860628659b?auto=format&fit=crop&q=80&w=600',
    stock: 35
  },
  {
    id: 'foot-sneak-1',
    name: 'Nursing Sneaker',
    category: 'Footwear',
    price: 5500,
    description: 'Athletic design with fluid-resistant coating.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    stock: 25
  },
  {
    id: 'foot-sock-comp',
    name: 'Compression Socks',
    category: 'Footwear',
    price: 1200,
    description: 'Graduated compression to reduce fatigue.',
    image: 'https://images.unsplash.com/photo-1588645063878-3db8778f5a11?auto=format&fit=crop&q=80&w=600',
    stock: 100
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
    productCategory: 'Apparel',
    estimatedQuantity: 500,
    requirements: 'Need navy blue scrubs with county emblem embroidery.',
    createdAt: new Date().toISOString(),
    status: 'New'
  }
];

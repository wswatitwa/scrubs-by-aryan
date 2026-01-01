
import { Product, Order, TenderInquiry, ShippingZone, SocialMediaLinks } from './types';

export const SHIPPING_ZONES: ShippingZone[] = [
  { id: 'sz-1', name: 'Nyahururu (Local Pickup)', fee: 0, estimatedDays: 'Same Day' },
  { id: 'sz-2', name: 'Nairobi CBD (G4S)', fee: 450, estimatedDays: '1-2 Days' },
  { id: 'sz-3', name: 'Nakuru Town', fee: 300, estimatedDays: '1 Day' },
  { id: 'sz-4', name: 'Mombasa / Coast', fee: 650, estimatedDays: '2-3 Days' },
  { id: 'sz-5', name: 'Kisumu / Western', fee: 550, estimatedDays: '2 Days' },
  { id: 'sz-6', name: 'Other Major Towns (Parcels)', fee: 500, estimatedDays: '2-3 Days' }
];

export const INITIAL_SOCIAL_LINKS: SocialMediaLinks = {
  whatsapp: '+254 722 435698',
  facebook: 'https://web.facebook.com/p/Scrubs-by-Aryan-Ke-61554847971027/?_rdc=1&_rdr#',
  instagram: ''
};

export const PRODUCTS: Product[] = [
  // APPAREL
  {
    id: 'ap-scr-1',
    name: 'V-Neck Performance Top',
    category: 'Apparel',
    subCategory: 'Scrubs',
    price: 1800,
    description: 'Ultra-soft moisture wicking fabric with reinforced seams.',
    image: 'https://images.unsplash.com/photo-1599493356621-1969311a7692?auto=format&fit=crop&q=80&w=600',
    stock: 120,
    styles: ['V-Neck'],
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Teal', hex: '#008080' },
      { name: 'Hunter Green', hex: '#355E3B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    isFeatured: true,
    reviews: [
      { id: 'r1', userName: 'Nurse Joy', rating: 5, comment: 'Best scrubs in Kenya! So breathable.', date: '2024-03-10', isVerified: true }
    ]
  },
  {
    id: 'ap-scr-2',
    name: 'Jogger Flex Pants',
    category: 'Apparel',
    subCategory: 'Scrubs',
    price: 2200,
    description: 'Cuffed jogger design with 5-pocket clinical utility system.',
    image: 'https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?auto=format&fit=crop&q=80&w=600',
    stock: 85,
    styles: ['Jogger'],
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Teal', hex: '#008080' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL']
  },
  {
    id: 'ap-lab-1',
    name: 'Professional Full-Length Coat',
    category: 'Apparel',
    subCategory: 'Lab Coats',
    price: 3500,
    description: 'Heavyweight blend with stain-resistant coating and internal tablet pockets.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
    stock: 40,
    styles: ['Full', 'Tailored'],
    colors: [
      { name: 'Cream White', hex: '#FFFDD0' },
      { name: 'Blue White', hex: '#F0F8FF' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    isFeatured: true
  },

  // EQUIPMENT
  {
    id: 'eq-bp-1',
    name: 'Digital Arm BP Monitor',
    category: 'Equipment',
    subCategory: 'BP Machines',
    price: 4500,
    description: 'Fully automatic blood pressure monitor with arrhythmia detection and 90-memory storage.',
    image: 'https://images.unsplash.com/photo-1623944889288-cd147dbb517c?auto=format&fit=crop&q=80&w=600',
    stock: 30,
    model: 'Omron-Compatible Series Y',
    warranty: '2 Years',
    styles: ['Standard Cuff', 'Large Cuff']
  },
  {
    id: 'eq-bp-2',
    name: 'Manual Sphygmomanometer',
    category: 'Equipment',
    subCategory: 'BP Machines',
    price: 2800,
    description: 'Professional aneroid sphygmomanometer with nylon cuff and chrome-plated gauge.',
    image: 'https://images.unsplash.com/photo-1542884748-2b87b3664b42?auto=format&fit=crop&q=80&w=600',
    stock: 45,
    warranty: '1 Year',
    styles: ['Black Cuff']
  },
  {
    id: 'eq-bp-wrist',
    name: 'Wrist BP Monitor',
    category: 'Equipment',
    subCategory: 'BP Machines',
    price: 3200,
    description: 'Compact and portable wrist blood pressure monitor with smart inflation technology.',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
    stock: 60,
    warranty: '1 Year'
  },
  {
    id: 'eq-spo2-1',
    name: 'Fingertip Pulse Oximeter',
    category: 'Equipment',
    subCategory: 'Monitor Systems',
    price: 1800,
    description: 'OLED display, accurate SpO2 and pulse rate measurement. Includes lanyard and batteries.',
    image: 'https://images.unsplash.com/photo-1596766468729-e88941f17fc4?auto=format&fit=crop&q=80&w=600',
    stock: 120,
    warranty: '1 Year',
    colors: [
      { name: 'Blue', hex: '#0EA5E9' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    id: 'eq-therm-ir',
    name: 'Infrared Thermometer',
    category: 'Equipment',
    subCategory: 'Monitor Systems',
    price: 2500,
    description: 'Non-contact digital infrared thermometer gun. Instant 1-second reading.',
    image: 'https://images.unsplash.com/photo-1585842378081-5c0203cc740c?auto=format&fit=crop&q=80&w=600',
    stock: 80,
    warranty: '1 Year'
  },
  {
    id: 'eq-neb-1',
    name: 'Portable Compressor Nebulizer',
    category: 'Equipment',
    subCategory: 'Monitor Systems',
    price: 4800,
    description: 'Efficient medication delivery for asthma and respiratory conditions. Low noise.',
    image: 'https://images.unsplash.com/photo-1584013926510-a447817eb487?auto=format&fit=crop&q=80&w=600',
    stock: 25,
    warranty: '2 Years'
  },
  {
    id: 'eq-steth-1',
    name: 'Classic III Stethoscope',
    category: 'Equipment',
    subCategory: 'Stethoscopes',
    price: 12500,
    description: 'High acoustic sensitivity for performing general physical assessments. Tunable diaphragms.',
    image: 'https://images.unsplash.com/photo-1631217868269-dfec8a9fe306?auto=format&fit=crop&q=80&w=600',
    stock: 15,
    warranty: '5 Years',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Navy Blue', hex: '#000080' },
      { name: 'Caribbean Blue', hex: '#0EA5E9' }
    ]
  },
  {
    id: 'eq-steth-2',
    name: 'Cardiology IV',
    category: 'Equipment',
    subCategory: 'Stethoscopes',
    price: 28000,
    description: 'Outstanding acoustics with better audibility of high-frequency sounds. For critical care.',
    image: 'https://images.unsplash.com/photo-1631217868269-dfec8a9fe306?auto=format&fit=crop&q=80&w=600',
    stock: 8,
    warranty: '7 Years',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Hunter Green', hex: '#355E3B' },
      { name: 'Plum', hex: '#583759' }
    ]
  },
  {
    id: 'eq-steth-light',
    name: 'Lightweight II S.E.',
    category: 'Equipment',
    subCategory: 'Stethoscopes',
    price: 8500,
    description: 'Lightweight entry-level stethoscope. Teardrop shape for easy cuff usage.',
    image: 'https://images.unsplash.com/photo-1631217868269-dfec8a9fe306?auto=format&fit=crop&q=80&w=600',
    stock: 20,
    warranty: '2 Years',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Ceil Blue', hex: '#92C6D5' }
    ]
  },
  {
    id: 'eq-oto-1',
    name: 'Pocket Otoscope',
    category: 'Equipment',
    subCategory: 'ENT & General',
    price: 6500,
    description: 'Fiber optic illumination for cool, obstruction-free viewing. Compact size.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
    stock: 15,
    warranty: '1 Year'
  },
  {
    id: 'eq-tuning-fork',
    name: 'Medical Tuning Fork Set',
    category: 'Equipment',
    subCategory: 'ENT & General',
    price: 3500,
    description: 'Set of aluminum alloy tuning forks for neurology and audiology testing.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    stock: 30
  },
  {
    id: 'eq-penlight',
    name: 'LED Penlight',
    category: 'Equipment',
    subCategory: 'ENT & General',
    price: 850,
    description: 'Reusable medical penlight with pupil gauge. Durable aluminum body.',
    image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=600',
    stock: 100,
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Black', hex: '#000000' }
    ]
  },

  // DIAGNOSTICS
  {
    id: 'diag-glu-1',
    name: 'Accu-Chek Active Kit',
    category: 'Diagnostics',
    subCategory: 'Glucometers',
    price: 3500,
    description: 'Reliable and fast blood glucose monitoring system. Easy to handle.',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
    stock: 50,
    model: 'Roche Accu-Chek Active',
    includes: ['Meter', '10 Test Strips', 'Lancing Device']
  },
  {
    id: 'diag-glu-2',
    name: 'OneTouch Select Plus',
    category: 'Diagnostics',
    subCategory: 'Glucometers',
    price: 4200,
    description: 'Simple 3-color range indicator to understand results. Fast 5s test time.',
    image: 'https://images.unsplash.com/photo-1628543108426-30238dd551aa?auto=format&fit=crop&q=80&w=600',
    stock: 35,
    model: 'OneTouch Select Plus Simple',
    includes: ['Meter', '10 Strips', 'Case']
  },
  {
    id: 'diag-glu-3',
    name: 'Sinocare Safe-Accu',
    category: 'Diagnostics',
    subCategory: 'Glucometers',
    price: 1800,
    description: 'Affordable and accurate monitoring. Large display.',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=600',
    stock: 80,
    model: 'Sinocare Safe-Accu',
    includes: ['Meter', '50 Strips', '50 Lancets']
  },
  {
    id: 'diag-test-malaria',
    name: 'Malaria Pf/Pv Antigen Test',
    category: 'Diagnostics',
    subCategory: 'Rapid Test Kits',
    price: 2500,
    description: 'Rapid chromatographic immunoassay for qualitative detection. Pack of 25.',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=600',
    stock: 100,
    model: 'Standard Q Malaria',
    includes: ['25 Cassettes', 'Buffer', 'Lancets']
  },
  {
    id: 'diag-test-hpy',
    name: 'H. Pylori Antibody Test',
    category: 'Diagnostics',
    subCategory: 'Rapid Test Kits',
    price: 3000,
    description: 'One step rapid test for detection of H. pylori antibodies. Pack of 25.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    stock: 60,
    model: 'Generic Rapid Test',
    includes: ['25 Devices', 'Buffer Solution']
  },
  {
    id: 'diag-test-preg',
    name: 'HCG Pregnancy Strips',
    category: 'Diagnostics',
    subCategory: 'Rapid Test Kits',
    price: 500,
    description: 'High sensitivity urine test strips. Bulk pack of 50.',
    image: 'https://images.unsplash.com/photo-1624797432677-6f803a98acb3?auto=format&fit=crop&q=80&w=600',
    stock: 200,
    model: 'Novatest HCG',
    includes: ['50 Strips']
  },
  {
    id: 'diag-urine-10',
    name: 'Urinalysis Reagent Strips (10P)',
    category: 'Diagnostics',
    subCategory: 'Lab Consumables',
    price: 1500,
    description: '10-parameter urine test strips (Leukocytes, Nitrite, Urobilinogen, etc.). Bottle of 100.',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
    stock: 150,
    model: 'Uriscan 10',
    includes: ['100 Strips']
  },
  {
    id: 'diag-vac-set',
    name: 'Vacutainer Tubes (EDTA)',
    category: 'Diagnostics',
    subCategory: 'Lab Consumables',
    price: 1200,
    description: 'Lavender top tubes for whole blood hematology determinations. Tray of 100.',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=600',
    stock: 300,
    model: 'BD Vacutainer',
    includes: ['100 Tubes']
  },

  // FOOTWEAR
  {
    id: 'foot-clog-1',
    name: 'Elite Ventilation Clogs',
    category: 'Footwear',
    subCategory: 'Medical Clogs',
    price: 4200,
    description: 'Anti-fatigue sole system with superior arch support. Autoclavable material.',
    image: 'https://images.unsplash.com/photo-1631548210082-65860628659b?auto=format&fit=crop&q=80&w=600',
    stock: 35,
    styles: ['Ventilated', 'Block/Solid'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#111111' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Cyan', hex: '#06B6D4' }
    ],
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  },
  {
    id: 'foot-clog-soft',
    name: 'Soft-Step Clogs',
    category: 'Footwear',
    subCategory: 'Medical Clogs',
    price: 3500,
    description: 'Ultra-lightweight EVA material with slip-resistant outsole. All-day comfort.',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=600',
    stock: 50,
    styles: ['Classic Pattern', 'Floral Print'],
    colors: [
      { name: 'Pink', hex: '#FFC0CB' },
      { name: 'Purple', hex: '#800080' },
      { name: 'Teal', hex: '#008080' }
    ],
    sizes: ['36', '37', '38', '39', '40', '41']
  },
  {
    id: 'foot-sneak-1',
    name: 'Fluid-Resistant Nursing Sneaker',
    category: 'Footwear',
    subCategory: 'Performance Sneakers',
    price: 5500,
    description: 'Athletic design with fluid-resistant coating and slip-resistant rubber sole.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    stock: 25,
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' }
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44']
  },
  {
    id: 'foot-sneak-2',
    name: 'Slip-On Recovery Shoe',
    category: 'Footwear',
    subCategory: 'Performance Sneakers',
    price: 4800,
    description: 'Breathable mesh upper with memory foam insole. Easy slip-on design.',
    image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&q=80&w=600',
    stock: 30,
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Black', hex: '#000000' }
    ],
    sizes: ['37', '38', '39', '40', '41', '42']
  },
  {
    id: 'foot-sock-comp',
    name: 'Compression Socks (15-20 mmHg)',
    category: 'Footwear',
    subCategory: 'Compression Wear',
    price: 1200,
    description: 'Graduated compression to reduce fatigue and swelling. Moisture-wicking fabric.',
    image: 'https://images.unsplash.com/photo-1588645063878-3db8778f5a11?auto=format&fit=crop&q=80&w=600',
    stock: 100,
    styles: ['Solid', 'Striped', 'Fun Pattern'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Multicolor', hex: '#FFA500' }
    ],
    sizes: ['S/M', 'L/XL']
  },

  // ACCESSORIES
  {
    id: 'acc-watch-1',
    name: 'Silicone Fob Watch',
    category: 'Accessories',
    subCategory: 'Watches',
    price: 850,
    description: 'Hygienic silicone infection-control fob watch with precise quartz movement.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=600',
    stock: 60,
    material: 'Silicone / Stainless Steel',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#111111' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Pink', hex: '#FFC0CB' },
      { name: 'Teal', hex: '#008080' }
    ]
  },
  {
    id: 'acc-watch-2',
    name: 'Clip-On Digital Watch',
    category: 'Accessories',
    subCategory: 'Watches',
    price: 1200,
    description: 'Digital display with stopwatch function, date, and backlight. Durable clip.',
    image: 'https://images.unsplash.com/photo-1595995252818-1c4b752df25b?auto=format&fit=crop&q=80&w=600',
    stock: 40,
    material: 'Polycarbonate',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' }
    ]
  },
  {
    id: 'acc-org-pouch',
    name: 'Pocket Organizer',
    category: 'Accessories',
    subCategory: 'Organization',
    price: 1500,
    description: 'Nylon pocket organizer for keeping pens, scissors, and penlights handy. Fits in scrub pocket.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    stock: 80,
    material: 'Nylon 600D',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Pink', hex: '#FFC0CB' }
    ]
  },
  {
    id: 'acc-id-holder',
    name: 'Retractable ID Reel',
    category: 'Accessories',
    subCategory: 'Organization',
    price: 450,
    description: 'Heavy duty retractable badge reel with alligator clip. Extends 24 inches.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    stock: 200,
    material: 'Plastic / Metal',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Blue', hex: '#4169E1' }
    ]
  },
  {
    id: 'acc-scis-band',
    name: 'Bandage Scissors',
    category: 'Accessories',
    subCategory: 'Utility',
    price: 950,
    description: 'Stainless steel Lister bandage scissors with angled tip for patient safety.',
    image: 'https://images.unsplash.com/photo-1580665516053-48762747169f?auto=format&fit=crop&q=80&w=600',
    stock: 50,
    material: 'Stainless Steel',
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Rainbow', hex: '#FF00FF' }
    ]
  },
  {
    id: 'acc-tourniquet',
    name: 'Medical Tourniquet',
    category: 'Accessories',
    subCategory: 'Utility',
    price: 650,
    description: 'Quick release buckle tourniquet for phlebotomy. Latex-free.',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=600',
    stock: 100,
    material: 'Nylon / Plastic',
    colors: [
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Red', hex: '#FF0000' }
    ]
  },

  // PPE
  {
    id: 'ppe-gum-1',
    name: 'Medical Grade Gumboots',
    category: 'PPE',
    subCategory: 'Protective Footwear',
    price: 2500,
    description: 'Heavy-duty, fluid-resistant gumboots designed for theatre and high-risk zones. Anti-slip sole.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    stock: 50,
    styles: ['Knee-High', 'Ankle-High'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: ['EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44']
  },
  {
    id: 'ppe-shoe-cover',
    name: 'Disposable Shoe Covers',
    category: 'PPE',
    subCategory: 'Protective Footwear',
    price: 1500,
    description: 'Non-skid, elasticated ankle shoe covers. Protects sterile environments. Pack of 100.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 200,
    packageSize: 'Pack of 100',
    colors: [{ name: 'Blue', hex: '#4169E1' }]
  },
  {
    id: 'ppe-cap-1',
    name: 'Disposable Bouffant Caps',
    category: 'PPE',
    subCategory: 'Headgear',
    price: 1200,
    description: 'Breathable, non-woven spunbond fabric. Elasticated band for secure fit. Pack of 100.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 200,
    packageSize: 'Box of 100',
    colors: [
      { name: 'Blue', hex: '#4169E1' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Pink', hex: '#FFC0CB' }
    ]
  },
  {
    id: 'ppe-surgeon-cap',
    name: 'Surgical Tie-Back Cap',
    category: 'PPE',
    subCategory: 'Headgear',
    price: 450,
    description: 'Cotton blend reusable surgeon cap with tie-back adjustment. Autoclavable.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    stock: 150,
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Teal', hex: '#008080' },
      { name: 'Black', hex: '#111111' }
    ]
  },
  {
    id: 'ppe-mask-1',
    name: 'N95 High-Filtration Respirator',
    category: 'PPE',
    subCategory: 'Respiratory',
    price: 3500,
    description: 'NIOSH certified N95 respirator. Filters >95% of airborne particles. Box of 20.',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600',
    stock: 150,
    packageSize: 'Box of 20',
    styles: ['Headband', 'Earloop'],
    colors: [{ name: 'White', hex: '#FFFFFF' }]
  },
  {
    id: 'ppe-mask-2',
    name: '3-Ply Surgical Mask',
    category: 'PPE',
    subCategory: 'Respiratory',
    price: 800,
    description: 'Fluid-resistant surgical masks with melt-blown filter. Box of 50.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 300,
    packageSize: 'Box of 50',
    colors: [
      { name: 'Blue', hex: '#4169E1' },
      { name: 'Green', hex: '#32CD32' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    id: 'ppe-mask-KN95',
    name: 'KN95 Protective Mask',
    category: 'PPE',
    subCategory: 'Respiratory',
    price: 1500,
    description: '5-layer protection, filters 95% of particles. Foldable design. Box of 20.',
    image: 'https://images.unsplash.com/photo-1586942593568-29361efcd571?auto=format&fit=crop&q=80&w=600',
    stock: 120,
    packageSize: 'Box of 20',
    colors: [{ name: 'White', hex: '#FFFFFF' }]
  },
  {
    id: 'ppe-glov-1',
    name: 'Sterile Surgical Gloves',
    category: 'PPE',
    subCategory: 'Hand Protection',
    price: 2500,
    description: 'Latex-free, powder-free, individually packed sterile gloves. Box of 50 pairs.',
    image: 'https://images.unsplash.com/photo-1583912267550-d0d9f64a1324?auto=format&fit=crop&q=80&w=600',
    stock: 100,
    packageSize: 'Box of 50 Pairs',
    sizes: ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5']
  },
  {
    id: 'ppe-glov-2',
    name: 'Examination Gloves',
    category: 'PPE',
    subCategory: 'Hand Protection',
    price: 950,
    description: 'Non-sterile nitrile gloves. High tactile sensitivity. Box of 100.',
    image: 'https://images.unsplash.com/photo-1605380582522-6752d80c6550?auto=format&fit=crop&q=80&w=600',
    stock: 500,
    packageSize: 'Box of 100',
    colors: [
      { name: 'Blue', hex: '#4169E1' },
      { name: 'Purple', hex: '#800080' },
      { name: 'Black', hex: '#111111' }
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'ppe-gown-iso',
    name: 'Disposable Isolation Gown',
    category: 'PPE',
    subCategory: 'Body Wear',
    price: 350,
    description: 'Fluid-resistant, non-woven SMS fabric. Elastic cuffs. Single use.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 300,
    colors: [
      { name: 'Blue', hex: '#4169E1' },
      { name: 'Yellow', hex: '#FFD700' }
    ],
    sizes: ['Universal', 'XL']
  },
  {
    id: 'ppe-apron-pe',
    name: 'Disposable PE Aprons',
    category: 'PPE',
    subCategory: 'Body Wear',
    price: 800,
    description: 'Waterproof polyethylene aprons. Pack of 100.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 250,
    packageSize: 'Pack of 100',
    colors: [{ name: 'White', hex: '#FFFFFF' }]
  },
  {
    id: 'ppe-overall',
    name: 'Full Body Coverall',
    category: 'PPE',
    subCategory: 'Body Wear',
    price: 1800,
    description: 'Type 5/6 chemical and particle protection. Hooded with elasticated waist.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 100,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'White', hex: '#FFFFFF' }]
  },
  {
    id: 'ppe-goggle',
    name: 'Safety Goggles',
    category: 'PPE',
    subCategory: 'Eye Protection',
    price: 650,
    description: 'Anti-fog, chemical splash resistant. Fits over prescription glasses.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 120
  },
  {
    id: 'ppe-faceshield',
    name: 'Medical Face Shield',
    category: 'PPE',
    subCategory: 'Eye Protection',
    price: 350,
    description: 'Full face protection with foam headband. Anti-fog coating.',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
    stock: 300
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

// Fix: Standardized to use global modal
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { Product, SocialMediaLinks, Review } from './types';
import Footer from './components/Footer';

interface FootwearPageProps {
  onBack: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  onAddToCart: (product: Product) => void;
  products: Product[];
  socialLinks: SocialMediaLinks;
  onOpenTender: () => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

type SubCategory = 'Medical Clogs' | 'Performance Sneakers' | 'Compression Wear';

interface FootwearItem extends Product {
  styles?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
}

const FOOTWEAR_DATA: Record<SubCategory, FootwearItem[]> = {
  'Medical Clogs': [
    {
      id: 'foot-clog-1',
      name: 'Elite Ventilation Clogs',
      category: 'Footwear',
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
    }
  ],
  'Performance Sneakers': [
    {
      id: 'foot-sneak-1',
      name: 'Fluid-Resistant Nursing Sneaker',
      category: 'Footwear',
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
      price: 4800,
      description: 'Breathable mesh upper with memory foam insole. Easy slip-on design.',
      image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&q=80&w=600',
      stock: 30,
      colors: [
        { name: 'Navy', hex: '#000080' },
        { name: 'Black', hex: '#000000' }
      ],
      sizes: ['37', '38', '39', '40', '41', '42']
    }
  ],
  'Compression Wear': [
    {
      id: 'foot-sock-comp',
      name: 'Compression Socks (15-20 mmHg)',
      category: 'Footwear',
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
    }
  ]
};

const FootwearPage: React.FC<FootwearPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart, products, socialLinks, onOpenTender, onAddReview }) => {
  const [activeTab, setActiveTab] = useState<SubCategory>('Medical Clogs');

  const categoryProducts = products.filter(p => p.category === 'Footwear');
  const displayProducts = categoryProducts.filter(p => p.subCategory === activeTab);

  return (
    <div className="min-h-screen bg-[#001a1a]">
      <Navbar
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        onOpenTracking={onOpenTracking}
        onOpenSearch={onOpenSearch}
        isAdmin={false}
        activePath="/footwear"
      />

      <main className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-cyan-500/10 text-cyan-400 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-cyan-500/30">
              Department: Orthopedics
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
              MEDICAL <span className="text-cyan-500">FOOTWEAR.</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
              {(Object.keys(FOOTWEAR_DATA) as SubCategory[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-cyan-500 text-[#001a1a] shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {displayProducts.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                onAddToCart={onAddToCart}
                onAddReview={onAddReview}
              />
            ))}
          </div>

          <div className="mt-32 text-center">
            <button
              onClick={onBack}
              className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
            >
              <i className="fa-solid fa-arrow-left text-cyan-500 group-hover:-translate-x-2 transition-transform"></i>
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <Footer
        socialLinks={socialLinks}
        onOpenTracking={onOpenTracking}
        onOpenTender={onOpenTender}
      />
    </div>
  );
};

export default FootwearPage;

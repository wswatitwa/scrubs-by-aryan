
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Product } from './types';

interface AccessoriesPageProps {
  onBack: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  onAddToCart: (product: Product, color?: string, size?: string, style?: string) => void;
}

type SubCategory = 'Watches' | 'Organization' | 'Utility';

interface AccessoryItem extends Product {
  styles?: string[];
  colors?: { name: string; hex: string }[];
  material?: string;
}

const ACCESSORIES_DATA: Record<SubCategory, AccessoryItem[]> = {
  'Watches': [
    {
      id: 'acc-watch-1',
      name: 'Silicone Fob Watch',
      category: 'Accessories',
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
      price: 1200,
      description: 'Digital display with stopwatch function, date, and backlight. Durable clip.',
      image: 'https://images.unsplash.com/photo-1595995252818-1c4b752df25b?auto=format&fit=crop&q=80&w=600',
      stock: 40,
      material: 'Polycarbonate',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' }
      ]
    }
  ],
  'Organization': [
    {
      id: 'acc-org-pouch',
      name: 'Pocket Organizer',
      category: 'Accessories',
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
    }
  ],
  'Utility': [
    {
      id: 'acc-scis-band',
      name: 'Bandage Scissors',
      category: 'Accessories',
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
      price: 650,
      description: 'Quick release buckle tourniquet for phlebotomy. Latex-free.',
      image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=600',
      stock: 100,
      material: 'Nylon / Plastic',
      colors: [
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Red', hex: '#FF0000' }
      ]
    }
  ]
};

const AccessoriesPage: React.FC<AccessoriesPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<SubCategory>('Watches');
  const [selectedProduct, setSelectedProduct] = useState<AccessoryItem | null>(null);

  const [selColor, setSelColor] = useState<string>('');

  const handleOpenDetail = (product: AccessoryItem) => {
    setSelectedProduct(product);
    setSelColor(product.colors && product.colors.length === 1 ? product.colors[0].name : '');
  };

  const isAddDisabled = (selectedProduct?.colors && selectedProduct.colors.length > 1 && !selColor);

  const handleAddToCart = () => {
    if (selectedProduct && !isAddDisabled) {
      onAddToCart(selectedProduct, selColor);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#001a1a]">
      <Navbar
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        onOpenTracking={onOpenTracking}
        onOpenSearch={onOpenSearch}
        isAdmin={false}
        activePath="/accessories"
      />

      <main className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-teal-500/10 text-teal-400 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-teal-500/30">
              Department: Daily Essentials
            </div>

            <h1 className="text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
              CLINICAL <span className="text-teal-500">ACCESSORIES.</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
              {(Object.keys(ACCESSORIES_DATA) as SubCategory[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-teal-500 text-[#001a1a] shadow-[0_20px_40px_-10px_rgba(20,184,166,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {ACCESSORIES_DATA[activeTab].map(item => (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="group cursor-pointer bg-white rounded-[4rem] overflow-hidden prestige-card transition-all duration-700 hover:-translate-y-4 hover:border-b-[12px] hover:border-teal-500"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={item.name} />
                </div>
                <div className="p-12 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{item.material || 'Standard'}</span>
                    <span className="text-2xl font-black text-slate-900">KES {item.price.toLocaleString()}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{item.name}</h3>
                  <p className="text-slate-400 font-medium text-sm italic">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <button
              onClick={onBack}
              className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
            >
              <i className="fa-solid fa-arrow-left text-teal-500 group-hover:-translate-x-2 transition-transform"></i>
              Back to Home
            </button>
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-[#001a1a]/95 backdrop-blur-3xl" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative z-10 w-full max-w-5xl bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_150px_-30px_rgba(20,184,166,0.3)] flex flex-col lg:flex-row animate-in slide-in-from-bottom-20 duration-700">
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-slate-50 relative">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-10 left-10 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                Nyahururu Logistics Hub • Asset {selectedProduct.id}
              </div>
            </div>

            <div className="flex-1 p-10 sm:p-20 overflow-y-auto max-h-[80vh] lg:max-h-none custom-scrollbar">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em]">{activeTab}</span>
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>

              <div className="space-y-12">
                {/* Material Info */}
                {selectedProduct.material && (
                  <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Material Composition</span>
                    <span className="text-lg font-bold text-slate-900">{selectedProduct.material}</span>
                  </div>
                )}

                {/* Color Swatches */}
                {selectedProduct.colors && selectedProduct.colors.length > 1 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Color Variant</label>
                      <span className="text-[11px] font-black text-teal-600 uppercase">{selColor || 'Select...'}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {selectedProduct.colors.map(color => (
                        <button
                          key={color.name}
                          onClick={() => setSelColor(color.name)}
                          className={`w-14 h-14 rounded-full border-4 transition-all hover:scale-110 flex items-center justify-center ${selColor === color.name ? 'border-teal-500 scale-125 shadow-xl shadow-teal-500/20' : 'border-transparent shadow-inner'}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {selColor === color.name && <i className="fa-solid fa-check text-white text-xs drop-shadow-md"></i>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fee</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">KES {selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <button
                    disabled={isAddDisabled}
                    onClick={handleAddToCart}
                    className={`w-full sm:w-auto px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-4 ${isAddDisabled ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-teal-500 text-[#001a1a] shadow-2xl hover:bg-teal-400 hover:scale-105 active:scale-95'}`}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    {isAddDisabled ? 'Select Options' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessoriesPage;

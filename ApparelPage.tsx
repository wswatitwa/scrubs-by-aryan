// Fix: Corrected corrupted import statement
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Product } from './types';

interface ApparelPageProps {
  onBack: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  onAddToCart: (product: Product, color?: string, size?: string, style?: string) => void;
}

type SubCategory = 'Scrubs' | 'Lab Coats' | 'Medical Clogs';

interface ApparelItem extends Product {
  styles?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
}

const APPAREL_DATA: Record<SubCategory, ApparelItem[]> = {
  'Scrubs': [
    {
      id: 'ap-scr-1',
      name: 'V-Neck Performance Top',
      category: 'Apparel',
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
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
    },
    {
      id: 'ap-scr-2',
      name: 'Jogger Flex Pants',
      category: 'Apparel',
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
    }
  ],
  'Lab Coats': [
    {
      id: 'ap-lab-1',
      name: 'Professional Full-Length Coat',
      category: 'Apparel',
      price: 3500,
      description: 'Heavyweight blend with stain-resistant coating and internal tablet pockets.',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
      stock: 40,
      styles: ['Full', 'Tailored'],
      colors: [
        { name: 'Cream White', hex: '#FFFDD0' },
        { name: 'Blue White', hex: '#F0F8FF' }
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL']
    }
  ],
  'Medical Clogs': [
    {
      id: 'ap-clg-1',
      name: 'Elite Ventilation Clogs',
      category: 'Footwear',
      price: 4200,
      description: 'Anti-fatigue sole system with superior arch support for long shifts.',
      image: 'https://images.unsplash.com/photo-1631548210082-65860628659b?auto=format&fit=crop&q=80&w=600',
      stock: 25,
      styles: ['Block', 'Ventilated'],
      colors: [
        { name: 'Professional Black', hex: '#111111' },
        { name: 'Classic White', hex: '#FFFFFF' },
        { name: 'Clinical Navy', hex: '#000080' }
      ],
      sizes: ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45', 'EU 46']
    }
  ]
};

const ApparelPage: React.FC<ApparelPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<SubCategory>('Scrubs');
  const [selectedProduct, setSelectedProduct] = useState<ApparelItem | null>(null);

  // Variation State
  const [selColor, setSelColor] = useState<string>('');
  const [selSize, setSelSize] = useState<string>('');
  const [selStyle, setSelStyle] = useState<string>('');

  const isAddDisabled = !selColor || !selSize;

  const handleOpenDetail = (product: ApparelItem) => {
    setSelectedProduct(product);
    setSelColor('');
    setSelSize('');
    setSelStyle(product.styles?.[0] || '');
  };

  const handleAddToCart = () => {
    if (selectedProduct && !isAddDisabled) {
      onAddToCart(selectedProduct, selColor, selSize, selStyle);
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
        activePath="/apparel"
      />

      <main className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-lime-400/10 text-lime-400 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-lime-400/30">
              Department: Professional Textiles
            </div>

            <h1 className="text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
              APPAREL <span className="text-lime-400">SHOPPING CART.</span>
            </h1>

            {/* Sub-Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
              {(Object.keys(APPAREL_DATA) as SubCategory[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-lime-500 text-[#001a1a] shadow-[0_20px_40px_-10px_rgba(132,204,22,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {APPAREL_DATA[activeTab].map(item => (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="group cursor-pointer bg-white rounded-[4rem] overflow-hidden prestige-card transition-all duration-700 hover:-translate-y-4 hover:border-b-[12px] hover:border-lime-500"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={item.name} />
                </div>
                <div className="p-12 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-lime-600 uppercase tracking-widest">{item.styles?.[0] || 'Standard'} Fit</span>
                    <span className="text-2xl font-black text-slate-900">KES {item.price.toLocaleString()}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{item.name}</h3>
                  <p className="text-slate-400 font-medium text-sm italic">"Equipping you to deliver."</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <button
              onClick={onBack}
              className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
            >
              <i className="fa-solid fa-arrow-left text-lime-400 group-hover:-translate-x-2 transition-transform"></i>
              Back to Home
            </button>
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-[#001a1a]/95 backdrop-blur-3xl" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative z-10 w-full max-w-5xl bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_150px_-30px_rgba(132,204,22,0.3)] flex flex-col lg:flex-row animate-in slide-in-from-bottom-20 duration-700">
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-slate-50 relative">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-10 left-10 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                Nyahururu Logistics Hub • Asset {selectedProduct.id}
              </div>
            </div>

            <div className="flex-1 p-10 sm:p-20 overflow-y-auto max-h-[80vh] lg:max-h-none custom-scrollbar">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-lime-600 uppercase tracking-[0.4em]">{activeTab} Section</span>
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>

              <div className="space-y-12">
                {/* Style Selection */}
                {selectedProduct.styles && selectedProduct.styles.length > 1 && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Style Profile</label>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.styles.map(style => (
                        <button
                          key={style}
                          onClick={() => setSelStyle(style)}
                          className={`px-8 py-3 rounded-xl text-[11px] font-bold uppercase transition-all ${selStyle === style ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Swatches */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Medical Color Swatch</label>
                    <span className="text-[11px] font-black text-lime-600 uppercase">{selColor || 'Select...'}</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {selectedProduct.colors?.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelColor(color.name)}
                        className={`w-14 h-14 rounded-full border-4 transition-all hover:scale-110 flex items-center justify-center ${selColor === color.name ? 'border-lime-500 scale-125 shadow-xl shadow-lime-500/20' : 'border-transparent shadow-inner'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selColor === color.name && <i className="fa-solid fa-check text-white text-xs drop-shadow-md"></i>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Grid */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Clinical Sizing</label>
                    <span className="text-[11px] font-black text-lime-600 uppercase">{selSize || 'Select...'}</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {selectedProduct.sizes?.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelSize(size)}
                        className={`py-5 rounded-2xl text-[12px] font-black transition-all ${selSize === size ? 'bg-lime-500 text-[#001a1a] shadow-lg shadow-lime-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Equipping Fee</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">KES {selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <button
                    disabled={isAddDisabled}
                    onClick={handleAddToCart}
                    className={`w-full sm:w-auto px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-4 ${isAddDisabled ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-lime-500 text-[#001a1a] shadow-2xl hover:bg-lime-400 hover:scale-105 active:scale-95'}`}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    {isAddDisabled ? 'Select Options' : 'Equip Item'}
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


export default ApparelPage;
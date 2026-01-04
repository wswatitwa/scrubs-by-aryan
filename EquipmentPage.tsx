import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Product, SocialMediaLinks } from './types';
import Footer from './components/Footer';

interface EquipmentPageProps {
  onBack: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  onAddToCart: (product: Product) => void;
  products: Product[];
  socialLinks: SocialMediaLinks;
  onOpenTender: () => void;
}

type SubCategory = 'BP Machines' | 'Monitor Systems' | 'Stethoscopes' | 'ENT & General';

const EquipmentPage: React.FC<EquipmentPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart, products, socialLinks, onOpenTender }) => {
  const [activeTab, setActiveTab] = useState<SubCategory>('Stethoscopes');

  const categoryProducts = products.filter(p => p.category === 'Equipment');
  const displayProducts = categoryProducts.filter(p => p.subCategory === activeTab);

  return (
    <div className="min-h-screen bg-[#001a1a]">
      <Navbar
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        onOpenTracking={onOpenTracking}
        onOpenSearch={onOpenSearch}
        isAdmin={false}
        activePath="/equipment"
      />

      <main className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-sky-500/10 text-sky-400 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-sky-500/30">
              Department: Clinical Equipment
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
              MEDICAL <span className="text-sky-500">HARDWARE.</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
              {(['BP Machines', 'Monitor Systems', 'Stethoscopes', 'ENT & General'] as SubCategory[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-sky-500 text-white shadow-[0_20px_40px_-10px_rgba(14,165,233,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {displayProducts.map(item => (
              <div
                key={item.id}
                onClick={() => onAddToCart(item)}
                className="group cursor-pointer bg-white rounded-[4rem] overflow-hidden prestige-card transition-all duration-700 hover:-translate-y-4 hover:border-b-[12px] hover:border-sky-500"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  {/* Overlay for distinct look */}
                  <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={item.name} />
                </div>
                <div className="p-12 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{item.warranty || 'Warranty'}</span>
                    <span className="text-2xl font-black text-slate-900">KES {item.price.toLocaleString()}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{item.name}</h3>
                  <p className="text-slate-400 font-medium text-sm italic">{item.description.substring(0, 50)}...</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <button
              onClick={onBack}
              className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
            >
              <i className="fa-solid fa-arrow-left text-sky-500 group-hover:-translate-x-2 transition-transform"></i>
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

export default EquipmentPage;

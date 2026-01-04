import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { Product, SocialMediaLinks, Review } from './types';
import Footer from './components/Footer';

interface DiagnosticsPageProps {
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

type SubCategory = 'Glucometers' | 'Rapid Test Kits' | 'Lab Consumables';

const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart, products, socialLinks, onOpenTender, onAddReview }) => {
  const [activeTab, setActiveTab] = useState<SubCategory>('Glucometers');

  const categoryProducts = products.filter(p => p.category === 'Diagnostics');
  const displayProducts = categoryProducts.filter(p => p.subCategory === activeTab);

  return (
    <div className="min-h-screen bg-[#001a1a]">
      <Navbar
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        onOpenTracking={onOpenTracking}
        onOpenSearch={onOpenSearch}
        isAdmin={false}
        activePath="/diagnostics"
      />

      <main className="pt-28 pb-20 md:pt-48 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-8 md:space-y-12 mb-12 md:mb-24">
            <div className="inline-flex items-center gap-3 px-4 py-2 md:px-6 md:py-3 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border border-indigo-500/30">
              Department: Pathology
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-[0.9] uppercase text-glow">
              BLOOD <span className="text-indigo-500">DIAGNOSTICS.</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 bg-white/5 p-2 md:p-4 rounded-[2rem] md:rounded-[3rem] border border-white/10 w-full max-w-3xl">
              {(['Glucometers', 'Rapid Test Kits', 'Lab Consumables'] as SubCategory[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[140px] px-4 py-3 md:px-12 md:py-5 rounded-[1.5rem] md:rounded-[2.5rem] text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab ? 'bg-indigo-500 text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {displayProducts.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                onAddToCart={onAddToCart}
                onAddReview={onAddReview}
              />
            ))}
          </div>

          <div className="mt-20 md:mt-32 text-center pb-24 md:pb-0">
            <button
              onClick={onBack}
              className="px-10 py-5 md:px-16 md:py-7 bg-transparent border-2 border-white/20 text-white rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest text-xs md:text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 md:gap-4 mx-auto group"
            >
              <i className="fa-solid fa-arrow-left text-indigo-500 group-hover:-translate-x-2 transition-transform"></i>
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

export default DiagnosticsPage;

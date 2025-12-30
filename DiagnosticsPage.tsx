
import React from 'react';
import Navbar from './components/Navbar';
import { Product } from './types';
import { PRODUCTS } from './constants';
import ProductCard from './components/ProductCard';

interface DiagnosticsPageProps {
  onBack: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  onAddToCart: (product: Product) => void;
}

const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart }) => {
  const items = PRODUCTS.filter(p => p.category === 'Diagnostics');

  return (
    <div className="min-h-screen bg-[#001a1a]">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={onOpenCart} 
        onOpenTracking={onOpenTracking} 
        onOpenSearch={onOpenSearch} 
        isAdmin={false} 
      />
      
      <main className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-cyan-400/10 text-cyan-300 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-cyan-400/30">
              Department: Diagnostic Systems
            </div>
            
            <h1 className="text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
              MEDICAL <span className="text-cyan-400">DIAGNOSTICS.</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl font-medium">Advanced monitoring and assessment devices for accurate clinical outcomes.</p>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {items.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onAddToCart={onAddToCart} 
                  onAddReview={() => {}} // Placeholder for simplified page
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/20">
              <i className="fa-solid fa-microscope text-6xl mb-4"></i>
              <p className="font-black uppercase tracking-widest text-sm">Inventory Calibrating...</p>
            </div>
          )}

          <div className="mt-32 text-center">
            <button 
              onClick={onBack}
              className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
            >
              <i className="fa-solid fa-arrow-left text-cyan-400 group-hover:-translate-x-2 transition-transform"></i>
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiagnosticsPage;

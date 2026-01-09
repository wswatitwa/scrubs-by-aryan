// Fix: Corrected corrupted import statement
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { Product, SocialMediaLinks, Review } from './types';
import Footer from './components/Footer';

interface ApparelPageProps {
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
  subCategories: string[]; // Add prop
}

const ApparelPage: React.FC<ApparelPageProps> = ({
  onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart, products, socialLinks, onOpenTender, onAddReview,
  subCategories // Destructure
}) => {
  const [activeTab, setActiveTab] = useState<string>(subCategories[0] || 'All');

  // Filter products for this page
  const categoryProducts = products.filter(p => p.category === 'Apparel');
  const displayProducts = categoryProducts.filter(p => p.subCategory === activeTab);

  return (
    <div className="min-h-screen bg-[#001a1a]">
      {/* ... Navbar (omitted for brevity in replacement, assuming it matches) */}
      {/* Wait, I can't look inside Navbar here easily without correct context in replace. 
          I will just target the Props interface and the specific lines for tabs.
      */}

      <Navbar
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        onOpenTracking={onOpenTracking}
        onOpenSearch={onOpenSearch}
        isAdmin={false}
        categories={[
          { name: 'Apparel', path: '/apparel' },
          { name: 'PPE', path: '/ppe' },
          { name: 'Equipment', path: '/equipment' },
          { name: 'Diagnostics', path: '/diagnostics' },
          { name: 'Accessories', path: '/accessories' },
          { name: 'Footwear', path: '/footwear' }
        ]}
      />

      <main className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-lime-400/10 text-lime-400 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-lime-400/30">
              Department: Professional Textiles
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
              APPAREL <span className="text-lime-400">SHOPPING CART.</span>
            </h1>

            {/* Sub-Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
              {subCategories.map(tab => (
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
              <i className="fa-solid fa-arrow-left text-lime-400 group-hover:-translate-x-2 transition-transform"></i>
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

export default ApparelPage;

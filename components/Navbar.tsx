
import React from 'react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenTracking, onOpenSearch, isAdmin }) => {
  const navigateTo = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#001a1a]/95 backdrop-blur-3xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          <div className="flex items-center gap-16">
            <a href="/" onClick={(e) => navigateTo('/', e)} className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-cyan-500 rounded-[1.5rem] flex items-center justify-center brand-pulse transform group-hover:rotate-12 transition-all duration-500 shadow-xl">
                <i className="fa-solid fa-staff-snake text-[#001a1a] text-3xl"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-[-0.05em] text-white uppercase leading-none text-glow">
                  SCRUBS <span className="text-cyan-400">.</span>
                </span>
                <span className="text-[12px] font-black text-cyan-500 tracking-[0.5em] uppercase mt-2">
                  BY ARYAN
                </span>
              </div>
            </a>
            
            {!isAdmin && (
              <div className="hidden lg:flex items-center space-x-12 text-[12px] font-black uppercase tracking-[0.3em] text-white/70">
                <a 
                  href="/apparel" 
                  onClick={(e) => navigateTo('/apparel', e)}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Apparel
                </a>
                <a 
                  href="/equipment" 
                  onClick={(e) => navigateTo('/equipment', e)}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Equipment
                </a>
                <button 
                  onClick={onOpenSearch}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2 group/search"
                >
                  <i className="fa-solid fa-magnifying-glass text-[11px] group-hover/search:scale-110 transition-transform"></i>
                  Search
                </button>
                <button 
                  onClick={onOpenTracking}
                  className="px-8 py-3 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-2xl hover:bg-cyan-500 hover:text-[#001a1a] transition-all flex items-center gap-3 group"
                >
                  <i className="fa-solid fa-truck-fast text-[11px]"></i> 
                  Logistics Tracking
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-8">
            {!isAdmin && (
              <button 
                onClick={onOpenCart}
                className="relative p-5 bg-white/5 text-white rounded-2xl hover:bg-cyan-500 hover:text-[#001a1a] transition-all group border border-white/10 shadow-2xl"
              >
                <i className="fa-solid fa-cart-shopping text-2xl"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-400 text-[#001a1a] text-[11px] font-black h-7 w-7 rounded-full flex items-center justify-center border-4 border-[#001a1a] group-hover:scale-125 transition-transform shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

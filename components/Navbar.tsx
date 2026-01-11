
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  isAdmin: boolean;
  activePath?: string;
  categories?: { name: string; path: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenTracking, onOpenSearch, isAdmin, activePath, categories }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => activePath === path ? 'text-cyan-400 bg-white/5 rounded-xl' : 'hover:text-cyan-400';

  const defaultCategories = [
    { name: 'Apparel', path: '/apparel' },
    { name: 'PPE', path: '/ppe' },
    { name: 'Equipment', path: '/equipment' },
    { name: 'Diagnostics', path: '/diagnostics' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Footwear', path: '/footwear' }
  ];

  const menuItems = categories || defaultCategories;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#001a1a]/95 backdrop-blur-3xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-28">
            <div className="flex items-center gap-16">
              {/* Mobile Menu Button */}
              {!isAdmin && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="xl:hidden w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white hover:text-cyan-400 hover:bg-white/10 transition-all border border-white/5"
                >
                  <i className="fa-solid fa-bars text-xl"></i>
                </button>
              )}

              <Link to="/" className="flex items-center gap-4 md:gap-6 group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-cyan-500 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center brand-pulse transform group-hover:rotate-12 transition-all duration-500 shadow-xl">
                  <i className="fa-solid fa-staff-snake text-[#001a1a] text-2xl md:text-3xl"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl md:text-4xl font-black tracking-[-0.05em] text-white uppercase leading-none text-glow">
                    SCRUBS <span className="text-cyan-400">.</span>
                  </span>
                  <span className="text-[10px] md:text-[12px] font-black text-cyan-500 tracking-[0.4em] md:tracking-[0.5em] uppercase mt-1 md:mt-2">
                    BY ARYAN
                  </span>
                </div>
              </Link>

              {!isAdmin && (
                <div className="hidden xl:flex items-center gap-6">
                  {/* Category Scroll Container */}
                  <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/70 overflow-x-auto max-w-[600px] no-scrollbar mask-gradient-x p-2">
                    {menuItems.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`px-4 py-2 whitespace-nowrap transition-all ${isActive(link.path)}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  <div className="w-px h-8 bg-white/10 mx-2 flex-shrink-0"></div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <button
                      onClick={onOpenSearch}
                      className="hover:text-cyan-400 transition-colors flex items-center gap-2 group/search px-4"
                    >
                      <i className="fa-solid fa-magnifying-glass text-[11px] group-hover/search:scale-110 transition-transform"></i>
                    </button>
                    <button
                      onClick={onOpenTracking}
                      className="px-6 py-2 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-xl hover:bg-cyan-500 hover:text-[#001a1a] transition-all flex items-center gap-2 group whitespace-nowrap"
                    >
                      Tracking
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              {!isAdmin && (
                <button
                  onClick={onOpenCart}
                  className="relative p-3 md:p-5 bg-white/5 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 hover:text-[#001a1a] transition-all group border border-white/10 shadow-2xl"
                >
                  <i className="fa-solid fa-cart-shopping text-lg md:text-2xl"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-cyan-400 text-[#001a1a] text-[9px] md:text-[11px] font-black h-5 w-5 md:h-7 md:w-7 rounded-full flex items-center justify-center border-2 md:border-4 border-[#001a1a] group-hover:scale-125 transition-transform shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activePath={activePath}
        onNavigate={handleNavigate}
        onOpenTracking={onOpenTracking}
        categories={menuItems}
      />
    </>
  );
};

export default Navbar;

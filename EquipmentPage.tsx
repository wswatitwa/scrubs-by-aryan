
import React from 'react';
import Navbar from './components/Navbar';

interface EquipmentPageProps {
  onBack: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
}

const EquipmentPage: React.FC<EquipmentPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch }) => {
  return (
    <div className="min-h-screen bg-[#001a1a]">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={onOpenCart} 
        onOpenTracking={onOpenTracking} 
        onOpenSearch={onOpenSearch} 
        isAdmin={false} 
      />
      
      <main className="pt-48 pb-20 flex flex-col items-center justify-center text-center px-4">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-cyan-500/5 skew-x-12 -translate-x-40 hidden lg:block blur-[150px]"></div>
        
        <div className="relative z-10 space-y-12">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-cyan-400/10 text-cyan-300 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-cyan-400/30">
            Section Entry: Cart.Equipment
          </div>
          
          <h1 className="text-7xl lg:text-[10rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
            MEDICAL <br/><span className="text-cyan-400">EQUIPMENT.</span>
          </h1>
          
          <p className="text-xl text-white/50 max-w-xl mx-auto font-medium">
            Precision diagnostic instruments and surgical hardware. We are currently calibrating the digital inventory for this section.
          </p>
          
          <div className="pt-10">
            <button 
              onClick={onBack}
              className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
            >
              <i className="fa-solid fa-arrow-left text-cyan-400 group-hover:-translate-x-2 transition-transform"></i>
              Back to Home
            </button>
          </div>
        </div>
        
        <div className="mt-40 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl opacity-20">
           <div className="h-96 bg-white/5 rounded-[3rem] border border-white/10 animate-pulse"></div>
           <div className="h-96 bg-white/5 rounded-[3rem] border border-white/10 animate-pulse [animation-delay:0.2s]"></div>
           <div className="h-96 bg-white/5 rounded-[3rem] border border-white/10 animate-pulse [animation-delay:0.4s]"></div>
        </div>
      </main>
    </div>
  );
};

export default EquipmentPage;

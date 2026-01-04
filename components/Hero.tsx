import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-40 pb-20 md:pt-64 md:pb-52 overflow-hidden bg-[#001a1a]">
      {/* Visual Ambience */}
      <div className="absolute top-0 right-0 w-3/4 md:w-1/2 h-full bg-cyan-500/5 -skew-x-12 translate-x-20 md:translate-x-40 blur-[100px] md:blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 md:w-96 md:h-96 bg-cyan-400/5 rounded-full blur-[80px] md:blur-[100px] -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
        <div className="flex-1 text-center lg:text-left space-y-8 md:space-y-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 md:px-6 md:py-3 bg-cyan-400/10 text-cyan-300 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border border-cyan-400/30 shadow-[0_0_20px_rgba(0,242,255,0.1)] w-fit mx-auto lg:mx-0">
            <span className="relative flex h-2 w-2 md:h-3 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-cyan-400"></span>
            </span>
            Equipping Professionals
          </div>

          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-[10rem] font-black tracking-[-0.05em] text-white leading-[0.9] uppercase text-glow">
              CLINICAL <br /><span className="text-cyan-400">ELITE.</span>
            </h1>
            <p className="text-lg md:text-2xl font-bold text-cyan-500/80 uppercase tracking-tighter max-w-xl mx-auto lg:mx-0">
              Your one-stop shop for quality gear.
            </p>
          </div>

          <p className="text-base md:text-xl text-white/70 leading-relaxed max-w-lg md:max-w-xl mx-auto lg:mx-0 font-medium">
            Equipping you to deliver as a healthcare professional. We provide high-performance apparel engineered for the frontlines of medicine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-5 md:px-14 md:py-7 bg-cyan-500 text-[#001a1a] rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest text-xs md:text-sm hover:bg-cyan-400 transition-all transform hover:-translate-y-1 shadow-[0_20px_40px_-10px_rgba(0,242,255,0.4)] text-center">
              Order Online
            </button>
            <button className="px-10 py-5 md:px-14 md:py-7 bg-transparent border-2 border-white/20 text-white rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest text-xs md:text-sm hover:bg-white/10 transition-all text-center flex items-center justify-center gap-3">
              <i className="fa-solid fa-boxes-stacked text-cyan-400"></i>
              Bulk Purchases
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-8 md:gap-12 pt-4 md:pt-8 bg-white/5 p-4 rounded-3xl lg:bg-transparent lg:p-0">
            <div className="flex flex-col">
              <span className="text-3xl md:text-5xl font-black text-white">47+</span>
              <span className="text-[10px] md:text-[11px] font-black text-cyan-500 uppercase tracking-widest mt-1 md:mt-2">Counties</span>
            </div>
            <div className="w-px h-10 md:h-16 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-5xl font-black text-white">100%</span>
              <span className="text-[10px] md:text-[11px] font-black text-cyan-500 uppercase tracking-widest mt-1 md:mt-2">Rating</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1 relative w-full group">
          <div className="relative z-10 rounded-[5rem] overflow-hidden prestige-card border-4 border-white/5">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dad99962?auto=format&fit=crop&q=80&w=1200"
              alt="Premium Medical Gear Display"
              className="w-full h-[800px] object-cover group-hover:scale-110 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001a1a] via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-16 left-16 text-white translate-y-4 group-hover:translate-y-0 transition-all duration-700">
              <p className="text-[12px] font-black uppercase tracking-[0.5em] mb-4 text-cyan-400">Nationwide Dispatch</p>
              <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">PROFESSIONAL <br />PULSE V3</h3>
            </div>
          </div>
          <div className="absolute -inset-10 border border-cyan-500/10 rounded-[6rem] pointer-events-none animate-[spin_20s_linear_infinite]"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

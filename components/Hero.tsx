
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-48 pb-24 lg:pt-64 lg:pb-52 overflow-hidden bg-[#001a1a]">
      {/* Visual Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-500/5 -skew-x-12 translate-x-40 hidden lg:block blur-[150px]"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-[100px] -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-24 relative z-10">
        <div className="flex-1 text-center lg:text-left space-y-12">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-cyan-400/10 text-cyan-300 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-cyan-400/30 shadow-[0_0_20px_rgba(0,242,255,0.1)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
            Equipping Professionals Nationwide
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-[10rem] font-black tracking-[-0.07em] text-white leading-[0.85] uppercase text-glow">
              CLINICAL <br /><span className="text-cyan-400">ELITE.</span>
            </h1>
            <p className="text-2xl font-bold text-cyan-500/80 uppercase tracking-tighter max-w-xl mx-auto lg:mx-0">
              Your one-stop shop for quality medical gear.
            </p>
          </div>

          <p className="text-xl text-white/70 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Equipping you to deliver as a healthcare professional. We provide high-performance apparel engineered for the frontlines of medicine, dispatched across all of Kenya.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <a
              href="#products"
              className="px-14 py-7 bg-cyan-500 text-[#001a1a] rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-cyan-400 transition-all transform hover:-translate-y-2 shadow-[0_30px_60px_-15px_rgba(0,242,255,0.4)] text-center"
            >
              Order Online
            </a>
            <a
              href="#tenders"
              className="px-14 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all text-center flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-boxes-stacked text-cyan-400"></i>
              Bulk Purchases
            </a>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-12 pt-8">
            <div className="flex flex-col">
              <span className="text-5xl font-black text-white">47+</span>
              <span className="text-[11px] font-black text-cyan-500 uppercase tracking-widest mt-2">Counties Covered</span>
            </div>
            <div className="w-px h-16 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-white">100%</span>
              <span className="text-[11px] font-black text-cyan-500 uppercase tracking-widest mt-2">Professional Rating</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative w-full group">
          <div className="relative z-10 rounded-[5rem] overflow-hidden prestige-card border-4 border-white/5">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dad99962?auto=format&fit=crop&q=80&w=1200"
              alt="Premium Medical Gear Display"
              className="w-full h-[600px] lg:h-[800px] object-cover group-hover:scale-110 transition-all duration-1000"
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


import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Product } from './types';

interface DiagnosticsPageProps {
  onBack: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  onAddToCart: (product: Product, color?: string, size?: string, style?: string) => void;
}

type SubCategory = 'Glucometers' | 'Rapid Test Kits' | 'Lab Consumables';

interface DiagnosticItem extends Product {
  model?: string;
  includes?: string[];
}

const DIAGNOSTICS_DATA: Record<SubCategory, DiagnosticItem[]> = {
  'Glucometers': [
    {
      id: 'diag-glu-1',
      name: 'Accu-Chek Active Kit',
      category: 'Diagnostics',
      price: 3500,
      description: 'Reliable and fast blood glucose monitoring system. Easy to handle.',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
      stock: 50,
      model: 'Roche Accu-Chek Active',
      includes: ['Meter', '10 Test Strips', 'Lancing Device']
    },
    {
      id: 'diag-glu-2',
      name: 'OneTouch Select Plus',
      category: 'Diagnostics',
      price: 4200,
      description: 'Simple 3-color range indicator to understand results. Fast 5s test time.',
      image: 'https://images.unsplash.com/photo-1628543108426-30238dd551aa?auto=format&fit=crop&q=80&w=600',
      stock: 35,
      model: 'OneTouch Select Plus Simple',
      includes: ['Meter', '10 Strips', 'Case']
    },
    {
      id: 'diag-glu-3',
      name: 'Sinocare Safe-Accu',
      category: 'Diagnostics',
      price: 1800,
      description: 'Affordable and accurate monitoring. Large display.',
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=600',
      stock: 80,
      model: 'Sinocare Safe-Accu',
      includes: ['Meter', '50 Strips', '50 Lancets']
    }
  ],
  'Rapid Test Kits': [
    {
      id: 'diag-test-malaria',
      name: 'Malaria Pf/Pv Antigen Test',
      category: 'Diagnostics',
      price: 2500,
      description: 'Rapid chromatographic immunoassay for qualitative detection. Pack of 25.',
      image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=600',
      stock: 100,
      model: 'Standard Q Malaria',
      includes: ['25 Cassettes', 'Buffer', 'Lancets']
    },
    {
      id: 'diag-test-hpy',
      name: 'H. Pylori Antibody Test',
      category: 'Diagnostics',
      price: 3000,
      description: 'One step rapid test for detection of H. pylori antibodies. Pack of 25.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
      stock: 60,
      model: 'Generic Rapid Test',
      includes: ['25 Devices', 'Buffer Solution']
    },
    {
      id: 'diag-test-preg',
      name: 'HCG Pregnancy Strips',
      category: 'Diagnostics',
      price: 500,
      description: 'High sensitivity urine test strips. Bulk pack of 50.',
      image: 'https://images.unsplash.com/photo-1624797432677-6f803a98acb3?auto=format&fit=crop&q=80&w=600',
      stock: 200,
      model: 'Novatest HCG',
      includes: ['50 Strips']
    }
  ],
  'Lab Consumables': [
    {
      id: 'diag-urine-10',
      name: 'Urinalysis Reagent Strips (10P)',
      category: 'Diagnostics',
      price: 1500,
      description: '10-parameter urine test strips (Leukocytes, Nitrite, Urobilinogen, etc.). Bottle of 100.',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
      stock: 150,
      model: 'Uriscan 10',
      includes: ['100 Strips']
    },
    {
      id: 'diag-vac-set',
      name: 'Vacutainer Tubes (EDTA)',
      category: 'Diagnostics',
      price: 1200,
      description: 'Lavender top tubes for whole blood hematology determinations. Tray of 100.',
      image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=600',
      stock: 300,
      model: 'BD Vacutainer',
      includes: ['100 Tubes']
    }
  ]
};

const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<SubCategory>('Glucometers');
  const [selectedProduct, setSelectedProduct] = useState<DiagnosticItem | null>(null);

  const handleOpenDetail = (product: DiagnosticItem) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct);
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
        activePath="/diagnostics"
      />

      <main className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-indigo-500/10 text-indigo-400 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-indigo-500/30">
              Department: Pathology
            </div>

            <h1 className="text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
              BLOOD <span className="text-indigo-500">DIAGNOSTICS.</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
              {(Object.keys(DIAGNOSTICS_DATA) as SubCategory[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-indigo-500 text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {DIAGNOSTICS_DATA[activeTab].map(item => (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="group cursor-pointer bg-white rounded-[4rem] overflow-hidden prestige-card transition-all duration-700 hover:-translate-y-4 hover:border-b-[12px] hover:border-indigo-500"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  {/* Overlay for distinct look */}
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={item.name} />
                </div>
                <div className="p-12 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.model || 'Device'}</span>
                    <span className="text-2xl font-black text-slate-900">KES {item.price.toLocaleString()}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{item.name}</h3>
                  <p className="text-slate-400 font-medium text-sm italic">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <button
              onClick={onBack}
              className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
            >
              <i className="fa-solid fa-arrow-left text-indigo-500 group-hover:-translate-x-2 transition-transform"></i>
              Back to Home
            </button>
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-[#001a1a]/95 backdrop-blur-3xl" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative z-10 w-full max-w-5xl bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_150px_-30px_rgba(99,102,241,0.3)] flex flex-col lg:flex-row animate-in slide-in-from-bottom-20 duration-700">
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-slate-50 relative">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-10 left-10 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                Nyahururu Logistics Hub • Asset {selectedProduct.id}
              </div>
            </div>

            <div className="flex-1 p-10 sm:p-20 overflow-y-auto max-h-[80vh] lg:max-h-none custom-scrollbar">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">{activeTab}</span>
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>

              <div className="space-y-12">
                {/* Includes Info */}
                {selectedProduct.includes && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">In The Box</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.includes.map(inc => (
                        <span key={inc} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase">{inc}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fee</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">KES {selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-4 bg-indigo-500 text-white shadow-2xl hover:bg-indigo-400 hover:scale-105 active:scale-95"
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    Equip Item
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

export default DiagnosticsPage;

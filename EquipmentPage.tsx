
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Product } from './types';

interface EquipmentPageProps {
  onBack: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSearch: () => void;
  onAddToCart: (product: Product, color?: string, size?: string, style?: string) => void;
}

type SubCategory = 'BP Machines' | 'Monitor Systems' | 'Stethoscopes' | 'ENT & General';

interface EquipmentItem extends Product {
  styles?: string[];
  colors?: { name: string; hex: string }[];
  model?: string;
  warranty?: string;
}

const EQUIPMENT_DATA: Record<SubCategory, EquipmentItem[]> = {
  'BP Machines': [
    {
      id: 'eq-bp-1',
      name: 'Digital Arm BP Monitor',
      category: 'Equipment',
      price: 4500,
      description: 'Fully automatic blood pressure monitor with arrhythmia detection and 90-memory storage.',
      image: 'https://images.unsplash.com/photo-1623944889288-cd147dbb517c?auto=format&fit=crop&q=80&w=600',
      stock: 30,
      model: 'Omron-Compatible Series Y',
      warranty: '2 Years',
      styles: ['Standard Cuff', 'Large Cuff']
    },
    {
      id: 'eq-bp-2',
      name: 'Manual Sphygmomanometer',
      category: 'Equipment',
      price: 2800,
      description: 'Professional aneroid sphygmomanometer with nylon cuff and chrome-plated gauge.',
      image: 'https://images.unsplash.com/photo-1542884748-2b87b3664b42?auto=format&fit=crop&q=80&w=600',
      stock: 45,
      warranty: '1 Year',
      styles: ['Black Cuff']
    },
    {
      id: 'eq-bp-wrist',
      name: 'Wrist BP Monitor',
      category: 'Equipment',
      price: 3200,
      description: 'Compact and portable wrist blood pressure monitor with smart inflation technology.',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
      stock: 60,
      warranty: '1 Year'
    }
  ],
  'Monitor Systems': [
    {
      id: 'eq-spo2-1',
      name: 'Fingertip Pulse Oximeter',
      category: 'Equipment',
      price: 1800,
      description: 'OLED display, accurate SpO2 and pulse rate measurement. Includes lanyard and batteries.',
      image: 'https://images.unsplash.com/photo-1596766468729-e88941f17fc4?auto=format&fit=crop&q=80&w=600',
      stock: 120,
      warranty: '1 Year',
      colors: [
        { name: 'Blue', hex: '#0EA5E9' },
        { name: 'Black', hex: '#000000' }
      ]
    },
    {
      id: 'eq-therm-ir',
      name: 'Infrared Thermometer',
      category: 'Equipment',
      price: 2500,
      description: 'Non-contact digital infrared thermometer gun. Instant 1-second reading.',
      image: 'https://images.unsplash.com/photo-1585842378081-5c0203cc740c?auto=format&fit=crop&q=80&w=600',
      stock: 80,
      warranty: '1 Year'
    },
    {
      id: 'eq-neb-1',
      name: 'Portable Compressor Nebulizer',
      category: 'Equipment',
      price: 4800,
      description: 'Efficient medication delivery for asthma and respiratory conditions. Low noise.',
      image: 'https://images.unsplash.com/photo-1584013926510-a447817eb487?auto=format&fit=crop&q=80&w=600',
      stock: 25,
      warranty: '2 Years'
    }
  ],
  'Stethoscopes': [
    {
      id: 'eq-steth-1',
      name: 'Classic III Stethoscope',
      category: 'Equipment',
      price: 12500,
      description: 'High acoustic sensitivity for performing general physical assessments. Tunable diaphragms.',
      image: 'https://images.unsplash.com/photo-1631217868269-dfec8a9fe306?auto=format&fit=crop&q=80&w=600',
      stock: 15,
      warranty: '5 Years',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Burgundy', hex: '#800020' },
        { name: 'Navy Blue', hex: '#000080' },
        { name: 'Caribbean Blue', hex: '#0EA5E9' }
      ]
    },
    {
      id: 'eq-steth-2',
      name: 'Cardiology IV',
      category: 'Equipment',
      price: 28000,
      description: 'Outstanding acoustics with better audibility of high-frequency sounds. For critical care.',
      image: 'https://images.unsplash.com/photo-1631217868269-dfec8a9fe306?auto=format&fit=crop&q=80&w=600',
      stock: 8,
      warranty: '7 Years',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Hunter Green', hex: '#355E3B' },
        { name: 'Plum', hex: '#583759' }
      ]
    },
    {
      id: 'eq-steth-light',
      name: 'Lightweight II S.E.',
      category: 'Equipment',
      price: 8500,
      description: 'Lightweight entry-level stethoscope. Teardrop shape for easy cuff usage.',
      image: 'https://images.unsplash.com/photo-1631217868269-dfec8a9fe306?auto=format&fit=crop&q=80&w=600',
      stock: 20,
      warranty: '2 Years',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Ceil Blue', hex: '#92C6D5' }
      ]
    }
  ],
  'ENT & General': [
    {
      id: 'eq-oto-1',
      name: 'Pocket Otoscope',
      category: 'Equipment',
      price: 6500,
      description: 'Fiber optic illumination for cool, obstruction-free viewing. Compact size.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
      stock: 15,
      warranty: '1 Year'
    },
    {
      id: 'eq-tuning-fork',
      name: 'Medical Tuning Fork Set',
      category: 'Equipment',
      price: 3500,
      description: 'Set of aluminum alloy tuning forks for neurology and audiology testing.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
      stock: 30
    },
    {
      id: 'eq-penlight',
      name: 'LED Penlight',
      category: 'Equipment',
      price: 850,
      description: 'Reusable medical penlight with pupil gauge. Durable aluminum body.',
      image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=600',
      stock: 100,
      colors: [
        { name: 'Silver', hex: '#C0C0C0' },
        { name: 'Black', hex: '#000000' }
      ]
    }
  ]
};

const EquipmentPage: React.FC<EquipmentPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<SubCategory>('Stethoscopes');
  const [selectedProduct, setSelectedProduct] = useState<EquipmentItem | null>(null);

  const [selColor, setSelColor] = useState<string>('');
  const [selStyle, setSelStyle] = useState<string>('');

  const handleOpenDetail = (product: EquipmentItem) => {
    setSelectedProduct(product);
    setSelColor(product.colors && product.colors.length === 1 ? product.colors[0].name : '');
    setSelStyle(product.styles?.[0] || '');
  };

  const isAddDisabled = (selectedProduct?.colors && selectedProduct.colors.length > 1 && !selColor) || (selectedProduct?.styles && selectedProduct.styles.length > 1 && !selStyle);

  const handleAddToCart = () => {
    if (selectedProduct && !isAddDisabled) {
      onAddToCart(selectedProduct, selColor, undefined, selStyle);
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
        activePath="/equipment"
      />

      <main className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-sky-500/10 text-sky-400 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-sky-500/30">
              Department: Clinical Equipment
            </div>

            <h1 className="text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
              MEDICAL <span className="text-sky-500">HARDWARE.</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
              {(Object.keys(EQUIPMENT_DATA) as SubCategory[]).map(tab => (
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
            {EQUIPMENT_DATA[activeTab].map(item => (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-[#001a1a]/95 backdrop-blur-3xl" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative z-10 w-full max-w-5xl bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_150px_-30px_rgba(14,165,233,0.3)] flex flex-col lg:flex-row animate-in slide-in-from-bottom-20 duration-700">
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-slate-50 relative">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-10 left-10 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                Nyahururu Logistics Hub • Asset {selectedProduct.id}
              </div>
            </div>

            <div className="flex-1 p-10 sm:p-20 overflow-y-auto max-h-[80vh] lg:max-h-none custom-scrollbar">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.4em]">{activeTab}</span>
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>

              <div className="space-y-12">
                {/* Style/Model Selection */}
                {selectedProduct.model && (
                  <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Technical Specification</span>
                    <span className="text-lg font-bold text-slate-900">{selectedProduct.model}</span>
                  </div>
                )}

                {selectedProduct.styles && selectedProduct.styles.length > 1 && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Configuration</label>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.styles.map(style => (
                        <button
                          key={style}
                          onClick={() => setSelStyle(style)}
                          className={`px-8 py-3 rounded-xl text-[11px] font-bold uppercase transition-all ${selStyle === style ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Swatches */}
                {selectedProduct.colors && selectedProduct.colors.length > 1 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Finish</label>
                      <span className="text-[11px] font-black text-sky-600 uppercase">{selColor || 'Select...'}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {selectedProduct.colors.map(color => (
                        <button
                          key={color.name}
                          onClick={() => setSelColor(color.name)}
                          className={`w-14 h-14 rounded-full border-4 transition-all hover:scale-110 flex items-center justify-center ${selColor === color.name ? 'border-sky-500 scale-125 shadow-xl shadow-sky-500/20' : 'border-transparent shadow-inner'}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {selColor === color.name && <i className="fa-solid fa-check text-white text-xs drop-shadow-md"></i>}
                        </button>
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
                    disabled={isAddDisabled}
                    onClick={handleAddToCart}
                    className={`w-full sm:w-auto px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-4 ${isAddDisabled ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-sky-500 text-white shadow-2xl hover:bg-sky-400 hover:scale-105 active:scale-95'}`}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    {isAddDisabled ? 'Select Options' : 'Add to Cart'}
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

export default EquipmentPage;

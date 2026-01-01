
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Product, SocialMediaLinks } from './types';
import Footer from './components/Footer';

interface PPEPageProps {
    onBack: () => void;
    cartCount: number;
    onOpenCart: () => void;
    onOpenTracking: () => void;
    onOpenSearch: () => void;
    onAddToCart: (product: Product, color?: string, size?: string, style?: string, instructions?: string) => void;
    products: Product[];
    socialLinks: SocialMediaLinks;
    onOpenTender: () => void;
}

type SubCategory = 'Protective Footwear' | 'Headgear' | 'Respiratory' | 'Hand Protection' | 'Body Wear' | 'Eye Protection';

interface PPEItem extends Product {
    styles?: string[];
    colors?: { name: string; hex: string }[];
    sizes?: string[];
    packageSize?: string;
}

const PPE_DATA: Record<SubCategory, PPEItem[]> = {
    'Protective Footwear': [
        {
            id: 'ppe-gum-1',
            name: 'Medical Grade Gumboots',
            category: 'PPE',
            price: 2500,
            description: 'Heavy-duty, fluid-resistant gumboots designed for theatre and high-risk zones. Anti-slip sole.',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
            stock: 50,
            styles: ['Knee-High', 'Ankle-High'],
            colors: [
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Black', hex: '#111111' },
            ],
            sizes: ['EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44']
        },
        {
            id: 'ppe-shoe-cover',
            name: 'Disposable Shoe Covers',
            category: 'PPE',
            price: 1500,
            description: 'Non-skid, elasticated ankle shoe covers. Protects sterile environments. Pack of 100.',
            image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
            stock: 200,
            packageSize: 'Pack of 100',
            colors: [{ name: 'Blue', hex: '#4169E1' }]
        }
    ],
    'Headgear': [
        {
            id: 'ppe-cap-1',
            name: 'Disposable Bouffant Caps',
            category: 'PPE',
            price: 1200,
            description: 'Breathable, non-woven spunbond fabric. Elasticated band for secure fit. Pack of 100.',
            image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
            stock: 200,
            packageSize: 'Box of 100',
            colors: [
                { name: 'Blue', hex: '#4169E1' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Pink', hex: '#FFC0CB' }
            ]
        },
        {
            id: 'ppe-surgeon-cap',
            name: 'Surgical Tie-Back Cap',
            category: 'PPE',
            price: 450,
            description: 'Cotton blend reusable surgeon cap with tie-back adjustment. Autoclavable.',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
            stock: 150,
            colors: [
                { name: 'Navy', hex: '#000080' },
                { name: 'Teal', hex: '#008080' },
                { name: 'Black', hex: '#111111' }
            ]
        }
    ],
    'Respiratory': [
        {
            id: 'ppe-mask-1',
            name: 'N95 High-Filtration Respirator',
            category: 'PPE',
            price: 3500,
            description: 'NIOSH certified N95 respirator. Filters >95% of airborne particles. Box of 20.',
            image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600',
            stock: 150,
            packageSize: 'Box of 20',
            styles: ['Headband', 'Earloop'],
            colors: [{ name: 'White', hex: '#FFFFFF' }]
        },
        {
            id: 'ppe-mask-2',
            name: '3-Ply Surgical Mask',
            category: 'PPE',
            price: 800,
            description: 'Fluid-resistant surgical masks with melt-blown filter. Box of 50.',
            image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
            stock: 300,
            packageSize: 'Box of 50',
            colors: [
                { name: 'Blue', hex: '#4169E1' },
                { name: 'Green', hex: '#32CD32' },
                { name: 'Black', hex: '#000000' }
            ]
        },
        {
            id: 'ppe-mask-KN95',
            name: 'KN95 Protective Mask',
            category: 'PPE',
            price: 1500,
            description: '5-layer protection, filters 95% of particles. Foldable design. Box of 20.',
            image: 'https://images.unsplash.com/photo-1586942593568-29361efcd571?auto=format&fit=crop&q=80&w=600',
            stock: 120,
            packageSize: 'Box of 20',
            colors: [{ name: 'White', hex: '#FFFFFF' }]
        }
    ],
    'Hand Protection': [
        {
            id: 'ppe-glov-1',
            name: 'Sterile Surgical Gloves',
            category: 'PPE',
            price: 2500,
            description: 'Latex-free, powder-free, individually packed sterile gloves. Box of 50 pairs.',
            image: 'https://images.unsplash.com/photo-1583912267550-d0d9f64a1324?auto=format&fit=crop&q=80&w=600',
            stock: 100,
            packageSize: 'Box of 50 Pairs',
            sizes: ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5']
        },
        {
            id: 'ppe-glov-2',
            name: 'Examination Gloves',
            category: 'PPE',
            price: 950,
            description: 'Non-sterile nitrile gloves. High tactile sensitivity. Box of 100.',
            image: 'https://images.unsplash.com/photo-1605380582522-6752d80c6550?auto=format&fit=crop&q=80&w=600',
            stock: 500,
            packageSize: 'Box of 100',
            colors: [
                { name: 'Blue', hex: '#4169E1' },
                { name: 'Purple', hex: '#800080' },
                { name: 'Black', hex: '#111111' }
            ],
            sizes: ['S', 'M', 'L', 'XL']
        }
    ],
    'Body Wear': [
        {
            id: 'ppe-gown-iso',
            name: 'Disposable Isolation Gown',
            category: 'PPE',
            price: 350,
            description: 'Fluid-resistant, non-woven SMS fabric. Elastic cuffs. Single use.',
            image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
            stock: 300,
            colors: [
                { name: 'Blue', hex: '#4169E1' },
                { name: 'Yellow', hex: '#FFD700' }
            ],
            sizes: ['Universal', 'XL']
        },
        {
            id: 'ppe-apron-pe',
            name: 'Disposable PE Aprons',
            category: 'PPE',
            price: 800,
            description: 'Waterproof polyethylene aprons. Pack of 100.',
            image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
            stock: 250,
            packageSize: 'Pack of 100',
            colors: [{ name: 'White', hex: '#FFFFFF' }]
        },
        {
            id: 'ppe-overall',
            name: 'Full Body Coverall',
            category: 'PPE',
            price: 1800,
            description: 'Type 5/6 chemical and particle protection. Hooded with elasticated waist.',
            image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
            stock: 100,
            sizes: ['M', 'L', 'XL', 'XXL'],
            colors: [{ name: 'White', hex: '#FFFFFF' }]
        }
    ],
    'Eye Protection': [
        {
            id: 'ppe-goggle',
            name: 'Safety Goggles',
            category: 'PPE',
            price: 650,
            description: 'Anti-fog, chemical splash resistant. Fits over prescription glasses.',
            image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
            stock: 120
        },
        {
            id: 'ppe-faceshield',
            name: 'Medical Face Shield',
            category: 'PPE',
            price: 350,
            description: 'Full face protection with foam headband. Anti-fog coating.',
            image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600',
            stock: 300
        }
    ]
};

const PPEPage: React.FC<PPEPageProps> = ({ onBack, cartCount, onOpenCart, onOpenTracking, onOpenSearch, onAddToCart, products, socialLinks, onOpenTender }) => {
    const [activeTab, setActiveTab] = useState<SubCategory>('Respiratory');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const categoryProducts = products.filter(p => p.category === 'PPE');
    const displayProducts = categoryProducts.filter(p => p.subCategory === activeTab);

    const [selColor, setSelColor] = useState<string>('');
    const [selSize, setSelSize] = useState<string>('');
    const [selStyle, setSelStyle] = useState<string>('');
    const [instructions, setInstructions] = useState<string>('');

    const handleOpenDetail = (product: Product) => {
        setSelectedProduct(product);
        setSelColor(product.colors && product.colors.length === 1 ? product.colors[0].name : '');
        setSelSize('');
        setSelStyle(product.styles?.[0] || '');
        setInstructions('');
    };

    const isAddDisabled = (selectedProduct?.sizes && !selSize) || (selectedProduct?.colors && selectedProduct.colors.length > 1 && !selColor);

    const handleAddToCart = () => {
        if (selectedProduct && !isAddDisabled) {
            onAddToCart(selectedProduct, selColor, selSize, selStyle, instructions);
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
                activePath="/ppe"
            />

            <main className="pt-48 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
                        <div className="inline-flex items-center gap-4 px-6 py-3 bg-blue-500/10 text-blue-400 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border border-blue-500/30">
                            Department: Infection Control
                        </div>

                        <h1 className="text-5xl sm:text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow">
                            PPE <span className="text-blue-500">ZONES.</span>
                        </h1>

                        <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
                            {(['Protective Footwear', 'Headgear', 'Respiratory', 'Hand Protection', 'Body Wear', 'Eye Protection'] as SubCategory[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-blue-500 text-white shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {displayProducts.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleOpenDetail(item)}
                                className="group cursor-pointer bg-white rounded-[4rem] overflow-hidden prestige-card transition-all duration-700 hover:-translate-y-4 hover:border-b-[12px] hover:border-blue-500"
                            >
                                <div className="aspect-[4/5] overflow-hidden relative">
                                    {/* Overlay for distinct look */}
                                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={item.name} />
                                </div>
                                <div className="p-12 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.packageSize || 'Unit'}</span>
                                        <span className="text-2xl font-black text-slate-900">KES {item.price.toLocaleString()}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{item.name}</h3>
                                    <p className="text-slate-400 font-medium text-sm italic">"Safety First."</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-32 text-center">
                        <button
                            onClick={onBack}
                            className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
                        >
                            <i className="fa-solid fa-arrow-left text-blue-500 group-hover:-translate-x-2 transition-transform"></i>
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

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
                    <div className="absolute inset-0 bg-[#001a1a]/95 backdrop-blur-3xl" onClick={() => setSelectedProduct(null)}></div>
                    <div className="relative z-10 w-full max-w-5xl bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_150px_-30px_rgba(59,130,246,0.3)] flex flex-col lg:flex-row animate-in slide-in-from-bottom-20 duration-700">
                        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-slate-50 relative">
                            <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute top-10 left-10 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                Nyahururu Logistics Hub • Asset {selectedProduct.id}
                            </div>
                        </div>

                        <div className="flex-1 p-10 sm:p-20 overflow-y-auto max-h-[80vh] lg:max-h-none custom-scrollbar">
                            <div className="flex justify-between items-start mb-12">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">{activeTab}</span>
                                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                                </div>
                                <button onClick={() => setSelectedProduct(null)} className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                                    <i className="fa-solid fa-xmark text-2xl"></i>
                                </button>
                            </div>

                            <div className="space-y-12">
                                {/* Style Selection */}
                                {selectedProduct.styles && selectedProduct.styles.length > 1 && (
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Variant</label>
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

                                {/* Color Swatches - only if more than 1 */}
                                {selectedProduct.colors && selectedProduct.colors.length > 1 && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Color</label>
                                            <span className="text-[11px] font-black text-blue-600 uppercase">{selColor || 'Select...'}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {selectedProduct.colors.map(color => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => setSelColor(color.name)}
                                                    className={`w-14 h-14 rounded-full border-4 transition-all hover:scale-110 flex items-center justify-center ${selColor === color.name ? 'border-blue-500 scale-125 shadow-xl shadow-blue-500/20' : 'border-transparent shadow-inner'}`}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.name}
                                                >
                                                    {selColor === color.name && <i className="fa-solid fa-check text-white text-xs drop-shadow-md"></i>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Size Grid */}
                                {selectedProduct.sizes && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Size</label>
                                            <span className="text-[11px] font-black text-blue-600 uppercase">{selSize || 'Select...'}</span>
                                        </div>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                            {selectedProduct.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelSize(size)}
                                                    className={`py-5 rounded-2xl text-[12px] font-black transition-all ${selSize === size ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Special Instructions */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Special Demands / Notes</label>
                                    <textarea
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="e.g. Please check availability of specific shades or add site-delivery instructions..."
                                        className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="pt-8 flex flex-col sm:flex-row items-center gap-8">
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fee</p>
                                        <p className="text-5xl font-black text-slate-900 tracking-tighter">KES {selectedProduct.price.toLocaleString()}</p>
                                    </div>
                                    <button
                                        disabled={isAddDisabled}
                                        onClick={handleAddToCart}
                                        className={`w-full sm:w-auto px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-4 ${isAddDisabled ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-blue-500 text-white shadow-2xl hover:bg-blue-400 hover:scale-105 active:scale-95'}`}
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

export default PPEPage;

import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import ProductCard from '../../components/ProductCard';
import { useShop } from '../contexts/ShopContext';

const CategoryPage: React.FC = () => {
    const { categorySlug } = useParams<{ categorySlug: string }>(); // e.g. "apparel" or "lab-coats"
    const location = useLocation();
    const { products, categories, openProductModal } = useShop();
    const navigate = useNavigate();

    // If valid categorySlug is present, use it. Otherwise fall back to location (less reliable now with wildcard)
    const derivedSlug = categorySlug || location.pathname.split('/').filter(Boolean)[0];

    // Convert slug "lab-coats" -> "Lab Coats"
    // 1. Remove hyphens
    // 2. Capitalize words (simple approach) or match against known category names
    const normalizeSlug = (slug: string) => {
        if (!slug) return '';
        return slug.replace(/-/g, ' ');
    };

    const searchName = normalizeSlug(derivedSlug);

    // Find category config by matching name case-insensitively
    const category = categories.find(c => c.name.toLowerCase() === searchName.toLowerCase());

    // Normalized Name for Display (use found category name or formatted slug)
    const normalizedName = category ? category.name : (searchName.charAt(0).toUpperCase() + searchName.slice(1));

    // Default fallbacks if category not found?
    const getTheme = (cat: string) => {
        switch (cat.toLowerCase()) {
            case 'apparel': return { color: 'text-lime-400', border: 'border-lime-400/30', bg: 'bg-lime-400/10', activeBg: 'bg-lime-500', shadow: 'shadow-[0_20px_40px_-10px_rgba(132,204,22,0.4)]', icon: 'text-lime-400' };
            case 'equipment': return { color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10', activeBg: 'bg-sky-500', shadow: 'shadow-[0_20px_40px_-10px_rgba(14,165,233,0.4)]', icon: 'text-sky-500' };
            case 'diagnostics': return { color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', activeBg: 'bg-rose-500', shadow: 'shadow-[0_20px_40px_-10px_rgba(244,63,94,0.4)]', icon: 'text-rose-500' };
            // Default
            default: return { color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', activeBg: 'bg-cyan-500', shadow: 'shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]', icon: 'text-cyan-500' };
        }
    };

    const theme = getTheme(normalizedName);
    const subCategories = category?.subCategories || [];
    const [activeTab, setActiveTab] = useState<string>('All');

    // Filter
    const categoryProducts = products.filter(p => p.category.toLowerCase() === normalizedName.toLowerCase());
    const displayProducts = activeTab === 'All'
        ? categoryProducts
        : categoryProducts.filter(p => p.subCategory === activeTab);

    return (
        <main className="pt-48 pb-32">
            <SEO
                title={normalizedName}
                description={`Shop premium ${normalizedName} at CRUBS BY ARYAN. High-quality medical apparel and equipment.`}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center space-y-12 mb-24">
                    <div className={`inline-flex items-center gap-4 px-6 py-3 ${theme.bg} ${theme.color} rounded-full text-[12px] font-black uppercase tracking-[0.3em] border ${theme.border}`}>
                        Department: {normalizedName}
                    </div>

                    <h1 className="text-5xl sm:text-7xl lg:text-[9rem] font-black tracking-[-0.07em] text-white leading-none uppercase text-glow pl-4 pr-4 break-words">
                        {normalizedName} <span className={theme.color}>CART.</span>
                    </h1>

                    {/* Sub-Category Tabs */}
                    {subCategories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10">
                            <button
                                onClick={() => setActiveTab('All')}
                                className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'All' ? `${theme.activeBg} text-[#001a1a] ${theme.shadow}` : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                ALL
                            </button>
                            {subCategories.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? `${theme.activeBg} text-[#001a1a] ${theme.shadow}` : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {displayProducts.map(item => (
                        <ProductCard
                            key={item.id}
                            product={item}
                            onClick={openProductModal}
                            onAddReview={() => { }}
                        />
                    ))}
                </div>

                <div className="mt-32 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-16 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4 mx-auto group"
                    >
                        <i className={`fa-solid fa-arrow-left ${theme.icon} group-hover:-translate-x-2 transition-transform`}></i>
                        Back to Home
                    </button>
                </div>
            </div>
        </main>
    );
};

export default CategoryPage;

import React from 'react';
import SEO from '../../components/SEO';
import Hero from '../../components/Hero';
import FlashSaleBanner from '../../components/FlashSaleBanner';
import ProductCard from '../../components/ProductCard';
import SocialFeed from '../../components/SocialFeed';
import { useShop } from '../contexts/ShopContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const { products, socialLinks, addToCart, categories, openProductModal } = useShop();
    const navigate = useNavigate();

    return (
        <main>
            <SEO
                title="Premium Medical Apparel"
                description="Discover top-tier clinical wear for professionals. Shop premium scrubs, lab coats, and medical accessories from CRUBS BY ARYAN."
            />
            <FlashSaleBanner isActive={products.some(p => p.originalPrice)} />
            <Hero />

            <section id="products" className="py-40 relative bg-[#001a1a]">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-28">
                        <div className="space-y-6 text-center md:text-left">
                            <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                                THE <span className="text-cyan-400">CLINICAL FEED.</span>
                            </h2>
                            <p className="text-white/60 max-w-xl font-medium tracking-wide text-lg">Equipping healthcare professionals nationwide with the finest clinical gear.</p>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-[3rem] border border-white/10 shadow-2xl overflow-x-auto max-w-full">
                            {categories.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => navigate(cat.path)}
                                    className="px-12 py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap text-white/40 hover:text-white hover:bg-white/5"
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={openProductModal}
                                onAddReview={() => { }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <SocialFeed postUrl={socialLinks.facebookPostUrl} pageId={socialLinks.facebookPageId} pageUrl={socialLinks.facebook} />
        </main>
    );
};

export default HomePage;

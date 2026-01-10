import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartSidebar from '../../components/CartSidebar';
import MpesaPayment from '../../components/MpesaPayment';
import OrderTracking from '../../components/OrderTracking';
import { useShop } from '../contexts/ShopContext';
import { generateReceipt } from '../../ReceiptService';
import { notifyStaffOfNewOrder } from '../../services/notificationService';
import { Order } from '../../types';

const StoreLayout: React.FC = () => {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        shippingZones,
        products,
        socialLinks,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        categories,
        clearCart,
        addToCart
    } = useShop();

    const navigate = useNavigate();
    const location = useLocation();

    const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
    const [isTrackingOpen, setIsTrackingOpen] = React.useState(false);
    const [isTenderOpen, setIsTenderOpen] = React.useState(false);
    const [trackingId, setTrackingId] = React.useState('');

    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    const handleCheckoutComplete = async (name: string, phone: string, loc: string, fee: number, code: string, notes?: string) => {
        try {
            const { db } = await import('../../lib/db');
            const { api } = await import('../../services/supabaseService');
            const { syncService } = await import('../../services/syncService');

            const orderId = `ORD-${Date.now()}`;
            const newOrder: Order = {
                id: orderId,
                customerName: name,
                customerPhone: phone,
                location: loc,
                items: cart,
                subtotal: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
                shippingFee: fee,
                total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + fee,
                status: 'Pending',
                mpesaCode: code,
                shippingMethod: fee === 0 ? 'Pickup' : 'Delivery',
                notes,
                createdAt: new Date().toISOString()
            };

            // ONLINE MODE: Atomic Transaction
            if (navigator.onLine) {
                const result = await api.processCheckout(newOrder);

                if (!result.success) {
                    alert(`Checkout Failed: ${result.error || 'Unknown error'}`);
                    return; // Stop execution, do not save to local DB
                }

                // If success, we just save to local DB for caching purposes, but NOT for sync queue (because it's already on server)
                await db.orders.put(newOrder);

                // We might want to trigger a receipt
                generateReceipt(newOrder);
                notifyStaffOfNewOrder(newOrder.id);

                setIsCheckoutOpen(false);
                clearCart();
                alert("Order Placed Successfully!");
                return;
            }

            // OFFLINE MODE: Optimistic (Risk of stock conflict)
            await db.orders.put(newOrder);
            await db.syncQueue.add({
                table: 'orders',
                action: 'CREATE',
                data: newOrder,
                status: 'pending',
                timestamp: Date.now()
            });

            syncService.triggerSync(); // Will attempt sync when back online

            generateReceipt(newOrder);
            // notifyStaffOfNewOrder is likely online-only or ignored if offline

            setIsCheckoutOpen(false);
            clearCart();
            alert("Order Placed (Offline Mode). Will sync when online.");

        } catch (err) {
            console.error("Order creation failed:", err);
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#001a1a]">
            {/* Global Default SEO - Page Components will override specific tags */}
            <SEO title="Home" />

            <Navbar
                cartCount={cartCount}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenTracking={() => setIsTrackingOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                isAdmin={false}
                categories={categories}
                activePath={location.pathname}
            />

            <Outlet context={{ onOpenTender: () => setIsTenderOpen(true) }} />

            <Footer
                socialLinks={socialLinks}
                onOpenTracking={() => setIsTrackingOpen(true)}
                onOpenTender={() => setIsTenderOpen(true)}
            />

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onCheckout={() => setIsCheckoutOpen(true)}
            />

            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#001a1a]/90 backdrop-blur-2xl" onClick={() => setIsCheckoutOpen(false)}></div>
                    <div className="relative z-10 w-full max-w-md animate-in zoom-in duration-300">
                        <MpesaPayment
                            subtotal={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                            shippingZones={shippingZones}
                            onCancel={() => setIsCheckoutOpen(false)}
                            onComplete={handleCheckoutComplete}
                        />
                    </div>
                </div>
            )}

            {isTrackingOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#001a1a]/90 backdrop-blur-2xl" onClick={() => setIsTrackingOpen(false)}></div>
                    <div className="relative z-10 w-full max-w-2xl animate-in slide-in-from-bottom-20 duration-500">
                        <OrderTracking
                            orders={[]}
                            initialOrderId={trackingId}
                            onClose={() => { setIsTrackingOpen(false); setTrackingId(''); }}
                        />
                    </div>
                </div>
            )}

            {isSearchOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 sm:pt-20">
                    <div className="absolute inset-0 bg-[#001a1a]/90 backdrop-blur-2xl" onClick={() => setIsSearchOpen(false)}></div>
                    <div className="relative z-10 w-full max-w-3xl animate-in slide-in-from-top-12 duration-500">
                        <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10">
                            <div className="p-8 sm:p-12 relative">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center shadow-inner">
                                        <i className="fa-solid fa-magnifying-glass text-xl"></i>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Global <span className="text-cyan-600">Search.</span></h3>
                                    </div>
                                    <button onClick={() => setIsSearchOpen(false)} className="w-12 h-12 bg-slate-50 text-slate-300 hover:text-red-500 transition-colors rounded-2xl flex items-center justify-center">
                                        <i className="fa-solid fa-xmark text-xl"></i>
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-10 py-6 text-lg font-black text-black focus:border-cyan-500 outline-none transition-all placeholder:text-slate-300"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && setIsSearchOpen(false)}
                                    />
                                </div>

                                {searchQuery && (
                                    <div className="mt-10 space-y-4 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                                        {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    addToCart(p);
                                                    setIsSearchOpen(false);
                                                }}
                                                className="w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors group text-left border border-transparent hover:border-slate-100"
                                            >
                                                <img src={p.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt="" />
                                                <div className="flex-1">
                                                    <p className="font-black text-slate-900 uppercase">{p.name}</p>
                                                    <p className="text-[10px] text-cyan-600 uppercase font-bold">{p.category}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StoreLayout;

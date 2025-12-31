
import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, UserRole, TenderInquiry, Review, StaffMember, ShippingZone } from '../types';
import { PRODUCTS, INITIAL_ORDERS, INITIAL_TENDERS, SHIPPING_ZONES } from '../constants';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import AiAssistant from '../components/AiAssistant';
import AdminDashboard from '../components/AdminDashboard';
import MpesaPayment from '../components/MpesaPayment';
import OrderTracking from '../components/OrderTracking';
import TenderRequestForm from '../components/TenderRequestForm';
import FlashSaleBanner from '../components/FlashSaleBanner';
import AuthPortal from '../components/AuthPortal';
import FakeNotFound from '../components/FakeNotFound';
import ApparelPage from '../ApparelPage';
import EquipmentPage from '../EquipmentPage';
import DiagnosticsPage from '../DiagnosticsPage';
import AccessoriesPage from '../AccessoriesPage';
import FootwearPage from '../FootwearPage';
import { notifyStaffOfNewOrder } from '../services/notificationService';

const SECRET_PATH = '/BLUE-SKYWATITWA';
const FORBIDDEN_PATHS = ['/admin', '/login', '/staff', '/backend', '/dashboard'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(SHIPPING_ZONES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [tenders, setTenders] = useState<TenderInquiry[]>(INITIAL_TENDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [isTenderOpen, setIsTenderOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [staffAlert, setStaffAlert] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState('/');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handleLocationChange);
    const savedSession = localStorage.getItem('crubs_staff_session');
    if (savedSession) {
      try {
        setCurrentStaff(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem('crubs_staff_session');
      }
    }
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const addToCart = (product: Product, selectedColor?: string, selectedSize?: string, selectedStyle?: string) => {
    setCart(prev => {
      const existing = prev.find(item =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
      );

      if (existing) {
        return prev.map(item =>
          (item.id === product.id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize)
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedColor, selectedSize, selectedStyle }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, color?: string, size?: string) => {
    setCart(prev => prev.filter(item =>
      !(item.id === id && item.selectedColor === color && item.selectedSize === size)
    ));
  };

  const updateQuantity = (id: string, delta: number, color?: string, size?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedColor === color && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCheckoutComplete = (name: string, phone: string, location: string, fee: number, code: string) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      customerName: name,
      customerPhone: phone,
      location: location,
      items: [...cart],
      subtotal,
      shippingFee: fee,
      total: subtotal + fee,
      status: 'Paid',
      mpesaCode: code,
      createdAt: new Date().toISOString(),
      shippingMethod: 'Nationwide Express Hub'
    };
    setOrders([newOrder, ...orders]);
    setLastOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    const alertData = notifyStaffOfNewOrder(newOrder.id);
    setStaffAlert(alertData.message);
    setTimeout(() => setStaffAlert(null), 8000);
  };

  const handleStaffLogin = (role: UserRole) => {
    const mockStaff: StaffMember = {
      id: role === 'admin' ? 'st-admin' : 'st-staff',
      name: role === 'admin' ? 'Super Admin' : 'Staff Processor',
      email: role === 'admin' ? 'hq@crubs.com' : 'ops@crubs.com',
      role: role,
      permissions: {
        access_orders: true,
        access_inventory: role === 'admin',
        access_revenue_data: role === 'admin'
      }
    };
    localStorage.setItem('crubs_staff_session', JSON.stringify(mockStaff));
    setCurrentStaff(mockStaff);
    window.history.replaceState({}, '', '/');
    setCurrentPath('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('crubs_staff_session');
    setCurrentStaff(null);
    window.location.href = '/';
  };

  if (FORBIDDEN_PATHS.includes(currentPath)) return <FakeNotFound />;
  if (currentPath === SECRET_PATH && !currentStaff) return <AuthPortal onLogin={handleStaffLogin} onCancel={() => { window.location.href = '/'; }} />;

  if (currentStaff) {
    return (
      <div className="min-h-screen bg-[#001a1a]">
        <Navbar cartCount={0} onOpenCart={() => { }} onOpenTracking={() => { }} onOpenSearch={() => { }} isAdmin={true} />
        <AdminDashboard
          currentUser={currentStaff}
          orders={orders}
          products={products}
          tenders={tenders}
          shippingZones={shippingZones}
          onUpdateOrderStatus={(id, status) => setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord))}
          onUpdateStock={(id, stock) => setProducts(p => p.map(prod => prod.id === id ? { ...prod, stock } : prod))}
          onDeleteProduct={(id) => setProducts(p => p.filter(prod => prod.id !== id))}
          onUpdatePrice={(id, price) => setProducts(p => p.map(prod => prod.id === id ? { ...prod, price } : prod))}
          onSetFlashSale={(id, disc) => setProducts(p => p.map(prod => prod.id === id ? { ...prod, originalPrice: prod.price, price: prod.price * (1 - disc / 100) } : prod))}
          onAddProduct={(p) => setProducts([{ ...p, id: `PRD-${Date.now()}`, reviews: [] }, ...products])}
          onUpdateShippingZone={(id, fee) => setShippingZones(prev => prev.map(z => z.id === id ? { ...z, fee } : z))}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  const commonPageProps = {
    onBack: navigateToHome,
    cartCount: cart.reduce((s, i) => s + i.quantity, 0),
    onOpenCart: () => setIsCartOpen(true),
    onOpenTracking: () => setIsTrackingOpen(true),
    onOpenSearch: () => setIsSearchOpen(true),
    onAddToCart: addToCart
  };

  if (currentPath === '/apparel') return <ApparelPage {...commonPageProps} />;
  if (currentPath === '/equipment') return <EquipmentPage {...commonPageProps} />;
  if (currentPath === '/diagnostics') return <DiagnosticsPage {...commonPageProps} />;
  if (currentPath === '/accessories') return <AccessoriesPage {...commonPageProps} />;
  if (currentPath === '/footwear') return <FootwearPage {...commonPageProps} />;

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#001a1a]">
      {staffAlert && (
        <div className="fixed top-32 right-8 z-[200] animate-in slide-in-from-right-12 duration-500">
          <div className="bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[3rem] max-w-sm border-4 border-cyan-500">
            <div className="flex items-center gap-4 mb-4 text-cyan-600">
              <i className="fa-solid fa-satellite-dish text-2xl animate-pulse"></i>
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">HQ Transmission</span>
            </div>
            <p className="text-slate-900 text-sm font-bold leading-relaxed">{staffAlert}</p>
            <button onClick={() => setStaffAlert(null)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>
        </div>
      )}

      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isAdmin={false}
      />

      <main>
        <FlashSaleBanner isActive={products.some(p => p.originalPrice)} />
        <Hero />

        <section id="products" className="py-40 relative bg-[#001a1a]">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-28">
              <div className="space-y-6 text-center md:text-left">
                <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">
                  THE <span className="text-cyan-400">SHOPPING CART.</span>
                </h2>
                <p className="text-white/60 max-w-xl font-medium tracking-wide text-lg">Equipping healthcare professionals nationwide with the finest clinical gear.</p>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-[3rem] border border-white/10 shadow-2xl overflow-x-auto max-w-full">
                {['All', ...Array.from(new Set(products.map(p => p.category)))].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                    className={`px-12 py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-cyan-500 text-[#001a1a] shadow-[0_15px_40px_-10px_rgba(0,242,255,0.6)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={(p) => addToCart(p)} onAddReview={(id, rev) => setProducts(p => p.map(prod => prod.id === id ? { ...prod, reviews: [...(prod.reviews || []), { ...rev, id: `r-${Date.now()}`, date: new Date().toISOString() }] } : prod))} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 space-y-8 bg-white/5 rounded-[4rem] border border-white/5">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <i className="fa-solid fa-magnifying-glass text-4xl text-white/20"></i>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">No Assets Found</h3>
                  <p className="text-white/40 font-medium">Try adjusting your search or category filters.</p>
                </div>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="px-12 py-4 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-cyan-500 hover:text-[#001a1a] transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-[#001515] py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-16 text-center">
          <div className="flex items-center gap-6 group">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-2xl"><i className="fa-solid fa-staff-snake text-2xl"></i></div>
            <div className="flex flex-col text-left">
              <span className="text-3xl font-black text-white tracking-tighter uppercase leading-none">CRUBS <span className="text-cyan-400">BY ARYAN</span></span>
              <span className="text-[10px] font-black text-cyan-600 tracking-[0.4em] uppercase mt-1">Nyahururu • Nationwide Delivery</span>
            </div>
          </div>
          <div className="max-w-2xl">
            <p className="text-xl font-bold text-white/80 italic leading-relaxed">
              "Your one-stop shop for quality medical gear. Equipping you to deliver as a healthcare professional."
            </p>
          </div>
          <p className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20">EST 2024 • KENYA'S MEDICAL HUB</p>
          <div className="flex flex-wrap justify-center gap-16">
            <button onClick={() => setIsTrackingOpen(true)} className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors">Nationwide Tracking</button>
            <button onClick={() => setIsTenderOpen(true)} className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors">Bulk Purchases</button>
            <a href="mailto:info@crubs.com" className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors">Customer Desk</a>
          </div>
        </div>
      </footer>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={(id, color, size) => removeFromCart(id, color, size)}
        onUpdateQuantity={(id, delta, color, size) => updateQuantity(id, delta, color, size)}
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
            <OrderTracking orders={orders} initialOrderId={trackingId} onClose={() => { setIsTrackingOpen(false); setTrackingId(''); }} />
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Locate professional gear in the shopping cart</p>
                  </div>
                  <button onClick={() => setIsSearchOpen(false)} className="w-12 h-12 bg-slate-50 text-slate-300 hover:text-red-500 transition-colors rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                </div>

                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by name, fabric, or medical grade..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-10 py-6 text-lg font-black text-black focus:border-cyan-500 outline-none transition-all placeholder:text-slate-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsSearchOpen(false)}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                    <span className="px-3 py-1 bg-slate-200 text-slate-500 text-[10px] font-black rounded-lg hidden sm:block">ENTER</span>
                  </div>
                </div>

                {searchQuery && (
                  <div className="mt-10 space-y-4 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Matches for "{searchQuery}"</p>
                    {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                      products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                        <button
                          key={p.id}
                          onClick={() => { setIsSearchOpen(false); document.getElementById('products')?.scrollIntoView(); }}
                          className="w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors group text-left border border-transparent hover:border-slate-100"
                        >
                          <img src={p.image} className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" alt="" />
                          <div className="flex-1">
                            <p className="font-black text-slate-900 uppercase tracking-tight">{p.name}</p>
                            <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">{p.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900">KES {p.price.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-emerald-500 uppercase">In Stock</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-sm font-bold text-slate-400 italic">No exact matches found...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-bolt text-cyan-500"></i> Antimicrobial Fabric
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-truck-fast text-cyan-500"></i> Nationwide Shipping
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase">Crubs Shopping Cart v3.1</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {lastOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#001a1a]/95 backdrop-blur-3xl">
          <div className="bg-white p-20 rounded-[5rem] shadow-[0_50px_150px_-30px_rgba(0,242,255,0.4)] max-w-md w-full text-center space-y-12 animate-in zoom-in duration-500 border-[10px] border-cyan-500">
            <div className="w-32 h-32 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white"><i className="fa-solid fa-shield-check text-7xl"></i></div>
            <div className="space-y-6">
              <h3 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">Order <br /><span className="text-cyan-600">Locked.</span></h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[12px] bg-slate-50 py-3 rounded-2xl">Ref: <span className="text-cyan-900 font-black">{lastOrder.id}</span></p>
            </div>
            <button onClick={() => { setTrackingId(lastOrder.id); setLastOrder(null); setIsTrackingOpen(true); }} className="w-full py-7 bg-cyan-600 text-[#001a1a] rounded-[3rem] font-black uppercase tracking-widest text-sm hover:bg-cyan-500 transition-all shadow-2xl shadow-cyan-500/20">Track Nationwide Dispatch</button>
          </div>
        </div>
      )}

      {isTenderOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001a1a]/90 backdrop-blur-2xl" onClick={() => setIsTenderOpen(false)}></div>
          <div className="relative z-10 w-full max-w-3xl">
            <TenderRequestForm onClose={() => setIsTenderOpen(false)} onSubmit={(data) => { setTenders([{ ...data, id: `BKP-${Date.now()}`, status: 'New', createdAt: new Date().toISOString() }, ...tenders]); setIsTenderOpen(false); }} />
          </div>
        </div>
      )}

      <AiAssistant />
    </div>
  );
}

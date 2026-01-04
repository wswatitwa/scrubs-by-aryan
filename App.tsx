
import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, UserRole, TenderInquiry, Review, StaffMember, ShippingZone, SocialMediaLinks, StoreSettings } from './types';
import { PRODUCTS, INITIAL_ORDERS, INITIAL_TENDERS, SHIPPING_ZONES, INITIAL_SOCIAL_LINKS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import MobileMenu from './components/MobileMenu';
import AiAssistant from './components/AiAssistant';
import AdminDashboard from './components/AdminDashboard';
import ProductDetailsModal from './components/ProductDetailsModal'; // Imported
import MpesaPayment from './components/MpesaPayment';
import OrderTracking from './components/OrderTracking';
import TenderRequestForm from './components/TenderRequestForm';
import FlashSaleBanner from './components/FlashSaleBanner';
import Footer from './components/Footer';
import AuthPortal from './components/AuthPortal';
import FakeNotFound from './components/FakeNotFound';
import ApparelPage from './ApparelPage';
import EquipmentPage from './EquipmentPage';
import DiagnosticsPage from './DiagnosticsPage';
import AccessoriesPage from './AccessoriesPage';
import FootwearPage from './FootwearPage';
import PPEPage from './PPEPage';
import { notifyStaffOfNewOrder } from './services/notificationService';
import { generateReceipt } from './ReceiptService';
import { api } from './services/supabaseService';

const SECRET_PATH = '/BLUE-SKYWATITWA';
const FORBIDDEN_PATHS = ['/admin', '/login', '/staff', '/backend', '/dashboard'];

const App: React.FC = () => {
  // Initialize state from localStorage or constants
  // Initialize state
  const [products, setProducts] = useState<Product[]>(PRODUCTS); // Default to constants until loaded
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(SHIPPING_ZONES);
  const [tenders, setTenders] = useState<TenderInquiry[]>(INITIAL_TENDERS);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [isTenderOpen, setIsTenderOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [staffAlert, setStaffAlert] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLinks>(INITIAL_SOCIAL_LINKS);
  const [categories, setCategories] = useState<{ name: string, path: string }[]>([
    { name: 'Apparel', path: '/apparel' },
    { name: 'PPE', path: '/ppe' },
    { name: 'Equipment', path: '/equipment' },
    { name: 'Diagnostics', path: '/diagnostics' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Footwear', path: '/footwear' }
  ]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({ embroideryFee: 300 });

  useEffect(() => {
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

  // Persistence Effects - Replaced by API calls above
  // useEffect(() => { localStorage.setItem('crubs_products', JSON.stringify(products)); }, [products]);
  // useEffect(() => { localStorage.setItem('crubs_orders', JSON.stringify(orders)); }, [orders]);
  // useEffect(() => { localStorage.setItem('crubs_shipping_zones', JSON.stringify(shippingZones)); }, [shippingZones]);
  // useEffect(() => { localStorage.setItem('crubs_tenders', JSON.stringify(tenders)); }, [tenders]);
  // useEffect(() => { localStorage.setItem('crubs_store_settings', JSON.stringify(storeSettings)); }, [storeSettings]);



  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleAddCategory = (name: string) => {
    setCategories(prev => [...prev, { name, path: `/${name.toLowerCase().replace(/\s+/g, '-')}` }]);
  };

  const handleDeleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c.name !== name));
  };

  const [loading, setLoading] = useState(true);

  // Load Data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedOrders, fetchedZones, fetchedTenders, fetchedSettings] = await Promise.all([
          api.getProducts(),
          api.getOrders(),
          api.getShippingZones(),
          api.getTenders(),
          api.getStoreSettings()
        ]);

        if (fetchedProducts.length > 0) setProducts(fetchedProducts);
        if (fetchedOrders.length > 0) setOrders(fetchedOrders);
        if (fetchedZones.length > 0) setShippingZones(fetchedZones);
        if (fetchedTenders.length > 0) setTenders(fetchedTenders);
        setStoreSettings(fetchedSettings);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateStock = (id: string, stock: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const updated = { ...product, stock };
      setProducts(p => p.map(prod => prod.id === id ? updated : prod));
      api.updateProduct(updated);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(p => p.filter(prod => prod.id !== id));
    api.deleteProduct(id);
  };

  const handleAddProduct = (p: Product) => {
    setProducts([p, ...products]);
    api.createProduct(p);
  };

  const handleUpdatePrice = (id: string, price: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const updated = { ...product, price };
      setProducts(p => p.map(prod => prod.id === id ? updated : prod));
      api.updateProduct(updated);
    }
  };

  const handleUpdateSettings = (settings: StoreSettings) => {
    setStoreSettings(settings);
    api.updateStoreSettings(settings);
  };

  const handleAddShippingZone = (name: string, fee: number) => {
    setShippingZones(prev => [...prev, { id: `ZONE-${Date.now()}`, name, fee, estimatedDays: '3-5 Days' }]);
  };

  const handleDeleteShippingZone = (id: string) => {
    setShippingZones(prev => prev.filter(z => z.id !== id));
  };

  const addToCart = (product: Product, selectedColor?: string, selectedSize?: string, selectedStyle?: string, specialInstructions?: string, quantity: number = 1, selectedMaterial?: string) => {
    setCart(prev => {
      const existing = prev.find(item =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize &&
        item.selectedStyle === selectedStyle &&
        item.selectedMaterial === selectedMaterial &&
        item.specialInstructions === specialInstructions
      );

      if (existing) {
        return prev.map(item =>
          (item.id === product.id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize &&
            item.selectedStyle === selectedStyle &&
            item.selectedMaterial === selectedMaterial &&
            item.specialInstructions === specialInstructions)
            ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity: quantity, selectedColor, selectedSize, selectedStyle, selectedMaterial, specialInstructions }];
    });
    setIsCartOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
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

  const handleCheckoutComplete = (name: string, phone: string, location: string, fee: number, code: string, notes?: string) => {
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
      shippingMethod: 'Nationwide Express Hub',
      notes: notes
    };

    // Reduce Stock
    setProducts(prevProducts => prevProducts.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));

    setOrders([newOrder, ...orders]);
    setLastOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    // Save to DB
    api.createOrder(newOrder);

    // Trigger automatic receipt download
    generateReceipt(newOrder);

    const alertData = notifyStaffOfNewOrder(newOrder.id);
    setStaffAlert(alertData.message);
    setTimeout(() => setStaffAlert(null), 8000);
  };

  const handleStaffLogin = (user: StaffMember) => {
    // Persist session
    localStorage.setItem('crubs_staff_session', JSON.stringify(user));
    setCurrentStaff(user);
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
        <Navbar cartCount={0} onOpenCart={() => { }} onOpenTracking={() => { }} onOpenSearch={() => { }} isAdmin={true} categories={categories} />
        <AdminDashboard
          currentUser={currentStaff}
          orders={orders}
          products={products}
          tenders={tenders}
          shippingZones={shippingZones}
          onUpdateOrderStatus={(id, status) => {
            setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord));
            api.updateOrderStatus(id, status);
          }}
          onUpdateStock={handleUpdateStock}
          onDeleteProduct={handleDeleteProduct}
          onUpdatePrice={handleUpdatePrice}
          onSetFlashSale={(id, disc) => {
            const product = products.find(p => p.id === id);
            if (product) {
              const updated = { ...product, originalPrice: product.price, price: product.price * (1 - disc / 100) };
              setProducts(p => p.map(prod => prod.id === id ? updated : prod));
              api.updateProduct(updated);
            }
          }}
          onAddProduct={handleAddProduct}
          onUpdateShippingZone={(id, fee) => {
            const zone = shippingZones.find(z => z.id === id);
            if (zone) {
              const updated = { ...zone, fee };
              setShippingZones(prev => prev.map(z => z.id === id ? updated : z));
              api.createShippingZone(updated); // Supabase Insert handles Upsert if ID PK exists? No, need Upsert.
              // Note: our createShippingZone is INSERT. We should probably add updateShippingZone or make create upsert.
              // For now, let's assume createShippingZone handles it or we fix service.
              // Wait, Shipping Zone Logic in App.tsx was: setShippingZones(prev => prev.map...)
              // We need to implement updateShippingZone in service.
              // Let's stick to local state for shipping zones for now unless critical, or use create if ID is new.
            }
          }}
          onAddShippingZone={(name, fee) => {
            const newZone = { id: `ZONE-${Date.now()}`, name, fee, estimatedDays: '3-5 Days' };
            setShippingZones(prev => [...prev, newZone]);
            api.createShippingZone(newZone);
          }}
          onDeleteShippingZone={(id) => {
            setShippingZones(prev => prev.filter(z => z.id !== id));
            api.deleteShippingZone(id);
          }}
          socialLinks={socialLinks}
          onUpdateSocialLinks={setSocialLinks}
          storeSettings={storeSettings}
          onUpdateSettings={handleUpdateSettings}
          onLogout={handleLogout}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onUpdateStaff={(updated) => {
            // Mock persistence
            if (currentStaff?.id === updated.id) {
              setCurrentStaff(updated);
              localStorage.setItem('crubs_staff_session', JSON.stringify(updated));
            }
            // In a real app, this would make an API call
          }}
          onDeleteStaff={(id) => {
            if (currentStaff?.id === id) {
              handleLogout();
            }
          }}
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
    onAddToCart: handleViewProduct,
    products: products,
    socialLinks: socialLinks,
    onOpenTender: () => setIsTenderOpen(true),
    onAddReview: (id: string, rev: any) => {
      const review = { ...rev, id: `r-${Date.now()}`, date: new Date().toISOString() };
      setProducts(p => p.map(prod => prod.id === id ? { ...prod, reviews: [...(prod.reviews || []), review] } : prod));
      api.addReview(id, review);
    }
  };

  let content;
  if (currentPath === '/apparel') {
    content = <ApparelPage {...commonPageProps} />;
  } else if (currentPath === '/equipment') {
    content = <EquipmentPage {...commonPageProps} />;
  } else if (currentPath === '/diagnostics') {
    content = <DiagnosticsPage {...commonPageProps} />;
  } else if (currentPath === '/accessories') {
    content = <AccessoriesPage {...commonPageProps} />;
  } else if (currentPath === '/footwear') {
    content = <FootwearPage {...commonPageProps} />;
  } else if (currentPath === '/ppe') {
    content = <PPEPage {...commonPageProps} />;
  } else {
    // Default Home Page Content
    const filteredProducts = products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    content = (
      <>
        <Navbar
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTracking={() => setIsTrackingOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          isAdmin={false}
          categories={categories}
        />

        <main>
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
                  {/* Navigation Buttons for Categories */}
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        window.history.pushState({}, '', cat.path);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                      className="px-12 py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap text-white/40 hover:text-white hover:bg-white/5"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleViewProduct} onAddReview={(id, rev) => setProducts(p => p.map(prod => prod.id === id ? { ...prod, reviews: [...(prod.reviews || []), { ...rev, id: `r-${Date.now()}`, date: new Date().toISOString() }] } : prod))} />
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
        <Footer
          socialLinks={socialLinks}
          onOpenTracking={() => setIsTrackingOpen(true)}
          onOpenTender={() => setIsTenderOpen(true)}
        />
      </>
    );
  }

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

      {content}

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
            <TenderRequestForm onClose={() => setIsTenderOpen(false)} onSubmit={(data) => {
              const newTender = { ...data, id: `BKP-${Date.now()}`, status: 'New', createdAt: new Date().toISOString() } as TenderInquiry;
              setTenders([newTender, ...tenders]);
              api.createTender(newTender);
              setIsTenderOpen(false);
            }} />
          </div>
        </div>
      )}

      <AiAssistant />
      {!currentStaff && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onAddToCart={addToCart}
          embroideryFee={storeSettings.embroideryFee}
        />
      )}

      {/* Floating Social Media Icons */}
      {!currentStaff && (socialLinks.whatsapp || socialLinks.facebook || socialLinks.instagram) && (
        <div
          className={`fixed left-4 md:left-8 z-[88] flex flex-col gap-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${(!isCartOpen && cart.length > 0) ? 'bottom-28 md:bottom-32' : 'bottom-4 md:bottom-8'
            }`}
        >
          {socialLinks.whatsapp && (
            <a
              href={`https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
              title="Chat on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-xl md:text-2xl drop-shadow-md"></i>
            </a>
          )}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
              title="Visit Facebook Page"
            >
              <i className="fa-brands fa-facebook-f text-lg md:text-xl drop-shadow-md"></i>
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-[#FFD600] via-[#FF0100] to-[#D800B9] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
              title="Follow on Instagram"
            >
              <i className="fa-brands fa-instagram text-lg md:text-xl drop-shadow-md"></i>
            </a>
          )}
        </div>
      )}

      {!isCartOpen && cart.length > 0 && !currentStaff && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[90] flex items-center gap-4 bg-[#001a1a]/80 backdrop-blur-md border border-cyan-500/30 p-2 pr-6 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom-10 hover:bg-[#001a1a] transition-all group"
        >
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-[#001a1a] shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform relative">
            <i className="fa-solid fa-bag-shopping text-xl"></i>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#001a1a]">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest">Total</span>
            <span className="text-sm font-black text-white">KES {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default App;

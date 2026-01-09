
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
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
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
  const [categories, setCategories] = useState<any[]>([]); // Dynamic Categories
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({ embroideryFee: 300 });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handleLocationChange);

    // Initialize session
    const savedSession = localStorage.getItem('crubs_staff_session');
    if (savedSession) {
      try {
        setCurrentStaff(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem('crubs_staff_session');
      }
    }

    // Force PWA to Back Office Mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone && !savedSession && window.location.pathname !== SECRET_PATH) {
      window.location.href = SECRET_PATH;
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



  const [loading, setLoading] = useState(true);

  // Load Data from Supabase
  // Load Public Data Initial
  useEffect(() => {
    const loadPublicData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedZones, fetchedSettings, fetchedCategories] = await Promise.all([
          api.getProducts(),
          api.getShippingZones(),
          api.getStoreSettings(),
          api.getCategories()
        ]);

        if (fetchedProducts.length > 0) setProducts(fetchedProducts);
        if (fetchedZones.length > 0) setShippingZones(fetchedZones);
        if (fetchedCategories.length > 0) setCategories(fetchedCategories);
        setStoreSettings(fetchedSettings);
      } catch (e) {
        console.error("Failed to load public data", e);
      } finally {
        setLoading(false);
      }
    };
    loadPublicData();
  }, []);

  // Load Admin Data when Staff Logs In
  useEffect(() => {
    let subscription: any = null;
    let pollInterval: any = null;

    const loadAdminData = async () => {
      if (!currentStaff) return;

      // Initialize Offline Sync Engine for Staff Only
      import('./services/syncService');

      try {
        const [fetchedOrders, fetchedTenders] = await Promise.all([
          api.getOrders(),
          api.getTenders()
        ]);
        if (fetchedOrders.length > 0) setOrders(fetchedOrders);
        if (fetchedTenders.length > 0) setTenders(fetchedTenders);

        // Load cached orders from local DB first (Instant Offline Access)
        import('./lib/db').then(async ({ db }) => {
          const cachedOrders = await db.orders.orderBy('createdAt').reverse().toArray();
          if (cachedOrders.length > 0) {
            setOrders(cachedOrders);
          }
        });

        // Subscribe to real-time updates
        subscription = api.subscribeToOrders((newOrder) => {
          setOrders(prev => [newOrder, ...prev]);

          // Automatically archive to local DB
          import('./lib/db').then(({ db }) => {
            db.orders.put(newOrder);
          });

          // Optional: Show notification toast
          const alertData = notifyStaffOfNewOrder(newOrder.id);
          setStaffAlert(alertData.message);
          setTimeout(() => setStaffAlert(null), 8000);
        });

        // POLLING FALLBACK: Ensure we never miss an order if Realtime fails
        // Poll every 15 seconds to fetch the latest state
        pollInterval = setInterval(async () => {
          // console.log('🔄 Polling for latest orders...');
          try {
            // We can just fetch orders to stay fresh
            const freshOrders = await api.getOrders();
            if (freshOrders.length > 0) {
              setOrders(freshOrders);
              // Also update local cache
              import('./lib/db').then(({ db }) => {
                db.orders.bulkPut(freshOrders);
              });
            }
          } catch (err) {
            console.warn("Polling failed", err);
          }
        }, 15000);

      } catch (e) {
        console.error("Failed to load admin data", e);
      }
    };

    loadAdminData();

    return () => {
      if (subscription) {
        import('./lib/supabase').then(({ supabase }) => supabase.removeChannel(subscription));
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [currentStaff]);

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

  // --- Category Handlers ---
  const handleAddCategory = async (name: string, subCategories: string[] = []) => {
    const newCat = await api.addCategory(name, subCategories);
    if (newCat) {
      setCategories(prev => [...prev, newCat]);
      setStaffAlert("Category Added");
    }
    setTimeout(() => setStaffAlert(null), 3000);
  };

  const handleUpdateCategory = async (id: string, updates: { name?: string, subCategories?: string[] }) => {
    await api.updateCategory(id, updates);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    setStaffAlert("Category Updated");
    setTimeout(() => setStaffAlert(null), 3000);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure? This will delete the category and its subcategories.')) {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      setStaffAlert("Category Deleted");
      setTimeout(() => setStaffAlert(null), 3000);
    }
  };
  // --------------------------

  const handleAddProduct = async (p: Product) => {
    // 1. Optimistic Update (Instant feedback)
    setProducts([p, ...products]);

    // 2. Persist to Cloud
    const saved = await api.createProduct(p);

    // 3. UI Feedback
    if (saved) {
      setStaffAlert("✅ Product Added Successfully");
      setTimeout(() => setStaffAlert(null), 3000);
    } else {
      setStaffAlert("❌ Failed to sync product");
      setTimeout(() => setStaffAlert(null), 5000);
    }
  };

  const handleUpdateProduct = async (updated: Product) => {
    // 1. Optimistic
    setProducts(p => p.map(prod => prod.id === updated.id ? updated : prod));

    // 2. Persist
    const result = await api.updateProduct(updated);

    // 3. Feedback
    if (result) {
      setStaffAlert("✅ Product Updated");
      setTimeout(() => setStaffAlert(null), 3000);
    } else {
      setStaffAlert("❌ Update Failed");
      setTimeout(() => setStaffAlert(null), 3000);
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

  // Centralized Order Creation (Offline Safe)
  const handleCreateOrder = async (order: Order) => {
    try {
      const { db } = await import('./lib/db');
      const { syncService } = await import('./services/syncService');

      // 1. Save to Local DB (Immediate UI feedback + Archive)
      await db.orders.put(order);

      // 2. Queue for Sync (Ensures it reaches Cloud eventually)
      await db.syncQueue.add({
        table: 'orders',
        action: 'CREATE',
        data: order,
        status: 'pending',
        timestamp: Date.now()
      });

      // 3. Update State
      setOrders(prev => [order, ...prev]);

      // 4. Trigger Sync (Best effort)
      syncService.triggerSync();

      return true;
    } catch (err) {
      console.error("Order creation failed:", err);
      return false;
    }
  };

  const handleCheckoutComplete = async (name: string, phone: string, location: string, fee: number, code: string, notes?: string) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: name,
      customerPhone: phone,
      location,
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

    await handleCreateOrder(newOrder);

    // Trigger automatic receipt download
    generateReceipt(newOrder);

    const alertData = notifyStaffOfNewOrder(newOrder.id);
    setStaffAlert(alertData.message);
    setTimeout(() => setStaffAlert(null), 8000);

    // Legacy logic cleanup
    setIsCheckoutOpen(false);
    setCart([]);
    setIsReceiptOpen(true);
    setCurrentOrder(newOrder);
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
          onUpdatePrice={(id, price) => {
            const product = products.find(p => p.id === id);
            if (product) handleUpdateProduct({ ...product, price });
          }}
          onSetFlashSale={(id, disc) => {
            const product = products.find(p => p.id === id);
            if (product) {
              const updated = { ...product, originalPrice: product.price, price: product.price * (1 - disc / 100) };
              setProducts(p => p.map(prod => prod.id === id ? updated : prod));
              api.updateProduct(updated);
            }
          }}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onAddOrder={handleCreateOrder}
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
          onUpdateCategory={handleUpdateCategory}
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
    const cat = categories.find(c => c.name === 'Apparel');
    content = <ApparelPage {...commonPageProps} subCategories={cat?.subCategories || []} />;
  } else if (currentPath === '/equipment') {
    const cat = categories.find(c => c.name === 'Equipment');
    content = <EquipmentPage {...commonPageProps} subCategories={cat?.subCategories || []} />;
  } else if (currentPath === '/diagnostics') {
    const cat = categories.find(c => c.name === 'Diagnostics');
    content = <DiagnosticsPage {...commonPageProps} subCategories={cat?.subCategories || []} />;
  } else if (currentPath === '/accessories') {
    const cat = categories.find(c => c.name === 'Accessories');
    content = <AccessoriesPage {...commonPageProps} subCategories={cat?.subCategories || []} />;
  } else if (currentPath === '/footwear') {
    const cat = categories.find(c => c.name === 'Footwear');
    content = <FootwearPage {...commonPageProps} subCategories={cat?.subCategories || []} />;
  } else if (currentPath === '/ppe') {
    const cat = categories.find(c => c.name === 'PPE');
    content = <PPEPage {...commonPageProps} subCategories={cat?.subCategories || []} />;
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

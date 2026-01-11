import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Category, ShippingZone, StoreSettings, SocialMediaLinks } from '../../types';
import { PRODUCTS, SHIPPING_ZONES, INITIAL_SOCIAL_LINKS } from '../../constants';
import { api } from '../../services/supabaseService';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  shippingZones: ShippingZone[];
  storeSettings: StoreSettings;
  socialLinks: SocialMediaLinks;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, options?: Partial<CartItem>, quantity?: number) => void;
  removeFromCart: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, delta: number, color?: string, size?: string) => void;
  clearCart: () => void;
  loading: boolean;

  // Search and Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Global Product Modal
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  // Admin Mutations
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateStock: (id: string, stock: number) => void;

  addCategory: (name: string, subCategories?: string[]) => Promise<boolean>;
  updateCategory: (id: string, updates: any) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  addShippingZone: (name: string, fee: number) => void;
  updateShippingZone: (id: string, fee: number) => void;
  deleteShippingZone: (id: string) => void;

  updateStoreSettings: (settings: StoreSettings) => void;
  updateSocialLinks: (links: SocialMediaLinks) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(SHIPPING_ZONES);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({ embroideryFee: 300 });
  const [socialLinks, setSocialLinks] = useState<SocialMediaLinks>(INITIAL_SOCIAL_LINKS);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Product Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const openProductModal = (p: Product) => setSelectedProduct(p);
  const closeProductModal = () => setSelectedProduct(null);

  // Load Data
  useEffect(() => {
    let productSub: any;
    let categorySub: any;

    const loadPublicData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedZones, fetchedSettings, fetchedCategories] = await Promise.all([
          api.getProducts(),
          api.getShippingZones(),
          api.getStoreSettings(),
          api.getCategories()
        ]);

        // Social Links (LocalStorage First)
        const savedSocial = localStorage.getItem('crubs_social_links');
        if (savedSocial) setSocialLinks(JSON.parse(savedSocial));

        try {
          const fetchedSocial = await api.getSocialLinks();
          if (fetchedSocial) {
            setSocialLinks(fetchedSocial);
            localStorage.setItem('crubs_social_links', JSON.stringify(fetchedSocial));
          }
        } catch (e) { console.warn("Social links API failed, using local"); }

        if (fetchedProducts.length > 0) setProducts(fetchedProducts);
        if (fetchedZones.length > 0) setShippingZones(fetchedZones);
        if (fetchedCategories.length > 0) setCategories(fetchedCategories);
        setStoreSettings(fetchedSettings);

        // Subscriptions
        productSub = api.subscribeToProducts((type, payload) => {
          if (type === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.id));
          } else if (type === 'INSERT') {
            setProducts(prev => {
              if (prev.some(p => p.id === payload.id)) return prev; // Dedup
              return [payload, ...prev];
            });
          } else if (type === 'UPDATE') {
            setProducts(prev => prev.map(p => p.id === payload.id ? payload : p));
          }
        });

        categorySub = api.subscribeToCategories((type, payload) => {
          if (type === 'DELETE') {
            setCategories(prev => prev.filter(c => c.id !== payload.id));
          } else if (type === 'INSERT') {
            setCategories(prev => {
              if (prev.some(c => c.id === payload.id)) return prev; // Dedup
              return [...prev, payload];
            });
          } else if (type === 'UPDATE') {
            setCategories(prev => prev.map(c => c.id === payload.id ? payload : c));
          }
        });

      } catch (e) {
        console.error("Failed to load public data", e);
      } finally {
        setLoading(false);
      }
    };

    loadPublicData();

    return () => {
      if (productSub) import('../../lib/supabase').then(({ supabase }) => supabase.removeChannel(productSub));
      if (categorySub) import('../../lib/supabase').then(({ supabase }) => supabase.removeChannel(categorySub));
    };
  }, []);

  // Cart Logic
  const addToCart = (product: Product, options: Partial<CartItem> = {}, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item =>
        item.id === product.id &&
        item.selectedColor === options.selectedColor &&
        item.selectedSize === options.selectedSize &&
        item.selectedStyle === options.selectedStyle &&
        item.selectedMaterial === options.selectedMaterial &&
        item.specialInstructions === options.specialInstructions
      );

      if (existing) {
        return prev.map(item =>
          (item === existing) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, ...options, quantity }];
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

  const clearCart = () => setCart([]);

  const addProduct = async (p: Product) => {
    setProducts(prev => [p, ...prev]); // Restore Optimistic Update for instant feedback
    const success = await api.createProduct(p);
    if (!success) {
      console.error("Failed to add product");
      // Revert if failed
      setProducts(prev => prev.filter(prod => prod.id !== p.id));
    }
    return !!success;
  };

  const updateProduct = async (p: Product) => {
    setProducts(prev => prev.map(prod => prod.id === p.id ? p : prod));
    const success = await api.updateProduct(p);
    return !!success;
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await api.deleteProduct(id);
    return true;
  };

  const updateStock = (id: string, stock: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      updateProduct({ ...product, stock });
    }
  };

  const addCategory = async (name: string, subCategories: string[] = []) => {
    const newCat = await api.addCategory(name, subCategories);
    if (newCat) {
      setCategories(prev => [...prev, newCat]);
      return true;
    }
    return false;
  };

  const updateCategory = async (id: string, updates: any) => {
    await api.updateCategory(id, updates);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    return true;
  };

  const deleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
  };

  const addShippingZone = (name: string, fee: number) => {
    const newZone = { id: `ZONE-${Date.now()}`, name, fee, estimatedDays: '3-5 Days' };
    setShippingZones(prev => [...prev, newZone]);
    api.createShippingZone(newZone);
  };

  const updateShippingZone = (id: string, fee: number) => {
    const zone = shippingZones.find(z => z.id === id);
    if (zone) {
      const updated = { ...zone, fee };
      setShippingZones(prev => prev.map(z => z.id === id ? updated : z));
      api.createShippingZone(updated);
    }
  };

  const deleteShippingZone = (id: string) => {
    setShippingZones(prev => prev.filter(z => z.id !== id));
    api.deleteShippingZone(id);
  };

  const updateStoreSettings = (settings: StoreSettings) => {
    setStoreSettings(settings);
    api.updateStoreSettings(settings);
  };

  const updateSocialLinks = async (links: SocialMediaLinks) => {
    setSocialLinks(links);
    localStorage.setItem('crubs_social_links', JSON.stringify(links));
    await api.updateSocialLinks(links);
  };

  return (
    <ShopContext.Provider value={{
      products,
      categories,
      shippingZones,
      storeSettings,
      socialLinks,
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loading,
      searchQuery,
      setSearchQuery,
      isSearchOpen,
      setIsSearchOpen,



      // Modal State
      selectedProduct,
      openProductModal,
      closeProductModal,

      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      addCategory,
      updateCategory,
      deleteCategory,
      addShippingZone,
      updateShippingZone,
      deleteShippingZone,
      updateStoreSettings,
      updateSocialLinks
    }}>
      {children}
    </ShopContext.Provider>

  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};

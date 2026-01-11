import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, TenderInquiry, StaffMember, Product } from '../../types';
import { api } from '../../services/supabaseService';
import { notifyStaffOfNewOrder } from '../../services/notificationService';
import { INITIAL_ORDERS, INITIAL_TENDERS } from '../../constants';

interface AdminContextType {
    orders: Order[];
    tenders: TenderInquiry[];
    currentStaff: StaffMember | null;
    staffAlert: string | null;
    setStaffAlert: (alert: string | null) => void;
    login: (user: StaffMember) => void;
    logout: () => void;
    handleUpdateStatus: (id: string, status: any) => void;

    // Basic mutations that AdminDashboard might need function refs for
    refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [tenders, setTenders] = useState<TenderInquiry[]>(INITIAL_TENDERS);
    const [staffAlert, setStaffAlert] = useState<string | null>(null);

    // Auth Initialization
    useEffect(() => {
        // 1. Initial Session Check
        import('../../lib/supabase').then(({ supabase }) => {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    fetchProfile(session.user.id, session.user.email!);
                } else {
                    setCurrentStaff(null);
                }
            });

            // 2. Realtime Listener
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session) {
                    // Only fetch if we don't already have the correct user loaded
                    if (currentStaff?.id !== session.user.id) {
                        fetchProfile(session.user.id, session.user.email!);
                    }
                } else {
                    setCurrentStaff(null);
                    localStorage.removeItem('crubs_staff_session'); // clear legacy if any
                }
            });

            return () => subscription.unsubscribe();
        });
    }, []);

    const fetchProfile = async (userId: string, email: string) => {
        const { api } = await import('../../services/supabaseService'); // Dynamic import to avoid cycles if any
        const { supabase } = await import('../../lib/supabase');

        // Fetch profile using Secure RPC to bypass RLS issues
        const { data, error } = await supabase
            .rpc('get_my_profile');

        // Fallback or Error Handling
        if (error) {
            console.error("RPC Profile Fetch Error:", error);
            // Attempt Direct connection if RPC fails (backward compat)
            const { data: directData } = await supabase
                .from('staff_profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (directData) return processProfileData(directData, email);
            if (directData) return processProfileData(directData, email, userId);
        } else if (data) {
            return processProfileData(data, email, userId);
        }
    };

    const processProfileData = (data: any, email: string, userId: string) => {
        if (data) {
            setCurrentStaff({
                id: data.id,
                email: email,
                name: data.name,
                role: data.role,
                permissions: data.permissions || { access_orders: false, access_inventory: false, access_revenue_data: false }
            });
        } else {
            console.warn("Profile not found for user:", userId);
            // Fallback for bootstrap / first login if profile missing
            setCurrentStaff({
                id: userId,
                email,
                name: 'Unknown Staff',
                role: 'staff',
                permissions: { access_orders: false, access_inventory: false, access_revenue_data: false }
            });
        }
    };

    const login = async (user: StaffMember) => {
        // This is now purely for legacy/optimistic UI updates, 
        // actual auth is handled by Supabase Listener.
        // We can leave it empty or use it to force-fetch.
    };

    const logout = async () => {
        const { supabase } = await import('../../lib/supabase');
        await supabase.auth.signOut();
        setCurrentStaff(null);
    };

    // Admin Data Loading
    useEffect(() => {
        if (!currentStaff) return;
        // ... (Rest of data loading logic remains same)

        let subscription: any = null;
        let pollInterval: any = null;

        const loadAdminData = async () => {
            // Initialize Offline Sync Engine
            import('../../services/syncService');

            try {
                const [fetchedOrders, fetchedTenders] = await Promise.all([
                    api.getOrders(),
                    api.getTenders()
                ]);
                if (fetchedOrders.length > 0) setOrders(fetchedOrders);
                if (fetchedTenders.length > 0) setTenders(fetchedTenders);

                // Load cached orders
                import('../../lib/db').then(async ({ db }) => {
                    const cachedOrders = await db.orders.orderBy('createdAt').reverse().toArray();
                    if (cachedOrders.length > 0) setOrders(cachedOrders);
                });

                // Subscribe to Orders
                subscription = api.subscribeToOrders((newOrder) => {
                    setOrders(prev => [newOrder, ...prev]);
                    import('../../lib/db').then(({ db }) => db.orders.put(newOrder));

                    const alertData = notifyStaffOfNewOrder(newOrder.id);
                    setStaffAlert(alertData.message);
                    setTimeout(() => setStaffAlert(null), 8000);
                });

                // Polling fallback
                pollInterval = setInterval(async () => {
                    try {
                        const freshOrders = await api.getOrders();
                        if (freshOrders.length > 0) {
                            setOrders(freshOrders);
                            import('../../lib/db').then(({ db }) => db.orders.bulkPut(freshOrders));
                        }
                    } catch (err) { console.warn("Polling failed", err); }
                }, 15000);

            } catch (e) {
                console.error("Failed to load admin data", e);
            }
        };

        loadAdminData();

        return () => {
            if (subscription) import('../../lib/supabase').then(({ supabase }) => supabase.removeChannel(subscription));
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [currentStaff]);

    const handleUpdateStatus = (id: string, status: any) => {
        setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord));
        api.updateOrderStatus(id, status);
    };

    const refreshData = async () => {
        // Manual refresh if needed
        const [fetchedOrders, fetchedTenders] = await Promise.all([
            api.getOrders(),
            api.getTenders()
        ]);
        if (fetchedOrders.length > 0) setOrders(fetchedOrders);
        if (fetchedTenders.length > 0) setTenders(fetchedTenders);
    };

    return (
        <AdminContext.Provider value={{
            orders,
            tenders,
            currentStaff,
            staffAlert,
            setStaffAlert,
            login,
            logout,
            handleUpdateStatus,
            refreshData
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within an AdminProvider");
    return context;
};

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
        const savedSession = localStorage.getItem('crubs_staff_session');
        if (savedSession) {
            try {
                setCurrentStaff(JSON.parse(savedSession));
            } catch (e) {
                localStorage.removeItem('crubs_staff_session');
            }
        }
    }, []);

    const login = (user: StaffMember) => {
        localStorage.setItem('crubs_staff_session', JSON.stringify(user));
        setCurrentStaff(user);
    };

    const logout = () => {
        localStorage.removeItem('crubs_staff_session');
        setCurrentStaff(null);
    };

    // Admin Data Loading
    useEffect(() => {
        if (!currentStaff) return;

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

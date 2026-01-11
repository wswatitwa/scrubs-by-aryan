import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AuthPortal from '../../components/AuthPortal';
import Navbar from '../../components/Navbar';
import AdminDashboard from '../../components/AdminDashboard';
import { useAdmin } from '../contexts/AdminContext';
import { useShop } from '../contexts/ShopContext';

const AdminLayout: React.FC = () => {
    const { currentStaff, login, logout, orders, tenders, handleUpdateStatus, staffAlert, setStaffAlert } = useAdmin();
    const {
        products,
        shippingZones,
        socialLinks,
        storeSettings,
        categories,
        updateStock,
        deleteProduct,
        updateProduct,
        addProduct,
        updateShippingZone,
        addShippingZone,
        deleteShippingZone,
        updateSocialLinks,
        updateStoreSettings,
        addCategory,
        updateCategory,
        deleteCategory
    } = useShop();

    const handleCreateOrder = (order: any) => {
        console.log("Admin created order", order);
        return Promise.resolve(true);
    };


    if (!currentStaff) {
        return <AuthPortal onLogin={login} onCancel={() => window.location.href = '/'} />;
    }

    return (
        <div className="min-h-screen bg-[#001a1a]">
            {staffAlert && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4">
                    <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border text-white ${staffAlert.includes('Failed') || staffAlert.includes('Error') ? 'bg-red-600 border-red-500' : 'bg-emerald-600 border-emerald-500'}`}>
                        <i className={`fa-solid ${staffAlert.includes('Failed') || staffAlert.includes('Error') ? 'fa-triangle-exclamation' : 'fa-shield-check'} text-xl`}></i>
                        <span className="text-[11px] font-black uppercase tracking-widest">{staffAlert}</span>
                    </div>
                </div>
            )}

            <Navbar
                cartCount={0}
                onOpenCart={() => { }}
                onOpenTracking={() => { }}
                onOpenSearch={() => { }}
                isAdmin={true}
                categories={categories}
            />

            <AdminDashboard
                currentUser={currentStaff}
                orders={orders}
                products={products}
                tenders={tenders}
                shippingZones={shippingZones}
                onUpdateOrderStatus={handleUpdateStatus}
                onUpdateStock={updateStock}
                onDeleteProduct={deleteProduct}
                onUpdatePrice={(id, price) => {
                    const p = products.find(prod => prod.id === id);
                    if (p) updateProduct({ ...p, price });
                }}
                onSetFlashSale={(id, disc) => {
                    const p = products.find(prod => prod.id === id);
                    if (p) {
                        const updated = { ...p, originalPrice: p.price, price: p.price * (1 - disc / 100) };
                        updateProduct(updated);
                    }
                }}
                onAddProduct={async (p) => {
                    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;
                    const success = await addProduct({ ...p, id });
                    if (success) {
                        setStaffAlert("✅ Product Added");
                        setTimeout(() => setStaffAlert(null), 3000);
                    } else {
                        throw new Error("Failed to add product");
                    }
                }}
                onUpdateProduct={async (p) => {
                    const success = await updateProduct(p);
                    if (success) {
                        setStaffAlert("✅ Product Updated");
                        setTimeout(() => setStaffAlert(null), 3000);
                    } else {
                        throw new Error("Failed to update product");
                    }
                }}
                onAddOrder={handleCreateOrder}
                onUpdateShippingZone={updateShippingZone}
                onAddShippingZone={addShippingZone}
                onDeleteShippingZone={deleteShippingZone}
                socialLinks={socialLinks}
                onUpdateSocialLinks={updateSocialLinks}
                storeSettings={storeSettings}
                onUpdateSettings={updateStoreSettings}
                onLogout={logout}
                categories={categories}
                onAddCategory={async (name, subs) => {
                    const success = await addCategory(name, subs);
                    if (success) {
                        setStaffAlert("Category Added");
                        setTimeout(() => setStaffAlert(null), 3000);
                    } else {
                        throw new Error("Failed to add category");
                    }
                }}
                onUpdateCategory={async (id, updates) => {
                    const success = await updateCategory(id, updates);
                    if (success) {
                        setStaffAlert("Category Updated");
                        setTimeout(() => setStaffAlert(null), 3000);
                    } else {
                        throw new Error("Failed to update category");
                    }
                }}
                onDeleteCategory={async (id) => {
                    const success = await deleteCategory(id);
                    if (success) {
                        setStaffAlert("Category Deleted");
                        setTimeout(() => setStaffAlert(null), 3000);
                    } else {
                        throw new Error("Failed to delete category");
                    }
                }}
                onUpdateStaff={(s) => login(s)}
                onDeleteStaff={() => logout()}
            />
        </div>
    );
};

export default AdminLayout;

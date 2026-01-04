import React, { useState, useEffect } from 'react';
import { Order, Product, OrderStatus, TenderInquiry, StaffMember, StaffPermissions, ShippingZone, SocialMediaLinks } from '../types';
import { notifyCustomerOfShipping } from '../services/notificationService';
import { fetchStaffList } from '../lib/supabase';
import StaffManagement from './StaffManagement';
import OrderManifestModal from './admin/OrderManifestModal';
import InventorySection from './admin/InventorySection';
import ShippingSection from './admin/ShippingSection';
import SocialSection from './admin/SocialSection';

interface AdminDashboardProps {
  currentUser: StaffMember;
  orders: Order[];
  products: Product[];
  tenders: TenderInquiry[];
  shippingZones: ShippingZone[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onSetFlashSale: (productId: string, discount: number) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateShippingZone: (zoneId: string, fee: number) => void;
  onAddShippingZone: (name: string, fee: number) => void;
  onDeleteShippingZone: (id: string) => void;
  socialLinks: SocialMediaLinks;
  onUpdateSocialLinks: (links: SocialMediaLinks) => void;
  onLogout: () => void;
  categories: { name: string; path: string }[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  onUpdateStaff: (updatedStaff: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  orders,
  products,
  tenders,
  shippingZones,
  socialLinks,
  onUpdateOrderStatus,
  onUpdateStock,
  onDeleteProduct,
  onUpdatePrice,
  onSetFlashSale,
  onAddProduct,
  onUpdateShippingZone,
  onAddShippingZone,
  onDeleteShippingZone,
  onUpdateSocialLinks,
  onLogout,
  categories,
  onAddCategory,
  onDeleteCategory,
  onUpdateStaff,
  onDeleteStaff
}) => {
  // ... existing state initialization ...
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics' | 'staff' | 'shipping' | 'social'>('orders');
  const [orderFilter, setOrderFilter] = useState<'All' | 'Pending' | 'Sent' | 'In Transit' | 'Delivered'>('All');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [systemAlert, setSystemAlert] = useState<{ message: string, type: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const isAdmin = currentUser.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchStaffList().then(setStaffList);
    }
  }, [isAdmin]);

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus) => {
    if (!currentUser.permissions.access_orders) return;
    onUpdateOrderStatus(order.id, newStatus);

    let message = `Order #${order.id} Updated`;
    if (newStatus === 'Sent') message = `Order dispatched to courier`;
    if (newStatus === 'In Transit') message = `Order marked as in transit`;
    if (newStatus === 'Delivered') message = `Order successfully delivered`;

    if (newStatus === 'Sent') {
      notifyCustomerOfShipping(order.customerPhone, order.id);
    }

    setSystemAlert({ message, type: 'system' });
    setTimeout(() => setSystemAlert(null), 3000);
  };


  const updatePermissions = (staffId: string, permissions: StaffPermissions) => {
    setStaffList(prev => prev.map(s => s.id === staffId ? { ...s, permissions } : s));
    setSystemAlert({ message: 'Privileges Updated', type: 'system' });
    setTimeout(() => setSystemAlert(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      {systemAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border text-white ${systemAlert.type === 'error' ? 'bg-red-600 border-red-500' : 'bg-emerald-600 border-emerald-500'}`}>
            <i className={`fa-solid ${systemAlert.type === 'error' ? 'fa-triangle-exclamation' : 'fa-shield-check'} text-xl`}></i>
            <span className="text-[11px] font-black uppercase tracking-widest">{systemAlert.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'}`}>
                Authorized: {currentUser.name}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Command <span className="text-blue-600">Center</span></h1>
          </div>
          <button
            onClick={onLogout}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 w-fit shadow-sm"
          >
            <i className="fa-solid fa-power-off"></i>
            Secure Sign-out
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>Orders</button>
          <button onClick={() => setActiveTab('inventory')} className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>Inventory</button>
          <button onClick={() => setActiveTab('shipping')} className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'shipping' ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>Shipping Logistics</button>
          {isAdmin && <button onClick={() => setActiveTab('social')} className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'social' ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>Social Media</button>}
          {isAdmin && <button onClick={() => setActiveTab('staff')} className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>Manage Staff</button>}
          {currentUser.permissions.access_revenue_data && <button onClick={() => setActiveTab('analytics')} className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>Revenue Analytics</button>}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          {activeTab === 'orders' && (
            currentUser.permissions.access_orders ? (
              <div className="flex flex-col h-full">
                {/* Order Sub-Navigation */}
                <div className="flex border-b border-slate-100 px-8">
                  {['All', 'Pending', 'Sent', 'In Transit', 'Delivered'].map(status => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status as any)}
                      className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${orderFilter === status ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reference</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Shipping (KES)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total (KES)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.filter(o => {
                        if (orderFilter === 'All') return true;
                        if (orderFilter === 'Pending') return o.status === 'Pending' || o.status === 'Paid';
                        return o.status === orderFilter;
                      }).map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-black text-blue-900">{order.id}</td>
                          <td className="px-8 py-6">
                            <span className="font-bold text-slate-800 block text-sm">{order.customerName}</span>
                            <span className="text-[10px] text-blue-600 font-bold uppercase">{order.location}</span>
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-500">{order.shippingFee.toLocaleString()}</td>
                          <td className="px-8 py-6 font-black text-slate-900">{order.total.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'In Transit' ? 'bg-amber-100 text-amber-700' :
                                order.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-600'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedOrder(order)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                View
                              </button>

                              {(order.status === 'Paid' || order.status === 'Pending') && (
                                <button onClick={() => handleUpdateStatus(order, 'Sent')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                                  Mark Sent
                                </button>
                              )}

                              {order.status === 'Sent' && (
                                <button onClick={() => handleUpdateStatus(order, 'In Transit')} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all">
                                  In Transit
                                </button>
                              )}

                              {order.status === 'In Transit' && (
                                <button onClick={() => handleUpdateStatus(order, 'Delivered')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">
                                  Mark Delivered
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-20 gap-4">
                <i className="fa-solid fa-lock text-5xl text-slate-100"></i>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Permission 'access_orders' Denied.</p>
              </div>
            )
          )}

          {activeTab === 'inventory' && (
            <InventorySection
              currentUser={currentUser}
              products={products}
              categories={categories}
              onUpdateStock={onUpdateStock}
              onDeleteProduct={onDeleteProduct}
              onSetFlashSale={onSetFlashSale}
              onAddProduct={onAddProduct}
              onAddCategory={onAddCategory}
              onDeleteCategory={onDeleteCategory}
              setSystemAlert={setSystemAlert}
            />
          )}

          {activeTab === 'shipping' && (
            <ShippingSection
              shippingZones={shippingZones}
              onUpdateShippingZone={onUpdateShippingZone}
              onAddShippingZone={onAddShippingZone}
              onDeleteShippingZone={onDeleteShippingZone}
            />
          )}

          {activeTab === 'social' && isAdmin && (
            <SocialSection
              socialLinks={socialLinks}
              onUpdateSocialLinks={onUpdateSocialLinks}
              setSystemAlert={setSystemAlert}
            />
          )}

          {activeTab === 'staff' && isAdmin && (
            <div className="p-8">
              <StaffManagement
                staffList={staffList}
                onUpdatePermissions={updatePermissions}
                onUpdateStaff={(updated) => {
                  setStaffList(prev => prev.map(s => s.id === updated.id ? updated : s));
                  onUpdateStaff(updated); // Propagate to parent if needed, but local state update is key for UI
                }}
                onDeleteStaff={(id) => {
                  setStaffList(prev => prev.filter(s => s.id !== id));
                  onDeleteStaff(id);
                }}
                onCreateStaff={(data) => {
                  const newS: StaffMember = { ...data, id: `st-${Date.now()}`, role: 'staff', permissions: { access_orders: true, access_inventory: false, access_revenue_data: false } };
                  setStaffList([...staffList, newS]);
                }}
              />
            </div>
          )}

          {activeTab === 'analytics' && currentUser.permissions.access_revenue_data && (
            <div className="flex flex-col items-center justify-center h-full p-20 space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">M-PESA Gross</p>
                  <h2 className="text-4xl font-black text-emerald-600">KES 1.8M</h2>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Ticket</p>
                  <h2 className="text-4xl font-black text-blue-600">KES 4,200</h2>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100 max-w-sm"></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Revenue Feed Live from Nyahururu Hub</p>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderManifestModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onMarkShipped={handleMarkShipped}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

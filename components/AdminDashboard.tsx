
import React, { useState, useRef, useEffect } from 'react';
import { Order, Product, OrderStatus, UserRole, TenderInquiry, StaffMember, StaffPermissions, ShippingZone } from '../types';
import { notifyCustomerOfShipping } from '../services/notificationService';
import { fetchStaffList, uploadProductImage } from '../lib/supabase';
import StaffManagement from './StaffManagement';

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
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentUser, 
  orders, 
  products, 
  tenders,
  shippingZones,
  onUpdateOrderStatus, 
  onUpdateStock, 
  onDeleteProduct,
  onUpdatePrice,
  onSetFlashSale,
  onAddProduct,
  onUpdateShippingZone,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics' | 'staff' | 'shipping'>('orders');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [systemAlert, setSystemAlert] = useState<{message: string, type: string} | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Apparel',
    price: '',
    description: '',
    stock: '50'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = currentUser.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchStaffList().then(setStaffList);
    }
  }, [isAdmin]);

  const handleMarkShipped = (order: Order) => {
    if (!currentUser.permissions.access_orders) return;
    onUpdateOrderStatus(order.id, 'Dispatched');
    const notification = notifyCustomerOfShipping(order.customerPhone, order.id);
    setSystemAlert({ message: notification.message, type: 'sms' });
    setTimeout(() => setSystemAlert(null), 5000);
  };

  const updatePermissions = (staffId: string, permissions: StaffPermissions) => {
    setStaffList(prev => prev.map(s => s.id === staffId ? { ...s, permissions } : s));
    setSystemAlert({ message: 'Privileges Updated', type: 'system' });
    setTimeout(() => setSystemAlert(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setSystemAlert({ message: 'Image File Required', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadProductImage(file);
      onAddProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        image: imageUrl,
        stock: parseInt(newProduct.stock),
        isFeatured: false
      });
      setShowAddModal(false);
      setNewProduct({ name: '', category: 'Apparel', price: '', description: '', stock: '50' });
      setPreviewImage(null);
      setSystemAlert({ message: 'Product Added Successfully', type: 'success' });
    } catch (err) {
      setSystemAlert({ message: 'Upload Failed', type: 'error' });
    } finally {
      setUploading(false);
      setTimeout(() => setSystemAlert(null), 3000);
    }
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
          {isAdmin && <button onClick={() => setActiveTab('staff')} className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>Manage Staff</button>}
          {currentUser.permissions.access_revenue_data && <button onClick={() => setActiveTab('analytics')} className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>Revenue Analytics</button>}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          {activeTab === 'orders' && (
             currentUser.permissions.access_orders ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reference</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Shipping (KES)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total (KES)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="px-8 py-6 font-black text-blue-900">{order.id}</td>
                          <td className="px-8 py-6">
                            <span className="font-bold text-slate-800 block text-sm">{order.customerName}</span>
                            <span className="text-[10px] text-blue-600 font-bold uppercase">{order.location}</span>
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-500">{order.shippingFee.toLocaleString()}</td>
                          <td className="px-8 py-6 font-black text-slate-900">{order.total.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            {order.status === 'Paid' && (
                              <button onClick={() => handleMarkShipped(order)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                                Ship Order
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-full p-20 gap-4">
                  <i className="fa-solid fa-lock text-5xl text-slate-100"></i>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Permission 'access_orders' Denied.</p>
                </div>
             )
          )}

          {activeTab === 'inventory' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Stock <span className="text-blue-600">Inventory</span></h3>
                {currentUser.permissions.access_inventory && (
                  <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Add New Product
                  </button>
                )}
              </div>
              {currentUser.permissions.access_inventory ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <div key={product.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                          <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                          <div>
                            <p className="font-black text-slate-800 text-xs">{product.name}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase">Stock: {product.stock}</p>
                          </div>
                        </div>
                        <button onClick={() => onUpdateStock(product.id, product.stock + 10)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                          <i className="fa-solid fa-plus text-[10px]"></i>
                        </button>
                      </div>
                    ))}
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-20 gap-4">
                  <i className="fa-solid fa-lock text-5xl text-slate-100"></i>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Permission 'access_inventory' Denied.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Shipping <span className="text-blue-600">Zones & Fees</span></h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure automated pricing for the Nyahururu Address Book</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {shippingZones.map(zone => (
                    <div key={zone.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                       <div className="flex justify-between items-start">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <i className="fa-solid fa-map-location-dot"></i>
                          </div>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-1 rounded-md">{zone.estimatedDays}</span>
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">{zone.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">Base Shipping Fee</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase">KES</span>
                          <input 
                            type="number" 
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 w-full text-sm font-black text-black focus:border-blue-600 outline-none"
                            value={zone.fee}
                            onChange={(e) => onUpdateShippingZone(zone.id, parseFloat(e.target.value) || 0)}
                          />
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'staff' && isAdmin && (
            <div className="p-8">
              <StaffManagement staffList={staffList} onUpdatePermissions={updatePermissions} onCreateStaff={(data) => {
                  const newS: StaffMember = { ...data, id: `st-${Date.now()}`, role: 'staff', permissions: { access_orders: true, access_inventory: false, access_revenue_data: false } };
                  setStaffList([...staffList, newS]);
              }} />
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

      {showAddModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-blue-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col md:flex-row">
            <div className="w-full md:w-5/12 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
               <div className="relative group w-full aspect-square mb-6">
                  {previewImage ? <img src={previewImage} className="w-full h-full object-cover rounded-3xl shadow-lg border-4 border-white" alt="Preview" /> : <div className="w-full h-full bg-white border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 gap-4 group-hover:border-blue-400 transition-colors"><i className="fa-solid fa-cloud-arrow-up text-5xl"></i><p className="text-[10px] font-black uppercase tracking-widest">Drop Image Here</p></div>}
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {previewImage && <button onClick={() => { setPreviewImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><i className="fa-solid fa-xmark text-xs"></i></button>}
               </div>
            </div>
            <div className="flex-1 p-10">
               <div className="flex justify-between items-start mb-8">
                  <div><h3 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Add <span className="text-blue-600">Product</span></h3><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Nyahururu Hub Inventory Management</p></div>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
               </div>
               <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label><input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" placeholder="e.g. Premium Medical Clogs" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (KES)</label><input required type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" placeholder="3500" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} /></div>
                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label><select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}><option>Apparel</option><option>Equipment</option><option>Diagnostics</option><option>Accessories</option><option>Footwear</option></select></div>
                  </div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Description</label><textarea required rows={3} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black resize-none" placeholder="Enter fabric details..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} /></div>
                  <button type="submit" disabled={uploading} className="w-full py-5 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50">{uploading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-check"></i>}{uploading ? 'Processing Assets...' : 'Finalize & Publish'}</button>
               </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

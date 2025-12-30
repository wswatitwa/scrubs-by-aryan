
import React, { useState } from 'react';
import { Order } from '../types';

interface OrderTrackingProps {
  orders: Order[];
  initialOrderId?: string;
  onClose: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orders, initialOrderId = '', onClose }) => {
  const [searchId, setSearchId] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(orders.find(o => o.id === initialOrderId) || null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.id.toUpperCase() === searchId.toUpperCase());
    if (found) {
      setOrder(found);
      setError('');
    } else {
      setOrder(null);
      setError('Order not found. Please check your Reference ID.');
    }
  };

  const statusSteps = [
    { key: 'Pending', label: 'Order Logged', icon: 'fa-file-invoice' },
    { key: 'Paid', label: 'Payment Verified', icon: 'fa-money-bill-transfer' },
    { key: 'Dispatched', label: 'In Transit', icon: 'fa-truck-fast' },
    { key: 'Delivered', label: 'Delivered', icon: 'fa-house-circle-check' }
  ];

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  return (
    <div className="bg-white p-8 sm:p-12 rounded-[3.5rem] shadow-2xl border border-blue-50 max-w-2xl w-full mx-auto animate-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
        <div>
          <h3 className="text-3xl font-black text-blue-900 tracking-tighter uppercase">Order <span className="text-blue-600">Track</span></h3>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Medical Supply Tracking</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-300 hover:text-red-500 transition-all">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-10">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g. ORD-1234)"
            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-8 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-800 shadow-lg active:scale-95 transition-all"
          >
            Locate
          </button>
        </div>
        {error && <p className="mt-3 text-[10px] font-black text-red-500 uppercase tracking-widest ml-4">{error}</p>}
      </form>

      {order ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-1">Shipping To</span>
              <h4 className="text-xl font-black text-slate-900">{order.customerName}</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{order.location}</p>
            </div>
            <div className="bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100 text-right">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Status</span>
              <span className="text-sm font-black text-blue-900 uppercase">{order.status}</span>
            </div>
          </div>

          <div className="relative pt-10 pb-4">
             <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
             <div 
               className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-1000"
               style={{ width: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%` }}
             ></div>
             
             <div className="relative flex justify-between">
                {statusSteps.map((step, idx) => {
                  const isActive = idx <= getStatusIndex(order.status);
                  const isCurrent = idx === getStatusIndex(order.status);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isCurrent ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 scale-125' : 
                        isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-white border-2 border-slate-50 text-slate-200'
                      }`}>
                        <i className={`fa-solid ${step.icon} text-lg`}></i>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest text-center max-w-[60px] ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Summary</h5>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600">{item.quantity}x {item.name}</span>
                  <span className="font-black text-slate-900">KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-black text-blue-900 uppercase text-[11px]">Total Paid</span>
                <span className="text-lg font-black text-blue-600">KES {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 justify-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            <i className="fa-solid fa-clock-rotate-left"></i>
            Real-time Status Sync Active
          </div>
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
           <i className="fa-solid fa-map-location-dot text-6xl text-slate-100"></i>
           <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Search your Order ID to see live progress</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;

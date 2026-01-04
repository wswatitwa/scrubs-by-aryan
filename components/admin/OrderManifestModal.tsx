import React from 'react';
import { Order } from '../../types';

interface OrderManifestModalProps {
    order: Order;
    onClose: () => void;
    onMarkShipped: (order: Order) => void;
}

/**
 * Modal to display detailed order information (Manifest).
 * Includes customer details, item breakdown with customizations, and financial summary.
 */
const OrderManifestModal: React.FC<OrderManifestModalProps> = ({ order, onClose, onMarkShipped }) => {
    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-[#001a1a]/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Order <span className="text-blue-600">Manifest</span></h3>
                        <div className="flex gap-4 mt-2">
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                                #{order.id}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${order.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' :
                                order.status === 'Dispatched' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                            <p className="font-bold text-slate-900">{order.customerName}</p>
                            <p className="text-xs text-slate-500">{order.customerPhone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery To</p>
                            <p className="font-bold text-slate-900">{order.location}</p>
                            <p className="text-xs text-slate-500">{order.shippingMethod}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Items Ordered</p>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-white" alt="" />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between">
                                            <h4 className="font-black text-slate-900 uppercase text-sm">{item.name}</h4>
                                            <span className="font-bold text-slate-900">KES {item.price.toLocaleString()}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {item.selectedSize && (
                                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase">
                                                    Size: {item.selectedSize}
                                                </span>
                                            )}
                                            {item.selectedColor && (
                                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1">
                                                    Color: {item.selectedColor}
                                                </span>
                                            )}
                                            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>

                                        {item.specialInstructions && (
                                            <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-100 flex gap-2 items-start">
                                                <i className="fa-solid fa-pen-nib mt-0.5 text-[10px]"></i>
                                                <div>
                                                    <span className="font-black text-[9px] uppercase tracking-wider block opacity-70">Embroidery / Notes</span>
                                                    <span className="font-medium italic">"{item.specialInstructions}"</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Subtotal</span>
                            <span className="font-medium">KES {order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Shipping Fee</span>
                            <span className="font-medium">KES {order.shippingFee.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-white/10 my-2"></div>
                        <div className="flex justify-between text-lg font-black uppercase tracking-widest">
                            <span className="text-cyan-400">Total Paid</span>
                            <span>KES {order.total.toLocaleString()}</span>
                        </div>
                        {order.mpesaCode && (
                            <div className="pt-2 mt-2 border-t border-white/10 text-[10px] text-center font-mono text-white/40">
                                MPESA TRANSACTION: {order.mpesaCode}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    {order.status === 'Paid' ? (
                        <button
                            onClick={() => onMarkShipped(order)}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all"
                        >
                            Mark as Dispatched
                        </button>
                    ) : (
                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Order is {order.status}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManifestModal;

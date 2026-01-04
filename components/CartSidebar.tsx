
import React from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string, color?: string, size?: string) => void;
  onUpdateQuantity: (id: string, delta: number, color?: string, size?: string) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div
        className="absolute inset-0 bg-[#001a1a]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex md:pl-10">
        <div className="w-screen md:max-w-md">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            <div className="flex-1 py-8 overflow-y-auto px-6 sm:px-8 custom-scrollbar">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Your <span className="text-cyan-600">Shopping Cart</span></h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Nyahururu Logistics Hub</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100">
                      <i className="fa-solid fa-staff-snake text-slate-200 text-4xl"></i>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your shopping cart is empty</p>
                      <button
                        onClick={onClose}
                        className="text-cyan-600 font-black uppercase tracking-widest text-[10px] hover:text-cyan-800 transition-colors"
                      >
                        Explore Catalog →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-8 divide-y divide-slate-50">
                      {items.map((item, idx) => (
                        <li key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="py-8 flex gap-6">
                          <div className="flex-shrink-0 w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name}</h3>
                                <p className="text-[11px] font-black text-cyan-900">KES {(item.price * item.quantity).toLocaleString()}</p>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.selectedStyle && <span className="text-[8px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded text-slate-500">{item.selectedStyle}</span>}
                                {item.selectedColor && <span className="text-[8px] font-black uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded text-cyan-600">Color: {item.selectedColor}</span>}
                                {item.selectedSize && <span className="text-[8px] font-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded text-blue-600">Size: {item.selectedSize}</span>}
                                {item.specialInstructions && (
                                  <span className="w-full text-[8px] font-bold italic text-amber-600 mt-2 block border-l-2 border-amber-200 pl-2">
                                    Note: {item.specialInstructions}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                              <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                <button onClick={() => onUpdateQuantity(item.id, -1, item.selectedColor, item.selectedSize)} className="text-slate-400 hover:text-cyan-600 transition-colors">
                                  <i className="fa-solid fa-minus text-[10px]"></i>
                                </button>
                                <span className="font-black text-slate-900 text-xs min-w-[20px] text-center">{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.id, 1, item.selectedColor, item.selectedSize)} className="text-slate-400 hover:text-cyan-600 transition-colors">
                                  <i className="fa-solid fa-plus text-[10px]"></i>
                                </button>
                              </div>
                              <button
                                onClick={() => onRemove(item.id, item.selectedColor, item.selectedSize)}
                                className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Payable</span>
                  <span className="text-2xl font-black text-slate-900">KES {total.toLocaleString()}</span>
                </div>

                <button
                  onClick={onCheckout}
                  className="flex-1 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  <span>Pay with M-PESA</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  <i className="fa-solid fa-truck-fast text-cyan-500 mr-2"></i>
                  Nationwide Delivery
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  <i className="fa-solid fa-shield-halved text-emerald-500 mr-2"></i>
                  Secure
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;

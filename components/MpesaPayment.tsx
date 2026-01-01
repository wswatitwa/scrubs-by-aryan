
import React, { useState, useEffect } from 'react';
import { initiateMpesaStkPush, verifyTransactionStatus } from '../services/paymentService';
import { ShippingZone } from '../types';

interface MpesaPaymentProps {
  subtotal: number;
  shippingZones: ShippingZone[];
  onComplete: (name: string, phone: string, location: string, fee: number, code: string, notes?: string) => void;
  onCancel: () => void;
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ subtotal, shippingZones, onComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [stkSent, setStkSent] = useState(false);
  const [error, setError] = useState('');
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });

  const total = subtotal + (selectedZone?.fee || 0);

  const handleTriggerStk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !selectedZone) {
      setError('Please provide Name, Phone, and Select a Destination.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response: any = await initiateMpesaStkPush(formData.phone, total);
      if (response.success) {
        setStkSent(true);
        const result: any = await verifyTransactionStatus(response.checkoutId);
        if (result.status === 'SUCCESS') {
          onComplete(formData.name, formData.phone, selectedZone.name, selectedZone.fee, result.transactionCode, formData.notes);
        } else {
          setError('Payment failed. Please try again.');
          setStkSent(false);
        }
      }
    } catch (err) {
      setError('M-PESA Gateway Timeout. Try again.');
      setStkSent(false);
    } finally {
      setLoading(false);
    }
  };

  if (stkSent) {
    return (
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full mx-auto text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fa-solid fa-mobile-vibration text-4xl"></i>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
        <div className="space-y-3">
          <h4 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Check Your Phone</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
            We've sent an STK prompt to <span className="text-emerald-600 font-bold">{formData.phone}</span>.
            Enter your M-PESA PIN to finish.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-2">
          <i className="fa-solid fa-spinner fa-spin text-emerald-500"></i>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Verification...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full mx-auto space-y-8 relative overflow-hidden">
      <div className="flex justify-between items-center relative z-10">
        <div>
          <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Finalize <span className="text-blue-600">Purchase</span></h3>
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Nyahururu Hub Express Payment</p>
        </div>
        <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleTriggerStk} className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipient Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Dr. Arthur Aryan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shipping Destination (Address Book)</label>
            <div className="relative">
              <select
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all appearance-none"
                onChange={(e) => {
                  const zone = shippingZones.find(z => z.id === e.target.value);
                  setSelectedZone(zone || null);
                }}
              >
                <option value="">Select Delivery Area...</option>
                {shippingZones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name} (+ KES {zone.fee})</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
            </div>
            {selectedZone && (
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest ml-1">
                <i className="fa-solid fa-truck-fast mr-1"></i> Estimated Delivery: {selectedZone.estimatedDays}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">M-PESA Registered Number</label>
            <div className="relative">
              <i className="fa-solid fa-mobile-screen absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500"></i>
              <input
                required
                type="tel"
                placeholder="07XX XXX XXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Order Demands / Instructions</label>
            <textarea
              rows={3}
              placeholder="e.g. Please deliver after 4PM or add specific hospital wing details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="bg-blue-900 p-6 rounded-[2rem] shadow-xl text-white space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-blue-300">
            <span>Items Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-blue-300">
            <span>Shipping Fee</span>
            <span>{selectedZone ? `KES ${selectedZone.fee.toLocaleString()}` : 'Select Area'}</span>
          </div>
          <div className="h-px bg-white/10 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest">Total Payable</span>
            <span className="text-2xl font-black">KES {total.toLocaleString()}</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-[11px] font-bold flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
          {loading ? "Processing..." : "Pay with M-PESA Now"}
        </button>
      </form>
    </div>
  );
};

export default MpesaPayment;

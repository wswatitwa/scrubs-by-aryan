
import React, { useState } from 'react';

interface TenderRequestFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const TenderRequestForm: React.FC<TenderRequestFormProps> = ({ onClose, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    orgType: 'Private Hospital',
    contactPerson: '',
    email: '',
    phone: '',
    productCategory: 'Staff Scrubs & Lab Coats',
    estimatedQuantity: '',
    budgetRange: 'Under KES 500k',
    deadline: '',
    requirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API delay
    setTimeout(() => {
      onSubmit(formData);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100 max-w-2xl w-full mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-check-double text-4xl"></i>
        </div>
        <h3 className="text-3xl font-black text-blue-900 uppercase">Inquiry Received</h3>
        <p className="text-slate-500 font-medium leading-relaxed">
          Thank you, <span className="text-blue-600 font-bold">{formData.contactPerson}</span>. 
          Your tender request for <span className="font-bold">{formData.orgName}</span> has been logged. 
          Our Institutional Desk in Nyahururu will review your requirements and reach out via <span className="font-bold">{formData.email}</span> within 24 hours.
        </p>
        <div className="pt-6">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 transition-all shadow-xl shadow-blue-200"
          >
            Close Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-blue-50 max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
        <div>
          <h3 className="text-3xl font-black text-blue-900 tracking-tight">INSTITUTIONAL PORTAL</h3>
          <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">Bulk Tender & Procurement Request</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-blue-600 transition-all">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Nyahururu Referral"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              value={formData.orgName}
              onChange={(e) => setFormData({...formData, orgName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Type</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all appearance-none"
              value={formData.orgType}
              onChange={(e) => setFormData({...formData, orgType: e.target.value})}
            >
              <option>Public Hospital</option>
              <option>Private Clinic</option>
              <option>Medical College</option>
              <option>NGO / Relief Org</option>
              <option>Government Agency</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Person</label>
            <input 
              required
              type="text" 
              placeholder="Full Name"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              value={formData.contactPerson}
              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
            <input 
              required
              type="email" 
              placeholder="procurement@org.com"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direct Phone</label>
            <input 
              required
              type="tel" 
              placeholder="07XX XXX XXX"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimated Budget</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all appearance-none"
              value={formData.budgetRange}
              onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
            >
              <option>Under KES 100k</option>
              <option>KES 100k - 500k</option>
              <option>KES 500k - 2M</option>
              <option>Above KES 2M</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Category</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all appearance-none"
              value={formData.productCategory}
              onChange={(e) => setFormData({...formData, productCategory: e.target.value})}
            >
              <option>Staff Scrubs & Lab Coats</option>
              <option>Surgical Gear (Caps/Masks)</option>
              <option>Diagnostic Equipment Fleet</option>
              <option>Medical Footwear Bulk</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected Delivery Date</label>
            <input 
              required
              type="date" 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Requirements (Quantity per size/color)</label>
          <textarea 
            rows={3}
            placeholder="e.g. 200 Sets Navy Blue (M), 100 Sets White (L). Include embroidery details if needed..."
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
            value={formData.requirements}
            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full py-6 bg-blue-700 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-blue-800 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95"
          >
            <i className="fa-solid fa-paper-plane"></i>
            Submit Formal Request
          </button>
          <div className="flex items-center justify-center gap-6 mt-6">
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest">
              <i className="fa-solid fa-lock text-blue-500"></i> Secure Encryption
            </span>
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest">
              <i className="fa-solid fa-clock text-blue-500"></i> 24h Response
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TenderRequestForm;

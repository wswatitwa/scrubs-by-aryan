
import React, { useState } from 'react';

interface AuthPortalProps {
  onLogin: (role: 'admin' | 'staff') => void;
  onCancel: () => void;
}

const AuthPortal: React.FC<AuthPortalProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Implementation note: use supabase.auth.signInWithPassword({ email, password }) here
    setTimeout(() => {
      // Role assignment logic for authorized accounts
      if (email.includes('admin')) {
        onLogin('admin');
      } else {
        onLogin('staff');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-blue-900/60 backdrop-blur-xl">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-blue-100 overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-blue-900 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800 rounded-full blur-3xl -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Portal Access</h2>
            <p className="text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Nyahururu Hub Internal System</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Email</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  required
                  type="email" 
                  placeholder="name@crubs.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              <>
                <i className="fa-solid fa-shield-check"></i>
                Authorize Session
              </>
            )}
          </button>
          
          <button 
            type="button"
            onClick={onCancel}
            className="w-full py-3 text-slate-400 font-black uppercase tracking-widest text-[9px] hover:text-blue-600 transition-colors"
          >
            Return to Storefront
          </button>
        </form>
        
        <div className="px-10 pb-10">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <i className="fa-solid fa-circle-info text-blue-600"></i>
            <p className="text-[9px] text-blue-800 font-bold leading-tight uppercase tracking-wider">
              System access is monitored. Logins are tracked by the Nyahururu Security Center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;

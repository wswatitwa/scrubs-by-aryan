```
import React, { useState, useEffect } from 'react';
import { StaffMember } from '../types';
import { supabase } from '../lib/supabaseClient'; // Added Supabase import

interface AuthPortalProps {
  onLogin: (user: StaffMember) => void;
  onCancel: () => void;
}

const AuthPortal: React.FC<AuthPortalProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2FA State
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [pendingUser, setPendingUser] = useState<StaffMember | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const [users, setUsers] = useState<StaffMember[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('crubs_staff_db');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem('crubs_staff_db', JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      // Rough mock password check - in real app use bcrypt on server
      if (user && (user.password === password || (!user.password && password === 'secret'))) {
        if (user.twoFactorEnabled) {
          // Generate Mock Code
          const code = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedCode(code);
          setPendingUser(user);
          setStep('2fa');

          console.log(`% c[Security Center]2FA Code for ${ user.email }: ${ code } `, "background: #059669; color: white; padding: 4px; border-radius: 4px; font-weight: bold;");
          alert(`[MOCK SMS] Your security code is: ${ code } `); // Alert for easier user testing

          setLoading(false);
        } else {
          onLogin(user);
        }
      } else {
        setError('Invalid credentials.');
        setLoading(false);
      }
    }, 1000);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (verificationCode === generatedCode) {
        if (pendingUser) onLogin(pendingUser);
      } else {
        setError('Invalid security code.');
        setLoading(false);
      }
    }, 800);
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

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="p-10 space-y-6">
            {error && <div className="p-3 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center">{error}</div>}

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
        ) : (
          <form onSubmit={handle2FASubmit} className="p-10 space-y-6 animate-in slide-in-from-right-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center">{error}</div>}

            <div className="text-center space-y-2 mb-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                <i className={`fa - solid ${ pendingUser?.twoFactorMethod === 'phone' ? 'fa-mobile-screen-button' : 'fa-envelope' } fa - beat`}></i>
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Verification Required</h3>
              <p className="text-[10px] text-slate-400 font-bold max-w-[200px] mx-auto">
                We sent a code to your {pendingUser?.twoFactorMethod === 'phone' ? 'Phone' : 'Email'}.
              </p>
              {/* DEV ONLY: Show Code for Testing */}
              <div className="bg-yellow-100 text-yellow-800 text-[10px] font-mono p-1 rounded inline-block border border-yellow-200" id="mock-2fa-code">
                TEST CODE: {generatedCode}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">6-Digit Code</label>
              <input
                autoFocus
                required
                type="text"
                maxLength={6}
                placeholder="000000"
                className="w-full text-center py-4 bg-slate-50 border border-slate-100 rounded-2xl text-2xl font-black text-black tracking-[0.5em] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Verify Identity'}
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="w-full py-3 text-slate-400 font-black uppercase tracking-widest text-[9px] hover:text-blue-600 transition-colors"
            >
              Try Different Account
            </button>
          </form>
        )}

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

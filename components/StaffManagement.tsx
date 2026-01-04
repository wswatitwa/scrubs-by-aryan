
import React, { useState } from 'react';
import { StaffMember, StaffPermissions } from '../types';

interface StaffManagementProps {
  staffList: StaffMember[];
  onUpdatePermissions: (staffId: string, permissions: StaffPermissions) => void;
  onCreateStaff: (data: any) => void;
  onUpdateStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ staffList, onUpdatePermissions, onCreateStaff, onUpdateStaff, onDeleteStaff }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'staff' as any });

  // 2FA Configuration State
  const [show2FAModal, setShow2FAModal] = useState<{ show: boolean, staff: StaffMember | null }>({ show: false, staff: null });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [twoFactorMethod, setTwoFactorMethod] = useState<'email' | 'phone'>('email');

  const togglePermission = (staff: StaffMember, key: keyof StaffPermissions) => {
    const updated = { ...staff.permissions, [key]: !staff.permissions[key] };
    onUpdatePermissions(staff.id, updated);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      onUpdateStaff(editingStaff);
      setEditingStaff(null);
    }
  };

  const handle2FASave = () => {
    if (show2FAModal.staff) {
      const updatedStaff = {
        ...show2FAModal.staff,
        twoFactorEnabled: true,
        twoFactorMethod: twoFactorMethod,
        phoneNumber: twoFactorMethod === 'phone' ? phoneNumber : undefined
      };
      onUpdateStaff(updatedStaff);
      setShow2FAModal({ show: false, staff: null });
    }
  };

  const handleDisable2FA = (staff: StaffMember) => {
    onUpdateStaff({ ...staff, twoFactorEnabled: false, phoneNumber: undefined });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Staff <span className="text-blue-600">Access Control</span></h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage Granular System Toggles & Security</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-user-plus"></i>
          Provision Staff
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {staffList.map(staff => (
          <div key={staff.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:border-blue-200 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${staff.role === 'admin' ? 'bg-blue-900 text-white' : 'bg-blue-50 text-blue-600'}`}>
                <i className={`fa-solid ${staff.role === 'admin' ? 'fa-user-shield' : 'fa-user-nurse'}`}></i>
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm leading-none flex items-center gap-2">
                  {staff.name}
                  {staff.twoFactorEnabled && <i className="fa-solid fa-shield-check text-emerald-500 text-[10px]" title="2FA Enabled"></i>}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{staff.email} • <span className="text-blue-600">{staff.role}</span></p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <PermissionToggle
                  label="Orders"
                  active={staff.permissions.access_orders}
                  onClick={() => togglePermission(staff, 'access_orders')}
                  disabled={staff.role === 'admin'}
                />
                <PermissionToggle
                  label="Stock"
                  active={staff.permissions.access_inventory}
                  onClick={() => togglePermission(staff, 'access_inventory')}
                  disabled={staff.role === 'admin'}
                />
                <PermissionToggle
                  label="Revenue"
                  active={staff.permissions.access_revenue_data}
                  onClick={() => togglePermission(staff, 'access_revenue_data')}
                  disabled={staff.role === 'admin'}
                />
              </div>

              <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingStaff(staff)}
                  className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors"
                  title="Edit Profile"
                >
                  <i className="fa-solid fa-pen text-xs"></i>
                </button>
                <button
                  onClick={() => staff.twoFactorEnabled ? handleDisable2FA(staff) : setShow2FAModal({ show: true, staff })}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${staff.twoFactorEnabled ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-50 text-slate-300 hover:text-emerald-500'}`}
                  title={staff.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                >
                  <i className={`fa-solid ${staff.twoFactorEnabled ? 'fa-shield-check' : 'fa-shield'} text-xs`}></i>
                </button>
                <button
                  onClick={() => onDeleteStaff(staff.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                  title="Revoke Access"
                >
                  <i className="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-blue-900 uppercase">New Staff Profile</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onCreateStaff(newStaff); setShowCreateModal(false); }}>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input required type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} />
              </div>
              <button className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow-lg">Create Profile</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-blue-900 uppercase">Update Profile</h3>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form className="space-y-4" onSubmit={handleUpdateSubmit}>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" value={editingStaff.name} onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input required type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" value={editingStaff.email} onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input type="password" placeholder="Leave empty to keep current" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" onChange={e => { if (e.target.value) setEditingStaff({ ...editingStaff, password: e.target.value }) }} />
              </div>
              <button className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow-lg">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal.show && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Enable 2-Step Auth</h3>
              <p className="text-slate-400 text-xs font-bold px-4 mt-2">Add an extra layer of security to {show2FAModal.staff?.name}'s account.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Verification Method</label>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTwoFactorMethod('email')}
                    className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${twoFactorMethod === 'email' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setTwoFactorMethod('phone')}
                    className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${twoFactorMethod === 'phone' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    SMS
                  </button>
                </div>
              </div>

              {twoFactorMethod === 'phone' && (
                <div className="space-y-1 animate-in slide-in-from-top-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    autoFocus
                    type="tel"
                    placeholder="+254 7..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={() => setShow2FAModal({ show: false, staff: null })} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200">Cancel</button>
              <button onClick={handle2FASave} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-200">Activate</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const PermissionToggle = ({ label, active, onClick, disabled }: { label: string, active: boolean, onClick: () => void, disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border transition-all ${active ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
  >
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default StaffManagement;

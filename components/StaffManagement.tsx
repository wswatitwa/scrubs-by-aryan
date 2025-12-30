
import React, { useState } from 'react';
import { StaffMember, StaffPermissions } from '../types';

interface StaffManagementProps {
  staffList: StaffMember[];
  onUpdatePermissions: (staffId: string, permissions: StaffPermissions) => void;
  onCreateStaff: (data: any) => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ staffList, onUpdatePermissions, onCreateStaff }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'staff' as any });

  const togglePermission = (staff: StaffMember, key: keyof StaffPermissions) => {
    const updated = { ...staff.permissions, [key]: !staff.permissions[key] };
    onUpdatePermissions(staff.id, updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Staff <span className="text-blue-600">Access Control</span></h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage Granular System Toggles</p>
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
          <div key={staff.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${staff.role === 'admin' ? 'bg-blue-900 text-white' : 'bg-blue-50 text-blue-600'}`}>
                <i className={`fa-solid ${staff.role === 'admin' ? 'fa-user-shield' : 'fa-user-nurse'}`}></i>
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm leading-none">{staff.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{staff.email} • <span className="text-blue-600">{staff.role}</span></p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <PermissionToggle 
                label="Orders" 
                active={staff.permissions.access_orders} 
                onClick={() => togglePermission(staff, 'access_orders')}
                disabled={staff.role === 'admin'}
              />
              <PermissionToggle 
                label="Inventory" 
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
          </div>
        ))}
      </div>

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
                <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input required type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
              </div>
              <button className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow-lg">Create Profile</button>
            </form>
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
    className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
      active ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
  >
    <div className={`w-3 h-3 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default StaffManagement;

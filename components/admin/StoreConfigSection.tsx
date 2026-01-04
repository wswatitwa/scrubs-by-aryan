
import React, { useState } from 'react';
import { StoreSettings } from '../../types';

interface StoreConfigSectionProps {
    settings: StoreSettings;
    onUpdateSettings: (settings: StoreSettings) => void;
    setSystemAlert: (alert: { message: string, type: string } | null) => void;
}

const StoreConfigSection: React.FC<StoreConfigSectionProps> = ({ settings, onUpdateSettings, setSystemAlert }) => {
    const [editSettings, setEditSettings] = useState<StoreSettings>(settings || { embroideryFee: 300 });

    const handleSave = () => {
        onUpdateSettings(editSettings);
        setSystemAlert({ message: 'Store Configuration Updated', type: 'success' });
        setTimeout(() => setSystemAlert(null), 3000);
    };

    return (
        <div className="p-8 space-y-8 max-w-2xl mx-auto">
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Store <span className="text-blue-600">Configurations</span></h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage global fees and operational settings</p>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                            <i className="fa-solid fa-pen-nib text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">Embroidery Service</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pricing for custom text on apparel</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fee per Item (KES)</label>
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition-colors">
                            <span className="text-slate-400 font-bold text-sm">KES</span>
                            <input
                                type="number"
                                className="flex-1 bg-transparent text-lg font-black text-slate-900 outline-none"
                                value={editSettings.embroideryFee}
                                onChange={(e) => setEditSettings({ ...editSettings, embroideryFee: Number(e.target.value) })}
                                min="0"
                            />
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold ml-1 mt-2">
                            * This fee will be automatically added to the product price when a customer adds custom embroidery.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-5 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3"
                >
                    <i className="fa-solid fa-floppy-disk"></i>
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default StoreConfigSection;

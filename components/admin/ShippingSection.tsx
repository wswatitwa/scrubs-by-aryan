import React from 'react';
import { ShippingZone } from '../../types';

interface ShippingSectionProps {
    shippingZones: ShippingZone[];
    onUpdateShippingZone: (zoneId: string, fee: number) => void;
    onAddShippingZone: (name: string, fee: number) => void;
    onDeleteShippingZone: (id: string) => void;
}

const ShippingSection: React.FC<ShippingSectionProps> = ({ shippingZones, onUpdateShippingZone, onAddShippingZone, onDeleteShippingZone }) => {
    // ...

    return (
        <div className="p-8 space-y-8">
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Shipping <span className="text-blue-600">Zones & Fees</span></h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure automated pricing for the Nyahururu Address Book</p>
            </div>

            {/* Add Zone Form */}
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-end">
                <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-1">New Zone Name</label>
                    <input type="text" placeholder="e.g. Eldoret Town" className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 outline-none text-sm font-bold" id="newZoneName" />
                </div>
                <div className="w-32 space-y-1">
                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-1">Fee (KES)</label>
                    <input type="number" placeholder="500" className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 outline-none text-sm font-bold" id="newZoneFee" />
                </div>
                <button
                    onClick={() => {
                        const nameInput = document.getElementById('newZoneName') as HTMLInputElement;
                        const feeInput = document.getElementById('newZoneFee') as HTMLInputElement;
                        if (nameInput.value && feeInput.value) {
                            onAddShippingZone(nameInput.value, parseFloat(feeInput.value));
                            nameInput.value = '';
                            feeInput.value = '';
                        }
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-colors h-[46px]"
                >
                    <i className="fa-solid fa-plus mr-2"></i> Add Route
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shippingZones.map(zone => (
                    <div key={zone.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 group">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                <i className="fa-solid fa-map-location-dot"></i>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-1 rounded-md">{zone.estimatedDays}</span>
                                <button
                                    onClick={() => onDeleteShippingZone(zone.id)}
                                    className="w-6 h-6 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    title="Remove Zone"
                                >
                                    <i className="fa-solid fa-trash-can text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">{zone.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold">Base Shipping Fee</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase">KES</span>
                            <input
                                type="number"
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 w-full text-sm font-black text-black focus:border-blue-600 outline-none"
                                value={zone.fee}
                                onChange={(e) => onUpdateShippingZone(zone.id, parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShippingSection;

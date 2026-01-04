import React, { useState } from 'react';
import { SocialMediaLinks } from '../../types';

interface SocialSectionProps {
    socialLinks: SocialMediaLinks;
    onUpdateSocialLinks: (links: SocialMediaLinks) => void;
    setSystemAlert: (alert: { message: string, type: string } | null) => void;
}

const SocialSection: React.FC<SocialSectionProps> = ({ socialLinks, onUpdateSocialLinks, setSystemAlert }) => {
    const [socialEdit, setSocialEdit] = useState<SocialMediaLinks>(socialLinks || { whatsapp: '', facebook: '', instagram: '' });

    return (
        <div className="p-8 space-y-8 max-w-2xl mx-auto">
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Social Media <span className="text-blue-600">Integration</span></h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure external connection points for the clinical community</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Official Number</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><i className="fa-brands fa-whatsapp"></i></div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-sm font-black text-black outline-none"
                            value={socialEdit.whatsapp}
                            onChange={(e) => setSocialEdit({ ...socialEdit, whatsapp: e.target.value })}
                            placeholder="+254 XXX XXXXXX"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Facebook Page URL</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><i className="fa-brands fa-facebook-f"></i></div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-sm font-black text-black outline-none"
                            value={socialEdit.facebook}
                            onChange={(e) => setSocialEdit({ ...socialEdit, facebook: e.target.value })}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instagram Account URL</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600"><i className="fa-brands fa-instagram"></i></div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-sm font-black text-black outline-none"
                            value={socialEdit.instagram}
                            onChange={(e) => setSocialEdit({ ...socialEdit, instagram: e.target.value })}
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                </div>

                <button
                    onClick={() => {
                        onUpdateSocialLinks(socialEdit);
                        setSystemAlert({ message: 'Social Hub Updated', type: 'success' });
                        setTimeout(() => setSystemAlert(null), 3000);
                    }}
                    className="w-full py-5 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow-xl shadow-blue-100 transition-all"
                >
                    Save Integration Details
                </button>
            </div>
        </div>
    );
};

export default SocialSection;

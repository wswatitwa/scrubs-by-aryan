import React from 'react';
import { SocialMediaLinks } from '../types';

interface FooterProps {
    socialLinks: SocialMediaLinks;
    onOpenTracking: () => void;
    onOpenTender: () => void;
}

const Footer: React.FC<FooterProps> = ({ socialLinks, onOpenTracking, onOpenTender }) => {
    // Defensive coding: Ensure socialLinks and whatsapp exist before accessing/replacing
    const whatsappNumber = socialLinks?.whatsapp || '';
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

    return (
        <footer className="bg-[#001515] py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-16 text-center">
                <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-2xl">
                        <i className="fa-solid fa-staff-snake text-2xl"></i>
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                            CRUBS <span className="text-cyan-400">BY ARYAN</span>
                        </span>
                        <span className="text-[10px] font-black text-cyan-600 tracking-[0.4em] uppercase mt-1">
                            Nyahururu • Nationwide Delivery
                        </span>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <p className="text-xl font-bold text-white/80 italic leading-relaxed">
                        "Your one-stop shop for quality medical gear. Equipping you to deliver as a healthcare professional."
                    </p>
                </div>

                <div className="flex gap-8 items-center">
                    {socialLinks?.whatsapp && (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                            title="WhatsApp"
                        >
                            <i className="fa-brands fa-whatsapp text-xl"></i>
                        </a>
                    )}
                    {socialLinks?.facebook && (
                        <a
                            href={socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
                            title="Facebook"
                        >
                            <i className="fa-brands fa-facebook-f text-xl"></i>
                        </a>
                    )}
                    {socialLinks?.instagram && (
                        <a
                            href={socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-300"
                            title="Instagram"
                        >
                            <i className="fa-brands fa-instagram text-xl"></i>
                        </a>
                    )}
                </div>

                <p className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20">EST 2024 • KENYA'S MEDICAL HUB</p>

                <div className="flex flex-wrap justify-center gap-16">
                    <button onClick={onOpenTracking} className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors">Nationwide Tracking</button>
                    <button onClick={onOpenTender} className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors">Bulk Purchases</button>
                    <a href="mailto:info@crubs.com" className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors">Customer Desk</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

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
        <footer className="bg-[#001515] border-t border-white/5 relative overflow-hidden">
            {/* Social Feed Section */}
            {(socialLinks?.facebookPageId || socialLinks?.instagramToken) && (
                <div className="border-b border-white/5 bg-[#000f0f]">
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Social <span className="text-cyan-400">Pulse.</span></h3>
                            <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.3em] mt-2">Latest from our community</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Facebook Feed */}
                            {socialLinks.facebookPageId && (
                                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 relative group">
                                    <div className="absolute top-4 right-4 text-blue-500 bg-blue-500/10 p-2 rounded-xl">
                                        <i className="fa-brands fa-facebook text-xl"></i>
                                    </div>
                                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Facebook Feed</h4>

                                    <div className="w-full overflow-hidden rounded-xl bg-white" style={{ minHeight: '300px' }}>
                                        <iframe
                                            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(socialLinks.facebook)}&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`}
                                            width="100%"
                                            height="300"
                                            style={{ border: 'none', overflow: 'hidden' }}
                                            scrolling="no"
                                            frameBorder="0"
                                            allowFullScreen={true}
                                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {/* Instagram Placeholders (Since we don't have a real token yet, we show a sleek placeholder or embed script) */}
                            {socialLinks.instagramToken && (
                                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 relative group">
                                    <div className="absolute top-4 right-4 text-pink-500 bg-pink-500/10 p-2 rounded-xl">
                                        <i className="fa-brands fa-instagram text-xl"></i>
                                    </div>
                                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Instagram Feed</h4>

                                    {/* Mock Instagram Grid for Visuals until Token is Valid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/5 overflow-hidden relative group/img cursor-pointer">
                                                <div className="absolute inset-0 flex items-center justify-center text-white/20 group-hover/img:text-pink-500 transition-colors">
                                                    <i className="fa-solid fa-image text-2xl"></i>
                                                </div>
                                                <div className="absolute inset-0 bg-pink-500/0 group-hover/img:bg-pink-500/20 transition-all"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <a href={socialLinks.instagram} target="_blank" className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-white transition-colors">View Full Gallery <i className="fa-solid fa-arrow-right ml-1"></i></a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center gap-16 text-center">
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

import React from 'react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    activePath?: string;
    onNavigate: (path: string) => void;
    onOpenTracking: () => void;
    categories: { name: string; path: string }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, activePath, onNavigate, onOpenTracking, categories }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Menu Content */}
            <div className="absolute inset-x-0 top-0 bg-[#001a1a] border-b border-white/10 p-6 shadow-2xl animate-in slide-in-from-top-10 duration-500">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                            <i className="fa-solid fa-staff-snake text-lg"></i>
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                            MENU
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <nav className="space-y-2">
                    {categories.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                onNavigate(item.path);
                                onClose();
                            }}
                            className={`w-full p-4 rounded-2xl text-left font-black uppercase tracking-widest text-sm transition-all flex justify-between items-center group ${activePath === item.path
                                ? 'bg-cyan-500 text-[#001a1a]'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {item.name}
                            <i className={`fa-solid fa-arrow-right text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${activePath === item.path ? 'opacity-100 text-[#001a1a]' : 'text-cyan-400'}`}></i>
                        </button>
                    ))}

                    <div className="h-px bg-white/10 my-4"></div>

                    <button
                        onClick={() => { onOpenTracking(); onClose(); }}
                        className="w-full p-4 rounded-2xl text-left font-black uppercase tracking-widest text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-3"
                    >
                        <i className="fa-solid fa-location-dot"></i>
                        Track Order
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default MobileMenu;


import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface ProductDetailsModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, color?: string, size?: string, style?: string, specialInstructions?: string, quantity?: number, material?: string) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedStyle, setSelectedStyle] = useState<string>('');
    const [selectedMaterial, setSelectedMaterial] = useState<string>('');
    const [embroideryText, setEmbroideryText] = useState('');

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setEmbroideryText('');
            // Default selections if only one option exists
            if (product.colors && product.colors.length === 1) setSelectedColor(product.colors[0].name);
            else setSelectedColor('');

            if (product.sizes && product.sizes.length === 1) setSelectedSize(product.sizes[0]);
            else setSelectedSize('');

            if (product.styles && product.styles.length === 1) setSelectedStyle(product.styles[0]);
            else setSelectedStyle('');

            if (product.materials && product.materials.length === 1) setSelectedMaterial(product.materials[0]);
            else setSelectedMaterial('');
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const isApparel = product.category === 'Apparel';
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasStyles = product.styles && product.styles.length > 0;
    const hasMaterials = product.materials && product.materials.length > 0;

    const isValid =
        (!hasColors || selectedColor) &&
        (!hasSizes || selectedSize) &&
        (!hasStyles || selectedStyle) &&
        (!hasMaterials || selectedMaterial);

    const handleAddToCart = () => {
        onAddToCart(product, selectedColor, selectedSize, selectedStyle, embroideryText || undefined, quantity, selectedMaterial);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#001a1a]/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300 custom-scrollbar">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-900 hover:bg-red-50 hover:text-red-500 transition-all shadow-lg"
                >
                    <i className="fa-solid fa-xmark text-lg"></i>
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 relative bg-slate-50 min-h-[300px] md:min-h-full">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {product.originalPrice && (
                        <div className="absolute top-8 left-8 bg-cyan-500 text-[#001a1a] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                            Sale
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-6">

                    {/* Header */}
                    <div>
                        <span className="text-cyan-600 font-black text-xs uppercase tracking-[0.3em]">{product.category}</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mt-2 leading-none">{product.name}</h2>
                        <div className="flex items-center gap-4 mt-4">
                            <span className="text-3xl font-black text-slate-900">KES {product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-slate-400 font-bold line-through decoration-2">KES {product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>
                        <p className="border-l-4 border-cyan-500 pl-4 mt-6 text-slate-600 font-medium italic">
                            {product.description}
                        </p>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    {/* Options Grid */}
                    <div className="space-y-8">

                        {/* Materials */}
                        {hasMaterials && (
                            <div className="space-y-3">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Material</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.materials?.map(material => (
                                        <button
                                            key={material}
                                            onClick={() => setSelectedMaterial(material)}
                                            className={`px-4 py-2 rounded-xl border-2 text-xs font-black transition-all ${selectedMaterial === material ? 'border-cyan-500 bg-cyan-500 text-[#001a1a] shadow-lg shadow-cyan-200' : 'border-slate-100 bg-white text-slate-400 hover:border-cyan-200 hover:text-cyan-600'}`}
                                        >
                                            {material}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Styles */}
                        {hasStyles && (
                            <div className="space-y-3">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Style</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.styles?.map(style => (
                                        <button
                                            key={style}
                                            onClick={() => setSelectedStyle(style)}
                                            className={`px-4 py-2 rounded-xl border-2 text-xs font-black transition-all ${selectedStyle === style ? 'border-cyan-500 bg-cyan-500 text-[#001a1a] shadow-lg shadow-cyan-200' : 'border-slate-100 bg-white text-slate-400 hover:border-cyan-200 hover:text-cyan-600'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {hasColors && (
                            <div className="space-y-3">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Color</span>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors?.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`group relative px-6 py-3 rounded-xl border-2 flex items-center gap-2 transition-all ${selectedColor === color.name ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-100 bg-white text-slate-600 hover:border-cyan-200'}`}
                                        >
                                            <span className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: color.hex || '#000' }}></span>
                                            <span className="text-xs font-bold uppercase">{color.name}</span>
                                            {selectedColor === color.name && (
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg text-[10px]">
                                                    <i className="fa-solid fa-check"></i>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {hasSizes && (
                            <div className="space-y-3">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Size</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes?.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-sm font-black transition-all ${selectedSize === size ? 'border-cyan-500 bg-cyan-500 text-[#001a1a] shadow-lg shadow-cyan-200' : 'border-slate-100 bg-white text-slate-400 hover:border-cyan-200 hover:text-cyan-600'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="space-y-3">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantity</span>
                            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl w-fit border border-slate-100">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-600 hover:text-cyan-500 transition-colors flex items-center justify-center"
                                >
                                    <i className="fa-solid fa-minus text-xs"></i>
                                </button>
                                <span className="w-8 text-center font-black text-lg text-slate-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-600 hover:text-cyan-500 transition-colors flex items-center justify-center"
                                >
                                    <i className="fa-solid fa-plus text-xs"></i>
                                </button>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400">{product.stock} items currently in stock</p>
                        </div>

                        {/* Embroidery (Apparel Only) */}
                        {isApparel && (
                            <div className="space-y-3 pt-4 border-t border-slate-100 animate-in slide-in-from-left-4">
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-pen-nib text-cyan-500"></i>
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Custom Embroidery</span>
                                    <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-[9px] font-black uppercase rounded">Optional</span>
                                </div>
                                <textarea
                                    value={embroideryText}
                                    onChange={(e) => setEmbroideryText(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-cyan-500 min-h-[80px] resize-none"
                                    placeholder="Enter name, title, or department details for embroidery..."
                                />
                            </div>
                        )}

                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <button
                            onClick={handleAddToCart}
                            disabled={!isValid || product.stock === 0}
                            className="w-full py-5 bg-[#001a1a] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-500 hover:text-[#001a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                        >
                            <span>{isValid ? 'Add to Cart' : 'Select Options'}</span>
                            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </button>
                        {!isValid && (
                            <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 animate-pulse">
                                Please select all required options
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;


import React, { useState } from 'react';
import { Product, Review } from '../types';
import ReviewSection from './ReviewSection';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddReview }) => {
  const [showReviews, setShowReviews] = useState(false);

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="group flex flex-col bg-white rounded-[4rem] overflow-hidden prestige-card transition-all duration-700 h-full border-b-[12px] border-transparent hover:border-cyan-500 hover:-translate-y-6">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
        />

        {/* Modern Status Badges */}
        <div className="absolute top-8 left-8 flex flex-col gap-4">
          {product.isFeatured && !product.originalPrice && (
            <div className="px-6 py-2.5 bg-[#001a1a] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl border border-white/10">
              <i className="fa-solid fa-shield-halved mr-3 text-cyan-400"></i>
              Sterile Grade
            </div>
          )}
          {product.originalPrice && (
            <div className="px-6 py-2.5 bg-cyan-500 text-[#001a1a] text-[11px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl font-bold">
              Exclusive Deal
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-8 left-8 right-8 py-6 bg-[#001a1a] text-white font-black uppercase tracking-[0.3em] text-[12px] rounded-[2.5rem] shadow-2xl md:opacity-0 md:translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 hover:bg-cyan-600 hover:text-[#001a1a] flex items-center justify-center gap-4 z-20"
        >
          <i className="fa-solid fa-cart-plus text-sm"></i>
          Equip Item
        </button>
      </div>

      <div className="p-8 sm:p-12 flex flex-col flex-1 gap-6">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.4em] mb-1">{product.category}</span>
          <div className="flex flex-col items-end">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">KES {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-[12px] text-slate-400 line-through font-bold">KES {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 leading-none group-hover:text-cyan-600 transition-colors line-clamp-1 uppercase tracking-tighter">{product.name}</h3>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed h-10 font-medium italic">
          "{product.description}"
        </p>

        <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="flex flex-col items-start group/rating transition-all"
          >
            <div className="flex gap-1 text-cyan-500 text-[12px]">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`${i < Math.round(averageRating || 5) ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
              ))}
              <span className="ml-3 text-slate-400 font-black text-[11px] uppercase tracking-tighter">({reviews.length} Logs)</span>
            </div>
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest">{product.stock} In Stock</span>
          </div>
        </div>

        {showReviews && (
          <ReviewSection
            reviews={reviews}
            onAddReview={(review) => onAddReview(product.id, review)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;

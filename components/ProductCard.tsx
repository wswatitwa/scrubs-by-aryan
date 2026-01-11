
import React, { useState } from 'react';
import { Product, Review } from '../types';
import ReviewSection from './ReviewSection';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddReview }) => {
  const [showReviews, setShowReviews] = useState(false);

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div
      onClick={() => onClick(product)}
      className="group flex flex-col bg-white rounded-[2.5rem] md:rounded-[4rem] overflow-hidden prestige-card transition-all duration-700 h-full border-b-[8px] md:border-b-[12px] border-transparent hover:border-cyan-500 hover:-translate-y-2 md:hover:-translate-y-6 shadow-lg cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
        />

        {/* ... Badges ... */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col gap-2 md:gap-4">
          {product.isFeatured && !product.originalPrice && (
            <div className="px-4 py-2 md:px-6 md:py-2.5 bg-[#001a1a] text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full shadow-2xl border border-white/10 w-fit">
              <i className="fa-solid fa-shield-halved mr-2 md:mr-3 text-cyan-400"></i>
              Sterile
            </div>
          )}
          {product.originalPrice && (
            <div className="px-4 py-2 md:px-6 md:py-2.5 bg-cyan-500 text-[#001a1a] text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full shadow-2xl font-bold w-fit">
              Sale
            </div>
          )}
        </div>

        {/* Action Button - Visible always on touch/small, hover on desktop */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent double trigger
            onClick(product);
          }}
          className="lg:absolute lg:bottom-8 lg:left-8 lg:right-8 absolute bottom-4 left-4 right-4 py-4 md:py-6 bg-[#001a1a] text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[12px] rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl lg:opacity-0 lg:translate-y-12 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 hover:bg-cyan-600 hover:text-[#001a1a] flex items-center justify-center gap-2 md:gap-4 z-20"
        >
          <i className="fa-solid fa-eye text-xs md:text-sm"></i>
          View Options
        </button>
      </div>

      <div className="p-6 md:p-8 sm:p-12 flex flex-col flex-1 gap-4 md:gap-6">
        <div className="flex justify-between items-start">
          <span className="text-[9px] md:text-[11px] font-black text-cyan-600 uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1">{product.category}</span>
          <div className="flex flex-col items-end">
            <span className="text-xl md:text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">KES {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-[10px] md:text-[12px] text-slate-400 line-through font-bold">KES {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none group-hover:text-cyan-600 transition-colors line-clamp-2 uppercase tracking-tighter">{product.name}</h3>

        <p className="text-slate-500 text-xs md:text-sm line-clamp-2 leading-relaxed h-8 md:h-10 font-medium italic">
          "{product.description}"
        </p>

        <div className="mt-auto pt-4 md:pt-8 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReviews(!showReviews);
            }}
            className="flex flex-col items-start group/rating transition-all"
          >
            <div className="flex gap-1 text-cyan-500 text-[10px] md:text-[12px]">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`${i < Math.round(averageRating || 5) ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
              ))}
              <span className="ml-2 md:ml-3 text-slate-400 font-black text-[9px] md:text-[11px] uppercase tracking-tighter">({reviews.length})</span>
            </div>
          </button>
          <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-50 text-emerald-600 rounded-lg md:rounded-xl">
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">{product.stock} Left</span>
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

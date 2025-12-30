
import React, { useState } from 'react';
import { Review } from '../types';

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, onAddReview }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;
    onAddReview({ userName, rating, comment, isVerified: false });
    setUserName('');
    setComment('');
    setRating(5);
    setShowForm(false);
  };

  return (
    <div className="mt-6 border-t border-slate-100 pt-6 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Reviews ({reviews.length})</h4>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1"
        >
          {showForm ? 'Cancel' : (
            <>
              <i className="fa-solid fa-plus"></i>
              Write Review
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className={`text-sm ${s <= rating ? 'text-amber-400' : 'text-slate-300'}`}
                >
                  <i className="fa-solid fa-star"></i>
                </button>
              ))}
            </div>
          </div>
          <input 
            type="text" 
            placeholder="Your Name"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-black focus:ring-2 focus:ring-blue-500 outline-none"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <textarea 
            placeholder="Your medical feedback..."
            rows={2}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-black focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button 
            type="submit"
            className="w-full py-3 bg-blue-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
        {reviews.length === 0 ? (
          <p className="text-[10px] text-slate-400 font-medium italic">No reviews yet. Be the first to share your experience!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-slate-50/50 p-3 rounded-xl space-y-2 border border-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-slate-800">{review.userName}</span>
                    {review.isVerified && (
                      <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Verified Buyer</span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star text-[9px] ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`}></i>
                    ))}
                  </div>
                </div>
                <span className="text-[8px] font-black text-slate-300 uppercase">{review.date}</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">"{review.comment}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

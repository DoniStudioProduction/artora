import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Camera, MessageSquare, CornerDownRight, Check, X, ShieldCheck, Sparkles } from "lucide-react";

interface Review {
  id: string;
  productId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number; // 1-5
  comment: string;
  imageUrl?: string;
  date: string;
  creatorReply?: string;
  creatorReplyDate?: string;
}

interface ProductReviewsProps {
  productId: string;
  productTitle: string;
  creatorId: string;
  isCreator: boolean; // Is the current logged-in user a creator
  currentUserName: string;
  currentUserAvatar: string;
  onUpdateProductRating?: (rating: number, count: number) => void;
}

export default function ProductReviews({
  productId,
  productTitle,
  creatorId,
  isCreator,
  currentUserName,
  currentUserAvatar,
  onUpdateProductRating
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [reviewImageUrl, setReviewImageUrl] = useState<string>("");
  const [isWriteOpen, setIsWriteOpen] = useState<boolean>(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  
  // Reply states
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");

  const DEFAULT_REVIEWS: Review[] = [
    {
      id: "rev_1",
      productId: "prod_nebula_ceramic",
      buyerName: "Lord Arthur Sterling",
      buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5,
      comment: "The celadon glaze is absolutely ethereal. Under morning light, it has a subtle sea-mist iridescence that photos cannot capture. Safely arrived inside its heavy cedar vault.",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80",
      date: "May 24, 2026",
      creatorReply: "Thank you for your patronage, Arthur. The celadon glaze was fired using local elder ash to create that exact natural iron reduction.",
      creatorReplyDate: "May 25, 2026"
    },
    {
      id: "rev_2",
      productId: "prod_nebula_ceramic",
      buyerName: "Clara Vance",
      buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      rating: 4,
      comment: "Incredibly fast processing. The clay body has a lovely textured, organic feel. A masterpiece that completes my minimalist entryway.",
      date: "June 02, 2026"
    },
    {
      id: "rev_3",
      productId: "prod_ethereal_echoes",
      buyerName: "Duchess Evelyn",
      buyerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5,
      comment: "This painting radiates an extraordinary warmth. Elena’s brushwork carries a meditative rhythm that completely transforms my parlor's atmosphere.",
      date: "May 28, 2026"
    }
  ];

  useEffect(() => {
    // Load reviews from localStorage
    const saved = localStorage.getItem("artora_product_reviews");
    let parsed: Review[] = [];
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    // Combine custom and default seed reviews for this product
    const customForProduct = parsed.filter(r => r.productId === productId);
    const defaultsForProduct = DEFAULT_REVIEWS.filter(r => r.productId === productId);
    
    // De-duplicate by id
    const combined = [...customForProduct];
    defaultsForProduct.forEach(def => {
      if (!combined.some(c => c.id === def.id)) {
        combined.push(def);
      }
    });

    setReviews(combined);

    // Calculate rating and update product detail rating if function provided
    if (onUpdateProductRating && combined.length > 0) {
      const avg = combined.reduce((sum, r) => sum + r.rating, 0) / combined.length;
      onUpdateProductRating(parseFloat(avg.toFixed(1)), combined.length);
    }
  }, [productId]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: Review = {
      id: `custom_rev_${Date.now()}`,
      productId,
      buyerName: currentUserName || "Guest Collector",
      buyerAvatar: currentUserAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
      rating,
      comment,
      imageUrl: reviewImageUrl.trim() || undefined,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
    };

    // Save to localStorage
    const saved = localStorage.getItem("artora_product_reviews");
    const currentList: Review[] = saved ? JSON.parse(saved) : [];
    const updatedList = [newReview, ...currentList];
    localStorage.setItem("artora_product_reviews", JSON.stringify(updatedList));

    // Update state
    const combined = [newReview, ...reviews];
    setReviews(combined);

    // Reset Form
    setComment("");
    setRating(5);
    setReviewImageUrl("");
    setIsWriteOpen(false);

    // Update overall rating
    if (onUpdateProductRating && combined.length > 0) {
      const avg = combined.reduce((sum, r) => sum + r.rating, 0) / combined.length;
      onUpdateProductRating(parseFloat(avg.toFixed(1)), combined.length);
    }
  };

  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    // Update state
    const updatedReviews = reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          creatorReply: replyText,
          creatorReplyDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
        };
      }
      return r;
    });
    setReviews(updatedReviews);

    // Update localStorage
    const saved = localStorage.getItem("artora_product_reviews");
    const currentList: Review[] = saved ? JSON.parse(saved) : [];
    
    // If the review is in localStorage, update it. If not, copy it to localStorage with the reply
    const exists = currentList.some(r => r.id === reviewId);
    let updatedList: Review[];
    if (exists) {
      updatedList = currentList.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            creatorReply: replyText,
            creatorReplyDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
          };
        }
        return r;
      });
    } else {
      const originalReview = reviews.find(r => r.id === reviewId);
      if (originalReview) {
        const reviewWithReply = {
          ...originalReview,
          creatorReply: replyText,
          creatorReplyDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
        };
        updatedList = [reviewWithReply, ...currentList];
      } else {
        updatedList = currentList;
      }
    }

    localStorage.setItem("artora_product_reviews", JSON.stringify(updatedList));

    // Reset reply fields
    setActiveReplyId(null);
    setReplyText("");
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : "5.0";

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Header Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-[#111111] text-[#C9A227] px-4 py-3 rounded-2xl text-center shadow-xs">
            <div className="font-serif text-2xl font-black">{averageRating}</div>
            <div className="text-[8px] font-mono uppercase tracking-widest text-white/50">Collector Rating</div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-4 h-4 fill-current ${
                    s <= Math.round(parseFloat(averageRating)) ? "text-amber-400" : "text-gray-200"
                  }`} 
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">Based on {reviews.length} authentic verifications</p>
          </div>
        </div>

        <button
          onClick={() => setIsWriteOpen(!isWriteOpen)}
          className="px-5 py-2.5 border border-gray-200 hover:border-gray-900 rounded-xl text-xs font-mono uppercase tracking-widest font-bold flex items-center space-x-2 transition"
        >
          <span>{isWriteOpen ? "Cancel Review" : "Write Review"}</span>
        </button>
      </div>

      {/* 2. Write Review Collapse Drawer */}
      <AnimatePresence>
        {isWriteOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 p-5 sm:p-6"
          >
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-gray-800">Submit Acquisition Review</h3>
              
              {/* Star Rating Select */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-400">Score Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-6 h-6 fill-current ${
                          s <= (hoveredStar || rating) ? "text-amber-400" : "text-gray-300"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your tactile impression, glaze details, packing quality..."
                  className="w-full text-xs font-sans p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] resize-none transition"
                />
              </div>

              {/* Image attachment URL */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Creation Image URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reviewImageUrl}
                    onChange={(e) => setReviewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or paste any custom picture link"
                    className="flex-1 text-xs font-sans p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                  />
                  <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111111] hover:bg-[#C9A227] text-white text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition"
                >
                  Submit Certified Review
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
            <MessageSquare className="w-10 h-10 text-[#C9A227]/40 mx-auto mb-2" />
            <h4 className="font-serif text-sm font-bold text-gray-900">No Reviews Yet</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">Be the first to record an official acquisition ledger for this masterpiece.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
              {/* Header and Stars */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <img 
                    src={rev.buyerAvatar} 
                    alt={rev.buyerName} 
                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1">
                      <span>{rev.buyerName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                    </h4>
                    <p className="text-[9px] text-gray-400 font-mono">{rev.date}</p>
                  </div>
                </div>

                <div className="flex space-x-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3.5 h-3.5 fill-current ${
                        s <= rev.rating ? "text-amber-400" : "text-gray-150"
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {rev.comment}
              </p>

              {/* Review image attachment */}
              {rev.imageUrl && (
                <div className="relative w-32 aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                  <img 
                    src={rev.imageUrl} 
                    alt="Collector photo" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}

              {/* Creator Reply Block */}
              {rev.creatorReply ? (
                <div className="bg-gray-50 rounded-xl p-4 ml-6 space-y-1.5 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-800 flex items-center space-x-1.5">
                      <CornerDownRight className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Studio Reply (Artisan Master)</span>
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono">{rev.creatorReplyDate}</span>
                  </div>
                  <p className="text-xs text-gray-500 italic font-light leading-relaxed">
                    "{rev.creatorReply}"
                  </p>
                </div>
              ) : (
                // If the user is the creator, allow them to reply
                isCreator && activeReplyId !== rev.id && (
                  <button
                    onClick={() => {
                      setActiveReplyId(rev.id);
                      setReplyText("");
                    }}
                    className="ml-6 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-mono uppercase tracking-wider text-gray-600 hover:border-gray-900 hover:text-gray-900 transition"
                  >
                    Reply to Review
                  </button>
                )
              )}

              {/* Inline Reply Form */}
              {isCreator && activeReplyId === rev.id && (
                <div className="bg-gray-50 rounded-xl p-4 ml-6 space-y-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-800 flex items-center space-x-1.5">
                      <CornerDownRight className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Writing reply as Artisan Master</span>
                    </span>
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Express gratitude, elaborate on materials used, or offer care instructions..."
                    className="w-full text-xs font-sans p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#C9A227] resize-none transition"
                  />

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1.5 bg-gray-200 rounded-lg text-[9px] font-mono uppercase tracking-wider text-gray-600 hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitReply(rev.id)}
                      className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#C9A227] text-white rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Submit Reply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

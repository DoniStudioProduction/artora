import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Trash2, ShoppingBag, Eye, Star } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface WishlistViewProps {
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  addToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onBackToHome: () => void;
}

export default function WishlistView({
  wishlist,
  onToggleWishlist,
  addToCart,
  onQuickView,
  onBackToHome
}: WishlistViewProps) {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Collect from standard and local custom storage
    const loadWishlist = () => {
      const savedCustom = localStorage.getItem("artora_custom_global_products");
      const customProds: Product[] = savedCustom ? JSON.parse(savedCustom) : [];
      const combined = [...customProds, ...PRODUCTS];

      const filtered = combined.filter(p => wishlist.includes(p.id));
      setWishlistProducts(filtered);
    };

    loadWishlist();
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-[#F8F8F6] pb-24 text-[#111111] text-left">
      
      {/* Premium Header */}
      <div className="bg-[#111111] text-[#F8F8F6] py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-3 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-mono font-bold block">Your Registry Vault</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight">Your Wishlist</h1>
          <p className="max-w-2xl text-xs md:text-sm text-white/60 font-light">Original handcrafted pieces saved for consideration. Ready to be added to your physical collection.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 p-8 max-w-xl mx-auto space-y-6">
            <Heart className="w-12 h-12 text-gray-200 mx-auto fill-current animate-pulse" />
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">Your future favorites belong here.</h3>
              <p className="text-xs text-gray-400 font-light mt-1">Explore the creator marketplace to curate and bookmark your favorite masterworks.</p>
            </div>
            
            <button
              onClick={onBackToHome}
              className="px-6 py-3 bg-[#111111] hover:bg-[#C9A227] hover:text-gray-900 text-white text-xs font-mono tracking-widest uppercase font-bold rounded-xl transition shadow-md cursor-pointer"
            >
              Explore Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map(p => (
              <motion.div
                key={p.id}
                layout
                onClick={() => onQuickView(p)}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-full"
              >
                <div className="relative aspect-[4/5] bg-[#F8F8F6] overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                  />
                  
                  {/* Category label */}
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[9px] text-[#111111] font-mono font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {p.category}
                  </span>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(p.id);
                    }}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-red-50 text-red-500 shadow-sm hover:scale-115 transition"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-sm font-medium text-gray-900 group-hover:text-[#C9A227] transition line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wide">By {p.artistName}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                      <span className="font-bold">{p.rating}</span>
                    </div>

                    <span className="font-serif text-sm font-bold text-gray-900">
                      ${p.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Direct Acquire */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="w-full mt-1 px-4 py-2.5 bg-[#111111] hover:bg-[#C9A227] text-white text-[10px] font-mono tracking-widest uppercase font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

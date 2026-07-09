import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Grid, List, SlidersHorizontal, ArrowUpDown, Eye, Heart, 
  ShoppingBag, Sparkles, Star, Award, Compass, Search
} from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface CreatorPortfolioProps {
  onQuickView: (product: Product) => void;
  addToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onViewCreatorShop: (creatorId: string) => void;
}

export default function CreatorPortfolio({
  onQuickView,
  addToCart,
  wishlist,
  onToggleWishlist,
  onViewCreatorShop
}: CreatorPortfolioProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate premium luxury skeleton loading transition
    setIsLoading(true);
    const timer = setTimeout(() => {
      const savedGlobal = localStorage.getItem("artora_custom_global_products");
      const customProds = savedGlobal ? JSON.parse(savedGlobal) : [];
      setProducts([...customProds, ...PRODUCTS]);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter and Sort logic
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0; // default order
  });

  // Verified Badges resolver based on Artist Name
  const getArtistBadge = (artistName: string) => {
    if (artistName === "Ami Tanaka") return { label: "Artora Elite", color: "bg-purple-50 text-purple-700 border-purple-200" };
    if (artistName === "Elena Rostova") return { label: "Featured Creator", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (artistName === "Siddharth Nair" || artistName === "Marcus Vance") return { label: "Verified Creator", color: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "New Creator", color: "bg-gray-50 text-gray-600 border-gray-200" };
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] font-sans pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      {/* 1. Header Hero Area */}
      <div className="max-w-7xl mx-auto text-center mb-16 space-y-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold bg-[#C9A227]/10 px-3 py-1 rounded-full">
          Guild Exhibition Portfolio
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-gray-900 tracking-tight max-w-2xl mx-auto">
          The Masterpiece Archives
        </h1>
        <p className="text-sm text-gray-500 font-light max-w-lg mx-auto">
          Explore raw materials sculpted into sensory heritage. Filter across custom workshops, browse premium studio designs, and acquire original creations.
        </p>
      </div>

      {/* 2. Advanced Filter & Sort Toolbar */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-12 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap border ${
                  selectedCategory === cat
                    ? "bg-[#111111] text-[#F8F8F6] border-[#111111] shadow-md shadow-[#111111]/10 font-bold"
                    : "bg-[#F8F8F6] text-gray-600 border-gray-200 hover:border-[#111111]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search portfolio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8F8F6] border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227] focus:border-transparent transition"
              />
            </div>

            {/* Sort Select */}
            <div className="relative w-full sm:w-auto flex items-center bg-[#F8F8F6] border border-gray-200 rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-4 h-4 text-gray-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-mono uppercase tracking-wider outline-none text-gray-700 cursor-pointer"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Collector Rating</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Masonry Layout Portfolio Grid */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          // Luxury Skeleton Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4 animate-pulse">
                <div className="bg-gray-100 rounded-2xl w-full h-80" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="h-4 bg-gray-100 rounded-full w-1/4" />
                  <div className="h-8 bg-gray-100 rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 max-w-xl mx-auto p-8 space-y-4">
            <Compass className="w-12 h-12 text-[#C9A227]/40 mx-auto animate-bounce" />
            <h3 className="font-serif text-lg font-bold text-gray-900">No Matching Creations</h3>
            <p className="text-xs text-gray-400 font-light">We couldn't find any masterpieces matching your filter criteria. Try expanding your search queries or selecting a different category.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setSortBy("default"); }}
              className="px-6 py-2.5 bg-[#111111] hover:bg-[#C9A227] text-[#F8F8F6] rounded-xl text-xs font-mono uppercase tracking-widest transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          // Premium Masonry / Columns Grid
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            <AnimatePresence>
              {sortedProducts.map((p) => {
                const isWishlisted = wishlist.includes(p.id);
                const badge = getArtistBadge(p.artistName);

                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="break-inside-avoid bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200/80 transition duration-300 flex flex-col justify-between mb-8 cursor-pointer group"
                    onClick={() => onQuickView(p)}
                  >
                    {/* Image Box */}
                    <div className="relative overflow-hidden bg-gray-50">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full object-cover group-hover:scale-[1.03] transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                      
                      {/* Action Overlays */}
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[9px] text-gray-800 font-mono font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-xs">
                        {p.category}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(p.id);
                        }}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-xs shadow-xs hover:scale-110 transition duration-200 text-gray-400 hover:text-red-500 z-10"
                      >
                        <Heart className={`w-4 h-4 fill-current ${isWishlisted ? "text-red-500" : "text-gray-400"}`} />
                      </button>
                    </div>

                    {/* Content details */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-sans font-light text-gray-400">By {p.artistName}</span>
                          <span className={`text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-medium text-gray-900 group-hover:text-[#C9A227] transition duration-200 line-clamp-2">
                          {p.title}
                        </h3>
                        
                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 font-mono">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                          <span className="text-gray-600 font-bold">{p.rating}</span>
                          <span>({p.reviewsCount} verified acquisitions)</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="font-serif text-base font-bold text-gray-900">
                          ${p.price.toLocaleString()}
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewCreatorShop(p.artistId);
                            }}
                            className="px-3.5 py-2 bg-gray-50 border border-gray-100 hover:border-[#111111] rounded-xl text-[10px] font-mono tracking-wider uppercase text-gray-700 transition"
                          >
                            Studio
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                            className="bg-[#111111] hover:bg-[#C9A227] text-white text-[10px] font-mono tracking-widest uppercase font-bold px-4 py-2 rounded-xl transition shadow-xs"
                          >
                            Acquire
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

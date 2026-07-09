import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Star, TrendingUp, Compass, Heart, ArrowUpRight, 
  MapPin, Award, Users, CheckCircle2, ChevronRight, ShoppingBag, Eye 
} from "lucide-react";
import { Product, Creator } from "../types";
import { PRODUCTS, CREATORS } from "../data";

interface DiscoverPageProps {
  onQuickView: (product: Product) => void;
  addToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onViewCreatorShop: (creatorId: string) => void;
  onSelectCategory: (category: string) => void;
}

export default function DiscoverPage({
  onQuickView,
  addToCart,
  wishlist,
  onToggleWishlist,
  onViewCreatorShop,
  onSelectCategory
}: DiscoverPageProps) {
  const [activeTab, setActiveTab] = useState<"trending" | "newest" | "featured">("trending");
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);
  const [creatorFollowerCounts, setCreatorFollowerCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Read following list from localStorage
    const saved = localStorage.getItem("artora_followed_creators");
    if (saved) {
      try {
        setFollowedCreators(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Initialize counts
    const counts: Record<string, number> = {};
    CREATORS.forEach(c => {
      counts[c.id] = c.followersCount;
    });
    setCreatorFollowerCounts(counts);
  }, []);

  const handleFollowToggle = (creatorId: string) => {
    let updated: string[];
    const isNowFollowing = !followedCreators.includes(creatorId);

    if (isNowFollowing) {
      updated = [...followedCreators, creatorId];
      setCreatorFollowerCounts(prev => ({
        ...prev,
        [creatorId]: (prev[creatorId] || 100) + 1
      }));
    } else {
      updated = followedCreators.filter(id => id !== creatorId);
      setCreatorFollowerCounts(prev => ({
        ...prev,
        [creatorId]: Math.max(0, (prev[creatorId] || 100) - 1)
      }));
    }

    setFollowedCreators(updated);
    localStorage.setItem("artora_followed_creators", JSON.stringify(updated));
  };

  // Curated collections
  const collections = [
    {
      id: "coll_1",
      title: "The Wabi-Sabi Sanctuary",
      tagline: "Imperfections hand-carved in Oregon clay and cedar.",
      count: 4,
      bgUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80",
      category: "Pottery"
    },
    {
      id: "coll_2",
      title: "Brutalist Structures",
      tagline: "Solid jewelers' brass and raw architectural metalwork.",
      count: 3,
      bgUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80",
      category: "Jewelry"
    },
    {
      id: "coll_3",
      title: "Oslo Fjord Light",
      tagline: "Evocative atmospheric paintings capturing Norwegian fog.",
      count: 5,
      bgUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
      category: "Paintings"
    }
  ];

  // Map products
  const trendingProducts = PRODUCTS.slice(0, 3);
  const newestProducts = PRODUCTS.slice(3, 6);
  const featuredProducts = [PRODUCTS[1], PRODUCTS[3], PRODUCTS[5]].filter(Boolean);

  const displayedProducts = 
    activeTab === "trending" ? trendingProducts :
    activeTab === "newest" ? newestProducts :
    featuredProducts;

  // Resolved Badges
  const getBadgeMeta = (creatorId: string) => {
    if (creatorId === "creator_ami_tanaka") return { label: "Artora Elite", color: "bg-purple-100 text-purple-700 border-purple-200" };
    if (creatorId === "creator_elena_rostova") return { label: "Featured Creator", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    if (creatorId === "creator_marcus_vance" || creatorId === "creator_siddharth_nair") return { label: "Verified Creator", color: "bg-amber-100 text-amber-700 border-amber-200" };
    return { label: "New Creator", color: "bg-gray-100 text-gray-600 border-gray-200" };
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] font-sans pb-24">
      {/* 1. Header Banner */}
      <div className="bg-[#111111] text-[#F8F8F6] py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden text-left">
        <div className="absolute inset-0 bg-radial-gradient from-[#C9A227]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
              Artora Discover Hub
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Unearth Rare Talent & <span className="font-serif italic text-[#C9A227]">Slow-Craft</span> Legacies
            </h1>
            <p className="text-xs md:text-sm text-gray-400 font-light max-w-lg">
              Peer through the kiln, feel the chisel grain, and connect with global masters. The community ledger guarantees direct studio support.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
              <div className="font-mono text-xl font-bold text-[#C9A227]">14+</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Guild Masters</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
              <div className="font-mono text-xl font-bold text-[#C9A227]">2.4K</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Collectors</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Categorization & Explorer Tab Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/50 pb-4 gap-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveTab("trending")}
              className={`pb-4 text-xs font-mono uppercase tracking-widest transition relative ${
                activeTab === "trending" ? "text-gray-900 font-bold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Trending Now
              {activeTab === "trending" && (
                <motion.div layoutId="discUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("newest")}
              className={`pb-4 text-xs font-mono uppercase tracking-widest transition relative ${
                activeTab === "newest" ? "text-gray-900 font-bold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Newest Arrivals
              {activeTab === "newest" && (
                <motion.div layoutId="discUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`pb-4 text-xs font-mono uppercase tracking-widest transition relative ${
                activeTab === "featured" ? "text-gray-900 font-bold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Featured Curator
              {activeTab === "featured" && (
                <motion.div layoutId="discUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]" />
              )}
            </button>
          </div>
          
          <div className="text-xs text-gray-400 font-light flex items-center space-x-1.5 bg-white py-1 px-3 rounded-lg border border-gray-100">
            <span className="w-2 h-2 bg-[#C9A227] rounded-full animate-ping" />
            <span>Updates hourly verified on chain</span>
          </div>
        </div>

        {/* Dynamic products list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((p) => {
              const isWishlisted = wishlist.includes(p.id);
              const badge = getBadgeMeta(p.artistId);
              return (
                <motion.div
                  key={`${activeTab}_${p.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onQuickView(p)}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between h-full cursor-pointer relative"
                >
                  <div className="relative aspect-square bg-[#F8F8F6] overflow-hidden">
                    <img 
                      src={p.imageUrl} 
                      alt={p.title} 
                      className="object-cover w-full h-full group-hover:scale-[1.03] transition duration-500"
                    />
                    
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[9px] text-gray-800 font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                      {p.category}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-xs shadow-xs hover:scale-110 transition text-gray-400 hover:text-red-500 z-10"
                    >
                      <Heart className={`w-4 h-4 fill-current ${isWishlisted ? "text-red-500" : "text-gray-400"}`} />
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[11px] text-gray-400 font-mono">
                        <span>By {p.artistName}</span>
                        <span className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h3 className="font-serif text-sm font-medium text-gray-900 group-hover:text-[#C9A227] transition line-clamp-1">
                        {p.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="font-serif text-sm font-bold text-gray-900">
                        ${p.price.toLocaleString()}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        className="bg-[#111111] group-hover:bg-[#C9A227] text-white text-[10px] font-mono tracking-widest uppercase font-bold px-4 py-2 rounded-xl transition shadow-xs"
                      >
                        Acquire Piece
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Popular Creators Directory Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-left">
        <div className="border-b border-gray-200/50 pb-4 mb-8">
          <h2 className="font-serif text-2xl font-light text-gray-900">Popular Creators</h2>
          <p className="text-xs text-gray-400 font-light mt-1">Interact with guild certified masters and trace their Slow-Craft journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CREATORS.map((c) => {
            const isFollowing = followedCreators.includes(c.id);
            const followers = creatorFollowerCounts[c.id] || c.followersCount;
            const badge = getBadgeMeta(c.id);

            return (
              <div 
                key={c.id} 
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between gap-6 hover:shadow-md transition duration-300"
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={c.avatarUrl} 
                    alt={c.name} 
                    onClick={() => onViewCreatorShop(c.id)}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#C9A227] cursor-pointer hover:opacity-90 transition"
                  />
                  <div className="space-y-1 text-left flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 
                        onClick={() => onViewCreatorShop(c.id)}
                        className="font-serif text-base font-bold text-gray-900 hover:text-[#C9A227] cursor-pointer transition"
                      >
                        {c.name}
                      </h3>
                      <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{c.specialty}</p>
                    <div className="flex items-center space-x-1.5 text-[11px] text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{c.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-2 italic">
                  "{c.bio}"
                </p>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div>
                      <span className="text-gray-900 font-bold block">{followers.toLocaleString()}</span>
                      <span className="text-gray-400 text-[9px] uppercase tracking-wider block">Followers</span>
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold block">42</span>
                      <span className="text-gray-400 text-[9px] uppercase tracking-wider block">Following</span>
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold block">{PRODUCTS.filter(p => p.artistId === c.id).length || 2}</span>
                      <span className="text-gray-400 text-[9px] uppercase tracking-wider block">Products</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewCreatorShop(c.id)}
                      className="px-3.5 py-2 bg-gray-50 hover:bg-[#111111] hover:text-white rounded-xl text-[10px] font-mono tracking-widest uppercase transition"
                    >
                      Studio
                    </button>
                    <button
                      onClick={() => handleFollowToggle(c.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold transition border ${
                        isFollowing 
                          ? "bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227]" 
                          : "bg-[#C9A227] border-transparent text-white"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Curated Collections Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-left">
        <div className="border-b border-gray-200/50 pb-4 mb-8">
          <h2 className="font-serif text-2xl font-light text-gray-900">Curated Collections</h2>
          <p className="text-xs text-gray-400 font-light mt-1">Immersive thematic aesthetics chosen by top design councils.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col) => (
            <div 
              key={col.id}
              onClick={() => onSelectCategory(col.category)}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition duration-500"
            >
              <img 
                src={col.bgUrl} 
                alt={col.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 space-y-2 text-left text-white">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
                  {col.count} Exquisite Works
                </span>
                <h3 className="font-serif text-lg font-light tracking-wide text-white group-hover:text-[#C9A227] transition">
                  {col.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-light line-clamp-2">
                  {col.tagline}
                </p>
                
                <div className="pt-2 flex items-center space-x-1 text-[10px] font-mono uppercase tracking-widest text-white/60 group-hover:text-white transition">
                  <span>Enter Collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recommended Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-left">
        <div className="border-b border-gray-200/50 pb-4 mb-8 flex justify-between items-end">
          <div>
            <h2 className="font-serif text-2xl font-light text-gray-900">Recommended for You</h2>
            <p className="text-xs text-gray-400 font-light mt-1">Sovereign works matched to premium tactile and aesthetic profiles.</p>
          </div>
          <span className="text-[10px] font-mono text-[#C9A227] tracking-widest uppercase font-bold">Personalized on chain</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS.slice(2, 4).map((p) => {
            const badge = getBadgeMeta(p.artistId);
            return (
              <div 
                key={`rec_${p.id}`}
                onClick={() => onQuickView(p)}
                className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-6 cursor-pointer hover:shadow-md transition duration-300"
              >
                <div className="sm:w-2/5 aspect-square bg-[#F8F8F6] rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={p.imageUrl} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#111111]/85 text-[#C9A227] text-[8px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {p.category}
                  </div>
                </div>
                <div className="sm:w-3/5 flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-gray-400">By {p.artistName}</span>
                      <span className={`text-[7px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-[#C9A227] transition line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-light line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-4">
                    <span className="font-serif text-sm font-bold text-gray-900">${p.price.toLocaleString()}</span>
                    <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest font-semibold flex items-center space-x-1">
                      <span>Acquire Piece</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Artora Originals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16 text-left">
        <div className="border-b border-gray-200/50 pb-4 mb-8">
          <h2 className="font-serif text-2xl font-light text-gray-900">Artora Originals</h2>
          <p className="text-xs text-gray-400 font-light mt-1">Exclusive custom commission series curated directly under the Artora Gold Seal.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.slice(0, 4).map((p) => {
            return (
              <div 
                key={`orig_${p.id}`}
                onClick={() => onQuickView(p)}
                className="group bg-[#111111] text-white rounded-3xl p-5 border border-white/5 shadow-xl flex flex-col justify-between h-full cursor-pointer hover:-translate-y-1 transition duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 mb-4">
                    <img 
                      src={p.secondaryImageUrl || p.imageUrl} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#C9A227] text-[#111111] text-[8px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1 shadow-md">
                      <Sparkles className="w-2.5 h-2.5 fill-current" />
                      <span>Original</span>
                    </div>
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-[#C9A227] font-mono">{p.category}</span>
                  <h3 className="font-serif text-sm font-light tracking-wide text-white group-hover:text-[#C9A227] transition line-clamp-1 mt-1 mb-2">
                    {p.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#C9A227]">${p.price.toLocaleString()}</span>
                  <div className="w-7 h-7 rounded-full bg-[#C9A227] text-[#111111] flex items-center justify-center group-hover:scale-110 transition">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

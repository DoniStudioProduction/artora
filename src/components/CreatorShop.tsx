import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, Heart, Share2, Mail, Users, Star, ShoppingBag, Eye, MapPin, CheckCircle2, 
  ArrowLeft, ArrowRight, MessageSquare, ChevronDown, Check, Compass, BookOpen, Fingerprint
} from "lucide-react";
import { Product, Creator } from "../types";
import { CREATORS, PRODUCTS } from "../data";
import CreatorJournal from "./CreatorJournal";
import CreativeDNA from "./CreativeDNA";

interface CreatorShopProps {
  creatorId: string;
  onBack: () => void;
  addToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export default function CreatorShop({
  creatorId,
  onBack,
  addToCart,
  onQuickView,
  wishlist,
  onToggleWishlist
}: CreatorShopProps) {
  
  // Custom created products and standard ones
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Community Experience tabs: "collection", "journal", "dna"
  const [currentTab, setCurrentTab] = useState<"collection" | "journal" | "dna">("collection");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Sorting & Collections Filtering states
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "price-asc" | "price-desc">("newest");
  const [selectedCollection, setSelectedCollection] = useState<string>("All");

  const getProductCollections = (p: Product): string[] => {
    if (!p) return [];
    const title = p.title.toLowerCase();
    const id = p.id;
    if (id.includes("nebula") || title.includes("vessel") || title.includes("bowl") || title.includes("ceramic")) {
      return ["Minimalism", "Summer Collection"];
    }
    if (id.includes("ethereal") || title.includes("echoes") || title.includes("canvas")) {
      return ["Luxury Decor", "Minimalism"];
    }
    if (id.includes("brutalist") || title.includes("ring") || title.includes("geometric")) {
      return ["Minimalism"];
    }
    if (id.includes("monolith") || title.includes("bench") || title.includes("chair")) {
      return ["Luxury Decor", "Minimalism"];
    }
    if (id.includes("heritage") || title.includes("board")) {
      return ["Summer Collection", "African Heritage"];
    }
    if (id.includes("tundra") || title.includes("mirage")) {
      return ["Luxury Decor", "African Heritage"];
    }
    if (id.includes("ancient") || title.includes("pendant") || title.includes("gold")) {
      return ["African Heritage", "Luxury Decor"];
    }
    // Fallback for custom added products
    if (p.category === "Painting" || p.category === "Paintings" || p.category === "Home Decor") {
      return ["Luxury Decor"];
    }
    if (p.category === "Jewelry" || p.category === "Pottery") {
      return ["Minimalism"];
    }
    return ["Summer Collection"];
  };

  useEffect(() => {
    // Load current logged-in user
    const savedUser = localStorage.getItem("artora_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    // Check if user is already following this creator in localStorage
    const savedFollows = localStorage.getItem("artora_followed_creators");
    if (savedFollows) {
      try {
        const list: string[] = JSON.parse(savedFollows);
        if (list.includes(creatorId)) {
          setIsFollowing(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [creatorId]);

  useEffect(() => {
    // Collect products from global storage and PRODUCTS list
    const loadData = () => {
      const savedGlobal = localStorage.getItem("artora_custom_global_products");
      const customProds: Product[] = savedGlobal ? JSON.parse(savedGlobal) : [];
      const combined = [...customProds, ...PRODUCTS];
      setAllProducts(combined);

      // Find creator
      const staticCreator = CREATORS.find(c => c.id === creatorId || c.id.toLowerCase() === creatorId.toLowerCase());
      const foundCreator = PRODUCTS.find(p => p.artistId === creatorId || p.artistId.toLowerCase().includes(creatorId.toLowerCase()));
      
      // Fallback or custom creator
      if (staticCreator) {
        setCreator(staticCreator);
        setFollowersCount(staticCreator.followersCount);
      } else if (foundCreator) {
        // Let's model a mock or search CREATORS list
        const detailedCreator = {
          id: foundCreator.artistId,
          name: foundCreator.artistName,
          specialty: foundCreator.category + " Crafting",
          avatarUrl: foundCreator.artistAvatar,
          bio: foundCreator.creatorStoryText || `${foundCreator.artistName} is a premiere Artora Guild member, specialising in elegant design inspired by the timeless beauty of natural materials and heritage techniques. Based in their custom design studio, they merge traditional handwork with sleek modern aesthetics.`,
          location: foundCreator.creatorCountry || "Oslo, Norway",
          followersCount: foundCreator.reviewsCount * 12 + 140,
          featuredWorks: [foundCreator.imageUrl]
        };
        setCreator(detailedCreator);
        setFollowersCount(detailedCreator.followersCount);
      } else {
        // Default creator
        const fallbackCreator: Creator = {
          id: creatorId,
          name: "Guild Artisan " + creatorId.split("_").pop(),
          specialty: "High craft designs",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
          bio: "Artora Guild certified master artisan. Dedicated to crafting heritage, bespoke works with rich sensory details.",
          location: "Oslo, Norway",
          followersCount: 280,
          featuredWorks: []
        };
        setCreator(fallbackCreator);
        setFollowersCount(fallbackCreator.followersCount);
      }
    };

    loadData();
  }, [creatorId]);

  const handleFollowClick = () => {
    const savedFollows = localStorage.getItem("artora_followed_creators");
    let list: string[] = savedFollows ? JSON.parse(savedFollows) : [];

    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
      list = list.filter(id => id !== creatorId);
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      if (!list.includes(creatorId)) {
        list.push(creatorId);
      }
    }
    localStorage.setItem("artora_followed_creators", JSON.stringify(list));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactSubject("");
      setContactMessage("");
      setIsContactOpen(false);
    }, 2000);
  };

  if (!creator) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]" />
      </div>
    );
  }

  // Filter products by this creator
  const creatorProducts = allProducts.filter(p => p.artistId === creator.id || p.artistName.toLowerCase() === creator.name.toLowerCase());

  // Dynamic rating calculation
  const averageRating = creatorProducts.length > 0 
    ? (creatorProducts.reduce((sum, p) => sum + p.rating, 0) / creatorProducts.length).toFixed(1)
    : "4.9";

  return (
    <div className="min-h-screen bg-[#F8F8F6] pb-24 text-[#111111]">
      
      {/* 1. Header Banner & Profile */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#111111]">
        {/* Luxury premium textured background banner */}
        <img 
          src={creatorProducts[0]?.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"}
          alt="Shop Banner"
          className="w-full h-full object-cover opacity-40 blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F8F6] to-transparent" />
        
        {/* Back to Marketplace button */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-xs font-mono tracking-widest uppercase shadow hover:bg-white hover:text-[#C9A227] flex items-center space-x-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </button>
      </div>

      {/* 2. Public profile card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          
          {/* Main Info */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Creator Avatar */}
            <div className="relative">
              <img 
                src={creator.avatarUrl} 
                alt={creator.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white shadow-lg bg-gray-50"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#C9A227] text-white p-1.5 rounded-xl border-2 border-white shadow">
                <Award className="w-4 h-4" />
              </div>
            </div>

            {/* Title / Badges / Stats */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="font-serif text-2xl md:text-3xl font-light text-gray-900 tracking-tight">
                  {creator.name}
                </h1>
                
                {/* Dynamic Verified/Level Badge */}
                {(() => {
                  const id = creator.id;
                  let label = "New Creator";
                  let color = "bg-gray-100 text-gray-600 border-gray-200/60";
                  if (id.includes("ami_tanaka")) {
                    label = "Elite Creator";
                    color = "bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/30";
                  } else if (id.includes("elena_rostova")) {
                    label = "Featured Creator";
                    color = "bg-purple-100 text-purple-700 border-purple-200";
                  } else if (id.includes("marcus_vance") || id.includes("siddharth_nair")) {
                    label = "Verified Creator";
                    color = "bg-emerald-100 text-emerald-700 border-emerald-200";
                  }
                  return (
                    <span className={`border px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${color}`}>
                      <CheckCircle2 className="w-3 h-3 fill-current" />
                      <span>{label}</span>
                    </span>
                  );
                })()}
              </div>

              <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{creator.specialty}</p>

              <div className="flex items-center justify-center md:justify-start space-x-2.5 text-xs text-gray-600">
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                <span className="font-light">{creator.location}</span>
              </div>

              {/* Bio block */}
              <p className="max-w-xl text-xs md:text-sm text-gray-600 leading-relaxed font-light">
                {creator.bio}
              </p>
            </div>
          </div>

          {/* Followers & Contact Buttons Panel */}
          <div className="flex flex-col items-center md:items-end justify-between self-stretch gap-6">
            
            {/* Stats Block - 5 columns for Followers, Following, Products, Sales, Rating */}
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-3 md:gap-4 text-center w-full md:min-w-[480px] bg-[#F8F8F6] p-4 rounded-2xl border border-gray-100">
              <div>
                <div className="text-sm font-bold text-gray-900 font-mono">{followersCount.toLocaleString()}</div>
                <div className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">Followers</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 font-mono">
                  {creator.id.includes("ami_tanaka") ? "142" : creator.id.includes("elena_rostova") ? "84" : "42"}
                </div>
                <div className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">Following</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 font-mono">{creatorProducts.length}</div>
                <div className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">Products</div>
              </div>
              <div>
                <div className="text-sm font-bold text-[#C9A227] font-mono">
                  {creator.id.includes("ami_tanaka") ? "1,240" : creator.id.includes("elena_rostova") ? "382" : "142"}
                </div>
                <div className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">Sales</div>
              </div>
              <div className="col-span-2 sm:col-span-1 md:col-span-1">
                <div className="text-sm font-bold text-[#C9A227] font-mono flex items-center justify-center gap-0.5">
                  <span>{averageRating}</span>
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">Rating</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setIsContactOpen(true)}
                className="flex-1 sm:flex-initial px-6 py-2.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-[11px] font-mono uppercase tracking-widest font-bold rounded-xl transition flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </button>
              
              <button
                onClick={handleFollowClick}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-[11px] font-mono uppercase tracking-widest font-bold transition ${
                  isFollowing 
                    ? "bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]" 
                    : "bg-[#C9A227] hover:bg-[#111111] text-white hover:text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow Creator"}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Contact Dialog Drawer Overlay */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 border border-gray-100 shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setIsContactOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <ArrowRight className="w-5 h-5 rotate-45" />
              </button>

              <div className="mb-4">
                <span className="text-[9px] uppercase tracking-widest text-[#C9A227] font-mono font-bold block mb-1">Direct Message</span>
                <h3 className="font-serif text-lg font-bold text-gray-900">Message {creator.name}</h3>
                <p className="text-xs text-gray-600 font-light">Custom order inquiries, bulk pricing, or unique dimensions.</p>
              </div>

              {contactSuccess ? (
                <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] p-4 rounded-xl flex items-center space-x-2 text-xs font-mono font-medium">
                  <Check className="w-4 h-4" />
                  <span>Inquiry safely submitted directly to the creator!</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600 font-mono uppercase tracking-wider block">Subject</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Custom Stoneware Inquiry" 
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#F8F8F6] border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600 font-mono uppercase tracking-wider block">Your Message</label>
                    <textarea 
                      placeholder="Detail your request..." 
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#F8F8F6] border border-gray-200 rounded-xl text-xs h-28 focus:outline-none focus:ring-1 focus:ring-[#C9A227] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#111111] hover:bg-[#C9A227] text-white text-[11px] font-mono tracking-widest uppercase font-bold rounded-xl transition"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tab Switcher Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-center border-b border-gray-200">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-none pb-px">
            {[
              { id: "collection", label: "Collection", icon: ShoppingBag },
              { id: "journal", label: "Studio Journal", icon: BookOpen },
              { id: "dna", label: "Creative DNA", icon: Fingerprint }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`py-4 px-2 sm:px-4 border-b-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                    isActive 
                      ? "border-[#C9A227] text-gray-900" 
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content Panels */}
      {currentTab === "collection" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-left">
          
          {/* Header & Stats bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/60 pb-4 mb-8 gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 tracking-tight">Studio Gallery</h2>
              <p className="text-xs text-gray-600 font-light">Explore hand-built creations filtered by curated themes and collections.</p>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 self-start md:self-auto bg-white border border-gray-150 px-3.5 py-2 rounded-xl shadow-xs">
              <span className="text-[10px] font-mono text-gray-600 uppercase">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-mono font-bold uppercase tracking-wider outline-none text-gray-800 cursor-pointer"
              >
                <option value="newest">Newest Creations</option>
                <option value="popular">Popularity & Stars</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Collection Filter row */}
          <div className="mb-8 space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-gray-600 block font-bold">Curated Collections</span>
            <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none">
              {["All", "Summer Collection", "African Heritage", "Minimalism", "Luxury Decor"].map((col) => {
                const count = col === "All" 
                  ? creatorProducts.length
                  : creatorProducts.filter(p => getProductCollections(p).includes(col)).length;
                return (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider border transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                      selectedCollection === col
                        ? "bg-[#111111] text-[#F8F8F6] border-[#111111] font-bold shadow-sm"
                        : "bg-white text-gray-500 border-gray-150 hover:border-gray-300"
                    }`}
                  >
                    <span>{col}</span>
                    {count > 0 && (
                      <span className={`text-[8px] font-bold rounded-full px-1.5 py-0.2 ${selectedCollection === col ? "bg-[#C9A227] text-white" : "bg-gray-100 text-gray-500"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Staggered Masonry List */}
          {(() => {
            const filteredAndSorted = creatorProducts
              .filter(p => selectedCollection === "All" || getProductCollections(p).includes(selectedCollection))
              .sort((a, b) => {
                if (sortBy === "price-asc") return a.price - b.price;
                if (sortBy === "price-desc") return b.price - a.price;
                if (sortBy === "popular") return b.reviewsCount - a.reviewsCount || b.rating - a.rating;
                return b.id.localeCompare(a.id);
              });

            if (filteredAndSorted.length === 0) {
              return (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
                  <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-xs text-gray-600 font-mono">No pieces match the chosen collection filter.</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {filteredAndSorted.map((p, index) => {
                  const isWishlisted = wishlist.includes(p.id);
                  // Staggered luxury lookbook heights
                  const aspectClass = index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-square" : "aspect-[3/4]";
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onQuickView(p)}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-full"
                    >
                      <div className={`relative ${aspectClass} bg-[#F8F8F6] overflow-hidden`}>
                        <img 
                          src={p.imageUrl} 
                          alt={p.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                        />
                        
                        {/* Category Label Overlay */}
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[9px] text-[#111111] font-mono font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm border border-gray-100">
                          {p.category}
                        </span>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(p.id);
                          }}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:scale-110 transition text-gray-500 hover:text-red-500"
                        >
                          <Heart className={`w-4 h-4 fill-current ${isWishlisted ? "text-red-500" : "text-gray-500"}`} />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4 text-left">
                        <div className="space-y-1.5">
                          <h3 className="font-serif text-sm font-medium text-gray-900 group-hover:text-[#C9A227] transition line-clamp-1">
                            {p.title}
                          </h3>
                          
                          <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 font-mono">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                            <span>{p.rating}</span>
                            <span className="text-gray-300">|</span>
                            <span>{p.reviewsCount} reviews</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <span className="font-serif text-sm font-bold text-gray-900">
                            {p.currency || "$"}{p.price.toLocaleString()}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                            className="bg-[#111111] group-hover:bg-[#C9A227] text-white text-[10px] font-mono tracking-widest uppercase font-bold px-3.5 py-2 rounded-lg transition"
                          >
                            Acquire Piece
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {currentTab === "journal" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-left">
          <CreatorJournal 
            creatorId={creator.id}
            creatorName={creator.name}
            creatorAvatar={creator.avatarUrl}
            isOwnProfile={
              currentUser && 
              (currentUser.isCreator || currentUser.role === "creator" || currentUser.role === "both") && 
              (currentUser.name.toLowerCase() === creator.name.toLowerCase() || creator.id.includes(currentUser.name.toLowerCase().replace(/\s+/g, "_")))
            }
          />
        </div>
      )}

      {currentTab === "dna" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-left">
          <CreativeDNA 
            creatorId={creator.id}
            creatorName={creator.name}
          />
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, SlidersHorizontal, Grid, List, Heart, Star, ShoppingBag, 
  X, Filter, RotateCcw, MapPin, Sparkles, HelpCircle 
} from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface MarketplaceProps {
  addToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  initialCategory?: string;
  onNavigateToCreatorShop: (creatorId: string) => void;
}

export default function Marketplace({
  addToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
  initialCategory = "All",
  onNavigateToCreatorShop
}: MarketplaceProps) {
  
  // Products source
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  // Loading Simulation
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCreator, setSearchCreator] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchMaterial, setSearchMaterial] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(3000);

  // Layout View State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Initial mount load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // When category changes, trigger loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Sync custom products from localStorage
  useEffect(() => {
    const loadMarketplace = () => {
      const savedCustom = localStorage.getItem("artora_custom_global_products");
      const customProds: Product[] = savedCustom ? JSON.parse(savedCustom) : [];
      
      // Ensure default products have some country metadata for the search if needed
      const normalizedDefaults = PRODUCTS.map(p => ({
        ...p,
        creatorCountry: p.id === "prod_nebula_ceramic" ? "United States" : 
                        p.id === "prod_ethereal_echoes" ? "Norway" :
                        p.id === "prod_brutalist_brass" ? "United Kingdom" : "Sweden",
        views: p.views || Math.floor(Math.random() * 150) + 20
      }));

      setAllProducts([...customProds, ...normalizedDefaults]);
    };

    loadMarketplace();
    // Refresh periodically if there are background updates
    const interval = setInterval(loadMarketplace, 2000);
    return () => clearInterval(interval);
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setSearchProduct("");
    setSearchCreator("");
    setSelectedCategory("All");
    setSearchMaterial("");
    setSearchCountry("");
    setMaxPrice(3000);
  };

  // Filter Logic
  const filteredProducts = allProducts.filter(p => {
    // 1. Product Name filter
    if (searchProduct.trim() !== "" && !p.title.toLowerCase().includes(searchProduct.toLowerCase())) {
      return false;
    }
    // 2. Creator filter
    if (searchCreator.trim() !== "" && !p.artistName.toLowerCase().includes(searchCreator.toLowerCase())) {
      return false;
    }
    // 3. Category filter
    if (selectedCategory !== "All" && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // 4. Material filter
    if (searchMaterial.trim() !== "") {
      const matQuery = searchMaterial.toLowerCase();
      const hasMaterial = p.materials.some(m => m.toLowerCase().includes(matQuery));
      if (!hasMaterial) return false;
    }
    // 5. Country filter
    if (searchCountry.trim() !== "") {
      const countryQuery = searchCountry.toLowerCase();
      const creatorCountry = (p.creatorCountry || "Norway").toLowerCase();
      if (!creatorCountry.includes(countryQuery)) return false;
    }
    // 6. Price filter
    if (p.price > maxPrice) {
      return false;
    }

    return true;
  });

  const categories = [
    "All", "Painting", "Craft", "Jewelry", "Pottery", "Woodwork", "Fashion", "Sculpture", "Home Decor", "Digital Art"
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] pb-24 text-[#111111] text-left">
      
      {/* Premium Hero Banner */}
      <div className="bg-[#111111] text-[#F8F8F6] py-12 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-3 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-mono font-bold block">Artora Registry</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight">The Creator Marketplace</h1>
          <p className="max-w-2xl text-xs md:text-sm text-white/60 font-light">Acquire bespoke originals directly from audited independent master craftsmen globally.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Advanced Multi-Field Search Panel */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C9A227]" />
              <h3 className="font-serif text-sm font-bold text-gray-900">Search Registry</h3>
            </div>
            
            <button
              onClick={resetFilters}
              className="text-xs text-[#C9A227] hover:text-black font-mono uppercase tracking-wider flex items-center space-x-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search by Product */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-600 block">Product Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Nebula, Echoes..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227] transition"
                />
                <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-500" />
              </div>
            </div>

            {/* Search by Creator */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-600 block">Creator / Artist</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ami Tanaka, Elena..."
                  value={searchCreator}
                  onChange={(e) => setSearchCreator(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227] transition"
                />
                <Sparkles className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-500" />
              </div>
            </div>

            {/* Search by Material */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-600 block">Material</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ash, Brass, Wood..."
                  value={searchMaterial}
                  onChange={(e) => setSearchMaterial(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227] transition"
                />
                <Filter className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-500" />
              </div>
            </div>

            {/* Search by Country */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-600 block">Country of Origin</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Norway, United States..."
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227] transition"
                />
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-500" />
              </div>
            </div>

          </div>

          {/* Pricing slider & Category filtering line */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-gray-50">
            {/* Category horizontal scroller */}
            <div className="flex items-center space-x-2 overflow-x-auto py-1.5 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition flex-shrink-0 border ${
                    selectedCategory === cat 
                      ? "bg-[#111111] border-[#111111] text-white font-bold" 
                      : "bg-[#F8F8F6] border-gray-200/50 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Max Price Range Filter */}
            <div className="w-full md:w-72 space-y-1">
              <div className="flex justify-between text-[10px] font-mono uppercase text-gray-500">
                <span>Max Price Limit</span>
                <span className="text-gray-900 font-bold">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#C9A227]"
              />
            </div>
          </div>
        </div>

        {/* Catalog Section */}
        <div className="mt-10 space-y-6">
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-mono">
              Displaying <span className="text-gray-900 font-bold">{filteredProducts.length}</span> unique creations found
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-4 space-y-4 shadow-xs animate-pulse text-left">
                  {/* Media placeholder */}
                  <div className="aspect-[4/5] bg-neutral-100 rounded-2xl w-full" />
                  
                  {/* Category & Badge */}
                  <div className="flex justify-between items-center">
                    <div className="h-3.5 bg-neutral-100 rounded-sm w-1/4" />
                    <div className="h-5 bg-neutral-100 rounded-full w-12" />
                  </div>

                  {/* Title & Creator */}
                  <div className="space-y-2 pt-2">
                    <div className="h-4.5 bg-neutral-100 rounded-sm w-3/4" />
                    <div className="h-3.5 bg-neutral-100 rounded-sm w-1/2" />
                  </div>

                  {/* Footer (Price & Button) */}
                  <div className="flex justify-between items-center pt-4 border-t border-neutral-50">
                    <div className="h-4 bg-neutral-100 rounded-sm w-1/5" />
                    <div className="h-8 bg-neutral-100 rounded-lg w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
              <RotateCcw className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-serif text-base font-bold text-gray-900">No matching creations found</h3>
              <p className="text-xs text-gray-600 font-light mt-1">Try resetting the filters or broadening your search terms.</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-5 py-2.5 bg-[#111111] hover:bg-[#C9A227] text-white text-[11px] font-mono tracking-widest uppercase font-bold rounded-xl transition"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(p => {
                const isWishlisted = wishlist.includes(p.id);
                return (
                  <motion.div
                    key={p.id}
                    layout
                    onClick={() => onQuickView(p)}
                    className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-full"
                  >
                    
                    {/* Media container */}
                    <div className="relative aspect-[4/5] bg-[#F8F8F6] overflow-hidden">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                      />
                      
                      {/* Left: Category badge */}
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[9px] text-[#111111] font-mono font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        {p.category}
                      </span>

                      {/* Right: Heart (Wishlist) button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(p.id);
                        }}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-xs shadow-sm hover:scale-110 transition text-gray-400"
                      >
                        <Heart className={`w-4 h-4 fill-current ${isWishlisted ? "text-red-500" : "text-gray-300"}`} />
                      </button>

                      {/* Origin flag overlay */}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[8px] font-mono tracking-wider uppercase flex items-center space-x-1">
                        <MapPin className="w-2.5 h-2.5 text-[#C9A227]" />
                        <span>{p.creatorCountry || "Norway"}</span>
                      </div>
                    </div>

                    {/* Meta section */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-serif text-sm font-medium text-gray-900 group-hover:text-[#C9A227] transition line-clamp-1">
                          {p.title}
                        </h3>
                        
                        {/* Clickable creator name */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToCreatorShop(p.artistId);
                          }}
                          className="text-[10px] text-gray-600 hover:text-[#C9A227] hover:underline flex items-center gap-1 font-mono tracking-wide"
                        >
                          <span>By {p.artistName}</span>
                          <span className="w-1 h-1 bg-[#C9A227] rounded-full" />
                          <span>View Shop</span>
                        </div>
                      </div>

                      {/* Rating + Price Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                          <span className="font-bold">{p.rating}</span>
                        </div>

                        <div className="flex items-baseline space-x-1.5">
                          <span className="font-serif text-sm font-bold text-gray-900">
                            {p.currency || "$"}{p.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart drawer confirmation */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        className="w-full mt-1.5 py-2.5 bg-[#111111] hover:bg-[#C9A227] text-white text-[10px] font-mono tracking-widest uppercase font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Acquire Masterwork</span>
                      </button>

                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

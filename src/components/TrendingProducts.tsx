import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, Eye, Star, Heart, Sparkles, ShieldCheck, ArrowRight, Award, Compass, HeartHandshake, CheckCircle2 
} from "lucide-react";
import { Product, Creator } from "../types";
import { PRODUCTS, CREATORS } from "../data";
import ProductDetails from "./ProductDetails";

interface TrendingProductsProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  addToCart: (product: Product) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
}

export default function TrendingProducts({
  selectedCategory,
  setSelectedCategory,
  addToCart,
  quickViewProduct,
  setQuickViewProduct
}: TrendingProductsProps) {
  
  // Local active product state to display the ProductDetails modal
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Synchronize modal state with the parent prop
  useEffect(() => {
    if (quickViewProduct) {
      setActiveModalProduct(quickViewProduct);
    }
  }, [quickViewProduct]);

  const handleCloseModal = () => {
    setActiveModalProduct(null);
    setQuickViewProduct(null);
  };

  // Hovered product states (for image swap)
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  
  // Local custom products merging
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  useEffect(() => {
    const loadCustom = () => {
      const saved = localStorage.getItem("artora_custom_global_products");
      if (saved) {
        try {
          setCustomProducts(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadCustom();
    const interval = setInterval(loadCustom, 2000);
    return () => clearInterval(interval);
  }, []);

  const allProducts = [...customProducts, ...PRODUCTS];

  // Saved/favorites state sync
  const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("artora_wishlist");
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleToggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    localStorage.setItem("artora_wishlist", JSON.stringify(updated));
  };

  // 1. Filtered Artworks (Paintings, Digital Art, Photography, Calligraphy, Illustration)
  const artworks = allProducts.filter(p => 
    ["paintings", "digital art", "photography", "calligraphy", "illustration", "mixed media"].includes(p.category.toLowerCase())
  );

  // 2. Featured Crafts (Pottery, Woodwork, Leather, Jewelry, Fashion, Home Decor, Traditional African Crafts, Textiles, Glass Art, Metal Art, Luxury Handmade)
  const crafts = allProducts.filter(p => 
    ["pottery", "woodwork", "leather", "jewelry", "fashion", "home decor", "traditional african crafts", "textiles", "glass art", "metal art", "luxury handmade"].includes(p.category.toLowerCase())
  );

  // 3. Trending Artists (Creators focused on visual/fine arts)
  const trendingArtists = CREATORS.filter(c => 
    c.specialty.toLowerCase().includes("paint") || c.specialty.toLowerCase().includes("art") || c.id === "creator_elena_rostova"
  );

  // 4. Trending Craftsmen (Creators focused on materials/tactile crafts)
  const trendingCraftsmen = CREATORS.filter(c => 
    !trendingArtists.some(ta => ta.id === c.id)
  );

  // 5. Newly Added Products (Slice of most recent)
  const newlyAdded = allProducts.slice(-4).reverse();

  // 6. Editor's Choice (Vetted premier items)
  const editorsChoice = allProducts.filter(p => p.rating === 5.0 || p.price > 500).slice(0, 4);

  // 7. Recommended For You (Highly-rated, balanced selections)
  const recommendedProducts = allProducts.filter(p => p.rating >= 4.8).slice(0, 4);

  // 8. Limited Edition Collection (1-of-1 pieces)
  const limitedEdition = allProducts.filter(p => p.inStock === 1).slice(0, 4);

  const handleAddToCartWithConfirmation = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(prod);
  };

  // Shared elegant card component helper
  const renderProductCard = (prod: Product) => {
    const isSaved = wishlist.includes(prod.id);
    const isHovered = hoveredProductId === prod.id;

    return (
      <motion.div
        layoutId={`prod-card-${prod.id}`}
        key={prod.id}
        onClick={() => {
          setActiveModalProduct(prod);
          setQuickViewProduct(prod);
        }}
        onMouseEnter={() => setHoveredProductId(prod.id)}
        onMouseLeave={() => setHoveredProductId(null)}
        className="group cursor-pointer flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-[#111111]/5 hover:shadow-xl transition-all duration-500"
      >
        {/* Frame image panel */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F8F6]">
          {/* Main Image */}
          <img
            src={prod.imageUrl}
            alt={prod.title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102 ${
              isHovered && prod.secondaryImageUrl ? "opacity-0" : "opacity-100"
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Secondary Detail Image Crossfade */}
          {prod.secondaryImageUrl && (
            <img
              src={prod.secondaryImageUrl}
              alt={`${prod.title} detail`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-102" : "opacity-0"
              }`}
              referrerPolicy="no-referrer"
            />
          )}

          {/* Stock Tag Overlay */}
          {prod.inStock === 1 && (
            <span className="absolute top-4 left-4 bg-[#111111] text-[#C9A227] font-mono text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
              Unique Masterpiece
            </span>
          )}

          {/* Favorites Heart Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist(prod.id);
            }}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-xs transition duration-300"
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Quick Controls Hover Panel */}
          <div className="absolute inset-0 bg-[#111111]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveModalProduct(prod);
                setQuickViewProduct(prod);
              }}
              className="p-3 bg-white hover:bg-[#C9A227] text-gray-800 hover:text-white rounded-xl shadow-md hover:scale-105 transition-all duration-300"
              title="Acquisition Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => handleAddToCartWithConfirmation(prod, e)}
              className="p-3 bg-[#111111] hover:bg-[#C9A227] text-white rounded-xl shadow-md hover:scale-105 transition-all duration-300"
              title="Add to Collection Bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Details panel */}
        <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
              {prod.category}
            </span>
            <div className="flex items-center space-x-1 font-mono text-[10px] text-gray-500">
              <Star className="w-3 h-3 fill-[#C9A227] text-[#C9A227]" />
              <span className="font-bold text-gray-800">{prod.rating}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-base font-normal text-gray-900 group-hover:text-[#C9A227] transition-colors leading-snug line-clamp-1">
              {prod.title}
            </h3>
            <div className="flex items-center space-x-1.5">
              <img 
                src={prod.artistAvatar} 
                alt={prod.artistName} 
                className="w-4 h-4 rounded-full object-cover border border-[#C9A227]/30" 
                referrerPolicy="no-referrer"
              />
              <p className="text-[11px] text-gray-500">
                {prod.artistName}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
            <p className="font-mono text-sm font-bold text-gray-900">
              ${prod.price.toLocaleString()}
            </p>
            <span className="text-[10px] font-sans text-gray-400 group-hover:text-[#C9A227] transition flex items-center gap-1 uppercase font-bold tracking-wider">
              <span>View Piece</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="trending-marketplace" className="bg-white">
      
      {/* SECTION 1: Curated Featured Artworks */}
      <div className="py-20 border-t border-[#111111]/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="text-left space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold block">Vetted Masterworks</span>
            <h2 className="font-serif text-3xl font-light text-gray-900 tracking-tight">Featured Artworks Collection</h2>
          </div>
          <p className="mt-3 md:mt-0 font-sans text-xs text-gray-500 max-w-xs text-left leading-relaxed">
            Exquisite high-contrast acrylics, digital canvases, and fine prints signed by certified gallery painters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artworks.slice(0, 4).map(prod => renderProductCard(prod))}
        </div>
      </div>

      {/* SECTION 2: Curated Featured Crafts */}
      <div className="py-20 bg-[#F8F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div className="text-left space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold block">Physical Legacies</span>
              <h2 className="font-serif text-3xl font-light text-gray-900 tracking-tight">Featured Craft Collections</h2>
            </div>
            <p className="mt-3 md:mt-0 font-sans text-xs text-gray-500 max-w-xs text-left leading-relaxed">
              Tactile hand-thrown pottery, heritage jointed woodcraft, sand-cast sterling jewelry, and organic silks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {crafts.slice(0, 4).map(prod => renderProductCard(prod))}
          </div>
        </div>
      </div>

      {/* SECTION 3 & 4: Trending Artists & Craftsmen Profiles */}
      <div className="py-20 border-t border-b border-[#111111]/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Trending Artists Column */}
          <div className="space-y-8">
            <div className="text-left space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">Brush &amp; Canvas Masters</span>
              <h3 className="font-serif text-2xl font-light text-gray-900">Trending Artists</h3>
            </div>

            <div className="space-y-6">
              {trendingArtists.map(artist => (
                <div key={artist.id} className="bg-[#F8F8F6] rounded-2xl p-5 border border-black/5 flex items-start gap-4 text-left">
                  <img src={artist.avatarUrl} alt={artist.name} className="w-12 h-12 rounded-full object-cover border border-[#C9A227] flex-shrink-0" referrerPolicy="no-referrer" />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif text-base font-medium text-gray-900">{artist.name}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]/10" />
                    </div>
                    <p className="font-mono text-[9px] uppercase text-[#C9A227] font-bold">{artist.specialty}</p>
                    <p className="text-xs text-gray-500 font-light line-clamp-2 leading-relaxed">{artist.bio}</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-gray-400">Norway / International Guild</span>
                      <span className="text-[#C9A227] font-bold">{artist.followersCount} Collectors</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Craftsmen Column */}
          <div className="space-y-8">
            <div className="text-left space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">Earth, Timber &amp; Forge Forge</span>
              <h3 className="font-serif text-2xl font-light text-gray-900">Trending Craftsmen</h3>
            </div>

            <div className="space-y-6">
              {trendingCraftsmen.map(craftsman => (
                <div key={craftsman.id} className="bg-[#F8F8F6] rounded-2xl p-5 border border-black/5 flex items-start gap-4 text-left">
                  <img src={craftsman.avatarUrl} alt={craftsman.name} className="w-12 h-12 rounded-full object-cover border border-[#C9A227] flex-shrink-0" referrerPolicy="no-referrer" />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif text-base font-medium text-gray-900">{craftsman.name}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]/10" />
                    </div>
                    <p className="font-mono text-[9px] uppercase text-[#C9A227] font-bold">{craftsman.specialty}</p>
                    <p className="text-xs text-gray-500 font-light line-clamp-2 leading-relaxed">{craftsman.bio}</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-gray-400">{craftsman.location}</span>
                      <span className="text-[#C9A227] font-bold">{craftsman.followersCount} Collectors</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 5: Newly Added Products */}
      <div className="py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div className="text-left space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold block">Hot Off the Kiln / Easel</span>
              <h2 className="font-serif text-3xl font-light text-gray-900 tracking-tight">Newly Added Originals</h2>
            </div>
            <p className="mt-3 md:mt-0 font-sans text-xs text-gray-500 max-w-xs text-left leading-relaxed">
              Be the first to acquire newly listed masterpieces fresh from global physical studios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newlyAdded.slice(0, 4).map(prod => renderProductCard(prod))}
          </div>
        </div>
      </div>

      {/* SECTION 6: Editor's Choice */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="text-left space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold block">Curated Elite Selections</span>
            <h2 className="font-serif text-3xl font-light text-gray-900 tracking-tight">Editor's Choice</h2>
          </div>
          <p className="mt-3 md:mt-0 font-sans text-xs text-gray-500 max-w-xs text-left leading-relaxed">
            The pinnacle of craftsmanship. Handpicked physical selections honoring flawless aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {editorsChoice.slice(0, 4).map(prod => renderProductCard(prod))}
        </div>
      </div>

      {/* SECTION 7: Recommended For You */}
      <div className="py-20 bg-[#F8F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div className="text-left space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold block">Guaranteed Authentic Character</span>
              <h2 className="font-serif text-3xl font-light text-gray-900 tracking-tight">Recommended For You</h2>
            </div>
            <p className="mt-3 md:mt-0 font-sans text-xs text-gray-500 max-w-xs text-left leading-relaxed">
              Tailored high-rating items matching fine geometric architecture and raw, warm tones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.slice(0, 4).map(prod => renderProductCard(prod))}
          </div>
        </div>
      </div>

      {/* SECTION 8: Limited Edition Collection */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="text-left space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold block">Unique Physical Realities</span>
            <h2 className="font-serif text-3xl font-light text-gray-900 tracking-tight">Limited Edition 1-of-1 Collection</h2>
          </div>
          <p className="mt-3 md:mt-0 font-sans text-xs text-gray-500 max-w-xs text-left leading-relaxed">
            Irreplicable objects. These original physical creations will never have a reproduction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {limitedEdition.slice(0, 4).map(prod => renderProductCard(prod))}
        </div>
      </div>

      {/* RENDER THE UNIFIED WORLD-CLASS DETAIL OVERLAY */}
      <AnimatePresence>
        {activeModalProduct && (
          <ProductDetails
            product={activeModalProduct}
            onClose={handleCloseModal}
            addToCart={addToCart}
            onBuyNow={(p) => {
              addToCart(p);
              // Handle opening bag drawer/checkout
            }}
            onViewCreatorShop={(creatorId) => {
              handleCloseModal();
              // Navigate to creator shop natively
              const event = new CustomEvent("artora_navigate_creator", { detail: creatorId });
              window.dispatchEvent(event);
            }}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </AnimatePresence>

    </section>
  );
}

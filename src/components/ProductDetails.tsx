import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  X, ShoppingBag, Heart, Star, ShieldCheck, Truck, MessageSquare, 
  UserPlus, Check, ChevronLeft, ChevronRight, Play, Compass, Award, Share2 
} from "lucide-react";
import { Product, Creator } from "../types";
import { PRODUCTS } from "../data";
import ProductReviews from "./ProductReviews";

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  addToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewCreatorShop: (creatorId: string) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export default function ProductDetails({
  product: initialProduct,
  onClose,
  addToCart,
  onBuyNow,
  onViewCreatorShop,
  wishlist,
  onToggleWishlist
}: ProductDetailsProps) {
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    setProduct(initialProduct);
    setActiveImageIndex(0);
  }, [initialProduct]);

  const isWishlisted = wishlist.includes(product.id);

  // Read current user state
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("artora_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Simulated images array (fallback to standard images if not provided)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [
        product.imageUrl,
        product.secondaryImageUrl || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1576016770956-debb63d900ef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
      ].filter(Boolean);

  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const minDelivery = new Date();
    minDelivery.setDate(today.getDate() + 5);
    const maxDelivery = new Date();
    maxDelivery.setDate(today.getDate() + 8);
    
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${minDelivery.toLocaleDateString("en-US", options)} – ${maxDelivery.toLocaleDateString("en-US", options)}`;
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "materials" | "reviews" | "story">("description");
  const [quantity, setQuantity] = useState(1);
  const [isFollowed, setIsFollowed] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    setShareCopied(true);
    try {
      navigator.clipboard?.writeText(`${window.location.origin}/product/${product.id}`);
    } catch (e) {
      console.warn("Clipboard access failed", e);
    }
    setTimeout(() => {
      setShareCopied(false);
    }, 2000);
  };

  // Simulated premium reviews
  const mockReviews = [
    { id: 1, author: "Amara Sinclair", rating: 5, date: "June 24, 2026", text: "Absolute masterpiece. The tactile weight and natural variations of the glaze under morning light are extraordinary. Artora truly curates the best artisans." },
    { id: 2, author: "Garrison Thorne", rating: 5, date: "May 18, 2026", text: "Impeccable packing and prompt delivery. This piece adds an atmosphere of raw, elegant luxury to my penthouse. Exceptional quality." }
  ];

  // Creator Story simulation
  const defaultStory = product.creatorStoryText || `This delicate piece is a testament to the patient craft of natural materials. Every line, curve, and texture was guided by hand in the artisan's studio, honoring decades-old craft traditions while embracing modern minimal elegance. It requires days of kiln firing, curing, or sculpting before reaching its final exquisite form.`;

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText("");
      setIsMessagingOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/85 backdrop-blur-sm flex items-center justify-center p-4">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh]"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-white/90 text-gray-800 hover:text-[#C9A227] hover:bg-white shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images Gallery */}
        <div className="w-full md:w-1/2 bg-[#F8F8F6] p-6 md:p-8 flex flex-col justify-between border-r border-gray-100 overflow-y-auto">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center group">
            <img 
              src={productImages[activeImageIndex]} 
              alt={product.title}
              className="object-cover w-full h-full max-h-[420px] transition-transform duration-500 ease-out hover:scale-125 cursor-zoom-in"
            />
            {/* Hover to zoom subtle indicator */}
            <span className="absolute top-4 left-4 bg-[#111111]/60 backdrop-blur-xs text-[7px] text-white font-mono uppercase tracking-widest px-2 py-1 rounded select-none opacity-0 group-hover:opacity-100 transition-opacity">
              Hover to Zoom
            </span>
            
            {/* Navigation arrows for images */}
            {productImages.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
                  className="absolute left-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                  className="absolute right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Video overlay button if a video is included */}
            {product.videoUrl && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase flex items-center space-x-1.5 cursor-pointer hover:bg-black transition">
                <Play className="w-3 h-3 fill-current" />
                <span>Play Craft Video</span>
              </div>
            )}
          </div>

          {/* Thumbnails list */}
          <div className="flex items-center space-x-3 mt-4 overflow-x-auto py-1">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden bg-white border-2 flex-shrink-0 transition-all ${
                  activeImageIndex === idx ? "border-[#C9A227] scale-105" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>

          {/* Luxury details info block */}
          <div className="mt-6 border-t border-gray-200/50 pt-5 space-y-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span className="font-mono uppercase tracking-wider text-[10px]">Artora Guild Verified Original</span>
            </div>
            <div className="flex items-start space-x-2 text-xs text-gray-500">
              <Truck className="w-4 h-4 text-[#C9A227] mt-0.5" />
              <div>
                <span className="font-mono uppercase tracking-wider text-[10px] block">
                  {product.processingTime || "Ships securely in 3–5 working days"}
                </span>
                <span className="text-[10px] text-gray-600 font-sans block mt-0.5">
                  Est. Delivery: <strong className="text-gray-700 font-medium">{getEstimatedDeliveryDate()}</strong> (Secure Courier)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Controls */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-6">
            
            {/* Breadcrumb / Category & Actions */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A227] font-mono font-bold">
                {product.category}
              </span>
              
              <div className="flex items-center space-x-2 relative">
                {shareCopied && (
                  <span className="absolute -top-10 right-0 bg-[#111111] text-[#C9A227] text-[8px] font-mono uppercase tracking-widest px-2.5 py-1 rounded shadow-md z-20 whitespace-nowrap">
                    Link Copied!
                  </span>
                )}

                {/* Share Button */}
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full border border-gray-100 bg-white text-gray-600 hover:text-[#C9A227] hover:bg-gray-50 transition shadow-xs hover:scale-105"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              
                {/* Wishlist Heart */}
                <button 
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-2 rounded-full border border-gray-100 transition shadow-sm hover:scale-105 ${
                    isWishlisted ? "bg-red-50 border-red-100 text-red-500" : "bg-white text-gray-600 hover:text-red-500"
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* Title & Price */}
            <div className="space-y-2 text-left">
              <h1 className="font-serif text-2xl md:text-3xl font-light text-gray-900 tracking-tight leading-tight">
                {product.title}
              </h1>
              <div className="flex items-baseline space-x-3">
                <span className="font-serif text-2xl font-medium text-gray-900">
                  {product.currency || "$"}{product.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-600 font-mono tracking-wider uppercase">
                  {product.inStock > 0 ? "Only 1 in stock (Original)" : "Sold Out"}
                </span>
              </div>
            </div>

            {/* Creator Card */}
            <div className="bg-[#F8F8F6] p-4 rounded-2xl flex items-center justify-between text-left border border-[#111111]/5">
              <div className="flex items-center space-x-3">
                <img 
                  src={product.artistAvatar} 
                  alt={product.artistName} 
                  className="w-10 h-10 rounded-full object-cover border border-[#C9A227]"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-serif text-sm font-medium text-gray-900">{product.artistName}</h4>
                    {(() => {
                      const badge = product.artistId === "creator_ami_tanaka" ? { label: "Elite", color: "bg-purple-100 text-purple-700 border-purple-200" } :
                                    product.artistId === "creator_elena_rostova" ? { label: "Featured", color: "bg-emerald-100 text-emerald-700 border-emerald-200" } :
                                    product.artistId === "creator_siddharth_nair" || product.artistId === "creator_marcus_vance" ? { label: "Verified", color: "bg-amber-100 text-amber-700 border-amber-200" } :
                                    { label: "New", color: "bg-gray-100 text-gray-600 border-gray-200" };
                      return (
                        <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.2 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-wide">Artisan Guild Member</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewCreatorShop(product.artistId)}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-[#C9A227] hover:text-white text-white text-[10px] font-mono tracking-widest uppercase rounded-lg transition"
                >
                  View Shop
                </button>
                <button
                  onClick={() => setIsFollowed(!isFollowed)}
                  className={`p-1.5 rounded-lg border transition flex items-center justify-center ${
                    isFollowed 
                      ? "bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227]" 
                      : "border-gray-200 text-gray-600 hover:border-[#111111]"
                  }`}
                  title="Follow Creator"
                >
                  {isFollowed ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Interactive Tabs */}
            <div className="border-b border-gray-100 flex space-x-6">
              {[
                { id: "description", label: "Details" },
                { id: "materials", label: "Materials & Dimensions" },
                { id: "reviews", label: "Reviews" },
                { id: "story", label: "Creator's Story" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 text-[11px] uppercase tracking-wider font-mono transition-all relative ${
                    activeTab === tab.id ? "text-gray-900 font-bold" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="text-sm text-gray-600 leading-relaxed text-left min-h-[140px]">
              {activeTab === "description" && (
                <p className="font-sans font-light text-gray-700">{product.description}</p>
              )}

              {activeTab === "materials" && (
                <div className="space-y-4 font-sans text-left">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gray-600 block mb-1">Materials Used</span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.materials.map((m, i) => (
                        <span key={i} className="bg-[#F8F8F6] border border-gray-200/50 text-gray-800 text-[11px] px-2.5 py-1 rounded-md font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100/60">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-600 block mb-1">Dimensions</span>
                      <span className="text-xs text-gray-800 font-medium">{product.dimensions}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-600 block mb-1">Weight (kg)</span>
                      <span className="text-xs text-gray-800 font-medium font-mono">
                        {product.weight ? `${product.weight} kg` : "0.85 kg"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100/60">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-600 block mb-1">Estimated Transit</span>
                      <span className="text-xs text-gray-800 font-medium">
                        {product.shippingTime ? `${product.shippingTime} week(s) delivery` : "1 - 2 weeks fully insured"}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-600 block mb-1">Care & Preservation</span>
                      <span className="text-xs text-gray-800 font-light leading-relaxed block">
                        {product.careInstructions || "Handle with silk gloves or soft cloth. Avoid abrasive detergents."}
                      </span>
                    </div>
                  </div>

                  {product.tags && product.tags.length > 0 && (
                    <div className="pt-2 border-t border-gray-100/60">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-600 block mb-1">Curation Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] text-[#C9A227] font-mono lowercase bg-[#C9A227]/5 border border-[#C9A227]/10 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="pt-2">
                  <ProductReviews
                    productId={product.id}
                    productTitle={product.title}
                    creatorId={product.artistId}
                    isCreator={user && (user.isCreator || user.role === "creator" || user.role === "both")}
                    currentUserName={user ? user.name : "Collector Guest"}
                    currentUserAvatar={user ? user.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"}
                  />
                </div>
              )}

              {activeTab === "story" && (
                <div className="space-y-5 font-sans text-xs">
                  <div className="border-l-2 border-[#C9A227] pl-4 space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold block">Artisan Inspiration</span>
                    <p className="italic text-gray-700 font-light leading-relaxed">
                      "{product.inspiration || "Inspired by traditional wabi-sabi philosophy, raw tactile structures, and seasonal organic changes in nature."}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100/60 text-left font-mono text-[10px]">
                    <div>
                      <span className="text-gray-600 uppercase block mb-0.5">Estimated Production Time</span>
                      <span className="text-gray-800 font-bold block">
                        {product.productionTime || "12 days of intensive manual craft labor"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 uppercase block mb-0.5">Country of Origin</span>
                      <span className="text-gray-800 font-bold block">
                        {product.artistId === "creator_ami_tanaka" ? "Kyoto, Japan" : 
                         product.artistId === "creator_marcus_vance" ? "Portland, Oregon, USA" : 
                         product.artistId === "creator_elena_rostova" ? "St. Petersburg, Russia" : 
                         product.artistId === "creator_siddharth_nair" ? "Kerala, India" : 
                         "Artora Guild Studio"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100/60 text-left">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600 font-bold block">The Making Of</span>
                    <p className="text-gray-600 font-light leading-relaxed">
                      {product.storyText || `The creation of "${product.title}" marks a critical dialogue between raw minerals and heat. This piece was thrown using unrefined stoneware clay sourced directly from organic deposits, ensuring unique iron speckles and minor surface fissures that declare its hand-constructed heritage. The surface was treated with high-fire wood ash slip and reduction-fired at 1300°C in an anagama kiln for over forty-eight consecutive hours, allowing the ash glaze to settle with spontaneous, natural grace.`}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Interactive Purchase controls & Messaging triggers */}
          <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
            
            {/* Buy / Cart Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(product)}
                className="w-full py-3.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] font-mono text-xs uppercase tracking-widest font-bold rounded-xl transition flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => onBuyNow(product)}
                className="w-full py-3.5 bg-[#C9A227] hover:bg-[#111111] text-white hover:text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl transition shadow-lg shadow-[#C9A227]/10"
              >
                Buy Now
              </button>
            </div>

            {/* Messaging Dialog Triggers */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setIsMessagingOpen(!isMessagingOpen)}
                className="text-xs text-gray-500 hover:text-[#C9A227] flex items-center space-x-1.5 font-mono uppercase tracking-wider pt-2 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Creator</span>
              </button>
            </div>

            {/* Inline Message Modal Overlay */}
            {isMessagingOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#F8F8F6] p-4 rounded-2xl border border-gray-100 space-y-3 mt-3 text-left"
              >
                <div className="flex justify-between items-center">
                  <h5 className="font-serif text-xs font-bold text-gray-900">Inquiry about "{product.title}"</h5>
                  <button onClick={() => setIsMessagingOpen(false)} className="text-gray-600 hover:text-gray-900 text-xs font-bold">Close</button>
                </div>
                {messageSent ? (
                  <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] p-3 rounded-xl flex items-center space-x-2 text-xs">
                    <Check className="w-4 h-4" />
                    <span>Your inquiry has been relayed to {product.artistName}!</span>
                  </div>
                ) : (
                  <form onSubmit={handleMessageSubmit} className="space-y-2">
                    <textarea
                      placeholder="Ask the creator about customization, dimensions, or shipping..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-light focus:outline-none focus:ring-1 focus:ring-[#C9A227] resize-none h-20"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#111111] text-white text-[10px] font-mono tracking-widest uppercase rounded-lg hover:bg-[#C9A227] transition"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Related Artworks */}
            {(() => {
              const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
              if (related.length === 0) return null;
              return (
                <div className="pt-6 border-t border-gray-100 text-left">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600 font-bold block mb-3">
                    Related Creations
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {related.map((rp) => (
                      <div 
                        key={rp.id}
                        onClick={() => setProduct(rp)}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 bg-gray-50/50 flex flex-col h-full hover:border-[#C9A227]/30 hover:shadow-xs transition"
                      >
                        <div className="aspect-square relative overflow-hidden bg-white">
                          <img 
                            src={rp.imageUrl} 
                            alt={rp.title}
                            className="object-cover w-full h-full group-hover:scale-102 transition duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-2 space-y-0.5 flex-1 flex flex-col justify-between">
                          <h5 className="font-serif text-[9px] text-gray-900 line-clamp-1 group-hover:text-[#C9A227] transition">
                            {rp.title}
                          </h5>
                          <p className="font-mono text-[9px] text-[#C9A227] font-semibold">
                            ${rp.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>

        </div>

      </motion.div>
    </div>
  );
}

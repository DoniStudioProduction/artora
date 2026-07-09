import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Mail, Phone, ShoppingBag, Heart, MessageSquare, Compass, 
  Settings, Award, TrendingUp, Plus, Store, Check, AlertCircle, 
  Trash2, Send, Star, FileText, Sparkles, MapPin, Users, ChevronRight, CheckCircle2, ShieldCheck, X, Eye
} from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import CreatorProductManager from "./CreatorProductManager";
import AddProduct from "./AddProduct";
import DirectMessaging from "./DirectMessaging";
import AdminDashboard from "./AdminDashboard";

interface DashboardsProps {
  user: any;
  onLogout: () => void;
  onUpdateUser: (updatedUser: any) => void;
  addToCart: (product: Product) => void;
  onBackToHome: () => void;
}

export default function Dashboards({ user, onLogout, onUpdateUser, addToCart, onBackToHome }: DashboardsProps) {
  // Determine if user has Buyer / Creator / Admin roles
  const isAdmin = user.role === "admin" || user.role === "ADMIN";
  const isCreator = user.role === "creator" || user.role === "both" || isAdmin;
  const isBuyer = user.role === "buyer" || user.role === "both" || isAdmin;

  // State to toggle between Buyer Workspace, Creator Workspace, and Admin Workspace
  const [activeWorkspace, setActiveWorkspace] = useState<"buyer" | "creator" | "admin">(
    isAdmin ? "admin" : (isCreator ? "creator" : "buyer")
  );


  // Tab State
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dashboardPreviewProduct, setDashboardPreviewProduct] = useState<Product | null>(null);

  // Profile Edit Form States
  const [editName, setEditName] = useState(user.name || "");
  const [editEmail, setEditEmail] = useState(user.email || "");
  const [editPhone, setEditPhone] = useState(user.phone || "");
  const [editBio, setEditBio] = useState(user.bio || "Independent Artisan Guild member.");
  const [editLocation, setEditLocation] = useState(user.location || "Oslo, Norway");
  const [editSuccess, setEditSuccess] = useState(false);

  // Messages Threads State
  const [messageThreads, setMessageThreads] = useState<any[]>([
    {
      id: "thread_1",
      sender: "Ami Tanaka",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      role: "Creator",
      subject: "Crate packing for Nebula Vessel",
      messages: [
        { sender: "Ami", text: "Hello Julian, I am hand-packing the vessel in a dual-layered wooden crate today. It should ship tomorrow morning.", time: "10:24 AM" },
        { sender: "You", text: "That is excellent news, Ami! I can't wait to see the glaze pattern under natural light.", time: "11:15 AM" }
      ],
      unread: true
    },
    {
      id: "thread_2",
      sender: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      role: "Creator",
      subject: "Oak Platter Care Guide",
      messages: [
        { sender: "Marcus", text: "Remember to treat the oak platter with cold-pressed walnut oil once every six months to preserve the organic grain luster.", time: "Yesterday" }
      ],
      unread: false
    }
  ]);
  const [replyText, setReplyText] = useState("");
  const [activeThreadId, setActiveThreadId] = useState("thread_1");

  // Creator newly added products state
  const [creatorProducts, setCreatorProducts] = useState<Product[]>([]);
  
  // Quick Add Product Form States
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Pottery");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMaterials, setNewMaterials] = useState("");
  const [newDimensions, setNewDimensions] = useState("");
  const [newImg, setNewImg] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);

  // Settings Toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Load custom creator products from local storage if any
  useEffect(() => {
    const saved = localStorage.getItem(`artora_creator_prod_${user.email}`);
    if (saved) {
      try {
        setCreatorProducts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default initial products matching creator name
      const defaultProducts = PRODUCTS.filter((p) => p.artistName === user.name);
      setCreatorProducts(defaultProducts);
    }
  }, [user.email, user.name]);

  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  useEffect(() => {
    // Collect 3 default recommendation products
    const recommendations = PRODUCTS.slice(0, 3);
    setWishlistItems(recommendations);
  }, []);

  // Buyer Account Extra States
  const [savedAddresses, setSavedAddresses] = useState<{ id: string; label: string; address: string }[]>(() => {
    const saved = localStorage.getItem("artora_saved_addresses");
    return saved ? JSON.parse(saved) : [
      { id: "addr_1", label: "Home Sanctuary", address: "1024 Ocean Blvd, Apt 4B, Beverly Hills, CA 90210, United States" },
      { id: "addr_2", label: "Curation Studio", address: "550 Broadway, Floor 12, New York, NY 10012, United States" }
    ];
  });

  const [followingCreators, setFollowingCreators] = useState<{ id: string; name: string; specialty: string; avatar: string }[]>(() => {
    const saved = localStorage.getItem("artora_following_creators");
    return saved ? JSON.parse(saved) : [
      { id: "tanaka", name: "Ami Tanaka", specialty: "Ceramics & Stoneware", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "vance", name: "Marcus Vance", specialty: "Heritage Woodwork", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" }
    ];
  });

  const [myReviews, setMyReviews] = useState<{ id: string; productTitle: string; artistName: string; rating: number; comment: string; date: string }[]>(() => {
    const saved = localStorage.getItem("artora_my_reviews");
    return saved ? JSON.parse(saved) : [
      { id: "rev_1", productTitle: "Nebula Wood-Fired Vessel", artistName: "Ami Tanaka", rating: 5, comment: "Absolutely breathtaking glaze patterns. The thermal packing was flawless, keeping the masterpiece perfectly pristine.", date: "July 02, 2026" }
    ];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem("artora_recently_viewed");
    return saved ? JSON.parse(saved) : [
      PRODUCTS[2],
      PRODUCTS[4]
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("artora_saved_addresses", JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem("artora_following_creators", JSON.stringify(followingCreators));
  }, [followingCreators]);

  useEffect(() => {
    localStorage.setItem("artora_my_reviews", JSON.stringify(myReviews));
  }, [myReviews]);

  useEffect(() => {
    localStorage.setItem("artora_recently_viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Form states for adding address
  const [newAddrLabel, setNewAddrLabel] = useState("");
  const [newAddrVal, setNewAddrVal] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: editName,
      email: editEmail,
      phone: editPhone,
      bio: editBio,
      location: editLocation
    };
    onUpdateUser(updated);
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setMessageThreads(prev => 
      prev.map(thread => {
        if (thread.id === activeThreadId) {
          return {
            ...thread,
            messages: [
              ...thread.messages,
              { sender: "You", text: replyText, time: "Just now" }
            ]
          };
        }
        return thread;
      })
    );
    setReplyText("");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDescription) return;

    const priceNum = parseFloat(newPrice) || 95;
    const randomImg = newImg.trim() || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80";

    const newProd: Product = {
      id: `custom_prod_${Date.now()}`,
      title: newTitle,
      artistId: `creator_${user.name.toLowerCase().replace(/\s+/g, "_")}`,
      artistName: user.name,
      artistAvatar: user.avatar,
      category: newCategory,
      price: priceNum,
      rating: 5.0,
      reviewsCount: 0,
      imageUrl: randomImg,
      description: newDescription,
      materials: newMaterials.split(",").map(m => m.trim()).filter(Boolean),
      dimensions: newDimensions || "10” x 10”",
      inStock: 3
    };

    const updated = [newProd, ...creatorProducts];
    setCreatorProducts(updated);
    localStorage.setItem(`artora_creator_prod_${user.email}`, JSON.stringify(updated));

    // Also push to global registry mock so it shows up immediately in App's catalog
    const globalProds = localStorage.getItem("artora_custom_global_products");
    const currentGlobal = globalProds ? JSON.parse(globalProds) : [];
    localStorage.setItem("artora_custom_global_products", JSON.stringify([newProd, ...currentGlobal]));

    // Reset
    setNewTitle("");
    setNewPrice("");
    setNewDescription("");
    setNewMaterials("");
    setNewDimensions("");
    setNewImg("");
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setActiveTab("products");
    }, 1500);
  };

  const handleRemoveProduct = (id: string) => {
    const updated = creatorProducts.filter(p => p.id !== id);
    setCreatorProducts(updated);
    localStorage.setItem(`artora_creator_prod_${user.email}`, JSON.stringify(updated));

    // Also update global custom registry
    const savedCustom = localStorage.getItem("artora_custom_global_products");
    if (savedCustom) {
      const customProds: Product[] = JSON.parse(savedCustom);
      const filteredGlobal = customProds.filter(p => p.id !== id);
      localStorage.setItem("artora_custom_global_products", JSON.stringify(filteredGlobal));
    }
  };

  const handleUpdateCreatorProducts = (updatedList: Product[]) => {
    setCreatorProducts(updatedList);
    localStorage.setItem(`artora_creator_prod_${user.email}`, JSON.stringify(updatedList));

    // Update global custom registry
    const savedCustom = localStorage.getItem("artora_custom_global_products");
    let customProds: Product[] = savedCustom ? JSON.parse(savedCustom) : [];
    
    // Filter out our own previous custom products from global array
    const creatorIdPrefix = `creator_${user.name.toLowerCase().replace(/\s+/g, "_")}`;
    customProds = customProds.filter(p => p.artistId !== creatorIdPrefix);

    // Filter in our own newly created/copied ones
    const newlyCreated = updatedList.filter(p => p.id.startsWith("custom_prod_"));
    const finalGlobal = [...newlyCreated, ...customProds];
    localStorage.setItem("artora_custom_global_products", JSON.stringify(finalGlobal));
  };

  const handleAddNewProductSave = (product: Product, isPublish: boolean) => {
    const updated = [product, ...creatorProducts];
    setCreatorProducts(updated);
    localStorage.setItem(`artora_creator_prod_${user.email}`, JSON.stringify(updated));

    // Also push to global custom registry
    const savedCustom = localStorage.getItem("artora_custom_global_products");
    const customProds: Product[] = savedCustom ? JSON.parse(savedCustom) : [];
    localStorage.setItem("artora_custom_global_products", JSON.stringify([product, ...customProds]));

    setActiveTab("products");
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(p => p.id !== id));
  };

  // Mock buyer orders reactive state
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  // Mock incoming creator orders reactive state
  const [creatorOrders, setCreatorOrders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("artora_orders");
    const parsedSaved = saved ? JSON.parse(saved) : [];

    const defaultsBuyer = [
      {
        id: "ORD-8273-092",
        date: "July 01, 2026",
        status: "Shipped",
        subtotal: 320,
        shippingFee: 15,
        taxFee: 0,
        total: 335,
        items: [
          { title: "Nebula Wood-Fired Vessel", artist: "Ami Tanaka", price: 320, qty: 1 }
        ],
        tracking: "UPS #ART-928301-A",
        deliveryEst: "July 08, 2026"
      },
      {
        id: "ORD-7162-811",
        date: "May 14, 2026",
        status: "Delivered",
        subtotal: 165,
        shippingFee: 15,
        taxFee: 0,
        total: 180,
        items: [
          { title: "Tessellated Terracotta Vase", artist: "Ami Tanaka", price: 165, qty: 1 }
        ],
        tracking: "FedEx #FED-29381-V",
        deliveryEst: "Delivered May 19, 2026"
      }
    ];

    setBuyerOrders([...parsedSaved, ...defaultsBuyer]);

    // Populate creator orders
    const defaultsCreator = [
      { id: "ORD-9928", buyer: "Genevieve Thorne", date: "July 05, 2026", item: "Custom Oak Platter", price: 280, status: "Preparing", address: "Beverly Hills, CA" },
      { id: "ORD-9831", buyer: "Lord Arthur Sterling", date: "June 28, 2026", item: "Heritage Burl Plate", price: 195, status: "Shipped", address: "London, UK" }
    ];

    const transformedSaved = parsedSaved.flatMap((ord: any) => {
      return ord.items.map((it: any) => ({
        id: ord.id,
        buyer: ord.customerName || "Collector Guild",
        date: ord.date,
        item: it.title,
        price: it.price * it.qty,
        status: ord.status,
        address: ord.shippingAddress,
        isCustom: true
      }));
    });

    setCreatorOrders([...transformedSaved, ...defaultsCreator]);
  }, [activeWorkspace, activeTab]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    // 1. Update creator view state
    setCreatorOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    // 2. Update buyer view state
    setBuyerOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    // 3. Update localStorage artora_orders
    const saved = localStorage.getItem("artora_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((o: any) => {
          if (o.id === orderId) {
            let newTracking = o.tracking;
            if (newStatus === "Confirmed") newTracking = "Guild settlement finalized. Crate custom engineering initialized.";
            if (newStatus === "Preparing") newTracking = "Master artisan hand-constructing custom wooden container.";
            if (newStatus === "Shipped") newTracking = `Crate dispatched under tracking #ART-${Math.floor(100000 + Math.random() * 900000)}`;
            if (newStatus === "Delivered") newTracking = "Insured wooden vault hand-delivered to recipient.";
            if (newStatus === "Completed") newTracking = "Ledger finalized successfully.";
            if (newStatus === "Cancelled") newTracking = "Transaction cancelled. Escrow refund finalized.";

            return { ...o, status: newStatus, tracking: newTracking };
          }
          return o;
        });
        localStorage.setItem("artora_orders", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };


  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] font-sans pb-24">
      
      {/* 1. Header Hero Panel */}
      <div className="bg-[#111111] text-[#F8F8F6] py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Left: Creator Profile Card */}
          <div className="flex items-center space-x-6 text-left">
            <div className="relative">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                alt={user.name}
                className="w-20 h-20 rounded-full border-2 border-[#C9A227] object-cover bg-[#F8F8F6]/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#C9A227] text-[#111111] p-1.5 rounded-full border-2 border-[#111111]">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl md:text-3xl font-light text-white tracking-tight">
                  Welcome, {user.name}
                </h1>
                {isCreator && (
                  <span className="bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#C9A227] px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest">
                    Guild Artisan
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60 font-light flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>{user.email}</span>
                {user.phone && (
                  <>
                    <span className="text-white/20">|</span>
                    <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{user.phone}</span>
                  </>
                )}
              </p>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>{editLocation}</span>
              </p>
            </div>
          </div>

          {/* Right: Workspace switcher for "Both" or Administrator users or Quick Navigation */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {(user.role === "both" || isAdmin) && (
              <div className="bg-white/10 p-1.5 rounded-2xl border border-white/10 flex flex-wrap items-center gap-1">
                {isAdmin && (
                  <button
                    onClick={() => { setActiveWorkspace("admin"); setActiveTab("overview"); }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                      activeWorkspace === "admin" ? "bg-[#C9A227] text-[#111111]" : "text-white hover:bg-white/5"
                    }`}
                  >
                    Admin Space
                  </button>
                )}
                <button
                  onClick={() => { setActiveWorkspace("buyer"); setActiveTab("overview"); }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                    activeWorkspace === "buyer" ? "bg-[#C9A227] text-[#111111]" : "text-white hover:bg-white/5"
                  }`}
                >
                  Buyer Space
                </button>
                <button
                  onClick={() => { setActiveWorkspace("creator"); setActiveTab("overview"); }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                    activeWorkspace === "creator" ? "bg-[#C9A227] text-[#111111]" : "text-white hover:bg-white/5"
                  }`}
                >
                  Creator Space
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button
                onClick={onBackToHome}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition"
              >
                Go to Shop
              </button>
              <button
                onClick={onLogout}
                className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition border border-red-500/10"
              >
                Log Out
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Workspace Body & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 text-left">
            <div className="bg-white rounded-3xl p-5 border border-[#111111]/5 shadow-sm space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 font-bold block px-3 mb-3">
                Workspace Navigation
              </span>
              
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "overview" 
                    ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Compass className="w-4 h-4" />
                  <span>Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeWorkspace === "creator" && (
                <>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      activeTab === "products" 
                        ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Store className="w-4 h-4" />
                      <span>Products ({creatorProducts.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      activeTab === "orders" 
                        ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Orders ({creatorOrders.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </>
              )}

              {activeWorkspace === "buyer" && (
                <>
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      activeTab === "wishlist" 
                        ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="w-4 h-4" />
                      <span>Wishlist ({wishlistItems.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      activeTab === "orders" 
                        ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="w-4 h-4" />
                      <span>My Orders ({buyerOrders.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveTab("saved_addresses")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      activeTab === "saved_addresses" 
                        ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4" />
                      <span>Saved Addresses ({savedAddresses.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveTab("following")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      activeTab === "following" 
                        ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4" />
                      <span>Following ({followingCreators.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveTab("my_reviews")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      activeTab === "my_reviews" 
                        ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="w-4 h-4" />
                      <span>My Reviews ({myReviews.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveTab("recently_viewed")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      activeTab === "recently_viewed" 
                        ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Eye className="w-4 h-4" />
                      <span>Recently Viewed ({recentlyViewed.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveTab("messages")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "messages" 
                    ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Messages</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "profile" 
                    ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "settings" 
                    ? "bg-[#C9A227]/10 text-[#C9A227] font-semibold border-l-4 border-[#C9A227]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

            </div>

            {/* Quick Actions Card */}
            {activeWorkspace === "creator" && (
              <div className="bg-white rounded-3xl p-6 border border-[#111111]/5 shadow-sm mt-6 text-left space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
                  Quick Actions
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    onClick={() => setActiveTab("add_product")}
                    className="w-full py-2.5 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition text-gray-700 text-center"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition text-gray-700 text-center"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Pane */}
          <div className="lg:col-span-9 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWorkspace === "admin" ? "admin" : activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                
                {activeWorkspace === "admin" && isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <>
                    {/* TAB: OVERVIEW */}
                    {activeTab === "overview" && (
                      <div className="space-y-8">
                    
                    {/* Welcome Header */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
                          Active Session
                        </span>
                        <h2 className="font-serif text-2xl font-normal text-gray-900">
                          {activeWorkspace === "creator" ? "Creator Studio Hub" : "Collector Sanctuary"}
                        </h2>
                        <p className="text-xs text-gray-500 font-light max-w-xl">
                          {activeWorkspace === "creator" 
                            ? "Manage your studio creations, commissions, client correspondence, and material authenticity audits."
                            : "Track your commissioned handcrafted pieces, curated wishlist favorites, and correspondence with guild artisans."}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center min-w-[120px]">
                        <span className="font-mono text-[10px] text-gray-400 uppercase">Verification</span>
                        <span className="text-sm font-bold text-emerald-600 flex items-center space-x-1 mt-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Active</span>
                        </span>
                      </div>
                    </div>

                    {/* Analytics row */}
                    {activeWorkspace === "creator" ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl p-5 border border-[#111111]/5 shadow-xs">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Total Sales</span>
                          <span className="text-xl md:text-2xl font-serif text-gray-900 block mt-2">$4,850.00</span>
                          <span className="text-[9px] font-mono text-emerald-600 mt-1 block">▲ +12% this cycle</span>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-[#111111]/5 shadow-xs">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Artworks Listed</span>
                          <span className="text-xl md:text-2xl font-serif text-gray-900 block mt-2">{creatorProducts.length} items</span>
                          <span className="text-[9px] font-mono text-gray-400 mt-1 block">Direct registry</span>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-[#111111]/5 shadow-xs">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Active Followers</span>
                          <span className="text-xl md:text-2xl font-serif text-gray-900 block mt-2">1,240</span>
                          <span className="text-[9px] font-mono text-emerald-600 mt-1 block">▲ +45 new</span>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-[#111111]/5 shadow-xs">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Authenticity Index</span>
                          <span className="text-xl md:text-2xl font-serif text-gray-900 block mt-2">100%</span>
                          <span className="text-[9px] font-mono text-yellow-600 mt-1 block">Verified Studio</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-5 border border-[#111111]/5 shadow-xs">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Acquisitions</span>
                          <span className="text-xl font-serif text-gray-900 block mt-2">2 Artworks</span>
                          <span className="text-[9px] font-mono text-[#C9A227] mt-1 block">Secure in collection</span>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-[#111111]/5 shadow-xs">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Wishlist Items</span>
                          <span className="text-xl font-serif text-gray-900 block mt-2">{wishlistItems.length} Saved</span>
                          <span className="text-[9px] font-mono text-gray-400 mt-1 block">Curated catalog</span>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-[#111111]/5 shadow-xs">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Secured Livelihood</span>
                          <span className="text-xl font-serif text-[#C9A227] block mt-2">90% Direct</span>
                          <span className="text-[9px] font-mono text-emerald-600 mt-1 block">Zero middleman fees</span>
                        </div>
                      </div>
                    )}

                    {/* Secondary Row: Orders & Reviews / Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* Left Side: Recent Orders */}
                      <div className="bg-white rounded-3xl p-6 border border-[#111111]/5 shadow-xs space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-serif text-lg text-gray-900">Recent Transactions</h3>
                          <button 
                            onClick={() => setActiveTab("orders")}
                            className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] font-bold hover:underline"
                          >
                            View All
                          </button>
                        </div>

                        <div className="space-y-4">
                          {activeWorkspace === "creator" ? (
                            creatorOrders.map((o) => (
                              <div key={o.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-[9px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold">
                                      {o.id}
                                    </span>
                                    <span className="text-xs font-bold text-gray-800">{o.item}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400">Buyer: {o.buyer} ({o.address})</p>
                                </div>
                                <div className="text-right space-y-1">
                                  <span className="text-xs font-bold block text-gray-900">${o.price}</span>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                                    o.status === "Shipped" ? "bg-emerald-50 text-emerald-700" : "bg-yellow-50 text-yellow-700"
                                  }`}>
                                    {o.status}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            buyerOrders.map((o) => (
                              <div key={o.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-[9px] bg-[#C9A227]/10 text-[#C9A227] px-1.5 py-0.5 rounded font-bold">
                                      {o.id}
                                    </span>
                                    <span className="text-xs font-bold text-gray-800">{o.items[0].title}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400">Studio: {o.items[0].artist} | {o.date}</p>
                                </div>
                                <div className="text-right space-y-1">
                                  <span className="text-xs font-bold block text-gray-900">${o.total}</span>
                                  <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded uppercase font-bold">
                                    {o.status}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right Side: Reviews or Recommended */}
                      <div className="bg-white rounded-3xl p-6 border border-[#111111]/5 shadow-xs space-y-4">
                        {activeWorkspace === "creator" ? (
                          <>
                            <h3 className="font-serif text-lg text-gray-900">Recent Customer Reviews</h3>
                            <div className="space-y-4">
                              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-gray-800">Lord Arthur Sterling</span>
                                  <div className="flex text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 font-light italic leading-relaxed">
                                  "The natural wood grain on the burl plate is absolutely mesmerizing. Authentic, raw quality of the ancient timber represents the finest art of joinery."
                                </p>
                              </div>

                              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-gray-800">Genevieve Thorne</span>
                                  <div className="flex text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 font-light italic leading-relaxed">
                                  "Stunning craftsmanship. Safe packing and impeccable timing directly from Seattle's heritage studio."
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-serif text-lg text-gray-900">Recommended Masterworks</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {PRODUCTS.slice(3, 5).map((p) => (
                                <div key={p.id} className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-left space-y-2.5">
                                  <img src={p.imageUrl} className="w-full h-24 object-cover rounded-xl" />
                                  <div>
                                    <h4 className="text-xs font-bold text-gray-900 truncate">{p.title}</h4>
                                    <p className="text-[10px] text-[#C9A227] font-mono">${p.price}</p>
                                  </div>
                                  <button
                                    onClick={() => addToCart(p)}
                                    className="w-full py-1.5 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                    </div>

                  </div>
                )}

                {/* TAB: PRODUCTS */}
                {activeTab === "products" && (
                  <CreatorProductManager
                    products={creatorProducts}
                    onUpdateProducts={handleUpdateCreatorProducts}
                    onAddNewClick={() => setActiveTab("add_product")}
                  />
                )}

                {/* TAB: ADD PRODUCT */}
                {activeTab === "add_product" && (
                  <AddProduct
                    user={user}
                    onSave={handleAddNewProductSave}
                    onCancel={() => setActiveTab("products")}
                  />
                )}

                {/* TAB: WISHLIST */}
                {activeTab === "wishlist" && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-gray-900">Curated Wishlist</h2>
                      <p className="text-xs text-gray-400 font-light mt-1">Your saved original masterpieces to add to cart or commission.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((p) => (
                        <div key={p.id} className="border border-gray-100 rounded-3xl p-4 bg-gray-50 flex flex-col justify-between text-left space-y-4">
                          <div className="space-y-3">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover rounded-2xl" />
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
                                {p.category}
                              </span>
                              <h3 className="font-serif text-sm font-bold text-gray-900 line-clamp-1 mt-0.5">{p.title}</h3>
                              <p className="text-[10px] text-gray-400">By {p.artistName}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200/50 flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-gray-900">${p.price}</span>
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => handleRemoveWishlist(p.id)}
                                className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                                title="Remove from list"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => addToCart(p)}
                                className="px-3 py-1.5 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {wishlistItems.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-gray-400 text-xs font-light">
                          Your future favorites belong here. Discover and save artwork on the main shop pages!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: ORDERS */}
                {activeTab === "orders" && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-6">
                      <div>
                        <h2 className="font-serif text-2xl text-gray-900">
                          {activeWorkspace === "creator" ? "Commission Inflow Sheet" : "Historical Orders"}
                        </h2>
                        <p className="text-xs text-gray-400 font-light mt-1">
                          {activeWorkspace === "creator" 
                            ? "Fulfill secure direct studio client commissions." 
                            : "Archival receipt copies for physical works verified on the ledger."}
                        </p>
                      </div>

                      <div className="space-y-6">
                        {activeWorkspace === "creator" ? (
                          creatorOrders.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl p-8 space-y-4">
                              <div className="w-12 h-12 rounded-full bg-amber-50 text-[#C9A227] flex items-center justify-center mx-auto">
                                <ShoppingBag className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-serif text-sm font-bold text-gray-800">Your gallery is ready for its first creation.</h3>
                                <p className="text-xs text-gray-400 font-light mt-1">Direct studio client commissions will appear here once registered on the ledger.</p>
                              </div>
                            </div>
                          ) : (
                            creatorOrders.map((o) => (
                              <div key={o.id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col md:flex-row justify-between gap-4 text-left">
                                <div className="space-y-1.5">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">
                                      {o.id}
                                    </span>
                                    <h3 className="text-xs font-bold text-gray-800">{o.item}</h3>
                                  </div>
                                  <p className="text-[11px] text-gray-500 font-light">
                                    Buyer: <strong className="font-medium text-gray-700">{o.buyer}</strong> | Destination: <strong className="font-medium text-gray-700">{o.address}</strong>
                                  </p>
                                  <p className="text-[10px] text-gray-400">Order Placed: {o.date}</p>
                                </div>
                                <div className="flex items-start md:items-end flex-col justify-between text-left md:text-right">
                                  <span className="text-sm font-bold text-gray-900">${o.price}</span>
                                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                                      o.status === "Shipped" ? "bg-emerald-50 text-emerald-700" : "bg-yellow-50 text-yellow-700"
                                    }`}>
                                      {o.status}
                                    </span>
                                    {o.status !== "Shipped" && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(o.id, "Shipped")}
                                        className="px-3 py-1 bg-[#C9A227] hover:bg-[#C9A227]/80 text-[#111111] text-[9px] font-mono font-bold uppercase tracking-widest rounded transition"
                                      >
                                        Mark Shipped
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )
                        ) : (
                          buyerOrders.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl p-8 space-y-4">
                              <div className="w-12 h-12 rounded-full bg-amber-50 text-[#C9A227] flex items-center justify-center mx-auto">
                                <ShoppingBag className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-serif text-sm font-bold text-gray-800">Your collection begins with your first masterpiece.</h3>
                                <p className="text-xs text-gray-400 font-light mt-1">Explore carefully curated, physical fine art from global creators.</p>
                              </div>
                            </div>
                          ) : (
                            buyerOrders.map((o) => {
                              const mainItem = o.items[0];
                              const artistName = mainItem?.artist || mainItem?.artistName || "Ami Tanaka";
                              const statusStages = ["Pending", "Preparing", "Shipped", "Delivered"];
                              const currentStageIndex = statusStages.indexOf(o.status) >= 0 ? statusStages.indexOf(o.status) : 0;

                              return (
                                <div key={o.id} className="p-6 bg-white border border-gray-100 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition">
                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
                                    <div className="space-y-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-mono text-[10px] bg-[#C9A227]/15 text-[#C9A227] px-2.5 py-0.5 rounded font-bold">
                                          {o.id}
                                        </span>
                                        <span className="text-xs text-gray-400">{o.date}</span>
                                      </div>
                                      <h3 className="text-base font-serif font-light text-gray-900">{mainItem?.title}</h3>
                                    </div>
                                    <div className="text-left md:text-right space-y-1.5">
                                      <span className="text-sm font-mono font-bold text-gray-900 block">${o.total}</span>
                                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                                        o.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : o.status === "Shipped" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                                      }`}>
                                        {o.status}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Dynamic Stepper */}
                                  <div className="space-y-3">
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Ledger Transit Pipeline</p>
                                    <div className="grid grid-cols-4 gap-2">
                                      {statusStages.map((stage, sIdx) => {
                                        const isPassed = sIdx <= currentStageIndex;
                                        const isCurrent = sIdx === currentStageIndex;
                                        return (
                                          <div key={stage} className="space-y-1.5 text-center">
                                            <div className={`h-1.5 rounded-full transition-all duration-300 ${
                                              isPassed ? (isCurrent ? "bg-amber-500 animate-pulse" : "bg-emerald-600") : "bg-gray-100"
                                            }`} />
                                            <span className={`text-[9px] font-mono uppercase font-bold block ${
                                              isCurrent ? "text-amber-600" : isPassed ? "text-emerald-700" : "text-gray-400"
                                            }`}>
                                              {stage}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs text-gray-500 font-light">
                                    <div className="space-y-1">
                                      <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400 block">Delivery Tracking Log</span>
                                      <span className="font-mono text-gray-800 font-medium">{o.tracking || "Awaiting courier log assignment."}</span>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400 block">Estimated Vault Hand-off</span>
                                      <span className="text-gray-800 font-medium">{o.deliveryEst}</span>
                                    </div>
                                  </div>

                                  {/* Active Interactions */}
                                  <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-2 justify-between items-center">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => {
                                          // Simple lookup or default thread
                                          const artistLower = artistName.toLowerCase();
                                          if (artistLower.includes("tanaka")) {
                                            setActiveThreadId("thread_tanaka");
                                          } else if (artistLower.includes("vance")) {
                                            setActiveThreadId("thread_vance");
                                          } else {
                                            setActiveThreadId("thread_tanaka");
                                          }
                                          setActiveTab("messages");
                                        }}
                                        className="px-4 py-2 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] text-[10px] font-mono uppercase tracking-wider font-bold rounded-xl transition flex items-center space-x-1.5"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>Message {artistName.split(" ")[0]}</span>
                                      </button>

                                      {/* Order Cancellation Support */}
                                      {o.status !== "Delivered" && o.status !== "Cancelled" && (
                                        <button
                                          onClick={() => {
                                            if (confirm("Are you sure you want to request cancellation for this masterwork commission? Funds will clear back to your wallet registry.")) {
                                              handleUpdateOrderStatus(o.id, "Cancelled");
                                            }
                                          }}
                                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-mono uppercase tracking-wider font-bold rounded-xl transition"
                                        >
                                          Cancel Commission
                                        </button>
                                      )}
                                    </div>

                                    {/* Simulator next state */}
                                    {o.status !== "Delivered" && o.status !== "Cancelled" && (
                                      <button
                                        onClick={() => {
                                          const currentIdx = statusStages.indexOf(o.status);
                                          if (currentIdx >= 0 && currentIdx < statusStages.length - 1) {
                                            handleUpdateOrderStatus(o.id, statusStages[currentIdx + 1]);
                                          }
                                        }}
                                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 text-[9px] font-mono uppercase font-bold tracking-wider rounded-lg transition"
                                      >
                                        Simulate Next Phase →
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )
                        )}
                      </div>
                    </div>

                    {/* Marketplace Protection Policies Accordion */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-4">
                      <div>
                        <h3 className="font-serif text-lg text-gray-900">Collector Protection & Guild Rules</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Learn how Artora secures every high-value direct workshop commission.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-left">
                          <span className="font-mono text-[9px] text-[#C9A227] uppercase tracking-wider font-bold">1. Escrow Safe-Settlement</span>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                            All collector acquisitions are held in safe, decentralized escrow. Artist studio payouts are cleared only upon confirmed digital sign-off of hand-delivery.
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-left">
                          <span className="font-mono text-[9px] text-[#C9A227] uppercase tracking-wider font-bold">2. Museum Packing Standards</span>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                            Artworks travel in hand-crafted temperature-stable cedarwood timber vaults. Continuous environmental monitors and transit insurance cover the full acquisition value.
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-left">
                          <span className="font-mono text-[9px] text-[#C9A227] uppercase tracking-wider font-bold">3. Authenticity Registry</span>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                            Every original workpiece lists permanent direct ledger registry data. This includes raw materials audits, dimension profiles, and the signature hashes of verified creators.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: MESSAGES */}
                {activeTab === "messages" && (
                  <DirectMessaging
                    currentUserId={user.email}
                    currentUserName={user.name}
                    currentUserAvatar={user.avatar}
                    onProductLinkClick={(prod) => setDashboardPreviewProduct(prod)}
                    initialThreadId={activeThreadId}
                  />
                )}

                {/* TAB: SAVED ADDRESSES */}
                {activeTab === "saved_addresses" && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-6">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h2 className="font-serif text-2xl text-gray-900">Saved Shipping Addresses</h2>
                        <p className="text-xs text-gray-400 font-light mt-1">Manage secure destination endpoints for insured shipping of acquired works.</p>
                      </div>
                      <button
                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                        className="px-4 py-2 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition flex items-center space-x-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingAddress ? "Cancel" : "Add Address"}</span>
                      </button>
                    </div>

                    {isAddingAddress && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-left space-y-4"
                      >
                        <h4 className="text-xs font-mono uppercase tracking-widest text-[#C9A227] font-bold">New Shipping Endpoint</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1 md:col-span-1">
                            <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold">Address Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Mountain Cabin"
                              value={newAddrLabel}
                              onChange={(e) => setNewAddrLabel(e.target.value)}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#C9A227] transition"
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold">Full Destination Address</label>
                            <input
                              type="text"
                              placeholder="e.g. 104 Aspen Heights Dr, Suite 3, Aspen, CO 81611, USA"
                              value={newAddrVal}
                              onChange={(e) => setNewAddrVal(e.target.value)}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#C9A227] transition"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              if (!newAddrLabel.trim() || !newAddrVal.trim()) return;
                              setSavedAddresses([
                                ...savedAddresses,
                                { id: `addr_${Date.now()}`, label: newAddrLabel, address: newAddrVal }
                              ]);
                              setNewAddrLabel("");
                              setNewAddrVal("");
                              setIsAddingAddress(false);
                            }}
                            className="px-5 py-2 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] text-xs font-mono uppercase tracking-wider font-bold transition rounded-xl"
                          >
                            Save Endpoint
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => (
                        <div key={addr.id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col justify-between items-start text-left space-y-4">
                          <div className="space-y-1.5">
                            <span className="font-mono text-[9px] bg-white text-[#C9A227] border border-[#C9A227]/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                              {addr.label}
                            </span>
                            <p className="text-xs text-gray-800 leading-relaxed font-light pt-1">{addr.address}</p>
                          </div>
                          <button
                            onClick={() => setSavedAddresses(savedAddresses.filter(a => a.id !== addr.id))}
                            className="text-[10px] font-mono uppercase tracking-widest text-red-500 hover:text-red-700 font-bold flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      ))}

                      {savedAddresses.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-400 text-xs font-light">
                          No saved addresses found. Let's record an address endpoint above.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: FOLLOWING */}
                {activeTab === "following" && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-gray-900">Followed Guild Artisans</h2>
                      <p className="text-xs text-gray-400 font-light mt-1">Acquire direct releases, live studio updates, and priority curation listings.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {followingCreators.map((artisan) => (
                        <div key={artisan.id} className="p-5 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-between text-left">
                          <div className="flex items-center space-x-4">
                            <img
                              src={artisan.avatar}
                              alt={artisan.name}
                              className="w-12 h-12 rounded-full border border-[#C9A227]/30 object-cover"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-gray-900">{artisan.name}</h4>
                              <p className="text-[10px] text-gray-400">{artisan.specialty}</p>
                              <span className="inline-block mt-1 text-[9px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded uppercase font-bold">
                                Certified Artist
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setFollowingCreators(followingCreators.filter(f => f.id !== artisan.id))}
                            className="px-3 py-1.5 border border-gray-200 hover:border-red-500 hover:text-red-500 rounded-lg text-[10px] font-mono uppercase tracking-widest transition"
                          >
                            Unfollow
                          </button>
                        </div>
                      ))}

                      {followingCreators.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-400 text-xs font-light">
                          You are not following any creators yet. Explore the shop gallery to discover master craftsmen!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: MY REVIEWS */}
                {activeTab === "my_reviews" && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-gray-900">My Curation Reviews</h2>
                      <p className="text-xs text-gray-400 font-light mt-1">Archived feedback logs written for verified masterpieces on the Artora ledger.</p>
                    </div>

                    <div className="space-y-4">
                      {myReviews.map((rev) => (
                        <div key={rev.id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-left space-y-3">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <h4 className="text-xs font-bold text-gray-900">{rev.productTitle}</h4>
                              <p className="text-[10px] text-gray-400 font-light">By {rev.artistName} • Review Logged: {rev.date}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex text-yellow-500">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                ))}
                              </div>
                              <button
                                onClick={() => setMyReviews(myReviews.filter(r => r.id !== rev.id))}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                                title="Delete review log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 font-light italic leading-relaxed">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}

                      {myReviews.length === 0 && (
                        <div className="text-center py-12 text-gray-400 text-xs font-light">
                          You have not cataloged any review logs yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: RECENTLY VIEWED */}
                {activeTab === "recently_viewed" && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-serif text-2xl text-gray-900">Recently Viewed Works</h2>
                        <p className="text-xs text-gray-400 font-light mt-1">Masterpieces you recently studied in the central gallery.</p>
                      </div>
                      {recentlyViewed.length > 0 && (
                        <button
                          onClick={() => setRecentlyViewed([])}
                          className="px-3.5 py-1.5 border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-gray-900 text-[10px] font-mono uppercase tracking-widest font-bold rounded-lg transition"
                        >
                          Clear History
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recentlyViewed.map((p) => (
                        <div key={p.id} className="border border-gray-100 rounded-3xl p-4 bg-gray-50 flex flex-col justify-between text-left space-y-4">
                          <div className="space-y-3">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-36 object-cover rounded-2xl" />
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
                                {p.category}
                              </span>
                              <h3 className="font-serif text-sm font-bold text-gray-900 line-clamp-1 mt-0.5">{p.title}</h3>
                              <p className="text-[10px] text-gray-400">By {p.artistName}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200/50 flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-gray-900">${p.price}</span>
                            <button
                              onClick={() => addToCart(p)}
                              className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition"
                            >
                              Acquire
                            </button>
                          </div>
                        </div>
                      ))}

                      {recentlyViewed.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-gray-400 text-xs font-light">
                          Your recently viewed history is clean. Enjoy browsing the Artora marketplace!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: PROFILE */}
                {activeTab === "profile" && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-gray-900">Edit Guild Profile</h2>
                      <p className="text-xs text-gray-400 font-light mt-1">These details verify your studio footprint and listing ledger identities.</p>
                    </div>

                    {editSuccess && (
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-700 flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Guild profile updated and cataloged successfully!</span>
                      </div>
                    )}

                    <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Full Identity Name</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Primary Email</label>
                        <input
                          type="email"
                          required
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Contact Phone</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Studio Location</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Bio Narrative</label>
                        <textarea
                          rows={4}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition resize-none"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2 pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] font-serif text-sm tracking-widest rounded-xl transition-all duration-300 font-bold shadow-md cursor-pointer"
                        >
                          Commit Profile Changes
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* TAB: SETTINGS */}
                {activeTab === "settings" && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-gray-900">Workspace Settings</h2>
                      <p className="text-xs text-gray-400 font-light mt-1">Configure security layers, alerts, and direct correspondence options.</p>
                    </div>

                    <div className="divide-y divide-gray-100 text-left space-y-6">
                      
                      <div className="flex justify-between items-center py-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800">Push Notifications</h4>
                          <p className="text-[11px] text-gray-400 font-light mt-1">Receive direct desktop alerts for client message commissions.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pushEnabled}
                            onChange={(e) => setPushEnabled(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A227]" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center py-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800">The Artora Gazette Gazette</h4>
                          <p className="text-[11px] text-gray-400 font-light mt-1">Monthly community stories, material drop listings, and artisan spotlights.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newsletterEnabled}
                            onChange={(e) => setNewsletterEnabled(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A227]" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center py-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800">Two-Factor Authentication</h4>
                          <p className="text-[11px] text-gray-400 font-light mt-1">Sign physical ledger authentications with secondary secure SMS verification codes.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={twoFactorEnabled}
                            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A227]" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center py-4 border-t border-gray-100">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800">Visual Onboarding</h4>
                          <p className="text-[11px] text-gray-400 font-light mt-1">Replay the introductory cinematic guides and creator guidelines.</p>
                        </div>
                        <button
                          onClick={() => {
                            localStorage.removeItem("artora_onboarded");
                            window.dispatchEvent(new CustomEvent("artora_trigger_onboarding"));
                          }}
                          className="px-4 py-2 border border-neutral-900 hover:border-[#C9A227] hover:text-[#C9A227] text-neutral-900 text-[10px] font-mono uppercase tracking-wider font-bold rounded-xl transition"
                        >
                          Replay Guide
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                  </>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Interactive Product Quick Preview Modal from Chat */}
      <AnimatePresence>
        {dashboardPreviewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setDashboardPreviewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F8F6] text-[#111111] max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-[#C9A227]/20 flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Product Image */}
              <div className="md:w-1/2 relative bg-[#111111] min-h-[250px] md:min-h-full">
                <img
                  src={dashboardPreviewProduct.imageUrl}
                  alt={dashboardPreviewProduct.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-[#C9A227] px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase">
                  {dashboardPreviewProduct.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-[#C9A227]">
                      {dashboardPreviewProduct.artistName}
                    </span>
                    <button
                      onClick={() => setDashboardPreviewProduct(null)}
                      className="text-gray-400 hover:text-gray-900 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
                    {dashboardPreviewProduct.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed font-light mb-4">
                    {dashboardPreviewProduct.description}
                  </p>

                  <div className="space-y-2 mb-6 text-xs text-gray-600">
                    {dashboardPreviewProduct.materials && (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[9px] uppercase text-gray-400">Materials:</span>
                        <span className="font-medium text-gray-800">{dashboardPreviewProduct.materials.join(", ")}</span>
                      </div>
                    )}
                    {dashboardPreviewProduct.dimensions && (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[9px] uppercase text-gray-400">Dimensions:</span>
                        <span className="font-medium text-gray-800">{dashboardPreviewProduct.dimensions}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="font-mono text-xs text-gray-400 uppercase">Acquisition Value</span>
                    <span className="font-serif text-2xl font-black text-gray-900">${dashboardPreviewProduct.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        addToCart(dashboardPreviewProduct);
                        setDashboardPreviewProduct(null);
                      }}
                      className="w-full py-3 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] transition-colors rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest"
                    >
                      Acquire Art
                    </button>
                    <button
                      onClick={() => setDashboardPreviewProduct(null)}
                      className="w-full py-3 border border-gray-300 hover:border-gray-900 transition-colors rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest"
                    >
                      Return to Chat
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

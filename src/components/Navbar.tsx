import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Check, 
  Lock, 
  Upload, 
  Sparkles, 
  Globe, 
  Palette,
  Eye,
  Bell
} from "lucide-react";
import { Product, CartItem } from "../types";
import { PRODUCTS } from "../data";

interface NavbarProps {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  addToCart: (product: Product) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  user: any;
  setUser: (user: any) => void;
  
  isBecomeCreatorOpen: boolean;
  setIsBecomeCreatorOpen: (open: boolean) => void;
  
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  onQuickView: (product: Product) => void;

  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Navbar({
  cart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  addToCart,
  isCartOpen,
  setIsCartOpen,
  user,
  setUser,
  isBecomeCreatorOpen,
  setIsBecomeCreatorOpen,
  selectedCategory,
  setSelectedCategory,
  onQuickView,
  currentView,
  onNavigate
}: NavbarProps) {
  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // Notification state
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; subtitle: string; unread: boolean }>>([
    { id: "1", title: "New message from Ami Tanaka", subtitle: '"Crate packing for Nebula Vessel..."', unread: true }
  ]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Authentication states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Creator onboarding form states
  const [creatorStep, setCreatorStep] = useState(1);
  const [studioName, setStudioName] = useState("");
  const [specialty, setSpecialty] = useState("Pottery");
  const [location, setLocation] = useState("");
  const [storyText, setStoryText] = useState("");
  const [isCreatorSuccess, setIsCreatorSuccess] = useState(false);
  const [creatorSpecialties, setCreatorSpecialties] = useState<string[]>([]);
  const [creatorCountry, setCreatorCountry] = useState("");
  const [creatorCity, setCreatorCity] = useState("");
  const [creatorBio, setCreatorBio] = useState("");
  const [creatorInstagram, setCreatorInstagram] = useState("");
  const [creatorWebsite, setCreatorWebsite] = useState("");
  const [creatorTwitter, setCreatorTwitter] = useState("");
  const [creatorProfileImg, setCreatorProfileImg] = useState("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=150&h=150&q=80");
  const [creatorCoverImg, setCreatorCoverImg] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80");
  const [applyAsSeller, setApplyAsSeller] = useState(true);

  // Checkout process states
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  // Save for Later State
  const [savedForLater, setSavedForLater] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("artora_saved_for_later");
    if (saved) {
      try {
        setSavedForLater(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isCartOpen]);

  const handleSaveForLater = (product: Product) => {
    removeFromCart(product.id);
    const updated = [...savedForLater.filter(p => p.id !== product.id), product];
    setSavedForLater(updated);
    localStorage.setItem("artora_saved_for_later", JSON.stringify(updated));
  };

  const handleMoveToCart = (product: Product) => {
    const updated = savedForLater.filter(p => p.id !== product.id);
    setSavedForLater(updated);
    localStorage.setItem("artora_saved_for_later", JSON.stringify(updated));
    addToCart(product);
  };

  const handleRemoveSaved = (productId: string) => {
    const updated = savedForLater.filter(p => p.id !== productId);
    setSavedForLater(updated);
    localStorage.setItem("artora_saved_for_later", JSON.stringify(updated));
  };

  // Categories list
  const categories = [
    "All", "Paintings", "Pottery", "Jewelry", "Woodwork", "Fashion", "Home Decor", "Digital Art", "Sculpture"
  ];

  // Focus search input on open
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.artistName.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.materials.some((m) => m.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query) ||
          (p.storyText && p.storyText.toLowerCase().includes(query))
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 500 ? 0 : 15;
  const orderTotal = subtotal + shippingFee;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    
    // Success login mock
    setUser({
      name: isRegisterMode ? authEmail.split("@")[0] : "Julian Finch",
      email: authEmail,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
      isCreator: false
    });
    
    // Reset
    setIsLoginOpen(false);
    setAuthEmail("");
    setAuthPassword("");
    setAuthError("");
  };

  const handleBecomeCreator = (e: React.FormEvent) => {
    e.preventDefault();
    if (creatorStep < 3) {
      setCreatorStep((prev) => prev + 1);
    } else {
      // Final submit
      setIsCreatorSuccess(true);
      
      const newApplication = {
        id: `app_${Date.now()}`,
        userId: user ? user.email : "guest",
        userName: user ? user.name : "Guest",
        userEmail: user ? user.email : "guest@artora.com",
        studioName: studioName,
        specialties: creatorSpecialties.length > 0 ? creatorSpecialties : [specialty],
        bio: creatorBio || storyText,
        country: creatorCountry || "Norway",
        city: creatorCity || location,
        socials: {
          instagram: creatorInstagram,
          website: creatorWebsite,
          twitter: creatorTwitter
        },
        profileImg: creatorProfileImg,
        coverImg: creatorCoverImg,
        applyAsSeller,
        createdAt: new Date().toISOString(),
        status: "PENDING"
      };

      // Save to localStorage applications
      const savedApps = localStorage.getItem("artora_creator_applications");
      const currentApps = savedApps ? JSON.parse(savedApps) : [];
      localStorage.setItem("artora_creator_applications", JSON.stringify([newApplication, ...currentApps]));

      // Also create a pending report in Admin reports
      const newReport = {
        id: `rep_apply_${Date.now()}`,
        type: "CREATOR_APPLY",
        status: "PENDING",
        details: `${user ? user.name : "Guest"} applying to become a Seller for "${studioName}". Specialty: ${creatorSpecialties.length > 0 ? creatorSpecialties.join(", ") : specialty}`,
        createdAt: new Date().toISOString(),
        applicationId: newApplication.id
      };
      const savedReports = localStorage.getItem("artora_admin_reports");
      const currentReports = savedReports ? JSON.parse(savedReports) : [];
      localStorage.setItem("artora_admin_reports", JSON.stringify([newReport, ...currentReports]));

      // Elevate user state locally if logged in
      if (user) {
        setUser({ ...user, isCreator: true });
      }
    }
  };

  const resetCreatorForm = () => {
    setIsBecomeCreatorOpen(false);
    setCreatorStep(1);
    setStudioName("");
    setSpecialty("Pottery");
    setLocation("");
    setStoryText("");
    setIsCreatorSuccess(false);
    setCreatorSpecialties([]);
    setCreatorCountry("");
    setCreatorCity("");
    setCreatorBio("");
    setCreatorInstagram("");
    setCreatorWebsite("");
    setCreatorTwitter("");
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep < 2) {
      setCheckoutStep(2);
    } else {
      // Process order
      setIsOrderComplete(true);
    }
  };

  const handleFinishOrder = () => {
    clearCart();
    setIsCheckoutMode(false);
    setCheckoutStep(1);
    setIsOrderComplete(false);
    setIsCartOpen(false);
  };

  const selectSearchProduct = (p: Product) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    onQuickView(p);
  };

  return (
    <>
      <header id="main-navigation" className="sticky top-0 z-40 w-full bg-[#F8F8F6]/85 backdrop-blur-md border-b border-[#111111]/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory("All");
                onNavigate("home");
              }}
              className="font-serif text-2xl tracking-[0.25em] text-[#111111] font-bold transition hover:opacity-80"
              id="navbar-logo"
            >
              ARTORA
            </a>
            <span className="hidden sm:inline-block w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-8 font-sans text-xs uppercase tracking-widest font-medium text-[#111111]/70">
            <button
              onClick={() => onNavigate("home")}
              className={`transition-colors hover:text-[#111111] relative py-1 ${
                currentView === "home" ? "text-[#111111] font-semibold" : ""
              }`}
            >
              Home
              {currentView === "home" && (
                <motion.div
                  layoutId="activeCategoryUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A227]"
                />
              )}
            </button>

            <button
              onClick={() => onNavigate("marketplace")}
              className={`transition-colors hover:text-[#111111] relative py-1 ${
                currentView === "marketplace" ? "text-[#111111] font-semibold" : ""
              }`}
            >
              Marketplace
              {currentView === "marketplace" && (
                <motion.div
                  layoutId="activeCategoryUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A227]"
                />
              )}
            </button>

            <button
              onClick={() => onNavigate("discover")}
              className={`transition-colors hover:text-[#111111] relative py-1 ${
                currentView === "discover" ? "text-[#111111] font-semibold" : ""
              }`}
            >
              Discover
              {currentView === "discover" && (
                <motion.div
                  layoutId="activeCategoryUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A227]"
                />
              )}
            </button>

            <button
              onClick={() => onNavigate("categories")}
              className={`transition-colors hover:text-[#111111] relative py-1 ${
                currentView === "categories" ? "text-[#111111] font-semibold" : ""
              }`}
            >
              Categories
              {currentView === "categories" && (
                <motion.div
                  layoutId="activeCategoryUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A227]"
                />
              )}
            </button>

            <button
              onClick={() => onNavigate("wishlist")}
              className={`transition-colors hover:text-[#111111] relative py-1 ${
                currentView === "wishlist" ? "text-[#111111] font-semibold" : ""
              }`}
            >
              Wishlist
              {currentView === "wishlist" && (
                <motion.div
                  layoutId="activeCategoryUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A227]"
                />
              )}
            </button>

            {user && (
              <button
                onClick={() => onNavigate("dashboard")}
                className={`transition-colors hover:text-[#111111] relative py-1 ${
                  currentView === "dashboard" ? "text-[#111111] font-semibold" : ""
                }`}
              >
                Dashboard
                {currentView === "dashboard" && (
                  <motion.div
                    layoutId="activeCategoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A227]"
                  />
                )}
              </button>
            )}
            
            <button 
              onClick={() => setIsBecomeCreatorOpen(true)}
              className="text-[#C9A227] hover:text-[#C9A227]/80 flex items-center space-x-1.5 font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Become a Creator</span>
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[#111111] hover:text-[#C9A227] p-2 rounded-full hover:bg-[#111111]/5 transition"
              id="btn-search-toggle"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative group">
                <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="text-[#111111] hover:text-[#C9A227] p-2 rounded-full hover:bg-[#111111]/5 transition relative" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1 right-1 bg-[#C9A227] w-2 h-2 rounded-full ring-2 ring-[#F8F8F6]" />
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-left">
                  <h4 className="font-serif text-xs font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 flex justify-between items-center">
                    <span>Notifications</span>
                    {notifications.some(n => n.unread) ? (
                      <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                        className="font-mono text-[9px] text-[#C9A227] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    ) : (
                      <span className="font-mono text-[9px] text-gray-400">0 New</span>
                    )}
                  </h4>
                  <div className="space-y-3 pt-1">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="flex items-start justify-between gap-2 group/item">
                          <div className="flex items-start space-x-2.5">
                            {n.unread && (
                              <div className="w-2 h-2 bg-[#C9A227] rounded-full mt-1.5 flex-shrink-0" />
                            )}
                            <div>
                              <p className={`text-[11px] font-medium text-gray-800 ${n.unread ? "font-semibold" : ""}`}>{n.title}</p>
                              <p className="text-[9px] text-gray-400 mt-0.5">{n.subtitle}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(notifications.filter(item => item.id !== n.id))}
                            className="text-gray-300 hover:text-red-500 text-[10px] opacity-0 group-hover/item:opacity-100 transition cursor-pointer"
                            title="Dismiss"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-gray-400 space-y-1">
                        <p className="text-[11px] font-serif italic text-gray-400 leading-normal">
                          We'll keep you informed when something important happens.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile */}
            {user ? (
              <div className="relative group">
                <button
  onClick={() => onNavigate("dashboard")}
  className="flex items-center space-x-2 py-1 focus:outline-none"
>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-[#C9A227] object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden sm:inline-block text-xs font-sans tracking-wider font-semibold text-[#111111]">
                    {user.name}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-800">{user.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                    {user.isCreator && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#C9A227]/10 text-[#C9A227] rounded text-[9px] font-bold">
                        Verified Creator
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => onNavigate("dashboard")}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 font-medium flex items-center space-x-2 border-b border-gray-50"
                  >
                    <Palette className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>My Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setIsBecomeCreatorOpen(true)}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 font-medium flex items-center space-x-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>My Creator Studio</span>
                  </button>
                  <button
                    onClick={() => { setUser(null); onNavigate("home"); }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate("login")}
                className="text-[#111111] hover:text-[#C9A227] p-2 rounded-full hover:bg-[#111111]/5 transition flex items-center space-x-1"
                id="btn-login-toggle"
                aria-label="Account Login"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[#111111] hover:text-[#C9A227] p-2 rounded-full hover:bg-[#111111]/5 transition relative"
              id="btn-cart-toggle"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A227] text-[#111111] font-mono text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-[#F8F8F6]">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-[#111111] p-2 rounded-full hover:bg-[#111111]/5 transition"
              id="btn-mobile-menu-toggle"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-[#111111]/5 bg-[#F8F8F6] overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="text-[10px] uppercase tracking-widest text-[#111111]/40 font-bold mb-2">
                  Browse Categories
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left text-sm py-2 px-3 rounded-lg font-sans transition ${
                        selectedCategory === cat 
                          ? "bg-[#111111] text-[#F8F8F6] font-medium" 
                          : "hover:bg-[#111111]/5 text-[#111111]/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#111111]/5 flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsBecomeCreatorOpen(true);
                    }}
                    className="w-full py-3 bg-[#111111] hover:bg-[#111111]/90 text-white rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    <span>Become a Creator</span>
                  </button>

                  {user ? (
                    <div className="flex flex-col space-y-2 pt-2">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-[#111111]/5 text-left">
                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-[#C9A227]" />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{user.name}</p>
                          <p className="text-[10px] text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onNavigate("dashboard");
                        }}
                        className="w-full py-2.5 bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#111111] rounded-xl text-xs uppercase tracking-widest font-mono font-bold flex items-center justify-center space-x-1.5"
                      >
                        <User className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setUser(null);
                          onNavigate("home");
                        }}
                        className="w-full py-2.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs uppercase tracking-widest font-mono font-bold transition"
                      >
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate("login");
                      }}
                      className="w-full py-3 border border-[#111111]/20 hover:border-[#111111] text-[#111111] rounded-xl text-xs uppercase tracking-widest font-semibold transition"
                    >
                      Log In / Register
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-md flex justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ y: -50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[70vh] flex flex-col overflow-hidden shadow-2xl border border-[#111111]/5"
            >
              {/* Search input header */}
              <div className="p-5 border-b border-[#111111]/5 flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Search className="w-5 h-5 text-[#C9A227]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search paintings, ceramics, handwoven woodcraft..."
                    className="w-full text-base font-sans outline-none placeholder:text-[#111111]/30 text-[#111111]"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-[#111111]/50 hover:text-[#111111] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="flex-1 overflow-y-auto p-6">
                {searchQuery === "" ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-[#111111]/40 font-bold mb-3">
                        Trending Galleries
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {["Stoneware Pots", "Abstract Linens", "Modern Brass Jewelry", "Heritage Oak", "Sustainable Trench"].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-3.5 py-1.5 bg-[#F8F8F6] hover:bg-[#C9A227]/10 hover:text-[#C9A227] text-xs rounded-full text-[#111111]/70 font-sans transition"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-[#111111]/40 font-bold mb-3">
                        Featured Guild Masterpieces
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {PRODUCTS.slice(0, 2).map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => selectSearchProduct(prod)}
                            className="flex items-center space-x-3 p-2 hover:bg-[#F8F8F6] rounded-xl cursor-pointer transition"
                          >
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-12 h-12 rounded-lg object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="truncate">
                              <p className="text-xs font-bold text-gray-800 truncate">{prod.title}</p>
                              <p className="text-[10px] text-gray-400">{prod.artistName}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Instant Suggestions Pills */}
                    {(() => {
                      const query = searchQuery.toLowerCase();
                      const suggestedCategories = [
                        "Paintings", "Digital Art", "Photography", "Sculpture", 
                        "Woodwork", "Pottery", "Leather", "Jewelry", "Fashion", "Home Decor"
                      ].filter(cat => cat.toLowerCase().includes(query) && cat.toLowerCase() !== query);
                      
                      const suggestedArtists = [
                        "Ami Tanaka", "Elena Rostova", "Marcus Vance", "Siddharth Nair"
                      ].filter(art => art.toLowerCase().includes(query) && art.toLowerCase() !== query);

                      if (suggestedCategories.length === 0 && suggestedArtists.length === 0) return null;

                      return (
                        <div className="mb-4 bg-[#F8F8F6] p-3 rounded-2xl text-left">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
                            Instant Suggestions
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {suggestedCategories.map(cat => (
                              <button
                                key={cat}
                                onClick={() => setSearchQuery(cat)}
                                className="px-2.5 py-1 bg-white hover:bg-[#C9A227]/10 hover:text-[#C9A227] text-[10px] rounded-lg border border-black/5 text-gray-600 font-sans transition"
                              >
                                Category: {cat}
                              </button>
                            ))}
                            {suggestedArtists.map(art => (
                              <button
                                key={art}
                                onClick={() => setSearchQuery(art)}
                                className="px-2.5 py-1 bg-white hover:bg-[#C9A227]/10 hover:text-[#C9A227] text-[10px] rounded-lg border border-black/5 text-gray-600 font-sans transition"
                              >
                                Artist: {art}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    <h4 className="text-[10px] uppercase tracking-widest text-[#111111]/40 font-bold mb-3">
                      Matching Art Pieces ({searchResults.length})
                    </h4>
                    
                    {searchResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 font-sans text-xs">
                        No creations match "{searchQuery}". Try searching for categories like "Pottery" or artist names.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {searchResults.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => selectSearchProduct(prod)}
                            className="flex items-center justify-between p-3 hover:bg-[#F8F8F6] rounded-xl cursor-pointer transition border border-transparent hover:border-[#111111]/5"
                          >
                            <div className="flex items-center space-x-4">
                              <img
                                src={prod.imageUrl}
                                alt={prod.title}
                                className="w-12 h-12 rounded-lg object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <p className="text-sm font-bold text-gray-800">{prod.title}</p>
                                <p className="text-xs text-gray-400">{prod.artistName} • <span className="text-[#C9A227]">{prod.category}</span></p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-xs font-bold text-gray-900">${prod.price}</span>
                              <Eye className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN/REGISTER MODAL */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#111111]/5"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-serif text-xl font-bold tracking-widest text-[#111111]">
                    {isRegisterMode ? "JOIN ARTORA" : "WELCOME BACK"}
                  </div>
                  <button
                    onClick={() => {
                      setIsLoginOpen(false);
                      setAuthError("");
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full text-[#111111]/40 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Third-party buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button 
                    onClick={() => {
                      setUser({
                        name: "Julian Finch",
                        email: "julian@google.com",
                        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
                        isCreator: false
                      });
                      setIsLoginOpen(false);
                    }}
                    className="py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center space-x-2 text-xs font-sans font-semibold text-gray-700 transition"
                  >
                    <span>Google</span>
                  </button>
                  <button 
                    onClick={() => {
                      setUser({
                        name: "Julian Finch",
                        email: "julian@apple.com",
                        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
                        isCreator: false
                      });
                      setIsLoginOpen(false);
                    }}
                    className="py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center space-x-2 text-xs font-sans font-semibold text-gray-700 transition"
                  >
                    <span>Apple</span>
                  </button>
                </div>

                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-gray-100"></div>
                  <span className="flex-shrink mx-4 text-gray-400 font-sans text-[10px] uppercase tracking-widest">Or login with email</span>
                  <div className="flex-grow border-t border-gray-100"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4 mt-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. collector@artora.com"
                      className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                    />
                  </div>

                  {authError && (
                    <p className="text-red-500 font-sans text-xs">{authError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#111111] hover:bg-[#111111]/90 text-[#F8F8F6] text-xs font-sans uppercase font-bold tracking-widest rounded-xl transition flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isRegisterMode ? "Create Collector Account" : "Sign In to Studio"}</span>
                  </button>
                </form>

                {/* Switch mode */}
                <div className="mt-6 text-center text-xs font-sans text-gray-500">
                  {isRegisterMode ? "Already have an account?" : "New to the Artora guild?"}{" "}
                  <button
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode);
                      setAuthError("");
                    }}
                    className="text-[#C9A227] hover:underline font-bold"
                  >
                    {isRegisterMode ? "Log In" : "Register"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BECOME A CREATOR MODAL (WIZARD) */}
      <AnimatePresence>
        {isBecomeCreatorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#111111]/5"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#111111] flex items-center space-x-2">
                    <Palette className="text-[#C9A227] w-5 h-5" />
                    <span>CREATOR ONBOARDING</span>
                  </div>
                  <button
                    onClick={resetCreatorForm}
                    className="p-1 hover:bg-gray-100 rounded-full text-[#111111]/40 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!isCreatorSuccess ? (
                  <form onSubmit={handleBecomeCreator} className="space-y-6">
                    
                    {/* Steps indicator */}
                    <div className="flex items-center justify-between px-2 mb-6">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                            creatorStep === step
                              ? "bg-[#111111] text-[#C9A227] ring-4 ring-[#C9A227]/15"
                              : creatorStep > step
                              ? "bg-[#2E8B57] text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}>
                            {creatorStep > step ? <Check className="w-4.5 h-4.5" /> : step}
                          </div>
                          {step < 3 && (
                            <div className={`flex-1 h-[2px] mx-4 ${
                              creatorStep > step ? "bg-[#2E8B57]" : "bg-gray-100"
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Step Content */}
                    {creatorStep === 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
                        <div className="border-b border-gray-100 pb-3 mb-2">
                          <h3 className="font-serif text-sm font-bold text-gray-800">Step 1: Studio Profile</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">Set up your public presence. We curate highly passionate and authentic craftsmen.</p>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Studio Name</label>
                          <input
                            type="text"
                            required
                            value={studioName}
                            onChange={(e) => setStudioName(e.target.value)}
                            placeholder="e.g. Vance Heritage Carpentry"
                            className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Country</label>
                            <input
                              type="text"
                              required
                              value={creatorCountry}
                              onChange={(e) => setCreatorCountry(e.target.value)}
                              placeholder="e.g. Norway"
                              className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">City</label>
                            <input
                              type="text"
                              required
                              value={creatorCity}
                              onChange={(e) => setCreatorCity(e.target.value)}
                              placeholder="e.g. Oslo"
                              className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Artistic specialties (Select multiple)</label>
                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50/50">
                            {[
                              "Painting", "Photography", "Illustration", "Digital Art", "Pottery", 
                              "Woodwork", "Leather Craft", "Fashion Design", "Beadwork", "Metal Art", 
                              "Glass Art", "Jewelry", "Home Decor", "Traditional African Crafts", "Mixed Media"
                            ].map((spec) => {
                              const isSelected = creatorSpecialties.includes(spec);
                              return (
                                <button
                                  key={spec}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setCreatorSpecialties(creatorSpecialties.filter((s) => s !== spec));
                                    } else {
                                      setCreatorSpecialties([...creatorSpecialties, spec]);
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition ${
                                    isSelected
                                      ? "bg-[#C9A227] text-[#111111] font-bold"
                                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                                  }`}
                                >
                                  {spec}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {creatorStep === 2 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
                        <div className="border-b border-gray-100 pb-3 mb-2">
                          <h3 className="font-serif text-sm font-bold text-gray-800">Step 2: Studio Visuals & Story</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">Provide URLs for your public identity. Artora collectors value the narrative of your guild.</p>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Biography / Narrative</label>
                          <textarea
                            required
                            rows={3}
                            value={creatorBio}
                            onChange={(e) => setCreatorBio(e.target.value)}
                            placeholder="Describe your process, materials, or workshop inspiration..."
                            className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] resize-none transition"
                          />
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Profile Image / Avatar URL</label>
                            <input
                              type="text"
                              value={creatorProfileImg}
                              onChange={(e) => setCreatorProfileImg(e.target.value)}
                              className="w-full text-xs font-mono p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Cover Image Banner URL</label>
                            <input
                              type="text"
                              value={creatorCoverImg}
                              onChange={(e) => setCreatorCoverImg(e.target.value)}
                              className="w-full text-xs font-mono p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                            />
                          </div>
                        </div>

                        <label className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100/70 transition text-left">
                          <input
                            type="checkbox"
                            checked={applyAsSeller}
                            onChange={(e) => setApplyAsSeller(e.target.checked)}
                            className="rounded text-[#C9A227] focus:ring-[#C9A227] h-4 w-4"
                          />
                          <div className="text-left">
                            <span className="block text-xs font-bold text-gray-800">Apply to become an active Seller</span>
                            <span className="block text-[10px] text-gray-400">Allows listing, fulfillment and ledger payout integration.</span>
                          </div>
                        </label>
                      </motion.div>
                    )}

                    {creatorStep === 3 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
                        <div className="border-b border-gray-100 pb-3 mb-2">
                          <h3 className="font-serif text-sm font-bold text-gray-800">Step 3: Social Connectivity</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">Provide paths to verify external digital footprint credibility.</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Instagram Handle</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-3 text-xs text-gray-400 font-mono">instagram.com/</span>
                              <input
                                type="text"
                                value={creatorInstagram}
                                onChange={(e) => setCreatorInstagram(e.target.value)}
                                placeholder="vancestudio"
                                className="w-full text-xs font-sans pl-[108px] pr-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Website URL</label>
                            <input
                              type="url"
                              value={creatorWebsite}
                              onChange={(e) => setCreatorWebsite(e.target.value)}
                              placeholder="https://vancestudio.com"
                              className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Twitter Handle</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-3.5 text-xs text-gray-400 font-mono">@</span>
                              <input
                                type="text"
                                value={creatorTwitter}
                                onChange={(e) => setCreatorTwitter(e.target.value)}
                                placeholder="vancestudio"
                                className="w-full text-xs font-sans pl-8 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border border-[#C9A227]/20 bg-[#C9A227]/5 rounded-2xl p-4 text-center">
                          <p className="text-xs text-[#111111] leading-relaxed">
                            By completing onboarding, you certify adherence to the **Artora Guild Pact for hand-made craftsmanship** and material transparency.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Footer Nav */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      {creatorStep > 1 ? (
                        <button
                          type="button"
                          onClick={() => setCreatorStep((prev) => prev - 1)}
                          className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-sans transition hover:bg-gray-50"
                        >
                          Back
                        </button>
                      ) : (
                        <div />
                      )}

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#111111] hover:bg-[#111111]/90 text-white font-sans text-xs uppercase font-bold tracking-widest rounded-xl transition flex items-center space-x-1.5"
                      >
                        <span>{creatorStep === 3 ? "Submit Application" : "Continue"}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                      </button>
                    </div>

                  </form>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-gray-900">Application Submitted!</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Congratulations on initiating your studio registration with the **Artora Creator Guild**. 
                      Our curation experts will inspect your submitted files and workshop profile within **24 to 48 hours**. 
                      We've dispatched a receipt email to your registered account.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={resetCreatorForm}
                        className="px-6 py-2.5 bg-[#111111] text-white text-xs font-sans uppercase tracking-widest font-bold rounded-xl"
                      >
                        Return to Gallery
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CART SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/40 backdrop-blur-xs flex justify-end"
            id="cart-drawer-backdrop"
          >
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => !isCheckoutMode && setIsCartOpen(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full max-w-md bg-[#F8F8F6] h-full shadow-2xl flex flex-col z-10 border-l border-[#111111]/5"
              id="cart-drawer-container"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#111111]/5 flex items-center justify-between bg-white">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="text-[#C9A227] w-5 h-5" />
                  <span className="font-serif text-lg font-bold text-gray-900">
                    {isCheckoutMode ? "CHECKOUT" : `YOUR ART BAG (${totalItems})`}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutMode(false);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full text-[#111111]/40 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              {!isCheckoutMode ? (
                <>
                  {/* Cart Item List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 && savedForLater.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 bg-[#C9A227]/10 text-[#C9A227] rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-sans font-medium text-gray-600">Your bag is currently empty.</p>
                        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                          Explore our curation categories and support direct artist-made masterpieces.
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="px-5 py-2.5 bg-[#111111] text-white text-xs uppercase font-bold tracking-widest rounded-xl hover:bg-[#111111]/90"
                        >
                          Start Exploring
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Active Cart List */}
                        {cart.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-2">
                              Acquisition Queue ({cart.length})
                            </h3>
                            <div className="space-y-4">
                              {cart.map((item) => (
                                <div
                                  key={item.product.id}
                                  className="bg-white rounded-2xl p-4 flex space-x-4 border border-[#111111]/5 shadow-xs relative"
                                >
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.product.title}
                                    className="w-20 h-20 rounded-xl object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.product.title}</p>
                                      <p className="text-[10px] text-gray-400">By {item.product.artistName}</p>
                                      <span className="inline-block mt-1 text-[9px] font-semibold text-[#C9A227] bg-[#C9A227]/5 px-2 py-0.5 rounded">
                                        {item.product.category}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                      {/* Quantity Control */}
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                                          <button
                                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="px-2 text-xs font-mono font-bold text-gray-700">
                                            {item.quantity}
                                          </span>
                                          <button
                                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition"
                                            disabled={item.quantity >= item.product.inStock}
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </div>
                                        <button
                                          onClick={() => handleSaveForLater(item.product)}
                                          className="text-[10px] text-[#C9A227] hover:text-[#C9A227]/80 font-semibold uppercase tracking-wider transition"
                                          title="Save this piece for later"
                                        >
                                          Save For Later
                                        </button>
                                      </div>

                                      <span className="font-mono text-xs font-bold text-gray-900">
                                        ${item.product.price * item.quantity}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="absolute top-2 right-2 p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Saved for Later Section */}
                        {savedForLater.length > 0 && (
                          <div className="pt-6 border-t border-gray-100 space-y-4">
                            <h3 className="text-[10px] uppercase font-mono tracking-wider text-[#C9A227] font-bold">
                              Saved For Later ({savedForLater.length})
                            </h3>
                            <div className="space-y-4">
                              {savedForLater.map((p) => (
                                <div
                                  key={p.id}
                                  className="bg-white rounded-2xl p-4 flex space-x-4 border border-[#111111]/5 shadow-xs relative"
                                >
                                  <img
                                    src={p.imageUrl}
                                    alt={p.title}
                                    className="w-16 h-16 rounded-xl object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{p.title}</p>
                                      <p className="text-[10px] text-gray-400">By {p.artistName}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="font-mono text-xs font-bold text-gray-900">${p.price}</span>
                                      <button
                                        onClick={() => handleMoveToCart(p)}
                                        className="text-[10px] bg-[#111111] text-white hover:bg-[#C9A227] hover:text-[#111111] px-3 py-1.5 rounded-lg font-mono uppercase tracking-wider font-bold transition"
                                      >
                                        Move to Bag
                                      </button>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveSaved(p.id)}
                                    className="absolute top-2 right-2 p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition"
                                    aria-label="Remove saved item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Summary / CTA */}
                  {cart.length > 0 && (
                    <div className="p-6 bg-white border-t border-[#111111]/5 space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Subtotal</span>
                          <span className="font-mono">${subtotal}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Studio Insured Shipping</span>
                          <span className="font-mono">{shippingFee === 0 ? "FREE" : `$${shippingFee}`}</span>
                        </div>
                        {shippingFee > 0 && (
                          <p className="text-[10px] text-[#2E8B57] font-medium">
                            Add ${(500 - subtotal)} more to qualify for Free Global Shipping!
                          </p>
                        )}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-gray-900">
                          <span>Estimated Total</span>
                          <span className="font-mono text-[#C9A227]">${orderTotal}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          onNavigate("checkout");
                        }}
                        className="w-full py-4 bg-[#111111] hover:bg-[#C9A227] hover:text-[#111111] text-white rounded-xl text-xs font-sans uppercase font-bold tracking-widest transition flex items-center justify-center space-x-2"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Secure Checkout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* CHECKOUT SUB-FLOW WRITTEN ACCORDING TO USER REQUIREMENTS */
                <div className="flex-1 overflow-y-auto flex flex-col h-full">
                  {!isOrderComplete ? (
                    <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col justify-between p-6 space-y-6">
                      <div className="space-y-6">
                        {/* Step title */}
                        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#111111]/40 font-bold border-b border-gray-100 pb-2">
                          <span>Step {checkoutStep} of 2</span>
                          <span>{checkoutStep === 1 ? "Shipping Address" : "Payment Details"}</span>
                        </div>

                        {checkoutStep === 1 ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingName}
                                onChange={(e) => setShippingName(e.target.value)}
                                placeholder="e.g. Julian Finch"
                                className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                                Street Address
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="e.g. 1042 NW Couch St"
                                className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                                City & Postcode
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingCity}
                                onChange={(e) => setShippingCity(e.target.value)}
                                placeholder="e.g. Portland, OR 97209"
                                className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                              />
                            </div>

                            <div className="p-4 bg-yellow-50/50 rounded-2xl border border-[#C9A227]/10 flex items-start space-x-2">
                              <Globe className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                              <p className="text-[10px] text-gray-500 leading-relaxed">
                                **Safe Insured Art Shipping**: All orders are packed in custom wooden crates with thermal insulation, protecting physical canvases and delicate stoneware clays perfectly.
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {/* Card Display Mock */}
                            <div className="bg-[#111111] p-5 rounded-2xl text-[#F8F8F6] space-y-6 relative overflow-hidden shadow-md">
                              <div className="absolute right-0 top-0 w-32 h-32 bg-[#C9A227]/5 rounded-full blur-2xl" />
                              <div className="flex justify-between items-center">
                                <span className="font-serif text-sm tracking-widest">ARTORA GUILD CARD</span>
                                <span className="text-[#C9A227] text-xs uppercase font-bold">Secure</span>
                              </div>
                              <div className="space-y-1">
                                <p className="font-mono text-base tracking-widest">
                                  {cardNumber ? cardNumber.replace(/(\d{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                                </p>
                              </div>
                              <div className="flex justify-between text-[10px] font-mono opacity-60">
                                <div>
                                  <p className="uppercase text-[8px] tracking-wider mb-0.5">Cardholder</p>
                                  <p>{shippingName || "JULIAN FINCH"}</p>
                                </div>
                                <div className="text-right">
                                  <p className="uppercase text-[8px] tracking-wider mb-0.5">Expires</p>
                                  <p>{cardExpiry || "MM/YY"}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                                Card Number
                              </label>
                              <input
                                type="text"
                                required
                                maxLength={16}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                                placeholder="4111 2222 3333 4444"
                                className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition font-mono"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  required
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                                  Security CVC
                                </label>
                                <input
                                  type="password"
                                  required
                                  maxLength={4}
                                  value={cardCVC}
                                  onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ""))}
                                  placeholder="•••"
                                  className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition font-mono"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-gray-100 space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Total due:</span>
                          <span className="font-mono font-bold text-[#111111]">${orderTotal}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => checkoutStep === 2 ? setCheckoutStep(1) : setIsCheckoutMode(false)}
                            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-sans font-semibold transition hover:bg-gray-50 text-center"
                          >
                            Back
                          </button>
                          
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-[#111111] text-[#F8F8F6] text-xs font-sans uppercase tracking-widest font-bold rounded-xl hover:bg-[#111111]/90 flex items-center justify-center space-x-1.5"
                          >
                            <span>{checkoutStep === 1 ? "Continue" : `Pay $${orderTotal}`}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    /* Dynamic Invoice & Success Page */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 space-y-6 flex-1 flex flex-col justify-between"
                    >
                      <div className="space-y-4 text-center">
                        <div className="w-16 h-16 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full flex items-center justify-center mx-auto">
                          <Check className="w-8 h-8" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900">MASTERPIECE ACQUIRED</h3>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto">
                          Your support funds direct artisanal livelihood. Below is your official Artora Guild receipt.
                        </p>
                        
                        {/* Visual Receipt */}
                        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 text-left space-y-4">
                          <div className="flex justify-between text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                            <span>Receipt ID #AR-{Math.floor(100000 + Math.random() * 900000)}</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                          
                          <div className="border-t border-gray-100 pt-3 space-y-2">
                            {cart.map((item) => (
                              <div key={item.product.id} className="flex justify-between text-xs font-sans">
                                <span className="text-gray-700">{item.product.title} (x{item.quantity})</span>
                                <span className="font-mono text-gray-900">${item.product.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-gray-100 pt-3 space-y-1 text-xs">
                            <div className="flex justify-between text-gray-500 text-[11px]">
                              <span>Shipping (Insured Crate)</span>
                              <span>{shippingFee === 0 ? "FREE" : `$${shippingFee}`}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 text-sm pt-1">
                              <span>Acquisition Cost</span>
                              <span className="font-mono text-[#C9A227]">${orderTotal}</span>
                            </div>
                          </div>

                          <div className="pt-2 text-center">
                            <p className="text-[9px] uppercase tracking-widest text-[#2E8B57] font-bold">
                              * Certificate of Authenticity dispatched
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleFinishOrder}
                        className="w-full py-3.5 bg-[#111111] hover:bg-[#111111]/90 text-white rounded-xl text-xs uppercase font-bold tracking-widest transition"
                      >
                        Finish & Back to Guild
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

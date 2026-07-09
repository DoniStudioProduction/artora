import { useState, useEffect } from "react";
import Splash from "./components/Splash";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import TrendingProducts from "./components/TrendingProducts";
import FeaturedCreators from "./components/FeaturedCreators";
import CreatorStories from "./components/CreatorStories";
import WhyUs from "./components/WhyUs";
import Footer from "./components/Footer";
import AuthPages from "./components/AuthPages";
import Dashboards from "./components/Dashboards";
import { Product, CartItem } from "./types";
import { seedInitialDataIfEmpty } from "./lib/firebaseService";

// New build views
import Marketplace from "./components/Marketplace";
import CategoriesPage from "./components/CategoriesPage";
import WishlistView from "./components/WishlistView";
import CreatorShop from "./components/CreatorShop";
import ProductDetails from "./components/ProductDetails";
import CheckoutPage from "./components/CheckoutPage";
import DiscoverPage from "./components/DiscoverPage";
import Onboarding from "./components/Onboarding";
import FeedbackCenter from "./components/FeedbackCenter";
import ErrorPages from "./components/ErrorPages";

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Onboarding Completed State
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem("artora_onboarded") === "true";
  });

  // Cart Management States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // User Profile State
  const [user, setUser] = useState<any>(null);

  // Custom Navigation / View Switching Router state
  const [currentView, setCurrentView] = useState<string>("home");

  // Creator Onboarding Modal state
  const [isBecomeCreatorOpen, setIsBecomeCreatorOpen] = useState(false);

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Quick View Product State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Wishlist, Active Creator, Active Product States
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeCreatorId, setActiveCreatorId] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Load wishlist from local storage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("artora_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
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

  // On page load, retrieve existing cart and persistent user session
  useEffect(() => {
    // Seed Firestore with initial premium datasets if empty
    seedInitialDataIfEmpty();

    const savedCart = localStorage.getItem("artora_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }

    const savedUser = localStorage.getItem("artora_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }

    const handleNavigateCreator = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCreatorId(customEvent.detail);
        setCurrentView("creator_shop");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const handleTriggerOnboarding = () => {
      setIsOnboarded(false);
    };

    const handleTriggerError = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setCurrentView(`error_${customEvent.detail}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("artora_navigate_creator", handleNavigateCreator);
    window.addEventListener("artora_trigger_onboarding", handleTriggerOnboarding);
    window.addEventListener("artora_trigger_error", handleTriggerError);

    return () => {
      window.removeEventListener("artora_navigate_creator", handleNavigateCreator);
      window.removeEventListener("artora_trigger_onboarding", handleTriggerOnboarding);
      window.removeEventListener("artora_trigger_error", handleTriggerError);
    };
  }, []);

  const handleSetUser = (newUser: any) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("artora_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("artora_user");
    }
  };

  const handleNavigate = (view: string) => {
    if (view === "dashboard" && !user) {
      setCurrentView("login");
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("artora_cart", JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      // Product exists, increment quantity
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
    } else {
      // Add as new item
      updatedCart = [...cart, { product, quantity: 1 }];
    }

    saveCartToStorage(updatedCart);
    
    // Automatically open the cart drawer so the user gets instant visual confirmation!
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    saveCartToStorage(updatedCart);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const scrollToMarketplace = () => {
    setCurrentView("home");
    setTimeout(() => {
      const element = document.getElementById("trending-marketplace");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased selection:bg-[#C9A227]/20 selection:text-[#111111] font-sans">
      
      {/* 1. Splash Screen Overlay */}
      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}

      {/* Onboarding Flow Overlay */}
      {!showSplash && !isOnboarded && (
        <Onboarding
          onComplete={() => {
            localStorage.setItem("artora_onboarded", "true");
            setIsOnboarded(true);
          }}
        />
      )}

      {/* Main Home Screen */}
      {!showSplash && isOnboarded && (
        <div className="flex flex-col min-h-screen">
          
          {/* 2. Responsive Navigation Bar */}
          <Navbar
            cart={cart}
            removeFromCart={removeFromCart}
            updateCartQuantity={updateCartQuantity}
            clearCart={clearCart}
            addToCart={addToCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            user={user}
            setUser={handleSetUser}
            isBecomeCreatorOpen={isBecomeCreatorOpen}
            setIsBecomeCreatorOpen={setIsBecomeCreatorOpen}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onQuickView={(p) => setQuickViewProduct(p)}
            currentView={currentView}
            onNavigate={handleNavigate}
          />

          {/* Main Content Router */}
          {currentView === "home" && (
            <main className="flex-1">
              
              {/* 3. Hero Section */}
              <Hero
                onExploreClick={scrollToMarketplace}
                onBecomeCreatorClick={() => setIsBecomeCreatorOpen(true)}
              />

              {/* 4. Featured Categories (Bento Grid) */}
              <Categories
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                scrollToMarketplace={scrollToMarketplace}
              />

              {/* 5. Trending Products Grid */}
              <TrendingProducts
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                addToCart={addToCart}
                quickViewProduct={quickViewProduct}
                setQuickViewProduct={setQuickViewProduct}
              />

              {/* 6. Featured Creators (Artisan profiles) */}
              <FeaturedCreators />

              {/* 7. Creator Stories (Chronicles) */}
              <CreatorStories />

              {/* 8. Why Artora Values Grid */}
              <WhyUs />

            </main>
          )}

          {currentView === "login" && (
            <div className="flex-1">
              <AuthPages
                onBackToHome={() => setCurrentView("home")}
                onLoginSuccess={(loggedInUser) => {
                  handleSetUser(loggedInUser);
                  setCurrentView("dashboard");
                }}
                onRegisterSuccess={(registeredUser) => {
                  handleSetUser(registeredUser);
                  setCurrentView("dashboard");
                }}
                initialMode="login"
              />
            </div>
          )}

          {currentView === "signup" && (
            <div className="flex-1">
              <AuthPages
                onBackToHome={() => setCurrentView("home")}
                onLoginSuccess={(loggedInUser) => {
                  handleSetUser(loggedInUser);
                  setCurrentView("dashboard");
                }}
                onRegisterSuccess={(registeredUser) => {
                  handleSetUser(registeredUser);
                  setCurrentView("dashboard");
                }}
                initialMode="signup"
              />
            </div>
          )}

          {currentView === "dashboard" && user && (
            <div className="flex-1">
              <Dashboards
                user={user}
                onLogout={() => {
                  handleSetUser(null);
                  setCurrentView("home");
                }}
                onUpdateUser={handleSetUser}
                addToCart={addToCart}
                onBackToHome={() => setCurrentView("home")}
              />
            </div>
          )}

          {currentView === "marketplace" && (
            <div className="flex-1">
              <Marketplace
                addToCart={addToCart}
                onQuickView={(p) => {
                  setActiveProduct(p);
                  setCurrentView("product_details");
                }}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                initialCategory={selectedCategory}
                onNavigateToCreatorShop={(creatorId) => {
                  setActiveCreatorId(creatorId);
                  setCurrentView("creator_shop");
                }}
              />
            </div>
          )}

          {currentView === "categories" && (
            <div className="flex-1">
              <CategoriesPage
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentView("marketplace");
                }}
              />
            </div>
          )}

          {currentView === "wishlist" && (
            <div className="flex-1">
              <WishlistView
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                addToCart={addToCart}
                onQuickView={(p) => {
                  setActiveProduct(p);
                  setCurrentView("product_details");
                }}
                onBackToHome={() => setCurrentView("marketplace")}
              />
            </div>
          )}

          {currentView === "discover" && (
            <div className="flex-1">
              <DiscoverPage 
                addToCart={addToCart}
                onQuickView={(p) => {
                  setActiveProduct(p);
                  setCurrentView("product_details");
                }}
                onViewCreatorShop={(creatorId) => {
                  setActiveCreatorId(creatorId);
                  setCurrentView("creator_shop");
                }}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentView("marketplace");
                }}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          )}

          {currentView === "creator_shop" && activeCreatorId && (
            <div className="flex-1">
              <CreatorShop
                creatorId={activeCreatorId}
                addToCart={addToCart}
                onQuickView={(p) => {
                  setActiveProduct(p);
                  setCurrentView("product_details");
                }}
                onBack={() => setCurrentView("marketplace")}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          )}

          {currentView === "product_details" && activeProduct && (
            <div className="flex-1">
              <ProductDetails
                product={activeProduct}
                addToCart={addToCart}
                onBuyNow={(p) => {
                  addToCart(p);
                  setIsCartOpen(true);
                }}
                onViewCreatorShop={(creatorId) => {
                  setActiveCreatorId(creatorId);
                  setCurrentView("creator_shop");
                }}
                onClose={() => setCurrentView("marketplace")}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          )}

          {currentView === "checkout" && (
            <div className="flex-1">
              <CheckoutPage
                cart={cart}
                removeFromCart={removeFromCart}
                updateCartQuantity={updateCartQuantity}
                clearCart={clearCart}
                user={user}
                onNavigate={handleNavigate}
              />
            </div>
          )}

          {currentView === "feedback" && (
            <div className="flex-1">
              <FeedbackCenter onBackToHome={() => setCurrentView("home")} />
            </div>
          )}

          {currentView === "error_no_internet" && (
            <div className="flex-1">
              <ErrorPages errorType="no_internet" onNavigateHome={() => setCurrentView("home")} />
            </div>
          )}

          {currentView === "error_auth_failure" && (
            <div className="flex-1">
              <ErrorPages errorType="auth_failure" onNavigateHome={() => setCurrentView("home")} onNavigateLogin={() => setCurrentView("login")} />
            </div>
          )}

          {currentView === "error_not_found" && (
            <div className="flex-1">
              <ErrorPages errorType="not_found" onNavigateHome={() => setCurrentView("home")} />
            </div>
          )}

          {currentView === "error_server_error" && (
            <div className="flex-1">
              <ErrorPages errorType="server_error" onNavigateHome={() => setCurrentView("home")} />
            </div>
          )}

          {currentView === "error_firestore_error" && (
            <div className="flex-1">
              <ErrorPages errorType="firestore_error" onNavigateHome={() => setCurrentView("home")} />
            </div>
          )}

          {currentView === "error_unknown" && (
            <div className="flex-1">
              <ErrorPages errorType="unknown" onNavigateHome={() => setCurrentView("home")} />
            </div>
          )}

          {/* 9. Global Premium Footer */}
          <Footer
            setSelectedCategory={setSelectedCategory}
            setIsBecomeCreatorOpen={setIsBecomeCreatorOpen}
            scrollToTop={scrollToTop}
            onNavigate={handleNavigate}
          />

        </div>
      )}

    </div>
  );
}

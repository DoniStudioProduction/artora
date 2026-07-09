import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShoppingBag, 
  Lock, 
  Plus, 
  Minus, 
  Trash2, 
  Globe,
  Award
} from "lucide-react";
import { Product, CartItem } from "../types";

interface CheckoutPageProps {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  user: any;
  onNavigate: (view: string) => void;
}

export default function CheckoutPage({
  cart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  user,
  onNavigate
}: CheckoutPageProps) {
  // Navigation block if cart is empty and order is not complete
  useEffect(() => {
    if (cart.length === 0 && !isOrderComplete) {
      onNavigate("home");
    }
  }, [cart]);

  // Steps: 1 = Shipping & Contact, 2 = Delivery & Payment, 3 = Confirmation Receipt
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>("");

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");

  // Delivery Method: 'local', 'national', 'international', 'pickup'
  const [deliveryMethod, setDeliveryMethod] = useState<string>("national");

  // Payment Method: 'card', 'paystack', 'flutterwave', 'bank_transfer', 'wallet', 'cod'
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  // Direct Bank Wire Fields
  const [bankReceiptUploaded, setBankReceiptUploaded] = useState(false);
  const [wireSenderName, setWireSenderName] = useState("");

  // Wallet State Mock
  const collectorWalletBalance = 25000; // Simulated Artora secure ledger credit

  // Coupons & Promotions
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: "percent" | "fixed"; value: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccessMsg, setPromoSuccessMsg] = useState("");

  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccessMsg("");
    const cleaned = promoCode.trim().toUpperCase();
    if (!cleaned) return;

    if (cleaned === "ARTORA10") {
      setAppliedPromo({ code: "ARTORA10", type: "percent", value: 10 });
      setPromoSuccessMsg("Accredited Artora 10% discount applied.");
    } else if (cleaned === "GUILD50") {
      setAppliedPromo({ code: "GUILD50", type: "fixed", value: 50 });
      setPromoSuccessMsg("Artora Guild $50 collector incentive applied.");
    } else if (cleaned === "MASTERPIECE") {
      setAppliedPromo({ code: "MASTERPIECE", type: "percent", value: 15 });
      setPromoSuccessMsg("Curator Selection 15% discount applied.");
    } else if (cleaned === "SPRING24") {
      setAppliedPromo({ code: "SPRING24", type: "percent", value: 20 });
      setPromoSuccessMsg("Artisan Spring Curation 20% discount applied.");
    } else {
      setPromoError("Invalid or expired promotional ledger code.");
    }
  };

  const countries = [
    "United States", "United Kingdom", "Canada", "Japan", "France", "Germany", 
    "Norway", "Italy", "Australia", "Singapore", "Switzerland"
  ];

  // Price calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Calculate Promo Discount
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      promoDiscount = Math.round(subtotal * (appliedPromo.value / 100));
    } else {
      promoDiscount = Math.min(appliedPromo.value, subtotal);
    }
  }

  const getShippingCost = () => {
    if (deliveryMethod === "pickup") return 0;
    if (deliveryMethod === "local") return 20;
    if (deliveryMethod === "national") {
      return subtotal > 1500 ? 0 : 45;
    }
    return 95; // international priority cased
  };

  const getShippingLabel = () => {
    if (deliveryMethod === "pickup") return "Guild Hall Direct Pickup";
    if (deliveryMethod === "local") return "Gallery Messenger Courier";
    if (deliveryMethod === "national") return "Secure National Freight";
    return "Crated Priority Air Cargo";
  };

  const getShippingEst = () => {
    if (deliveryMethod === "pickup") return "Same-day collect at Guild Chamber";
    if (deliveryMethod === "local") return "24 - 48 Hours climate-controlled courier";
    if (deliveryMethod === "national") return "3 - 5 business days in timber vault";
    return "7 - 12 business days cased priority air freight";
  };

  const shippingFee = getShippingCost();
  const taxFee = Math.round((subtotal - promoDiscount) * 0.08); // Mock 8% tax
  const orderTotal = subtotal - promoDiscount + shippingFee + taxFee;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;
    setPlacedOrderId(newOrderId);

    // Prepare order item formats for database list
    const orderItems = cart.map(item => ({
      title: item.product.title,
      artist: item.product.artistName,
      price: item.product.price,
      qty: item.quantity,
      imageUrl: item.product.imageUrl,
      category: item.product.category,
      productId: item.product.id
    }));

    // Generate Order object for buyer and creator workspace
    const newOrder = {
      id: newOrderId,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      status: "Pending", // Statuses: "Pending", "Confirmed", "Preparing", "Shipped", "Delivered", "Completed", "Cancelled"
      subtotal,
      promoDiscount,
      appliedPromoCode: appliedPromo?.code || null,
      shippingFee,
      taxFee,
      total: orderTotal,
      items: orderItems,
      deliveryMethod: getShippingLabel(),
      deliveryEst: getShippingEst(),
      tracking: "Awaiting ledger confirmation from Guild Studio.",
      shippingAddress: deliveryMethod === "pickup" ? "Guild Hall Curatorial Chamber (Direct Collection)" : `${address}${apartment ? `, Apt ${apartment}` : ""}, ${city}, ${state} ${zipCode}, ${country}`,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      paymentMethodLabel: paymentMethod === "card" ? "Credit Card (Stripe Portal)" :
                          paymentMethod === "paystack" ? "Paystack Secure Africa Gateway" :
                          paymentMethod === "flutterwave" ? "Flutterwave Global settlement" :
                          paymentMethod === "bank_transfer" ? "Direct Bank Wire" :
                          paymentMethod === "wallet" ? "Artora Ledger Wallet" : "Cash on Delivery (Courier COD)"
    };

    // Retrieve and update buyer orders
    const savedOrders = localStorage.getItem("artora_orders");
    const currentOrders = savedOrders ? JSON.parse(savedOrders) : [];
    localStorage.setItem("artora_orders", JSON.stringify([newOrder, ...currentOrders]));

    // Generate dynamic notifications
    const newNotificationOrder = {
      id: `NOT-${Date.now()}`,
      userId: email,
      title: "Order Placed",
      message: `Your acquisition request for "${orderItems[0].title}" was logged into Artora's secure registry under ${newOrderId}.`,
      type: "order_new",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    const newNotificationPayment = {
      id: `NOT-PAY-${Date.now()}`,
      userId: email,
      title: "Payment Registered",
      message: paymentMethod === "bank_transfer" ?
               `Your direct bank wire request has been logged. Order will move to "Confirmed" once funds settle in escrow.` :
               `Direct settlement clearing was finalized for $${orderTotal.toLocaleString()} via ${newOrder.paymentMethodLabel}. Guild funds secured.`,
      type: "payment_received",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    const savedNotifications = localStorage.getItem("artora_notifications");
    const currentNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];
    localStorage.setItem(
      "artora_notifications", 
      JSON.stringify([newNotificationOrder, newNotificationPayment, ...currentNotifications])
    );

    // Complete order in UI state
    setIsOrderComplete(true);
    setCheckoutStep(3);
  };

  const handleFinish = () => {
    clearCart();
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] pb-24 text-left">
      {/* Visual Identity Header */}
      <div className="bg-[#111111] text-[#F8F8F6] py-12 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-mono font-bold block">
              Secure Ledger Acquisition
            </span>
            <h1 className="font-serif text-3xl font-light text-white tracking-tight">
              Guild Checkout
            </h1>
          </div>
          
          {/* Checkout Steps Tracker */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className={`px-2 py-1 rounded ${checkoutStep >= 1 ? "bg-[#C9A227] text-[#111111]" : "bg-white/10 text-white/40"} font-bold`}>1</span>
            <span className="text-white/20">&mdash;</span>
            <span className={`px-2 py-1 rounded ${checkoutStep >= 2 ? "bg-[#C9A227] text-[#111111]" : "bg-white/10 text-white/40"} font-bold`}>2</span>
            <span className="text-white/20">&mdash;</span>
            <span className={`px-2 py-1 rounded ${checkoutStep >= 3 ? "bg-[#C9A227] text-[#111111]" : "bg-white/10 text-white/40"} font-bold`}>3</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {!isOrderComplete ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Input Forms (Steps 1 & 2) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {checkoutStep === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleNextStep} className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-sm space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h2 className="font-serif text-lg text-gray-900">1. Shipping & Contact</h2>
                        <p className="text-xs text-gray-600 font-light mt-0.5">Please provide secure direct physical registry details.</p>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-4">
                        <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Full Name</label>
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Genevieve Thorne"
                              className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Email Address</label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. genevieve@example.com"
                              className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +1 (310) 555-0199"
                            className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition"
                          />
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="space-y-4 pt-4 border-t border-gray-50">
                        <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">Shipping Address</h3>
                        
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Street Address</label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. 1024 Ocean Blvd"
                            className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Apartment, Suite, etc. (Optional)</label>
                            <input
                              type="text"
                              value={apartment}
                              onChange={(e) => setApartment(e.target.value)}
                              placeholder="e.g. Suite 4B"
                              className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">City</label>
                            <input
                              type="text"
                              required
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="e.g. Beverly Hills"
                              className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">State / Province</label>
                            <input
                              type="text"
                              required
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              placeholder="e.g. CA"
                              className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">ZIP / Postal Code</label>
                            <input
                              type="text"
                              required
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              placeholder="e.g. 90210"
                              className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Country</label>
                            <select
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full text-xs font-sans p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition"
                            >
                              {countries.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3.5 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition flex items-center space-x-2"
                        >
                          <span>Continue to Payment</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-sm space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h2 className="font-serif text-lg text-gray-900">2. Delivery & Payment Method</h2>
                        <p className="text-xs text-gray-600 font-light mt-0.5">Choose physical packing curation levels and secure settlement gateways.</p>
                      </div>

                      {/* Delivery Methods */}
                      <div className="space-y-4">
                        <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold flex items-center space-x-1">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Delivery Options</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Pickup */}
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod("pickup")}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition ${
                              deliveryMethod === "pickup" 
                                ? "border-[#C9A227] bg-[#C9A227]/5" 
                                : "border-gray-100 hover:border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-gray-900">Guild Hall Direct Pickup</p>
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">ECO-SAFE</span>
                              </div>
                              <p className="text-[10px] text-gray-600 mt-1">Collect at main Artora Guild curatorial chamber. Direct hand-off.</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[10px] font-mono text-gray-500">Same-Day Pick Up</span>
                              <span className="text-xs font-mono font-bold text-gray-900">FREE</span>
                            </div>
                          </button>

                          {/* Local Courier */}
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod("local")}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition ${
                              deliveryMethod === "local" 
                                ? "border-[#C9A227] bg-[#C9A227]/5" 
                                : "border-gray-100 hover:border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold text-gray-900">Gallery Messenger Courier</p>
                              <p className="text-[10px] text-gray-600 mt-1">Temperature-stable hand carried. Insured white-glove courier.</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[10px] font-mono text-gray-500">24-48 Hours</span>
                              <span className="text-xs font-mono font-bold text-gray-900">$20</span>
                            </div>
                          </button>

                          {/* National Secure */}
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod("national")}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition ${
                              deliveryMethod === "national" 
                                ? "border-[#C9A227] bg-[#C9A227]/5" 
                                : "border-gray-100 hover:border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold text-gray-900">Secure National Freight</p>
                              <p className="text-[10px] text-gray-600 mt-1">Dispatched inside custom-crafted cedar shockproof vaults.</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[10px] font-mono text-gray-500">3-5 Business Days</span>
                              <span className="text-xs font-mono font-bold text-gray-900">
                                {subtotal > 1500 ? "FREE" : "$45"}
                              </span>
                            </div>
                          </button>

                          {/* International */}
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod("international")}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition ${
                              deliveryMethod === "international" 
                                ? "border-[#C9A227] bg-[#C9A227]/5" 
                                : "border-gray-100 hover:border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-gray-900">Crated Priority Air Cargo</p>
                                <span className="bg-yellow-50 text-[#C9A227] border border-[#C9A227]/30 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">EXPORT</span>
                              </div>
                              <p className="text-[10px] text-gray-600 mt-1">Artisan crating, custom export clearing, international priority air.</p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[10px] font-mono text-gray-500">7-12 Business Days</span>
                              <span className="text-xs font-mono font-bold text-gray-900">$95</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div className="space-y-4 pt-4 border-t border-gray-50">
                        <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold flex items-center space-x-1">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Secure Direct Settlement Curation</span>
                        </h3>

                        {/* Responsive Premium Tab Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-gray-100 bg-gray-50 p-1.5 rounded-2xl">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`py-2 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xl text-center transition ${
                              paymentMethod === "card" ? "bg-[#111111] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            Credit Card
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("paystack")}
                            className={`py-2 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xl text-center transition ${
                              paymentMethod === "paystack" ? "bg-[#111111] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            Paystack
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod("flutterwave")}
                            className={`py-2 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xl text-center transition ${
                              paymentMethod === "flutterwave" ? "bg-[#111111] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            Flutterwave
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod("bank_transfer")}
                            className={`py-2 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xl text-center transition ${
                              paymentMethod === "bank_transfer" ? "bg-[#111111] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            Bank Wire
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod("wallet")}
                            className={`py-2 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xl text-center transition ${
                              paymentMethod === "wallet" ? "bg-[#111111] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            Guild Wallet
                          </button>

                          <button
                            type="button"
                            disabled={deliveryMethod !== "local"}
                            onClick={() => setPaymentMethod("cod")}
                            className={`py-2 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xl text-center transition ${
                              deliveryMethod !== "local" ? "opacity-40 cursor-not-allowed text-gray-300" :
                              paymentMethod === "cod" ? "bg-[#111111] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                            }`}
                            title={deliveryMethod !== "local" ? "Only available with Local Gallery Messenger Courier" : ""}
                          >
                            COD
                          </button>
                        </div>

                        {/* PAYMENT DETAILS FORMS */}
                        {paymentMethod === "card" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-4">
                            {/* Interactive Card Graphic */}
                            <div className="bg-[#111111] text-[#F8F8F6] p-5 rounded-2xl space-y-8 relative overflow-hidden shadow-xl border border-white/5">
                              <div className="absolute right-0 top-0 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-2xl" />
                              <div className="flex justify-between items-center">
                                <span className="font-serif text-[10px] tracking-widest uppercase font-semibold text-white/55">ARTORA COLLECTOR LEDGER</span>
                                <Award className="w-5 h-5 text-[#C9A227]" />
                              </div>
                              
                              <div className="space-y-1.5">
                                <p className="font-mono text-sm tracking-[0.2em] text-white">
                                  {cardNumber ? cardNumber.replace(/(\d{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                                </p>
                              </div>

                              <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                                <div>
                                  <span className="block text-[7px] uppercase tracking-wider mb-0.5">Collector Name</span>
                                  <span className="text-white font-medium uppercase tracking-wide">{fullName || "JULIAN FINCH"}</span>
                                </div>
                                <div className="text-right">
                                  <span className="block text-[7px] uppercase tracking-wider mb-0.5">Expiry</span>
                                  <span className="text-white font-medium">{cardExpiry || "MM/YY"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Card Input fields */}
                            <div className="space-y-4 text-xs">
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-1">Card Number (Stripe Secure Direct)</label>
                                <input
                                  type="text"
                                  required
                                  maxLength={16}
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                                  placeholder="4111 2222 3333 4444"
                                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition font-mono"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-1">Expiry Date</label>
                                  <input
                                    type="text"
                                    required
                                    maxLength={5}
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    placeholder="MM/YY"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-1">Security CVC</label>
                                  <input
                                    type="password"
                                    required
                                    maxLength={3}
                                    value={cardCVC}
                                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ""))}
                                    placeholder="•••"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C9A227] focus:bg-white transition font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === "paystack" && (
                          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-center space-y-2">
                            <p className="text-xs font-bold text-[#111111]">Paystack African Settlement Gateway</p>
                            <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                              You will be redirected securely to the Paystack checkout engine to finalize your masterpiece acquisition via Card, Bank transfer, or Mobile Money (NGN, GHS, ZAR, KES, USD).
                            </p>
                          </div>
                        )}

                        {paymentMethod === "flutterwave" && (
                          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 text-center space-y-2">
                            <p className="text-xs font-bold text-[#111111]">Flutterwave Global Curation Gateway</p>
                            <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                              Direct global multi-currency settlement. Complete your payment securely via cards, mobile wallets, or domestic direct deposit channels instantly.
                            </p>
                          </div>
                        )}

                        {paymentMethod === "bank_transfer" && (
                          <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 text-left space-y-4 text-xs">
                            <div className="border-b border-neutral-200 pb-2">
                              <p className="font-bold text-gray-900">Artora Curator Escrow Accounts</p>
                              <p className="text-[10px] text-gray-600 mt-0.5 font-light">Direct wire transfer logs require manual treasury validation.</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-gray-600 bg-white p-3 rounded-xl border border-neutral-100">
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-gray-600">Beneficiary Bank</span>
                                <span className="font-bold text-gray-800">Guild Capital Bank, NY</span>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-gray-600">Account Number</span>
                                <span className="font-bold text-gray-800">1090-4482-9901-209</span>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-gray-600">Routing (ABA / Transit)</span>
                                <span className="font-bold text-gray-800">021000021</span>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-gray-600">Swift / BIC</span>
                                <span className="font-bold text-gray-800">GUILDBKNYXXX</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-1">Sender Account Name</label>
                                <input
                                  type="text"
                                  value={wireSenderName}
                                  onChange={(e) => setWireSenderName(e.target.value)}
                                  placeholder="e.g. Genevieve Thorne C/O Guild Trust"
                                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] text-xs"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between p-2 bg-yellow-50/60 rounded-xl border border-yellow-100 text-[10px]">
                                <span className="text-gray-600">Simulate Uploading Bank Receipt?</span>
                                <button
                                  type="button"
                                  onClick={() => setBankReceiptUploaded(!bankReceiptUploaded)}
                                  className={`px-3 py-1 rounded-lg text-[9px] font-mono tracking-wider uppercase font-bold transition ${
                                    bankReceiptUploaded ? "bg-emerald-600 text-white" : "bg-neutral-800 text-white"
                                  }`}
                                >
                                  {bankReceiptUploaded ? "✓ Receipt Logged" : "Attach Draft Receipt"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === "wallet" && (
                          <div className="bg-[#111111] text-white p-6 rounded-2xl border border-white/10 text-center space-y-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">Secure Collector Ledger Balance</p>
                              <p className="text-2xl font-serif font-light">${collectorWalletBalance.toLocaleString()}</p>
                            </div>
                            
                            <div className="text-[11px] text-white/40 leading-relaxed max-w-sm mx-auto">
                              {orderTotal <= collectorWalletBalance ? (
                                <p className="text-emerald-400 font-bold">✓ Sufficient Ledger Balance. Immediate clear upon placement.</p>
                              ) : (
                                <p className="text-rose-400 font-bold">✗ Insufficient balance. Please purchase additional ledger credits.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {paymentMethod === "cod" && (
                          <div className="bg-[#C9A227]/5 p-6 rounded-2xl border border-[#C9A227]/20 text-center space-y-2">
                            <p className="text-xs font-bold text-gray-900">Cash / Card on Hand Delivery</p>
                            <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                              Pay direct to our Gallery Messenger Curator upon receiving the crates. Secure hand-held POS machine will be present. Available only for Local Gallery messenger deliveries.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Step Actions */}
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(1)}
                          className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition flex items-center space-x-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Shipping</span>
                        </button>
                        
                        <button
                          type="submit"
                          className="px-8 py-3.5 bg-[#111111] hover:bg-[#2E8B57] text-white text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition flex items-center space-x-2 shadow-md"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                          <span>Place Secure Order (${orderTotal.toLocaleString()})</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Order Summary Panel */}
            <div className="lg:col-span-5 text-left">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-sm space-y-6 sticky top-8">
                <h3 className="font-serif text-lg text-gray-900 border-b border-gray-100 pb-3">Order Summary</h3>

                {/* Items loop */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-gray-50">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex space-x-3 pt-3 first:pt-0">
                      <img src={item.product.imageUrl} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{item.product.title}</p>
                        <p className="text-[10px] text-gray-600 font-medium">By {item.product.artistName}</p>
                        
                        <div className="flex justify-between items-center mt-1">
                          {/* Mini count adjuster */}
                          <div className="flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5">
                            <button 
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="text-gray-500 hover:text-gray-800"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="font-mono text-[10px] text-gray-700 font-bold">{item.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="text-gray-500 hover:text-gray-800"
                              disabled={item.quantity >= item.product.inStock}
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <span className="font-mono text-xs font-bold text-gray-900">${item.product.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Panel */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <span className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold">Collector Promotion Code</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. ARTORA10, MASTERPIECE"
                      className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs font-mono uppercase focus:border-[#C9A227] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] text-xs font-mono uppercase font-bold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[10px] text-rose-500 font-medium">{promoError}</p>}
                  {promoSuccessMsg && <p className="text-[10px] text-emerald-600 font-medium">{promoSuccessMsg}</p>}
                  
                  {/* Standard codes hint */}
                  <div className="text-[9px] text-gray-600 bg-gray-50 p-2 rounded-lg flex justify-between font-mono">
                    <span>Try: <strong className="text-gray-700 select-all font-bold">ARTORA10</strong> (10% off) or <strong className="text-gray-700 select-all font-bold">GUILD50</strong> ($50)</span>
                  </div>
                </div>

                {/* Totals sheet */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Artwork Subtotal</span>
                    <span className="font-mono">${subtotal.toLocaleString()}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Collector Incentive ({appliedPromo?.code})</span>
                      <span className="font-mono">-${promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Premium Crate Packing ({getShippingLabel()})</span>
                    <span className="font-mono">{shippingFee === 0 ? "FREE" : `$${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Guild Ledger Taxes (8%)</span>
                    <span className="font-mono">${taxFee.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-bold text-gray-900">
                    <span>Total Acquisition Due</span>
                    <span className="font-mono text-[#C9A227] text-base">${orderTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-2">
                  <Globe className="w-4 h-4 text-[#C9A227] mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    <strong>Secure Shipping Ledger Protection</strong>: All direct original commissions transit in custom temperature-stable cedarwood vaults. Authenticity tags are added to physical objects instantly.
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* CONFIRMATION INVOICE RECEIPT VIEW */
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-gray-100 p-8 shadow-md text-center space-y-6"
            >
              <div className="w-16 h-16 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8" />
              </div>
              
              <div className="space-y-1.5">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#2E8B57] font-bold">Registry Logging Successful</p>
                <h2 className="font-serif text-2xl font-light text-gray-900">Original Masterpiece Acquired</h2>
                <p className="text-xs text-gray-600 max-w-sm mx-auto font-light leading-relaxed">
                  Congratulations. Your acquisition request was logged. Funds are locked to secure the artisan's direct studio ledger.
                </p>
              </div>

              {/* Dynamic Interactive Order Lifecycle Timeline */}
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-left space-y-4">
                <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">Ledger Pipeline Tracking</h3>
                
                <div className="relative pl-6 border-l-2 border-neutral-200 space-y-5 ml-2 text-xs">
                  {/* Step 1: Pending */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-emerald-600 border-4 border-white flex items-center justify-center text-white text-[7px]" />
                    <div>
                      <p className="font-bold text-gray-900">Order Pending Confirmation</p>
                      <p className="text-[10px] text-gray-600 mt-0.5 font-medium">Logged in Artora decentralized registry. Transaction ID: {placedOrderId}</p>
                    </div>
                  </div>

                  {/* Step 2: Escrow Confirmed */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-emerald-600 border-4 border-white flex items-center justify-center text-white text-[7px]" />
                    <div>
                      <p className="font-bold text-gray-900">Escrow Secured & Settlement Processed</p>
                      <p className="text-[10px] text-gray-600 mt-0.5 font-medium">Cleared via {paymentMethod === "card" ? "Credit Card (Stripe)" : paymentMethod === "paystack" ? "Paystack" : paymentMethod === "flutterwave" ? "Flutterwave" : paymentMethod === "bank_transfer" ? "Bank Wire Transfer" : paymentMethod === "wallet" ? "Artora Wallet" : "Cash on Delivery"}.</p>
                    </div>
                  </div>

                  {/* Step 3: Preparing (Active In-Progress State) */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center text-white text-[7px] animate-pulse" />
                    <div>
                      <p className="font-bold text-gray-900 flex items-center gap-2">
                        <span>Studio Craters Building Custom Timber Vault</span>
                        <span className="text-[8px] bg-amber-50 border border-amber-200 text-amber-700 px-1 py-0.2 rounded font-mono font-bold">CURRENT STATE</span>
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5 font-medium">Artisans are crafting temperature-stable cedarwood vaults specific to the dimension of your artwork.</p>
                    </div>
                  </div>

                  {/* Step 4: Shipped */}
                  <div className="relative opacity-60">
                    <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-neutral-200 border-4 border-white flex items-center justify-center text-white text-[7px]" />
                    <div>
                      <p className="font-medium text-gray-600">Dispatched via {getShippingLabel()}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5 font-medium">Estimated transit: {getShippingEst()}. Tracking log will activate shortly.</p>
                    </div>
                  </div>

                  {/* Step 5: Delivered */}
                  <div className="relative opacity-60">
                    <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-neutral-200 border-4 border-white flex items-center justify-center text-white text-[7px]" />
                    <div>
                      <p className="font-medium text-gray-600">Hand-Receipt Finalized</p>
                      <p className="text-[10px] text-gray-600 mt-0.5 font-medium">Physical white-glove courier hand-off completed with secure authentication key.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Receipt details */}
              <div className="border border-dashed border-gray-200 bg-gray-50 rounded-2xl p-6 text-left space-y-4">
                <div className="flex justify-between text-[9px] font-mono text-gray-600 uppercase tracking-wider pb-3 border-b border-gray-200/50">
                  <span>Invoice # {placedOrderId}</span>
                  <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span>
                </div>

                <div className="space-y-2.5">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs text-gray-700">
                      <div>
                        <span className="font-medium text-gray-900">{item.product.title}</span>
                        <span className="text-gray-600 font-light block text-[10px]">By {item.product.artistName} (Qty x{item.quantity})</span>
                      </div>
                      <span className="font-mono text-gray-900">${(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200/50 pt-3 space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between text-[11px]">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toLocaleString()}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[11px] text-emerald-600">
                      <span>Collector Incentive ({appliedPromo?.code})</span>
                      <span className="font-mono">-${promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px]">
                    <span>Insured Packaging ({getShippingLabel()})</span>
                    <span className="font-mono">{shippingFee === 0 ? "FREE" : `$${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Taxes</span>
                    <span className="font-mono">${taxFee.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-gray-900 text-sm border-t border-dashed border-gray-200 mt-2 pt-2">
                    <span>Acquisition Settlement</span>
                    <span className="font-mono text-[#C9A227]">${orderTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Shipping Destination */}
                <div className="border-t border-gray-200/50 pt-3 space-y-1 text-[10px] text-gray-600">
                  <span className="font-mono uppercase tracking-wider block">Registry Destination</span>
                  <p className="text-gray-700 font-light text-xs mt-0.5">{deliveryMethod === "pickup" ? "Guild Hall Curatorial Chamber (Direct Collection)" : `${address}, ${city}, ${state} ${zipCode}`}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate("marketplace")}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition text-center font-mono uppercase tracking-wider"
                >
                  Marketplace
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#111111] rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition shadow-md"
                >
                  My Collector Hub
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

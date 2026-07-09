import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Bug, 
  Sparkles, 
  Heart, 
  HelpCircle, 
  Star, 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  Info
} from "lucide-react";

interface FeedbackCenterProps {
  onBackToHome: () => void;
}

export default function FeedbackCenter({ onBackToHome }: FeedbackCenterProps) {
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "rate" | "support">("rate");
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [severity, setSeverity] = useState<string>("Medium");
  const [featureCategory, setFeatureCategory] = useState<string>("UI/UX");
  const [textFeedback, setTextFeedback] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");

  const handleTypeChange = (type: "bug" | "feature" | "rate" | "support") => {
    setFeedbackType(type);
    setTextFeedback("");
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textFeedback.trim() && feedbackType !== "rate") return;

    // Simulate ticket generation
    const randomTicket = `ART-FB-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(randomTicket);
    setIsSubmitted(true);

    // Save to local storage mock collection
    const savedFeedback = localStorage.getItem("artora_beta_feedback");
    const currentList = savedFeedback ? JSON.parse(savedFeedback) : [];
    const newFeedback = {
      id: randomTicket,
      type: feedbackType,
      rating: feedbackType === "rate" ? rating : null,
      severity: feedbackType === "bug" ? severity : null,
      category: feedbackType === "feature" ? featureCategory : null,
      text: textFeedback,
      email: userEmail || "anonymous@artora.com",
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("artora_beta_feedback", JSON.stringify([newFeedback, ...currentList]));
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] pb-24 text-left font-sans">
      
      {/* Visual Header */}
      <div className="bg-[#111111] text-[#F8F8F6] py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <button 
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#C9A227] hover:text-white transition duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio</span>
          </button>
          
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-mono font-bold block">Artora Beta Program</span>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight">Feedback &amp; Quality Guild</h1>
            <p className="max-w-2xl text-xs md:text-sm text-white/60 font-light leading-relaxed">
              Help us refine the digital craft experience. Report friction, suggest premium additions, or log visual bugs. Every report enters our physical ledger review.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Category Picker & Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base text-gray-900 font-medium">Feedback Category</h3>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => handleTypeChange("rate")}
                className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl text-xs font-semibold tracking-wider transition text-left border ${
                  feedbackType === "rate"
                    ? "bg-[#C9A227]/10 border-[#C9A227] text-amber-950"
                    : "bg-white border-neutral-100 text-gray-500 hover:bg-neutral-50"
                }`}
              >
                <Star className="w-4.5 h-4.5 text-[#C9A227] fill-current" />
                <span className="flex-1">Rate Experience</span>
              </button>

              <button
                onClick={() => handleTypeChange("bug")}
                className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl text-xs font-semibold tracking-wider transition text-left border ${
                  feedbackType === "bug"
                    ? "bg-red-50 border-red-200 text-red-900"
                    : "bg-white border-neutral-100 text-gray-500 hover:bg-neutral-50"
                }`}
              >
                <Bug className="w-4.5 h-4.5 text-red-500" />
                <span className="flex-1">Report Bug</span>
              </button>

              <button
                onClick={() => handleTypeChange("feature")}
                className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl text-xs font-semibold tracking-wider transition text-left border ${
                  feedbackType === "feature"
                    ? "bg-blue-50 border-blue-200 text-blue-900"
                    : "bg-white border-neutral-100 text-gray-500 hover:bg-neutral-50"
                }`}
              >
                <Sparkles className="w-4.5 h-4.5 text-blue-500" />
                <span className="flex-1">Suggest Feature</span>
              </button>

              <button
                onClick={() => handleTypeChange("support")}
                className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl text-xs font-semibold tracking-wider transition text-left border ${
                  feedbackType === "support"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-white border-neutral-100 text-gray-500 hover:bg-neutral-50"
                }`}
              >
                <HelpCircle className="w-4.5 h-4.5 text-emerald-500" />
                <span className="flex-1">Contact Support</span>
              </button>
            </div>
          </div>

          <div className="bg-neutral-900 text-white rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />
            <h4 className="font-serif text-sm text-[#C9A227] font-semibold tracking-widest uppercase">Artora Core Spec</h4>
            <div className="divide-y divide-white/10 text-xs font-mono text-white/70">
              <div className="flex justify-between py-2">
                <span>Core Spec:</span>
                <span className="text-[#C9A227] font-bold">V-26 Guild</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Client Engine:</span>
                <span>v0.6.0-beta</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Security Ledger:</span>
                <span className="text-emerald-400">Connected</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Deploy Node:</span>
                <span>Cloud-Run-2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-gray-900">Feedback Audited Successfully</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Your report has been received and logged directly onto the Artora quality pipeline.
                  </p>
                </div>
                <div className="inline-block p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-left max-w-xs w-full">
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold border-b border-gray-200/60 pb-1.5 mb-1.5 uppercase">
                    <span>Ledger Ticket</span>
                    <span>Status</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-800">{ticketId}</span>
                    <span className="text-emerald-600 font-bold">QUEUED_FOR_REVIEWS</span>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setTextFeedback("");
                    }}
                    className="px-5 py-2.5 bg-gray-900 hover:bg-[#C9A227] text-white hover:text-gray-900 text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition shadow-xs"
                  >
                    Submit Another Report
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key={feedbackType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* 1. Star Rating Form */}
                {feedbackType === "rate" && (
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-serif text-lg text-gray-900">Rate Your Experience</h3>
                      <p className="text-xs text-gray-400 font-light mt-0.5">Let us know how satisfied you are with the Artora marketplace client.</p>
                    </div>

                    <div className="flex items-center space-x-1.5 py-4">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isSelected = starValue <= rating;
                        const isHovered = hoveredRating !== null && starValue <= hoveredRating;
                        return (
                          <button
                            key={starValue}
                            type="button"
                            onMouseEnter={() => setHoveredRating(starValue)}
                            onMouseLeave={() => setHoveredRating(null)}
                            onClick={() => setRating(starValue)}
                            className="p-1 transition-all hover:scale-120"
                          >
                            <Star 
                              className={`w-10 h-10 transition-colors ${
                                isHovered || (!hoveredRating && isSelected)
                                  ? "text-[#C9A227] fill-[#C9A227]"
                                  : "text-gray-200"
                              }`} 
                            />
                          </button>
                        );
                      })}
                      <span className="text-xs font-mono text-[#C9A227] font-bold uppercase pl-4">
                        {rating === 5 ? "Exquisite (5/5)" :
                         rating === 4 ? "Polished (4/5)" :
                         rating === 3 ? "Functional (3/5)" :
                         rating === 2 ? "Friction (2/5)" : "Broken (1/5)"}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Bug Reporting Details */}
                {feedbackType === "bug" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-2 border-b border-gray-100 pb-3">
                      <h3 className="font-serif text-lg text-gray-900">Report a Bug</h3>
                      <p className="text-xs text-gray-400 font-light mt-0.5">Describe visual or functional bugs to our engineering studio.</p>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Bug Severity</label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 outline-hidden focus:border-[#C9A227]"
                      >
                        <option value="Low">Low (Visual flicker, typo)</option>
                        <option value="Medium">Medium (Incorrect counts, navigation glitch)</option>
                        <option value="High">High (Checkout failure, profile edit error)</option>
                        <option value="Critical">Critical (Application crash, loss of registry)</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Operating Platform</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 font-mono select-none">
                        Chrome-V8 / React Container
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Feature Suggestions */}
                {feedbackType === "feature" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-2 border-b border-gray-100 pb-3">
                      <h3 className="font-serif text-lg text-gray-900">Suggest a Feature</h3>
                      <p className="text-xs text-gray-400 font-light mt-0.5">Recommend luxurious enhancements or practical utilities.</p>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Feature Category</label>
                      <select
                        value={featureCategory}
                        onChange={(e) => setFeatureCategory(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 outline-hidden focus:border-[#C9A227]"
                      >
                        <option value="UI/UX">UI &amp; Luxury Transitions</option>
                        <option value="Products">Craft &amp; Creator Profiles</option>
                        <option value="Community">Guild Conversations &amp; Journal</option>
                        <option value="Wallet">Secure Escrow Checkout</option>
                        <option value="Ledger">Material Authenticity Registry</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Priority Alignment</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 font-mono select-none">
                        Beta Community Backlog
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. General Support */}
                {feedbackType === "support" && (
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-serif text-lg text-gray-900">Contact Studio Support</h3>
                      <p className="text-xs text-gray-400 font-light mt-0.5">Need help with direct commissions or physical ledger verification?</p>
                      <p className="text-xs mt-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-gray-600 font-sans flex items-center space-x-2">
                        <span className="font-semibold text-[#C9A227]">Direct Email:</span>
                        <a href="mailto:joinartora@gmail.com" className="underline hover:text-[#C9A227] font-mono font-bold">joinartora@gmail.com</a>
                      </p>
                    </div>
                  </div>
                )}

                {/* Text Description Box */}
                <div className="space-y-1 text-left">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold block">
                    {feedbackType === "rate" ? "Share Your Thoughts (Optional)" : "Detailed Chronicle Information"}
                  </label>
                  <textarea
                    required={feedbackType !== "rate"}
                    value={textFeedback}
                    onChange={(e) => setTextFeedback(e.target.value)}
                    placeholder={
                      feedbackType === "rate" ? "Tell us what you loved about Artora or what we can refine..." :
                      feedbackType === "bug" ? "Provide step-by-step details of the glitch, visual error, or overflow..." :
                      feedbackType === "feature" ? "Explain the custom utility or interface refinement you'd love to see..." :
                      "What issues are you encountering with your account, shipping crate, or direct commissions?..."
                    }
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-sans text-gray-700 outline-hidden focus:border-[#C9A227] focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Optional Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Your Correspondence Email</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="collector@artora.com"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 outline-hidden focus:border-[#C9A227] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="flex items-end pb-1.5 text-[10px] text-gray-400 font-light leading-snug">
                    <span className="flex items-center gap-1.5 bg-gray-100/50 p-3 rounded-xl border border-gray-200/40 w-full">
                      <Info className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                      <span>We correspond within 24 hours on premium commission concerns.</span>
                    </span>
                  </div>
                </div>

                {/* Submit Trigger */}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-mono text-[9px] text-gray-400">
                    Artora Build 011 • Release 2026
                  </span>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gray-900 hover:bg-[#C9A227] text-white hover:text-gray-900 text-xs font-mono tracking-widest uppercase font-bold rounded-xl transition-all duration-300 shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Log Feedback Report</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}

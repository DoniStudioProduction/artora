import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Globe, 
  Store, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  X,
  CheckCircle
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Discover Unique Art & Handcrafted Pieces",
      description: "Step into a curated gallery of verified original masterpieces, hand-thrown stoneware pottery, bespoke jewelry, and fine woodwork. Every physical object carries our signature material authenticity.",
      icon: Compass,
      color: "from-[#C9A227]/20 to-transparent",
      visual: (
        <div className="relative w-full h-48 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-xs">
          <div className="absolute inset-0 bg-radial from-amber-50/40 via-transparent to-transparent" />
          <div className="relative flex items-center justify-center space-x-4">
            {/* Elegant physical pottery representation */}
            <div className="w-16 h-24 bg-[#E6D9C5] rounded-t-full rounded-b-3xl border border-[#C9A227]/30 flex items-center justify-center shadow-sm relative transform -rotate-6">
              <span className="absolute top-4 w-6 h-[1px] bg-amber-800/10" />
              <span className="absolute bottom-6 w-10 h-[1px] bg-amber-800/15" />
            </div>
            {/* Elegant framed art */}
            <div className="w-24 h-28 bg-white border-4 border-neutral-900 rounded-sm shadow-md flex flex-col justify-between p-2 relative z-10">
              <div className="w-full h-16 bg-gradient-to-tr from-[#C9A227]/40 to-amber-50 rounded-xs flex items-center justify-center">
                <Compass className="w-6 h-6 text-amber-800/60" />
              </div>
              <div className="h-4 flex items-center justify-between">
                <span className="w-10 h-1.5 bg-neutral-200 rounded-full" />
                <span className="w-3 h-1.5 bg-[#C9A227] rounded-full" />
              </div>
            </div>
            {/* Elegant visual ring */}
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C9A227]/50 flex items-center justify-center transform rotate-12 bg-amber-50/20">
              <span className="w-8 h-8 rounded-full bg-white border border-[#C9A227]/20 shadow-xs" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Support Talented Creators Worldwide",
      description: "Artora connects you directly with independent artisans across the globe. By purchasing through our secured direct escrow, you guarantee that studio livelihoods are fully sustained and appreciated.",
      icon: Globe,
      color: "from-blue-500/10 to-transparent",
      visual: (
        <div className="relative w-full h-48 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-xs">
          <div className="absolute inset-0 bg-radial from-blue-50/40 via-transparent to-transparent" />
          <div className="relative flex flex-col items-center space-y-4">
            <div className="flex -space-x-4">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm relative z-10" />
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80" className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm" />
            </div>
            <div className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-3 py-1 rounded-full border border-emerald-100 font-bold tracking-wider uppercase flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Direct Studio Payouts</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Open Your Own Creator Store",
      description: "Host your beautiful virtual gallery inside Artora. Track product inventory, write a physical journal, trace your Creative DNA style, and process payments securely in a unified, premium space.",
      icon: Store,
      color: "from-emerald-500/10 to-transparent",
      visual: (
        <div className="relative w-full h-48 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-xs">
          <div className="absolute inset-0 bg-radial from-emerald-50/30 via-transparent to-transparent" />
          <div className="relative w-64 p-3 bg-[#F8F8F6] rounded-xl border border-neutral-200/60 shadow-sm flex flex-col space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <span className="font-serif text-xs font-bold text-gray-800">Studio Dashboard</span>
              <span className="font-mono text-[8px] bg-[#C9A227]/20 text-[#C9A227] px-1.5 py-0.5 rounded uppercase font-bold">Active Store</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-neutral-100">
                <span className="block text-[8px] text-gray-500 uppercase">Sales Volume</span>
                <span className="font-mono text-xs font-bold text-gray-900">$12,490</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-neutral-100">
                <span className="block text-[8px] text-gray-500 uppercase">Live Products</span>
                <span className="font-mono text-xs font-bold text-[#C9A227]">14 Pieces</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Build a Global Creative Community",
      description: "Participate in local guild conversations, custom order direct message inquiries, and write workshop stories. Cultivate intimate collector connections built on confidence, trust, and shared values.",
      icon: Users,
      color: "from-[#C9A227]/20 to-transparent",
      visual: (
        <div className="relative w-full h-48 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-xs">
          <div className="absolute inset-0 bg-radial from-amber-50/40 via-transparent to-transparent" />
          <div className="relative w-64 space-y-2 text-xs">
            <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 text-left flex items-start space-x-2.5 max-w-[85%]">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&h=60&q=80" className="w-6 h-6 rounded-full object-cover border border-[#C9A227]" />
              <div>
                <p className="text-[10px] font-bold text-gray-800">Collector Sophia</p>
                <p className="text-[9px] text-gray-500 font-light leading-snug">Can you craft this stoneware plate in cobalt blue?</p>
              </div>
            </div>
            <div className="bg-[#C9A227]/10 p-2.5 rounded-2xl border border-[#C9A227]/20 text-right flex items-start space-x-2.5 max-w-[85%] ml-auto justify-end">
              <div className="text-right">
                <p className="text-[10px] font-bold text-amber-900">Artisan Guild</p>
                <p className="text-[9px] text-amber-800 font-light leading-snug">Yes, let's create a custom order for you.</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#C9A227] text-white flex items-center justify-center text-[9px] font-bold">AG</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("artora_onboarded", "true");
    onComplete();
  };

  const SlideIcon = slides[currentSlide].icon;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#090909]/90 backdrop-blur-md overflow-y-auto select-none">
      
      {/* Background spot light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] aspect-square rounded-full bg-radial from-[#C9A227]/5 to-transparent blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-[#F8F8F6] rounded-3xl border border-white/25 overflow-hidden shadow-2xl flex flex-col z-10"
      >
        {/* Skip button top-right */}
        <button 
          onClick={handleComplete}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors z-20"
          title="Skip Onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic decorative colored background gradient */}
        <div className={`h-2 bg-gradient-to-r ${slides[currentSlide].color} w-full transition-all duration-500`} />

        {/* Content body */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
          
          {/* Header section with icon & step count */}
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white rounded-2xl border border-neutral-100 shadow-xs text-[#C9A227]">
              <SlideIcon className="w-6 h-6" />
            </div>
            <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
              Tour {currentSlide + 1} / {slides.length}
            </span>
          </div>

          {/* Core dynamic content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h2 className="font-serif text-2xl md:text-3xl text-gray-900 tracking-tight leading-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {slides[currentSlide].description}
              </p>

              {/* Slide specific Visual Asset */}
              <div className="pt-2">
                {slides[currentSlide].visual}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-8 bg-[#C9A227]" : "w-2 bg-gray-200"
                }`}
                aria-label={`Go to tour slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Controls footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Back Button */}
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className={`flex items-center space-x-1 font-mono text-xs uppercase tracking-widest font-bold px-3 py-2.5 rounded-xl border transition ${
                currentSlide === 0 
                  ? "opacity-35 border-transparent text-gray-400 cursor-not-allowed" 
                  : "border-gray-200 hover:border-gray-900 hover:bg-white text-gray-700"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {/* Skip Option */}
            {currentSlide < slides.length - 1 && (
              <button
                onClick={handleComplete}
                className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-gray-900 font-semibold transition"
              >
                Skip Tour
              </button>
            )}

            {/* Next / Launch Button */}
            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 font-mono text-xs uppercase tracking-widest font-bold bg-[#111111] hover:bg-[#C9A227] text-white hover:text-gray-900 px-5 py-2.5 rounded-xl transition duration-300 shadow-md"
            >
              <span>{currentSlide === slides.length - 1 ? "Launch" : "Next"}</span>
              {currentSlide === slides.length - 1 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

        </div>
      </motion.div>

    </div>
  );
}

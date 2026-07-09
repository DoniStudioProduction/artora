import { motion } from "motion/react";
import { ArrowRight, Sparkles, ShieldCheck, Globe, HelpCircle } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
  onBecomeCreatorClick: () => void;
}

export default function Hero({ onExploreClick, onBecomeCreatorClick }: HeroProps) {
  return (
    <section id="hero-section" className="relative bg-[#F8F8F6] pt-12 pb-20 md:py-28 overflow-hidden border-b border-[#111111]/5">
      
      {/* Background ambient light */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-10 bottom-0 w-80 h-80 bg-[#2E8B57]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Left Column (5 cols or 7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-[#111111]/5 px-3.5 py-1.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-700 font-bold">
                Direct-from-Studio Curated Guild
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#111111] leading-[1.1] tracking-tight"
              >
                Discover Original Art <br />
                <span className="italic font-light text-[#C9A227]">&amp; Handmade Craft.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-sans text-sm md:text-base text-gray-600 max-w-xl font-light leading-relaxed"
              >
                Buy directly from artists and artisans around the world. We bypass galleries and middlemen to distribute **90% of all revenues** directly to workshop guilds.
              </motion.p>
            </div>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={onExploreClick}
                className="px-8 py-4 bg-[#111111] text-[#F8F8F6] text-xs font-sans uppercase font-bold tracking-widest rounded-xl hover:bg-[#111111]/90 shadow-lg shadow-black/5 hover:translate-y-[-1px] transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 text-[#C9A227]" />
              </button>

              <button
                onClick={onBecomeCreatorClick}
                className="px-8 py-4 border border-[#111111]/25 text-[#111111] text-xs font-sans uppercase font-bold tracking-widest rounded-xl hover:border-[#111111] hover:bg-white/40 hover:translate-y-[-1px] transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <span>Become a Creator</span>
              </button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="pt-8 border-t border-gray-200 grid grid-cols-3 gap-6 max-w-lg font-sans"
            >
              <div>
                <p className="font-serif text-2xl font-bold text-gray-900">420+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1 font-semibold">Verified Studios</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-gray-900">90%</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1 font-semibold">Direct Earnings</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-gray-900">100%</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1 font-semibold">Insured Shipping</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column - Luxury Collage (5 cols) */}
          <div className="lg:col-span-5 relative h-[420px] md:h-[500px] w-full flex items-center justify-center mt-6 lg:mt-0">
            
            {/* Main Center Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-72 md:w-80 h-96 md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white"
            >
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
                alt="Contemporary abstract artwork frame"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-white/50 shadow-sm">
                <div>
                  <p className="text-[10px] font-bold text-gray-900 font-sans uppercase">Ethereal Echoes Canvas</p>
                  <p className="text-[9px] text-[#C9A227] font-mono">By Elena Rostova</p>
                </div>
                <span className="font-mono text-xs font-black text-gray-900">$1,850</span>
              </div>
            </motion.div>

            {/* Floating Left Image */}
            <motion.div
              initial={{ x: -40, y: 50, opacity: 0 }}
              animate={{ x: -110, y: 110, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute hidden sm:block w-44 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-[#F8F8F6] bg-[#F8F8F6]"
            >
              <img
                src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=500&q=80"
                alt="Finely sculpted ceramic vase"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Floating Right Image */}
            <motion.div
              initial={{ x: 40, y: -50, opacity: 0 }}
              animate={{ x: 120, y: -100, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute hidden sm:block w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-[#F8F8F6] bg-[#F8F8F6]"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80"
                alt="Brutalist handmade rings"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Behind Ambient Glow Frame */}
            <div className="absolute w-[360px] h-[360px] border border-dashed border-[#C9A227]/30 rounded-full animate-spin-slow pointer-events-none -z-10" />

          </div>
          
        </div>
      </div>
    </section>
  );
}

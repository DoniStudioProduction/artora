import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, ShieldAlert, Heart, Globe, Mail } from "lucide-react";
import LegalHub, { LegalDocTab } from "./LegalHub";

interface FooterProps {
  setSelectedCategory: (cat: string) => void;
  setIsBecomeCreatorOpen: (open: boolean) => void;
  scrollToTop: () => void;
  onNavigate?: (view: string) => void;
}

export default function Footer({ setSelectedCategory, setIsBecomeCreatorOpen, scrollToTop, onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalDocTab>("privacy");

  useEffect(() => {
    const handleOpenLegal = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: LegalDocTab }>;
      if (customEvent.detail && customEvent.detail.tab) {
        setLegalTab(customEvent.detail.tab);
        setLegalOpen(true);
      }
    };
    window.addEventListener("artora-open-legal", handleOpenLegal);
    return () => {
      window.removeEventListener("artora-open-legal", handleOpenLegal);
    };
  }, []);

  const openLegalDocument = (tab: LegalDocTab) => {
    setLegalTab(tab);
    setLegalOpen(true);
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes("@")) {
      setIsSubscribed(true);
      setNewsletterEmail("");
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    window.scrollTo({ top: 800, behavior: "smooth" });
  };

  return (
    <footer id="main-footer" className="bg-[#111111] text-[#F8F8F6] pt-20 pb-12 font-sans border-t border-white/5 relative overflow-hidden">
      
      {/* Decorative dark vector element */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand & Narrative (4 cols) */}
          <div className="md:col-span-4 space-y-6 text-left">
            <div className="flex items-center space-x-2">
              <span 
                onClick={scrollToTop}
                className="font-serif text-3xl font-bold tracking-[0.2em] text-[#F8F8F6] cursor-pointer hover:opacity-80 transition"
              >
                ARTORA
              </span>
              <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
            </div>
            
            <p className="text-xs text-[#F8F8F6]/80 font-light leading-relaxed max-w-sm">
              Artora is a premium global marketplace and creative guild. We connect discerning collectors directly with independent artisans, securing studio livelihood and verifying physical material authenticity.
            </p>

            <div className="flex items-center space-x-1.5 font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Slow Craft Worldwide Guild</span>
            </div>
          </div>

          {/* Column 2: Navigation link directories (5 cols: 2 + 2 + 1) */}
          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 text-left">
            
            {/* Sub column: Marketplace */}
            <div className="space-y-4">
              <h4 className="font-serif text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
                Explore Art
              </h4>
              <ul className="space-y-2.5 text-xs text-[#F8F8F6]/80 font-light">
                {["Paintings", "Pottery", "Jewelry", "Woodwork", "Sculpture"].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className="hover:text-white transition duration-200"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sub column: Guild Community */}
            <div className="space-y-4">
              <h4 className="font-serif text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
                The Guild
              </h4>
              <ul className="space-y-2.5 text-xs text-[#F8F8F6]/80 font-light">
                <li>
                  <button onClick={() => setIsBecomeCreatorOpen(true)} className="hover:text-white transition duration-200">
                    Become a Creator
                  </button>
                </li>
                <li>
                  <a href="#creator-stories" className="hover:text-white transition duration-200">
                    Creator Diaries
                  </a>
                </li>
                <li>
                  <a href="#why-artora-section" className="hover:text-white transition duration-200">
                    Guild Charter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition duration-200">
                    Material Standards
                  </a>
                </li>
              </ul>
            </div>

            {/* Sub column: Client Support */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="font-serif text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
                Services
              </h4>
              <ul className="space-y-2.5 text-xs text-[#F8F8F6]/80 font-light">
                <li>
                  <a href="#" className="hover:text-white transition duration-200">
                    Crate Packing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition duration-200">
                    Safe Insurance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition duration-200">
                    Certificates
                  </a>
                </li>
                <li>
                  {onNavigate ? (
                    <button onClick={() => onNavigate("feedback")} className="hover:text-white transition duration-200 cursor-pointer text-left">
                      Beta Feedback
                    </button>
                  ) : (
                    <a href="#" className="hover:text-white transition duration-200">
                      Beta Feedback
                    </a>
                  )}
                </li>
                <li className="pt-2 border-t border-white/10">
                  <a href="mailto:joinartora@gmail.com" className="text-[#C9A227] hover:text-white transition duration-200 text-[10px] font-mono tracking-wider block mt-1">
                    joinartora@gmail.com
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Column 3: Newsletter Sign-Up (3 cols) */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="font-serif text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
              The Artora Gazette
            </h4>
            
            <p className="text-xs text-[#F8F8F6]/75 font-light leading-relaxed">
              Subscribe to receive private workshop drops, artist narrative chronicles, and local guild stories.
            </p>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form
                  key="subscribe-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex border-b border-white/20 pb-1.5 focus-within:border-[#C9A227] transition"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-transparent text-xs font-sans outline-none w-full placeholder:text-white/30 text-white"
                  />
                  <button
                    type="submit"
                    className="p-1 hover:text-[#C9A227] transition"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="subscribe-success"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-[#2E8B57]/10 border border-[#2E8B57]/20 rounded-xl flex items-center space-x-2 text-[#2E8B57]"
                >
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
                    Gazette Subscription Successful
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Footer Bottom Row (Copyright & Legal) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-mono text-[#F8F8F6]/65 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Artora Inc. All rights reserved. Handcrafted digital product. <span className="text-[#C9A227] font-bold tracking-wider ml-1 uppercase text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/10">Artora v1.0-beta</span>
          </p>

          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2 text-[10px] font-mono text-[#F8F8F6]/65">
            <button onClick={() => openLegalDocument("privacy")} className="hover:text-white transition cursor-pointer">Privacy Charter</button>
            <button onClick={() => openLegalDocument("terms")} className="hover:text-white transition cursor-pointer">Collector Terms</button>
            <button onClick={() => openLegalDocument("refunds")} className="hover:text-white transition cursor-pointer">Refund & Escrow</button>
            <button onClick={() => openLegalDocument("creator")} className="hover:text-white transition cursor-pointer">Creator Guidelines</button>
            <button onClick={() => openLegalDocument("protection")} className="hover:text-white transition cursor-pointer">Collector Protection</button>
          </div>
        </div>

      </div>

      <LegalHub isOpen={legalOpen} onClose={() => setLegalOpen(false)} defaultTab={legalTab} />
    </footer>
  );
}

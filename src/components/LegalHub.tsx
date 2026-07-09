import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Key, FileText, RefreshCw, Sparkles, Mail, Heart } from "lucide-react";

export type LegalDocTab = "privacy" | "terms" | "refunds" | "creator" | "protection";

interface LegalHubProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalDocTab;
}

export default function LegalHub({ isOpen, onClose, defaultTab = "privacy" }: LegalHubProps) {
  const [activeTab, setActiveTab] = useState<LegalDocTab>(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      // Lock scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, defaultTab]);

  // Support custom event to change tabs dynamically
  useEffect(() => {
    const handleSetTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: LegalDocTab }>;
      if (customEvent.detail && customEvent.detail.tab) {
        setActiveTab(customEvent.detail.tab);
      }
    };
    window.addEventListener("artora-set-legal-tab", handleSetTab);
    return () => {
      window.removeEventListener("artora-set-legal-tab", handleSetTab);
    };
  }, []);

  const tabs = [
    { id: "privacy" as LegalDocTab, label: "Privacy Charter", icon: Key },
    { id: "terms" as LegalDocTab, label: "Collector Terms", icon: FileText },
    { id: "refunds" as LegalDocTab, label: "Refund & Escrow", icon: RefreshCw },
    { id: "creator" as LegalDocTab, label: "Creator Guidelines", icon: Sparkles },
    { id: "protection" as LegalDocTab, label: "Collector Protection", icon: ShieldCheck },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            id="legal-hub-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-[#141414] border border-white/10 w-full max-w-4xl h-[85vh] sm:h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 text-white font-sans"
            id="legal-hub-modal"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-neutral-900/40">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-[#C9A227]" />
                <div>
                  <h2 className="font-serif text-lg tracking-tight text-white">Artora Trust & Legal Sanctuary</h2>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">
                    ARTORA v1.0 • Public Beta Curation Charter
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition text-gray-400 hover:text-white"
                id="btn-close-legal-hub"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main content body (Flexible layout: Sidebar on desktop, top bar on mobile) */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Tab Selector */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-neutral-900/20 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0 scrollbar-none">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-xs font-medium transition duration-200 shrink-0 md:shrink-1 ${
                        isActive
                          ? "bg-[#C9A227] text-black font-bold"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      id={`btn-legal-tab-${tab.id}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap md:whitespace-normal">{tab.label}</span>
                    </button>
                  );
                })}

                <div className="hidden md:block mt-auto p-4 border-t border-white/5 space-y-2">
                  <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest text-center">
                    Guild Verification
                  </p>
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed font-light">
                    Your patronage directly funds artisanal slow-craft communities worldwide.
                  </p>
                </div>
              </div>

              {/* Document Display Area */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6" id="legal-hub-content-container">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {activeTab === "privacy" && (
                      <div className="space-y-6">
                        <div className="space-y-2 border-b border-white/5 pb-4">
                          <h3 className="font-serif text-2xl text-white">Privacy & Identity Charter</h3>
                          <p className="text-[11px] font-mono text-[#C9A227] uppercase tracking-wider">
                            Last Updated: July 2026
                          </p>
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed font-light">
                          At Artora, we believe that an artisan's studio is a private sanctuary, and a collector's patronage is a personal legacy. Our digital system is designed under strict privacy-first principles to secure transaction histories, private communications, and shipping registries.
                        </p>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-[#C9A227] flex items-center gap-2">
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded font-mono">1.</span>
                            Secure Direct Communications
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Private messaging channels between fine art buyers and studio creators are restricted solely to the authorized participants of each chat thread. No corporate marketing crawlers analyze your creative commission details or visual attachment handshakes.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-[#C9A227] flex items-center gap-2">
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded font-mono">2.</span>
                            Patron Data & Financial Encryption
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Payment parameters, shipping coordinates, and transaction logs are integrated securely. Artora does not trade, distribute, or leverage patron information for programmatic advertising models.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-[#C9A227] flex items-center gap-2">
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded font-mono">3.</span>
                            Data Retention & Erasure
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Any collector or creator holds the right to query, export, or completely clear their guild registration records. Once an escrow transaction is marked closed, secondary diagnostic shipping tags are purged from active indexing directories within 30 business days.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center space-x-3 text-xs text-gray-400">
                          <Mail className="w-4 h-4 text-[#C9A227]" />
                          <span>Direct Privacy Inquiry: <a href="mailto:joinartora@gmail.com" className="underline hover:text-[#C9A227] font-mono">joinartora@gmail.com</a></span>
                        </div>
                      </div>
                    )}

                    {activeTab === "terms" && (
                      <div className="space-y-6">
                        <div className="space-y-2 border-b border-white/5 pb-4">
                          <h3 className="font-serif text-2xl text-white">Collector Terms & Guild Agreement</h3>
                          <p className="text-[11px] font-mono text-[#C9A227] uppercase tracking-wider">
                            Standard Terms • Public Beta v1.0
                          </p>
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed font-light">
                          These terms outline the rights and obligations of collectors purchasing authentic original creations, customized commissions, or physical slow-craft items. By executing transactions inside Artora, you acknowledge and agree to this framework.
                        </p>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-[#C9A227] flex items-center gap-2">
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded font-mono">A.</span>
                            Physical Escrow & Transaction Clears
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Funds transferred during masterwork orders are locked securely in our digital escrow layer. The platform holds these funds until delivery is verified or the 14-day tracking lock expires, protecting collectors from non-fulfillment and guaranteeing artists complete payment.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-[#C9A227] flex items-center gap-2">
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded font-mono">B.</span>
                            Commission Contracts & Tailored Design
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Custom commission agreements initiated through direct messages define separate material fees, drafting states, and delivery expectations. Cancellation request features exist inside the dashboard workspace, returning capital to wallet registries under the terms of the individual artisan contract.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-[#C9A227] flex items-center gap-2">
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded font-mono">C.</span>
                            Ledger Ownership Rights
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Each physical piece sold carries a registered digital ledger entry confirming its workshop pedigree and material details. Upon payment clearing, the ledger ownership is transferred from the creator's guild registry to the collector's digital library.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "refunds" && (
                      <div className="space-y-6">
                        <div className="space-y-2 border-b border-white/5 pb-4">
                          <h3 className="font-serif text-2xl text-white">Refund & Physical Escrow Protection</h3>
                          <p className="text-[11px] font-mono text-[#C9A227] uppercase tracking-wider">
                            14-Day Escrow & Guild Custody
                          </p>
                        </div>

                        <div className="p-4 bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-2xl flex items-start space-x-3">
                          <ShieldCheck className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-[#C9A227] leading-relaxed">
                            <strong>100% Protection Guarantee:</strong> The platform operates a strict Escrow Protection protocol. Funds are never cleared instantly to creator accounts; they are safely locked to prevent losses during physical delivery.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-white">1. Cancellation of Commenced Commissions</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            If a bespoke commission is in progress, the patron may request a cancellation directly through their dashboard layout. Depending on the current design stage (e.g., kiln preparation, rough wood cutting, initial drafts), the guild administrator moderates partial or full refunds.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-white">2. Shipping Damage & Non-Authentic Disputes</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Physical artwork damaged in transit is covered under Artora Transit Insurance. Collectors must file a dispute report within 14 days of receipt, including photo verification of package breakage. Non-authentic claims trigger a full guild master audit.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-white">3. Refund Execution Timeframes</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Approved cancellations or dispute refunds clear immediately back into the buyer's payment method or registered wallet balance, usually processing within 3 to 5 business days.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "creator" && (
                      <div className="space-y-6">
                        <div className="space-y-2 border-b border-white/5 pb-4">
                          <h3 className="font-serif text-2xl text-white">Creator Guild & Listing Guidelines</h3>
                          <p className="text-[11px] font-mono text-[#C9A227] uppercase tracking-wider">
                            Guild Code • Artisan Standards
                          </p>
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed font-light">
                          Artora is a creative guild rather than a bulk commercial bazaar. We support slow-craft, fine arts, custom pottery, manual woodworking, glassblowing, and hand-woven textiles.
                        </p>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-white flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                            <span>Authentic Creation Mandate</span>
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Every item listed must represent a direct original physical masterpiece drafted, shaped, or polished in your own workspace. Mass-produced, drop-shipped, commercially cast, or automated algorithmic reproductions are strictly forbidden.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-white flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                            <span>Material & Origin Fidelity</span>
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Artisans are required to precisely detail materials (e.g., stoneware body, iron-rich slip, local mountain clay, raw oak, oil on stretched canvas) and shipping weight coordinates to prevent damage and billing mismatch.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-white flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                            <span>Shipping & Fragility Standards</span>
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Creators bear the responsibility of crating and protecting fragile masterpieces. High-fired pottery, hand-blown glassware, and oversized canvases must be wrapped in heavy bubble wrap, double-boxed, or packed in shock-absorbent wooden custom frames.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "protection" && (
                      <div className="space-y-6">
                        <div className="space-y-2 border-b border-white/5 pb-4">
                          <h3 className="font-serif text-2xl text-white">Collector Protection Guarantee</h3>
                          <p className="text-[11px] font-mono text-[#C9A227] uppercase tracking-wider">
                            Verified Pedigree • Secure Escrow
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                            <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h5 className="font-serif text-sm text-white">Authentic Studio Sourcing</h5>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                              Every creator profile is manually audited by Artora's Guild Administration. We confirm physical workshop coordinates and artistic pedigree.
                            </p>
                          </div>

                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                            <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                              <Key className="w-4 h-4" />
                            </div>
                            <h5 className="font-serif text-sm text-white">Direct Escrow Custody</h5>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                              Payment is securely held in platform escrow until shipping delivery is confirmed or the inspection window closes.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-serif text-base text-white">Physical-Digital Pedigree Registration</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Every physical purchase includes a physical Certificate of Authenticity (COA) hand-signed by the craftsman and mirrored on the digital ledger. This guarantees collector protection, preventing counterfeit duplicates and establishing verified secondary market pedigree.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                              <Heart className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Direct Guild Access</p>
                              <p className="text-[10px] text-gray-400">Need personal shipping insurance or special crating assistance?</p>
                            </div>
                          </div>
                          <a
                            href="mailto:joinartora@gmail.com"
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] uppercase tracking-wider font-mono text-white rounded-lg transition border border-white/10 shrink-0"
                          >
                            Email Support
                          </a>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

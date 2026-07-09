import { motion } from "motion/react";
import { Heart, ShieldCheck, Leaf, Globe } from "lucide-react";
import { WHY_ARTORA } from "../data";

export default function WhyUs() {
  
  // Simple icon mapper to resolve static string definitions from data.ts
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return <Heart className="w-6 h-6 text-[#C9A227]" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-[#C9A227]" />;
      case "Leaf":
        return <Leaf className="w-6 h-6 text-[#C9A227]" />;
      case "Globe":
        return <Globe className="w-6 h-6 text-[#C9A227]" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-[#C9A227]" />;
    }
  };

  return (
    <section id="why-artora-section" className="py-24 bg-[#F8F8F6] border-t border-b border-[#111111]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
            The Artora Standard
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">
            Why Discerning Collectors Choose Artora
          </h2>
          <p className="font-sans text-xs text-gray-500 font-light leading-relaxed">
            We are not just a marketplace. We are a creative digital guild designed to protect, support, and connect authentic workshops globally.
          </p>
        </div>

        {/* Core Value Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" id="whyus-grid">
          {WHY_ARTORA.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 text-left flex flex-col justify-between space-y-6"
            >
              
              {/* Icon Capsule Header */}
              <div className="w-12 h-12 bg-[#C9A227]/10 rounded-2xl flex items-center justify-center border border-[#C9A227]/15">
                {getIcon(pillar.icon)}
              </div>

              {/* Title & Body Context */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Tiny footer guild label */}
              <div className="pt-2 border-t border-gray-50 font-mono text-[9px] text-gray-600 uppercase tracking-widest font-semibold">
                * Guild Standard V-26
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

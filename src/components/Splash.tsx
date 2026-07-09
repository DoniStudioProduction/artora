import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Elegant cinematic duration: 2.8s total
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.02,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090909] overflow-hidden select-none"
        >
          {/* Luxurious Ambient Gallery Spotlights */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top gold ambient light */}
            <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-radial from-[#C9A227]/12 to-transparent blur-[120px] opacity-80" />
            
            {/* Bottom ivory subtle highlight */}
            <div className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[100%] aspect-square rounded-full bg-radial from-[#FDFBF7]/5 to-transparent blur-[140px]" />
            
            {/* Subtle floating gold ember accent */}
            <motion.div 
              animate={{ 
                y: [-10, 10, -10],
                x: [-15, 15, -15],
                opacity: [0.2, 0.4, 0.2] 
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[45%] left-[25%] w-32 h-32 rounded-full bg-[#C9A227]/10 blur-2xl"
            />
            <motion.div 
              animate={{ 
                y: [15, -15, 15],
                x: [10, -10, 10],
                opacity: [0.15, 0.3, 0.15] 
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[35%] right-[20%] w-40 h-40 rounded-full bg-[#C9A227]/8 blur-2xl"
            />

            {/* Micro Gallery Grid lines */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay">
              <div className="w-full h-full border-t border-b border-l border-r border-white/20 grid grid-cols-4 grid-rows-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border-r border-b border-white/20" />
                ))}
              </div>
            </div>
          </div>

          {/* Cinematic Logo container */}
          <div className="relative flex flex-col items-center justify-center px-6 max-w-sm w-full text-center z-10">
            
            {/* Subtle glow circle behind logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute w-72 h-72 rounded-full bg-[#C9A227]/5 blur-3xl pointer-events-none -z-10"
            />

            {/* ARTORA Brand Logo with light sweep effect */}
            <div className="relative overflow-hidden py-4 px-8">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  backgroundPosition: ["200% center", "-200% center"]
                }}
                transition={{ 
                  opacity: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                  backgroundPosition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="font-serif text-5xl md:text-6xl font-extralight tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#C9A227] to-[#FDFBF7] bg-[length:200%_auto] uppercase select-none relative"
                style={{
                  backgroundImage: "linear-gradient(120deg, #E2D9C5 0%, #FDFBF7 25%, #C9A227 50%, #FDFBF7 75%, #E2D9C5 100%)",
                  backgroundSize: "200% auto"
                }}
              >
                ARTORA
              </motion.h1>
              
              {/* Gold Ambient Light Sweep Overlay Reflection */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ delay: 0.5, duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
                className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none mix-blend-screen"
              />
            </div>

            {/* Premium Gold Accent Bar */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.4 }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
              className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mt-1"
            />
          </div>

          {/* Micro indicator of authentic design */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="font-mono text-[9px] tracking-[0.5em] text-[#FDFBF7] uppercase"
            >
              FINE ART &amp; CRAFT
            </motion.span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

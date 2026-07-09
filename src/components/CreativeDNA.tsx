import React from "react";
import { motion } from "motion/react";
import { Award, Check, Lock, Shield, Star, Sparkles, TrendingUp, Compass, Calendar } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  thresholdLabel: string;
  unlockedAt: string | null;
  points: number;
}

interface CreativeDNAProps {
  creatorId: string;
  creatorName: string;
}

export default function CreativeDNA({ creatorId, creatorName }: CreativeDNAProps) {
  // Solve achievements based on creator level
  const isAmi = creatorId === "creator_ami_tanaka";
  const isElena = creatorId === "creator_elena_rostova";
  const isMarcus = creatorId === "creator_marcus_vance";
  const isSiddharth = creatorId === "creator_siddharth_nair";

  // Achievements configuration
  const achievements: Achievement[] = [
    {
      id: "joined",
      title: "Master Artisan Registration",
      description: "Successfully passed guild vetting and registered the custom studio workspace.",
      icon: Shield,
      thresholdLabel: "Vetting Passed",
      unlockedAt: isAmi ? "May 12, 2024" : isElena ? "Oct 05, 2025" : isMarcus ? "Jan 15, 2026" : "Just now",
      points: 100
    },
    {
      id: "first_product",
      title: "Inaugural Exhibition",
      description: "Published the first original Slow-Craft product on the Artora catalog.",
      icon: Compass,
      thresholdLabel: "1 Product",
      unlockedAt: isAmi ? "May 20, 2024" : isElena ? "Oct 12, 2025" : isMarcus ? "Jan 22, 2026" : "Just now",
      points: 150
    },
    {
      id: "first_sale",
      title: "Inaugural Patronage",
      description: "First masterpiece acquired by a registered Artora guild collector.",
      icon: Sparkles,
      thresholdLabel: "1 Sale",
      unlockedAt: isAmi ? "Jun 02, 2024" : isElena ? "Nov 01, 2025" : isMarcus ? "Feb 10, 2026" : null,
      points: 200
    },
    {
      id: "sales_10",
      title: "Decatur Accomplishment",
      description: "Dispatched 10 certified hand-constructed crates to high-net-worth collectors.",
      icon: TrendingUp,
      thresholdLabel: "10 Sales",
      unlockedAt: isAmi ? "Sep 18, 2024" : isElena ? "Jan 15, 2026" : isMarcus ? "May 12, 2026" : null,
      points: 300
    },
    {
      id: "verified",
      title: "Gold Seal Guild Verification",
      description: "Officially certified as a verified Master Craftsman with verified physical studio inspection.",
      icon: Award,
      thresholdLabel: "Verified Badge",
      unlockedAt: isAmi ? "Nov 15, 2024" : isElena ? "Mar 22, 2026" : isMarcus ? "Jun 05, 2026" : null,
      points: 400
    },
    {
      id: "sales_100",
      title: "Century Achievement",
      description: "Successfully dispatched over 100 certified works globally. Extreme devotion to materials.",
      icon: Star,
      thresholdLabel: "100 Sales",
      unlockedAt: isAmi ? "Mar 10, 2025" : null,
      points: 500
    },
    {
      id: "featured",
      title: "Sovereign Featured Craftsman",
      description: "Featured in the seasonal Artora Guild Exhibition catalog as a trending master.",
      icon: Star,
      thresholdLabel: "Featured Badge",
      unlockedAt: isAmi ? "Jul 01, 2025" : isElena ? "Jun 10, 2026" : null,
      points: 600
    },
    {
      id: "elite",
      title: "Artora Sovereign Elite",
      description: "Awarded the highest level of guild recognition for defining global contemporary craft.",
      icon: Award,
      thresholdLabel: "Elite Badge",
      unlockedAt: isAmi ? "Jan 01, 2026" : null,
      points: 1000
    }
  ];

  const totalPoints = achievements.reduce((sum, ach) => ach.unlockedAt ? sum + ach.points : sum, 0);
  const maxPoints = achievements.reduce((sum, ach) => sum + ach.points, 0);
  const progressPercent = Math.round((totalPoints / maxPoints) * 100);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 text-left space-y-8 max-w-2xl mx-auto">
      
      {/* 1. Header with Stats bar */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900">Creative DNA</h2>
          <p className="text-xs text-gray-400 font-mono">Artistic heritage timeline & milestone ledger</p>
        </div>

        {/* Progress bar */}
        <div className="bg-[#F8F8F6] p-4 rounded-2xl border border-gray-150 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-500 uppercase">Guild Heritage Level</span>
            <span className="text-gray-900 font-bold">{totalPoints} / {maxPoints} DNA Points ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#C9A227] transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-200">
        {achievements.map((ach) => {
          const isUnlocked = ach.unlockedAt !== null;
          const Icon = ach.icon;

          return (
            <div key={ach.id} className="relative text-left group">
              {/* Timeline marker */}
              <div className={`absolute -left-10 sm:-left-12 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${
                isUnlocked 
                  ? "bg-[#C9A227] border-[#C9A227] text-white shadow-md shadow-[#C9A227]/20 scale-105" 
                  : "bg-white border-gray-200 text-gray-300"
              }`}>
                {isUnlocked ? <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Lock className="w-3.5 h-3.5" />}
              </div>

              {/* Achievement Card */}
              <div className={`p-4 rounded-2xl border transition duration-300 ${
                isUnlocked 
                  ? "bg-white border-gray-150 shadow-xs hover:border-gray-900" 
                  : "bg-gray-50/50 border-gray-100 opacity-60"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4.5 h-4.5 ${isUnlocked ? "text-[#C9A227]" : "text-gray-300"}`} />
                    <h3 className={`text-xs font-bold ${isUnlocked ? "text-gray-900" : "text-gray-400"}`}>
                      {ach.title}
                    </h3>
                  </div>
                  
                  {isUnlocked ? (
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-[#C9A227]" />
                      {ach.unlockedAt}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-gray-300 bg-gray-100/50 border border-gray-100 px-2.5 py-0.5 rounded-full">
                      Locked • {ach.thresholdLabel}
                    </span>
                  )}
                </div>

                <p className={`text-[11px] font-light mt-2 leading-relaxed ${isUnlocked ? "text-gray-500" : "text-gray-300"}`}>
                  {ach.description}
                </p>

                <div className="mt-3 flex justify-between items-center text-[9px] font-mono">
                  <span className={`uppercase tracking-wider ${isUnlocked ? "text-gray-400" : "text-gray-300"}`}>
                    Guild Ledger Reward
                  </span>
                  <span className={`font-bold ${isUnlocked ? "text-[#C9A227]" : "text-gray-300"}`}>
                    +{ach.points} DNA XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, UserCheck, MapPin, Sparkles, Heart } from "lucide-react";
import { Creator } from "../types";
import { CREATORS } from "../data";

export default function FeaturedCreators() {
  const [creatorsState, setCreatorsState] = useState<Creator[]>(CREATORS);

  const toggleFollow = (creatorId: string) => {
    setCreatorsState((prev) =>
      prev.map((c) => {
        if (c.id === creatorId) {
          const isFollowing = !c.isFollowing;
          return {
            ...c,
            isFollowing,
            followersCount: isFollowing ? c.followersCount + 1 : c.followersCount - 1
          };
        }
        return c;
      })
    );
  };

  return (
    <section id="featured-creators" className="py-24 bg-[#F8F8F6] border-t border-b border-[#111111]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="text-left space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
              The Artisan Guild
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">
              Featured Studio Creators
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-sans text-xs text-gray-500 max-w-sm text-left leading-relaxed">
            Meet the architects of physical material. We verify each studio workspace to guarantee pure craft authenticity and slow production.
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="creators-grid">
          {creatorsState.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-xs hover:shadow-xl hover:border-[#111111]/15 transition-all duration-300 flex flex-col md:flex-row justify-between gap-8 text-left"
            >
              {/* Creator Context Left Column (60%) */}
              <div className="flex-1 flex flex-col justify-between space-y-6">
                
                {/* Header Profile Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#C9A227] shadow-sm flex-shrink-0"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-serif text-lg font-bold text-gray-900">{creator.name}</h3>
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    </div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold leading-tight">
                      {creator.specialty}
                    </p>
                    <div className="flex items-center space-x-1 text-gray-400 font-sans text-[10px]">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{creator.location}</span>
                    </div>
                  </div>
                </div>

                {/* Short Bio */}
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  {creator.bio}
                </p>

                {/* Follower Counter & Action */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm font-bold text-gray-900">
                      {creator.followersCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 ml-1.5 font-semibold">
                      Guild Collectors
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-sans uppercase font-bold tracking-widest transition flex items-center space-x-1.5 ${
                      creator.isFollowing
                        ? "bg-[#2E8B57]/10 text-[#2E8B57] hover:bg-[#2E8B57]/20"
                        : "bg-[#111111] hover:bg-[#111111]/90 text-white"
                    }`}
                  >
                    {creator.isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Creator Portfolio Mosaic Right Column (40%) */}
              <div className="w-full md:w-[180px] flex flex-col justify-center space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Featured Works</p>
                <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
                  {creator.featuredWorks.map((workUrl, i) => (
                    <div
                      key={i}
                      className="h-16 md:h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group/work relative"
                    >
                      <img
                        src={workUrl}
                        alt={`${creator.name} featured master work ${i + 1}`}
                        className="w-full h-full object-cover group-hover/work:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/work:bg-black/10 transition" />
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

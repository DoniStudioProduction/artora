import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, X, Clock, Calendar, ArrowRight, User } from "lucide-react";
import { CreatorStory } from "../types";
import { CREATOR_STORIES } from "../data";

export default function CreatorStories() {
  const [activeStory, setActiveStory] = useState<CreatorStory | null>(null);

  return (
    <section id="creator-stories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
            Editorial Narrative
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">
            Creator Stories &amp; Journeys
          </h2>
          <p className="font-sans text-xs text-gray-500 font-light leading-relaxed">
            Go inside the studios. Learn how our artists think, live, and create, directly in their own words.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="stories-grid">
          {CREATOR_STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group cursor-pointer flex flex-col justify-between h-full rounded-3xl bg-[#F8F8F6] overflow-hidden border border-[#111111]/5 hover:shadow-xl hover:border-[#111111]/10 transition-all duration-300"
              onClick={() => setActiveStory(story)}
            >
              
              {/* Image Frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Micro timing tag */}
                <span className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md text-gray-800 font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
                  <Clock className="w-3 h-3 text-[#C9A227]" />
                  <span>{story.readTime}</span>
                </span>
              </div>

              {/* Text context */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between text-left space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={story.creatorAvatar}
                      alt={story.creatorName}
                      className="w-5 h-5 rounded-full object-cover border border-[#C9A227]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-gray-500">
                      Written by {story.creatorName}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-normal text-gray-900 group-hover:text-[#C9A227] transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-400">
                    Published {story.publishedDate}
                  </span>

                  <button
                    onClick={() => setActiveStory(story)}
                    className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#111111] group-hover:text-[#C9A227] transition-colors flex items-center space-x-1"
                  >
                    <span>Read Chronicle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* DETAILED STORY READING OVERLAY MODAL */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            id="story-modal-backdrop"
          >
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setActiveStory(null)} />

            <motion.div
              initial={{ scale: 0.95, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-10 border border-[#111111]/5 max-h-[92vh] flex flex-col"
              id="story-modal-container"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-5 right-5 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-600 hover:text-black shadow-sm transition"
                aria-label="Close reader"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Story Header Banner Image */}
              <div className="relative aspect-[16/7] w-full bg-gray-100 flex-shrink-0">
                <img
                  src={activeStory.imageUrl}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Title inside Banner */}
                <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 text-left space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
                    Chronicles of craft
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-normal text-white leading-tight">
                    {activeStory.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable Editorial Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 text-left">
                
                {/* Author Card Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeStory.creatorAvatar}
                      alt={activeStory.creatorName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#C9A227]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{activeStory.creatorName}</p>
                      <p className="text-[10px] text-[#C9A227] uppercase font-mono font-bold">Verified Studio Member</p>
                    </div>
                  </div>

                  {/* Metadata tags */}
                  <div className="flex items-center space-x-4 font-mono text-[10px] text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{activeStory.publishedDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeStory.readTime}</span>
                    </span>
                  </div>
                </div>

                {/* Editorial Content */}
                <div className="font-serif text-base text-gray-800 leading-relaxed max-w-2xl mx-auto space-y-6">
                  {/* First letter beautiful drop-cap */}
                  <div className="whitespace-pre-line font-light text-gray-700 leading-relaxed md:text-lg">
                    {activeStory.fullStory}
                  </div>
                </div>

                {/* Footnote values */}
                <div className="pt-8 border-t border-gray-100 text-center max-w-lg mx-auto">
                  <p className="font-serif italic text-sm text-[#C9A227]">
                    "At Artora, every handcrafted artifact represents the direct physical effort of a human artisan."
                  </p>
                  <button
                    onClick={() => setActiveStory(null)}
                    className="mt-6 px-6 py-2.5 bg-[#111111] text-white text-xs font-sans uppercase font-bold tracking-widest rounded-xl hover:bg-black transition"
                  >
                    Finish Reading
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

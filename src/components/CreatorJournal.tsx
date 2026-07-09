import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, MessageSquare, Share2, Plus, Sparkles, Send, Play, X,
  FileText, Image as ImageIcon, Video, Eye, ThumbsUp, Calendar
} from "lucide-react";

interface JournalPost {
  id: string;
  creatorId: string;
  title: string;
  content: string;
  type: "Behind-the-scenes" | "Studio photos" | "Videos" | "Work in Progress" | "Collection announcements";
  mediaUrl: string;
  mediaType: "image" | "video";
  likesCount: number;
  comments: { sender: string; text: string; time: string }[];
  date: string;
}

interface CreatorJournalProps {
  creatorId: string;
  isOwnProfile: boolean;
  creatorName: string;
  creatorAvatar: string;
}

export default function CreatorJournal({
  creatorId,
  isOwnProfile,
  creatorName,
  creatorAvatar
}: CreatorJournalProps) {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Create Journal Post state
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<JournalPost["type"]>("Behind-the-scenes");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Core Seed Posts
  const SEED_POSTS: JournalPost[] = [
    {
      id: "post_tanaka_1",
      creatorId: "creator_ami_tanaka",
      title: "Glaze Kiln Atmosphere Study",
      content: "Evaluating the reducing fire atmosphere on iron oxide slip inside the wood kiln. This batch resulted in some deep copper hues that feel organic, almost cosmic under warm studio lights.",
      type: "Behind-the-scenes",
      mediaUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      likesCount: 124,
      comments: [
        { sender: "Julian Finch", text: "This copper hue is unreal! Eagerly awaiting the final release.", time: "2 hours ago" },
        { sender: "Isabella V.", text: "The carbon trapping details near the collar are superb.", time: "1 hour ago" }
      ],
      date: "July 05, 2026"
    },
    {
      id: "post_tanaka_2",
      creatorId: "creator_ami_tanaka",
      title: "Wheel Throwing: Nebulous Bowl Form",
      content: "A short time-lapse throwing the wide-rimmed nebulous bowl form on the kick wheel. Notice the intentional wrist deceleration to introduce slight structural waves.",
      type: "Videos",
      mediaUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
      mediaType: "video",
      likesCount: 98,
      comments: [
        { sender: "Marcus Vance", text: "Beautiful kick technique, Ami! Smooth rhythm.", time: "Yesterday" }
      ],
      date: "July 03, 2026"
    },
    {
      id: "post_vance_1",
      creatorId: "creator_marcus_vance",
      title: "Restoring the 1920 Oregon Workbench",
      content: "Spent the weekend cleaning, leveling, and hand-planing our century-old heritage workshop table. This ironwood workbench has seen three generations of master builders.",
      type: "Studio photos",
      mediaUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      likesCount: 86,
      comments: [
        { sender: "Arthur Sterling", text: "Tools with memory always shape superior designs.", time: "3 days ago" }
      ],
      date: "June 28, 2026"
    }
  ];

  useEffect(() => {
    // Read user custom posts
    const customPostsSaved = localStorage.getItem("artora_creator_journal_custom");
    let customPosts: JournalPost[] = [];
    if (customPostsSaved) {
      try {
        customPosts = JSON.parse(customPostsSaved);
      } catch (e) {
        console.error(e);
      }
    }

    // Filter by current creator id
    const combined = [...customPosts, ...SEED_POSTS].filter(p => p.creatorId === creatorId);
    setPosts(combined);

    // Read user likes
    const likedSaved = localStorage.getItem("artora_liked_journal_posts");
    if (likedSaved) {
      try {
        setLikedPosts(JSON.parse(likedSaved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [creatorId]);

  const handleLike = (postId: string) => {
    let updatedLikes: string[];
    const isLiked = likedPosts.includes(postId);
    if (isLiked) {
      updatedLikes = likedPosts.filter(id => id !== postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: p.likesCount - 1 } : p));
    } else {
      updatedLikes = [...likedPosts, postId];
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p));
    }
    setLikedPosts(updatedLikes);
    localStorage.setItem("artora_liked_journal_posts", JSON.stringify(updatedLikes));

    // Persist counts if custom post
    setPosts(currentPosts => {
      const customPosts = currentPosts.filter(p => p.id.startsWith("custom_post_"));
      if (customPosts.length > 0) {
        const savedCustom = localStorage.getItem("artora_creator_journal_custom");
        if (savedCustom) {
          const parsed: JournalPost[] = JSON.parse(savedCustom);
          const updated = parsed.map(p => {
            const found = currentPosts.find(cp => cp.id === p.id);
            return found ? { ...p, likesCount: found.likesCount } : p;
          });
          localStorage.setItem("artora_creator_journal_custom", JSON.stringify(updated));
        }
      }
      return currentPosts;
    });
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const newComment = {
      sender: "You",
      text: commentText,
      time: "Just now"
    };

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    });

    setPosts(updatedPosts);
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));

    // Persist custom posts comments
    const customPost = updatedPosts.find(p => p.id === postId && p.id.startsWith("custom_post_"));
    if (customPost) {
      const savedCustom = localStorage.getItem("artora_creator_journal_custom");
      if (savedCustom) {
        const parsed: JournalPost[] = JSON.parse(savedCustom);
        const updated = parsed.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p);
        localStorage.setItem("artora_creator_journal_custom", JSON.stringify(updated));
      }
    }
  };

  const handleShare = (postId: string) => {
    // Copy mockup link to clipboard
    const simulatedLink = `${window.location.origin}/journal/${postId}`;
    navigator.clipboard.writeText(simulatedLink).then(() => {
      setShareFeedback(postId);
      setTimeout(() => setShareFeedback(null), 3000);
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const sampleImages = [
      "https://images.unsplash.com/photo-1456073124466-2ebac85e8245?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"
    ];

    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    const newPost: JournalPost = {
      id: `custom_post_${Date.now()}`,
      creatorId: creatorId,
      title: newTitle,
      content: newContent,
      type: newType,
      mediaUrl: newMediaUrl.trim() || randomImg,
      mediaType: newMediaType,
      likesCount: 0,
      comments: [],
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
    };

    // Save custom post
    const savedCustom = localStorage.getItem("artora_creator_journal_custom");
    const currentCustom = savedCustom ? JSON.parse(savedCustom) : [];
    const updatedCustom = [newPost, ...currentCustom];
    localStorage.setItem("artora_creator_journal_custom", JSON.stringify(updatedCustom));

    // Update state
    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setNewMediaUrl("");
    setIsWriteOpen(false);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const categories = ["All", "Behind-the-scenes", "Studio photos", "Videos", "Work in Progress", "Collection announcements"];
  const filteredPosts = posts.filter(p => selectedCategory === "All" || p.type === selectedCategory);

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto">
      
      {/* 1. Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900">Studio Journal</h2>
          <p className="text-xs text-gray-400 font-mono">Behind-the-scenes memoirs & creation logs</p>
        </div>

        {isOwnProfile && (
          <button
            onClick={() => setIsWriteOpen(true)}
            className="px-5 py-2.5 bg-[#111111] hover:bg-[#C9A227] text-white rounded-xl text-xs font-mono uppercase tracking-widest font-bold flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Entry</span>
          </button>
        )}
      </div>

      {/* 2. Journal Category filter pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition border ${
              selectedCategory === cat 
                ? "bg-[#111111] text-[#F8F8F6] border-[#111111] font-bold"
                : "bg-white text-gray-500 border-gray-150 hover:border-gray-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Write Journal Modal */}
      <AnimatePresence>
        {isWriteOpen && (
          <div className="fixed inset-0 z-50 bg-[#111111]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100"
            >
              <form onSubmit={handleCreatePost} className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="font-serif text-base font-bold text-gray-900 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    <span>WRITE TO JOURNAL</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsWriteOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Entry Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sculpting the Autumn Urns"
                    className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Log Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as JournalPost["type"])}
                      className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none bg-white focus:border-[#C9A227] transition"
                    >
                      <option>Behind-the-scenes</option>
                      <option>Studio photos</option>
                      <option>Videos</option>
                      <option>Work in Progress</option>
                      <option>Collection announcements</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Media Type</label>
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as "image" | "video")}
                      className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none bg-white focus:border-[#C9A227] transition"
                    >
                      <option value="image">Image Attachment</option>
                      <option value="video">Video (Simulated Player)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Media URL (Optional)</label>
                  <input
                    type="text"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or blank for random"
                    className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Journal Content (MarkDown / Memoir)</label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write your story, inspiration, workbench logs, or progress detail..."
                    className="w-full text-xs font-sans p-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A227] resize-none transition"
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#111111] hover:bg-[#C9A227] text-white text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition"
                  >
                    Publish to Feed
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Journal Feed List */}
      <div className="space-y-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
            <FileText className="w-10 h-10 text-[#C9A227]/40 mx-auto" />
            <h4 className="font-serif text-sm font-bold text-gray-900">Feed Empty</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">No journal entries found in this category. Connect your workspace to publish logs.</p>
          </div>
        ) : (
          filteredPosts.map(post => {
            const hasLiked = likedPosts.includes(post.id);
            const isCommentsOpen = expandedComments[post.id];
            const isShared = shareFeedback === post.id;

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={creatorAvatar} 
                      alt={creatorName} 
                      className="w-10 h-10 rounded-full object-cover border border-[#C9A227]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{creatorName}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
                        <span className="text-[#C9A227] font-semibold uppercase">{post.type}</span>
                        <span>•</span>
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media representation */}
                {post.mediaUrl && (
                  <div className="relative aspect-video bg-gray-50 overflow-hidden border-y border-gray-50 group">
                    <img 
                      src={post.mediaUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.01]"
                    />
                    
                    {post.mediaType === "video" && (
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center">
                        <button className="w-14 h-14 bg-[#C9A227] text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition duration-300">
                          <Play className="w-6 h-6 fill-current text-white ml-1" />
                        </button>
                        <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-[9px] text-white font-mono px-2 py-0.5 rounded">
                          Simulated Playback Mode
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Article Content */}
                <div className="p-6 space-y-4">
                  <h3 className="font-serif text-lg text-gray-900">{post.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Actions row */}
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-gray-500 text-xs font-mono">
                    <div className="flex items-center space-x-6">
                      {/* Like button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1.5 transition ${
                          hasLiked ? "text-red-500 scale-105" : "hover:text-red-500"
                        }`}
                      >
                        <Heart className={`w-4.5 h-4.5 ${hasLiked ? "fill-current" : ""}`} />
                        <span>{post.likesCount}</span>
                      </button>

                      {/* Comments toggle button */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center space-x-1.5 hover:text-[#C9A227] transition"
                      >
                        <MessageSquare className="w-4.5 h-4.5" />
                        <span>{post.comments.length} Comments</span>
                      </button>
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center space-x-1.5 hover:text-[#C9A227] transition relative"
                    >
                      <Share2 className="w-4.5 h-4.5" />
                      <span>{isShared ? "Copied!" : "Share Link"}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Comments Drawer */}
                {isCommentsOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="bg-[#F8F8F6] border-t border-gray-50 px-6 py-5 space-y-4 text-left"
                  >
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Comments Ledger</h5>
                    
                    {post.comments.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">No comments yet. Initiate the dialogue above.</p>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {post.comments.map((comm, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-2xl border border-gray-100 text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-gray-800">{comm.sender}</span>
                              <span className="text-[9px] text-gray-400 font-mono">{comm.time}</span>
                            </div>
                            <p className="text-gray-600 font-light leading-relaxed">{comm.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Send Comment Form */}
                    <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Contribute your observation to the studio ledger..."
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C9A227] transition"
                      />
                      <button
                        type="submit"
                        className="p-2.5 bg-[#111111] hover:bg-[#C9A227] text-white rounded-xl transition flex items-center justify-center"
                      >
                        <Send className="w-4.5 h-4.5" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
}

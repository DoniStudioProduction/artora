import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Image as ImageIcon, ShoppingBag, Eye, Check, CheckCircle2, 
  Sparkles, FileText, X, ChevronRight, MessageSquare, AlertCircle
} from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface ChatMessage {
  sender: "You" | "Creator" | "Collector" | string;
  text: string;
  time: string;
  image?: string;
  productLink?: Product;
  read?: boolean;
}

interface MessageThread {
  id: string;
  sender: string;
  avatar: string;
  role: "Creator" | "Collector" | string;
  subject: string;
  messages: ChatMessage[];
  unread: boolean;
  isTyping?: boolean;
  typingText?: string;
}

interface DirectMessagingProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onProductLinkClick: (product: Product) => void;
  initialThreadId?: string;
  embeddedMode?: boolean; // If used within dashboard vs standalone modal
}

export default function DirectMessaging({
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onProductLinkClick,
  initialThreadId,
  embeddedMode = true
}: DirectMessagingProps) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  
  // Attachments state
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isImagePasteOpen, setIsImagePasteOpen] = useState(false);
  const [pastedImageUrl, setPastedImageUrl] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const DEFAULT_THREADS: MessageThread[] = [
    {
      id: "thread_tanaka",
      sender: "Ami Tanaka",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      role: "Creator",
      subject: "Crate packing for Nebula Vessel",
      unread: true,
      messages: [
        { sender: "Ami Tanaka", text: "Hello Julian, I am hand-packing the vessel in a dual-layered wooden crate today. It should ship tomorrow morning.", time: "10:24 AM", read: true },
        { sender: "You", text: "That is excellent news, Ami! I can't wait to see the glaze pattern under natural light.", time: "11:15 AM", read: true },
        { sender: "Ami Tanaka", text: "I also have another similar copper reduction plate that matches this glaze pattern beautifully if you are interested.", time: "11:20 AM", read: true, productLink: PRODUCTS[0] }
      ],
      isTyping: false,
      typingText: "Ami Tanaka is sketching custom lids..."
    },
    {
      id: "thread_vance",
      sender: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      role: "Creator",
      subject: "Oak Platter Care Guide",
      unread: false,
      messages: [
        { sender: "Marcus Vance", text: "Remember to treat the oak platter with cold-pressed walnut oil once every six months to preserve the organic grain luster.", time: "Yesterday", read: true }
      ],
      isTyping: false
    }
  ];

  useEffect(() => {
    // Load chat threads from local storage
    const saved = localStorage.getItem("artora_chat_threads");
    let loadedThreads: MessageThread[] = [];
    if (saved) {
      try {
        loadedThreads = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    // Merge defaults
    const combined = [...loadedThreads];
    DEFAULT_THREADS.forEach(def => {
      if (!combined.some(t => t.id === def.id)) {
        combined.push(def);
      }
    });

    setThreads(combined);

    // Solve active thread
    if (initialThreadId && combined.some(t => t.id === initialThreadId)) {
      setActiveThreadId(initialThreadId);
    } else if (combined.length > 0) {
      setActiveThreadId(combined[0].id);
    }
  }, [initialThreadId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [threads, activeThreadId]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Mark active thread as read
  useEffect(() => {
    if (activeThread && activeThread.unread) {
      const updated = threads.map(t => t.id === activeThreadId ? { ...t, unread: false } : t);
      setThreads(updated);
      localStorage.setItem("artora_chat_threads", JSON.stringify(updated));
    }
  }, [activeThreadId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      sender: "You",
      text: inputText,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      read: false
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, newMsg],
          unread: false
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    localStorage.setItem("artora_chat_threads", JSON.stringify(updatedThreads));
    setInputText("");

    // Simulate smart Artisan replies after a brief typing phase
    triggerCreatorMockReply(activeThreadId);
  };

  const triggerCreatorMockReply = (threadId: string) => {
    // Enable typing indicator after 1.5s
    setTimeout(() => {
      setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            isTyping: true,
            typingText: `${t.sender} is typing...`
          };
        }
        return t;
      }));

      // Deliver message after another 2.5s
      setTimeout(() => {
        const creatorReplies: Record<string, string> = {
          thread_tanaka: "I am finalizing the ledger coordinates right now. Let me know if you would like me to reserve the copper plate for you!",
          thread_vance: "Of course! Let me know if you need any other maintenance guidance. My workshop doors are always open.",
        };

        const replyText = creatorReplies[threadId] || "Understood! Let me review my workshop inventory and get back to you with the custom specs.";

        const botMsg: ChatMessage = {
          sender: activeThread ? activeThread.sender : "Creator",
          text: replyText,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          read: false
        };

        setThreads(prev => prev.map(t => {
          if (t.id === threadId) {
            return {
              ...t,
              messages: [...t.messages, botMsg],
              unread: true,
              isTyping: false
            };
          }
          return t;
        }));

        // Persist to local storage
        setThreads(currentThreads => {
          localStorage.setItem("artora_chat_threads", JSON.stringify(currentThreads));
          return currentThreads;
        });

      }, 2500);

    }, 1500);
  };

  const handleAttachProduct = (product: Product) => {
    const newMsg: ChatMessage = {
      sender: "You",
      text: `Acquisition Reference: ${product.title}`,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      productLink: product,
      read: false
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    localStorage.setItem("artora_chat_threads", JSON.stringify(updatedThreads));
    setIsProductPickerOpen(false);

    triggerCreatorMockReply(activeThreadId);
  };

  const handleAttachImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedImageUrl.trim()) return;

    const newMsg: ChatMessage = {
      sender: "You",
      text: "Uploaded workshop attachment:",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      image: pastedImageUrl,
      read: false
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    localStorage.setItem("artora_chat_threads", JSON.stringify(updatedThreads));
    setPastedImageUrl("");
    setIsImagePasteOpen(false);

    triggerCreatorMockReply(activeThreadId);
  };

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-gray-100 min-h-[450px] space-y-4">
        <MessageSquare className="w-12 h-12 text-[#C9A227]/40 mb-2" />
        <div>
          <h3 className="font-serif text-lg font-bold text-gray-900">Conversations with creators will appear here.</h3>
          <p className="text-xs text-gray-400 font-light max-w-sm mx-auto mt-1">Engage with artists, discuss bespoke commissions, and check production status securely.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[550px] max-h-[650px]">
        
        {/* 1. Left Conversation Threads roster */}
        <div className="md:col-span-4 border-r border-gray-100 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-50 text-left bg-gray-50/50">
            <h3 className="font-serif text-base font-bold text-gray-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#C9A227]" />
              <span>Studio Threads</span>
            </h3>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">Verified Communications Ledger</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {threads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const isActive = thread.id === activeThreadId;

              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-4 flex items-start space-x-3 text-left transition relative ${
                    isActive ? "bg-gray-50/80 border-l-4 border-[#C9A227]" : "hover:bg-gray-50/30"
                  }`}
                >
                  <img 
                    src={thread.avatar} 
                    alt={thread.sender} 
                    className="w-10 h-10 rounded-full object-cover border border-[#C9A227] flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-900 truncate">{thread.sender}</span>
                      <span className="text-[9px] text-gray-400 font-mono">{lastMsg ? lastMsg.time : ""}</span>
                    </div>
                    <p className="text-[9px] font-mono font-bold uppercase text-[#C9A227] tracking-wider mt-0.5">{thread.role}</p>
                    <p className="text-xs text-gray-400 truncate mt-1">{lastMsg ? lastMsg.text : thread.subject}</p>
                  </div>

                  {thread.unread && !isActive && (
                    <span className="absolute top-4 right-4 w-2 h-2 bg-[#C9A227] rounded-full ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Right Conversation Chat Window */}
        <div className="md:col-span-8 flex flex-col bg-[#F8F8F6]">
          
          {/* Header info */}
          {activeThread ? (
            <>
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between text-left">
                <div className="flex items-center space-x-3">
                  <img 
                    src={activeThread.avatar} 
                    alt={activeThread.sender} 
                    className="w-10 h-10 rounded-full object-cover border border-[#C9A227]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                      <span>{activeThread.sender}</span>
                      <span className="text-[8px] font-mono border border-[#C9A227]/20 text-[#C9A227] bg-[#C9A227]/5 px-1.5 py-0.2 rounded-full uppercase">
                        {activeThread.role}
                      </span>
                    </h4>
                    <p className="text-[9px] text-gray-400 font-mono truncate max-w-xs sm:max-w-md">Subject: {activeThread.subject}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-[#C9A227] font-mono bg-[#C9A227]/10 px-3 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full animate-pulse" />
                  <span>Encrypted Ledger</span>
                </div>
              </div>

              {/* Messages threads panel scroll */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[420px] text-left">
                {activeThread.messages.map((m, idx) => {
                  const isMe = m.sender === "You";
                  return (
                    <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl p-4 text-xs ${
                        isMe 
                          ? "bg-[#111111] text-[#F8F8F6] rounded-br-none" 
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-xs"
                      }`}>
                        
                        {/* Attachment Image */}
                        {m.image && (
                          <div className="mb-2 rounded-xl overflow-hidden max-w-xs border border-gray-100">
                            <img src={m.image} alt="Attachment" className="w-full h-32 object-cover" />
                          </div>
                        )}

                        {/* Text message */}
                        <p className="leading-relaxed whitespace-pre-line font-light">{m.text}</p>

                        {/* Interactive Product Link */}
                        {m.productLink && (
                          <div 
                            onClick={() => onProductLinkClick(m.productLink!)}
                            className={`mt-3 p-3 rounded-xl flex items-center justify-between gap-3 border cursor-pointer hover:border-[#C9A227] transition ${
                              isMe ? "bg-white/10 border-white/10 text-white" : "bg-gray-50 border-gray-150 text-gray-900"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <img 
                                src={m.productLink.imageUrl} 
                                alt={m.productLink.title} 
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                              />
                              <div className="truncate text-left">
                                <p className="text-[10px] font-bold truncate leading-tight">{m.productLink.title}</p>
                                <p className="text-[9px] opacity-75 font-mono mt-0.5">${m.productLink.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <Eye className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                          </div>
                        )}

                        {/* Footer status line */}
                        <div className="flex items-center justify-between mt-2 opacity-50 font-mono text-[8px]">
                          <span>{m.time}</span>
                          {isMe && (
                            <div className="flex items-center space-x-0.5">
                              <span>Read</span>
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Animated typing indicator */}
                {activeThread.isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-400 border border-gray-100 rounded-2xl rounded-bl-none p-3 shadow-xs text-xs font-mono flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      <span className="text-[9px]">{activeThread.typingText || "Master is replying..."}</span>
                    </div>
                  </div>
                )}

                {/* Ref anchor */}
                <div ref={scrollRef} />
              </div>

              {/* Input toolbar form */}
              <div className="bg-white border-t border-gray-100 p-4 space-y-3">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                  
                  {/* Image attachment paste */}
                  <button
                    type="button"
                    onClick={() => setIsImagePasteOpen(!isImagePasteOpen)}
                    className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-800 transition"
                    title="Attach Image Link"
                  >
                    <ImageIcon className="w-4.5 h-4.5" />
                  </button>

                  {/* Product attachment picker */}
                  <button
                    type="button"
                    onClick={() => setIsProductPickerOpen(!isProductPickerOpen)}
                    className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-[#C9A227] transition"
                    title="Attach Masterpiece Reference"
                  >
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Engage dialogue with artisan studio..."
                    className="flex-grow bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C9A227] transition"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 bg-[#111111] hover:bg-[#C9A227] text-white rounded-xl disabled:opacity-40 transition flex items-center justify-center"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>

                {/* Sub panels */}
                <AnimatePresence>
                  {/* Image Attach form */}
                  {isImagePasteOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50 p-3 rounded-xl border border-gray-100 text-left"
                    >
                      <form onSubmit={handleAttachImage} className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={pastedImageUrl}
                          onChange={(e) => setPastedImageUrl(e.target.value)}
                          placeholder="Paste image Unsplash / Pinterest / Imgur URL..."
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#C9A227]"
                        />
                        <button
                          type="submit"
                          className="bg-[#111111] text-white text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg font-bold"
                        >
                          Attach
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* Product picker dropdown roster */}
                  {isProductPickerOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50 p-3 rounded-xl border border-gray-100 text-left max-h-40 overflow-y-auto"
                    >
                      <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 font-black block mb-2">Select Reference Masterpiece</span>
                      <div className="grid grid-cols-2 gap-2">
                        {PRODUCTS.slice(0, 4).map(prod => (
                          <div
                            key={prod.id}
                            onClick={() => handleAttachProduct(prod)}
                            className="bg-white p-2 border border-gray-100 rounded-lg hover:border-[#C9A227] cursor-pointer transition flex items-center space-x-2"
                          >
                            <img src={prod.imageUrl} className="w-8 h-8 rounded-md object-cover" />
                            <div className="truncate">
                              <p className="text-[10px] font-bold truncate text-gray-800">{prod.title}</p>
                              <p className="text-[9px] text-gray-400 font-mono">${prod.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <AlertCircle className="w-8 h-8 text-gray-300 mb-2 animate-bounce" />
              <p className="text-xs font-light">Select an active conversation to view the ledger history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

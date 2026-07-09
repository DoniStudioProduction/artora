import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Eye, Edit, Trash2, Copy, Play, PauseCircle, CheckCircle2, AlertCircle, 
  ShoppingBag, Star, Plus, Check, DollarSign, X, Layers, Save 
} from "lucide-react";
import { Product } from "../types";

interface CreatorProductManagerProps {
  products: Product[];
  onUpdateProducts: (updatedList: Product[]) => void;
  onAddNewClick: () => void;
}

export default function CreatorProductManager({
  products,
  onUpdateProducts,
  onAddNewClick
}: CreatorProductManagerProps) {
  
  // Inline edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editStock, setEditStock] = useState("");
  
  // Undo deletion simulation
  const [recentlyDeleted, setRecentlyDeleted] = useState<Product | null>(null);
  const [showUndoAlert, setShowUndoAlert] = useState(false);

  const categories = [
    "Painting", "Craft", "Jewelry", "Pottery", "Woodwork", "Fashion", "Sculpture", "Home Decor", "Digital Art"
  ];

  const handleDelete = (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    setRecentlyDeleted(target);
    setShowUndoAlert(true);

    const updated = products.filter(p => p.id !== id);
    onUpdateProducts(updated);

    // Auto dismiss undo alert
    setTimeout(() => {
      setShowUndoAlert(false);
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (!recentlyDeleted) return;
    const restored = [recentlyDeleted, ...products];
    onUpdateProducts(restored);
    setRecentlyDeleted(null);
    setShowUndoAlert(false);
  };

  const handleDuplicate = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `custom_prod_dup_${Date.now()}`,
      title: `Copy of ${product.title}`,
      status: "Draft",
      views: 0,
      reviewsCount: 0,
      rating: 5.0
    };
    onUpdateProducts([duplicated, ...products]);
  };

  const handleTogglePause = (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const newStatus: "Published" | "Draft" | "Paused" = p.status === "Paused" ? "Published" : "Paused";
        return { ...p, status: newStatus };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditPrice(product.price.toString());
    setEditCategory(product.category);
    setEditStock(product.inStock.toString());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          title: editTitle,
          price: parseFloat(editPrice) || p.price,
          category: editCategory,
          inStock: parseInt(editStock) || p.inStock
        };
      }
      return p;
    });

    onUpdateProducts(updated);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Undo Delete Notice */}
      <AnimatePresence>
        {showUndoAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#111111] text-white p-4 rounded-xl flex items-center justify-between shadow-xl border border-white/10"
          >
            <div className="flex items-center space-x-2.5 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
              <span>Listing "{recentlyDeleted?.title}" has been deleted.</span>
            </div>
            <button 
              onClick={handleUndoDelete}
              className="text-[#C9A227] hover:underline text-xs font-mono uppercase tracking-wider font-bold"
            >
              Undo Deletion
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-gray-900">Your Managed Artworks</h2>
          <p className="text-xs text-gray-400 font-light">Audit your creations, status, metrics, and list new masterworks.</p>
        </div>
        
        <button
          onClick={onAddNewClick}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#111111] hover:bg-[#C9A227] text-white text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <div>
            <h3 className="font-serif text-base font-bold text-gray-900">Your gallery is ready for its first creation.</h3>
            <p className="text-xs text-gray-400 font-light mt-1">Deploy and manage your custom masterworks seamlessly.</p>
          </div>
          <button
            onClick={onAddNewClick}
            className="px-5 py-2.5 border border-[#111111] hover:border-[#C9A227] hover:text-[#C9A227] text-[#111111] text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition cursor-pointer"
          >
            Create First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => {
            // Setup default metric states
            const productViews = p.views !== undefined ? p.views : Math.floor(Math.random() * 240) + 12;
            const productStatus = p.status || "Published";

            return (
              <motion.div
                key={p.id}
                layout
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                
                {/* Product Header Card */}
                <div className="relative aspect-video bg-[#F8F8F6] overflow-hidden">
                  <img src={p.imageUrl} alt={p.title} className="object-cover w-full h-full" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {productStatus === "Published" && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span>Active</span>
                      </span>
                    )}
                    {productStatus === "Draft" && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        <span>Draft</span>
                      </span>
                    )}
                    {productStatus === "Paused" && (
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <span>Paused</span>
                      </span>
                    )}
                  </div>

                  {/* Views & Category metrics bottom overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white font-mono text-[9px] tracking-wide">
                    <span>{p.category}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{productViews} Views</span>
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-sm font-bold text-gray-900 line-clamp-1">{p.title}</h3>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#C9A227] font-bold">${p.price.toLocaleString()}</span>
                      <div className="flex flex-col items-end text-right">
                        <span className={p.inStock <= 3 ? "text-amber-600 font-bold" : "text-gray-400"}>
                          Stock: {p.inStock} items
                        </span>
                        {p.inStock <= 3 && p.inStock > 0 && (
                          <span className="text-[9px] uppercase tracking-wider text-amber-500 font-bold flex items-center gap-0.5 mt-0.5">
                            <AlertCircle className="w-3 h-3 animate-pulse" />
                            <span>Low Stock Alert</span>
                          </span>
                        )}
                        {p.inStock === 0 && (
                          <span className="text-[9px] uppercase tracking-wider text-red-500 font-bold flex items-center gap-0.5 mt-0.5">
                            <AlertCircle className="w-3 h-3" />
                            <span>Sold Out</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Operational Controls Footer */}
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-50 text-[10px] font-mono font-bold uppercase tracking-widest">
                    
                    <button
                      onClick={() => startEdit(p)}
                      className="p-2 border border-gray-100 hover:border-[#C9A227] text-gray-600 hover:text-[#C9A227] rounded-xl flex items-center justify-center transition"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(p)}
                      className="p-2 border border-gray-100 hover:border-[#C9A227] text-gray-600 hover:text-[#C9A227] rounded-xl flex items-center justify-center transition"
                      title="Duplicate Product"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleTogglePause(p.id)}
                      className={`p-2 border rounded-xl flex items-center justify-center transition ${
                        productStatus === "Paused" 
                          ? "bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227]" 
                          : "border-gray-100 hover:border-[#C9A227] text-gray-600"
                      }`}
                      title={productStatus === "Paused" ? "Resume Listing" : "Pause Listing"}
                    >
                      <PauseCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 border border-red-50 hover:border-red-500 text-red-500 rounded-xl flex items-center justify-center transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Inline Quick Edit Overlay Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 border border-gray-100 shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setEditingProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[9px] uppercase tracking-widest text-[#C9A227] font-mono font-bold block mb-1">Quick Edit</span>
                <h3 className="font-serif text-lg font-bold text-gray-900">Modify Listing</h3>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Artwork Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F8F6] border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Price ($)</label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8F8F6] border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Stock Level</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8F8F6] border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F8F6] border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#111111] hover:bg-[#C9A227] text-white text-[11px] font-mono tracking-widest uppercase font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, FileText, UploadCloud, DollarSign, Eye, Save, Send, Trash2, 
  Plus, Check, AlertCircle, ShoppingBag, MapPin, Layers, Scale, Clock, Video, X 
} from "lucide-react";
import { Product } from "../types";

interface AddProductProps {
  user: any;
  onSave: (product: Product, isPublish: boolean) => void;
  onCancel: () => void;
}

export default function AddProduct({ user, onSave, onCancel }: AddProductProps) {
  // Input fields
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Painting");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [quantity, setQuantity] = useState("1");
  const [materials, setMaterials] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [processingTime, setProcessingTime] = useState("Ready to ship in 3-5 days");
  const [weight, setWeight] = useState("");
  const [shippingTime, setShippingTime] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Media uploads simulation
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
  ]);
  const [uploadedVideo, setUploadedVideo] = useState<string>("");
  const [videoInput, setVideoInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  // Preview Mode Toggle
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Categories list exactly as specified
  const categories = [
    "Painting", "Craft", "Jewelry", "Pottery", "Woodwork", "Fashion", "Sculpture", "Home Decor", "Digital Art"
  ];

  // Currencies list
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setUploadedImages(prev => [...prev, imageInput.trim()]);
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveDraft = () => {
    setValidationError(null);
    if (!productName.trim() || !price.trim()) {
      setValidationError("Please enter a product name and price first.");
      return;
    }
    const finalProduct = buildProductObject("Draft");
    onSave(finalProduct, false);
  };

  const handlePublish = () => {
    setValidationError(null);
    if (!productName.trim() || !price.trim() || !description.trim()) {
      setValidationError("Please fill in the product name, price, and description before publishing.");
      return;
    }
    const finalProduct = buildProductObject("Published");
    onSave(finalProduct, true);
  };

  const buildProductObject = (status: "Published" | "Draft" | "Paused"): Product => {
    const defaultImage = uploadedImages[0] || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80";
    return {
      id: `custom_prod_${Date.now()}`,
      title: productName,
      artistId: `creator_${user.name.toLowerCase().replace(/\s+/g, "_")}`,
      artistName: user.name,
      artistAvatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
      category,
      price: parseFloat(price) || 0,
      rating: 5.0,
      reviewsCount: 0,
      imageUrl: defaultImage,
      secondaryImageUrl: uploadedImages[1] || undefined,
      description,
      materials: materials.split(",").map(m => m.trim()).filter(Boolean),
      dimensions: dimensions || "Bespoke dimensions",
      inStock: parseInt(quantity) || 1,
      views: 0,
      status,
      images: uploadedImages,
      videoUrl: uploadedVideo || undefined,
      processingTime,
      currency,
      quantity: parseInt(quantity) || 1,
      creatorCountry: user.location || "Oslo, Norway",
      weight: parseFloat(weight) || undefined,
      shippingTime: parseInt(shippingTime) || undefined,
      careInstructions: careInstructions || undefined,
      tags: tagsInput.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
    };
  };

  // Preview object
  const previewProduct = buildProductObject("Draft");

  return (
    <div className="bg-[#F8F8F6] text-[#111111] py-8 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#111111]/10 pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-mono font-bold">Creator Studio</span>
            <h1 className="font-serif text-2xl md:text-3xl font-light text-gray-900 tracking-tight">Create & List Artwork</h1>
            <p className="text-xs text-gray-500 font-light mt-1">Populate the global Artora marketplace registry with your newly cured masterwork.</p>
          </div>
          
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-4 py-2 bg-white border border-gray-200 hover:border-[#111111] text-xs font-mono tracking-wider uppercase rounded-xl transition flex items-center space-x-1.5 shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>{isPreviewMode ? "Edit Details" : "Live Preview"}</span>
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-mono tracking-wider uppercase hover:text-red-500 transition"
            >
              Discard
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <AnimatePresence mode="wait">
          {isPreviewMode ? (
            /* PREVIEW LAYOUT */
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl space-y-8"
            >
              <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 p-4 rounded-2xl text-xs text-[#C9A227] font-mono tracking-wide flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>You are currently previewing how your listing will appear to collectors.</span>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Images mock */}
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="aspect-square bg-[#F8F8F6] rounded-2xl overflow-hidden flex items-center justify-center">
                    <img 
                      src={uploadedImages[0] || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"} 
                      alt="Preview Artwork" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info mock */}
                <div className="w-full md:w-1/2 space-y-4">
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#C9A227]">{category}</span>
                  <h2 className="font-serif text-2xl text-gray-900">{productName || "Untitled Original Piece"}</h2>
                  <div className="text-xl font-serif font-semibold">{currency} {price || "0.00"}</div>
                  
                  <div className="border-t border-b border-gray-100 py-3 my-2 space-y-2 text-xs text-gray-500">
                    <div><span className="font-mono uppercase tracking-wider">Materials:</span> {materials || "Bespoke blend"}</div>
                    <div><span className="font-mono uppercase tracking-wider">Dimensions:</span> {dimensions || "Original Dimensions"}</div>
                    <div><span className="font-mono uppercase tracking-wider">Stock:</span> {quantity} piece(s) available</div>
                    <div><span className="font-mono uppercase tracking-wider">Processing Time:</span> {processingTime}</div>
                  </div>

                  <p className="text-xs text-gray-600 font-light leading-relaxed italic">"{description || "No description provided."}"</p>

                  <div className="pt-4 flex gap-3">
                    <button onClick={handleSaveDraft} className="flex-1 py-3 bg-white border border-[#111111] text-[#111111] text-xs font-mono tracking-widest uppercase font-bold rounded-xl hover:bg-[#111111] hover:text-white transition">
                      Save Draft
                    </button>
                    <button onClick={handlePublish} className="flex-1 py-3 bg-[#C9A227] text-white text-xs font-mono tracking-widest uppercase font-bold rounded-xl hover:bg-black transition">
                      Publish Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* FORM LAYOUT */
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-lg space-y-6"
            >
              {validationError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-800 font-sans flex items-center justify-between shadow-xs">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                    <span>{validationError}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setValidationError(null)}
                    className="p-1 hover:bg-red-100 rounded-full text-red-500 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Product Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sculptural Obsidian Vessel"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Price *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="950"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                    />
                    <DollarSign className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Currency Dropdown */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Quantity / Stock *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                {/* Processing Time */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Estimated Processing Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Ready to ship in 3-5 days"
                    value={processingTime}
                    onChange={(e) => setProcessingTime(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                {/* Materials Used */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Materials Used</label>
                  <input
                    type="text"
                    placeholder="e.g. Stoneware Clay, Cobalt Oxide, Ash Glaze (comma separated)"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                {/* Dimensions */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g. 12” H x 8” W"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                {/* Weight (kg) */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2.4"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                {/* Shipping Time (weeks) */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Estimated Transit Time (weeks)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={shippingTime}
                    onChange={(e) => setShippingTime(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                </div>

                {/* Search Tags */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Search Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. ceramic, modern, obsidian, sculpture"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                </div>

              </div>

              {/* Care Instructions */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Care & Preservation Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Handwash with delicate soap only. Keep away from prolonged direct high-noon sunlight."
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Description *</label>
                <textarea
                  placeholder="Detail the creative process, glaze formulation, wood kiln firing hours, or design origin..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs h-32 focus:outline-none focus:border-[#C9A227] resize-none transition"
                />
              </div>

              {/* Upload Multiple Images */}
              <div className="space-y-3 text-left border-t border-gray-100 pt-5">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#C9A227] font-bold block">Images Collection</label>
                  <p className="text-[10px] text-gray-400 font-light">Input high-resolution Unsplash image links or file URLs representing your artwork from various profiles.</p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#111111] hover:bg-[#C9A227] text-white text-[10px] font-mono uppercase tracking-widest rounded-xl transition"
                  >
                    Add URL
                  </button>
                </div>

                {/* Displaying Uploaded Images */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-[#F8F8F6] rounded-xl overflow-hidden border border-gray-100 group">
                      <img src={img} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Empty state box to prompt selection */}
                  <div className="aspect-square bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                    <UploadCloud className="w-6 h-6 text-[#C9A227] mb-1.5" />
                    <span className="text-[9px] font-mono uppercase">Drag/Drop or Add URL Above</span>
                  </div>
                </div>
              </div>

              {/* Upload Product Video */}
              <div className="space-y-2 text-left border-t border-gray-100 pt-5">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Product Video (Optional)</label>
                  <p className="text-[10px] text-gray-400 font-light">Add a short studio crafting loop or turntable showcasing details.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste video file URL or YouTube link"
                    value={uploadedVideo}
                    onChange={(e) => setUploadedVideo(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#F8F8F6] border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-[#C9A227] transition"
                  />
                  {uploadedVideo && (
                    <button
                      type="button"
                      onClick={() => setUploadedVideo("")}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition text-[10px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Save / Publish Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-mono tracking-widest uppercase font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  className="w-full sm:w-auto px-6 py-3 bg-[#C9A227] hover:bg-[#111111] text-white text-xs font-mono tracking-widest uppercase font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-lg shadow-[#C9A227]/10"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Product</span>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

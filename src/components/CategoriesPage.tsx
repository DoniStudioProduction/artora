import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

interface CategoriesPageProps {
  onSelectCategory: (category: string) => void;
}

export default function CategoriesPage({ onSelectCategory }: CategoriesPageProps) {
  
  // Immersive categories matching requirements exactly
  const categoriesList = [
    {
      name: "Paintings",
      description: "Fine acrylic, oil pastel, and physical watercolor brushstrokes on rich canvas and linen.",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      count: 42,
      tag: "Original Canvas"
    },
    {
      name: "Digital Art",
      description: "Modern algorithmic vector works, abstract projections, and rare immersive digital files.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      count: 28,
      tag: "New Media"
    },
    {
      name: "Photography",
      description: "Limited edition analog frames, architectural studies, and dramatic fine-art captures.",
      image: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&w=600&q=80",
      count: 19,
      tag: "Limited Prints"
    },
    {
      name: "Sculpture",
      description: "Imposing modern shapes, hand-carved stone, fine bronze castings, and heavy physical forms.",
      image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80",
      count: 12,
      tag: "Fine Form"
    },
    {
      name: "Woodwork",
      description: "Fallen regional hardwoods hand-crafted into custom heirloom furniture and organic joinery.",
      image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
      count: 24,
      tag: "Heritage Wood"
    },
    {
      name: "Pottery",
      description: "Tactile imperfections, raw clay bodies, wood-fired finishes, and earthy studio pottery.",
      image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80",
      count: 36,
      tag: "Stoneware"
    },
    {
      name: "Leather",
      description: "Vegetable-tanned full-grain bags, journals, and accessories stitched by hand.",
      image: "https://images.unsplash.com/photo-1530133532239-edd907babd1c?auto=format&fit=crop&w=600&q=80",
      count: 15,
      tag: "Hand-Stitched"
    },
    {
      name: "Jewelry",
      description: "Brutalist geometry, sand-cast sterling silver, raw gold bands, and wearable precious solids.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      count: 31,
      tag: "Wearable Art"
    },
    {
      name: "Fashion",
      description: "Couture knitwear, organic-dyed natural threads, and exclusive avant-garde silhouettes.",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
      count: 22,
      tag: "Studio Wear"
    },
    {
      name: "Home Decor",
      description: "Curated objects of character: custom wall mirrors, organic light fixtures, and raw statement plates.",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
      count: 45,
      tag: "Bespoke Space"
    },
    {
      name: "Traditional African Crafts",
      description: "Beautifully hand-woven sisal baskets, traditional hand-carved wood masks, and ancestral beadings.",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
      count: 18,
      tag: "African Heritage"
    },
    {
      name: "Luxury Handmade",
      description: "The pinnacle of craftsman masterworks, made with gold leaf, silk inlays, and rare materials.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      count: 10,
      tag: "Signature Masterpieces"
    },
    {
      name: "Textiles",
      description: "Richly textured woven throws, tapestry work, hand-spun wool, and heritage room linens.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      count: 25,
      tag: "Woven Fiber"
    },
    {
      name: "Glass Art",
      description: "Stained panels, hand-blown organic glass vessels, and light-refracting crystal prisms.",
      image: "https://images.unsplash.com/photo-1504198266287-1659872e6590?auto=format&fit=crop&w=600&q=80",
      count: 14,
      tag: "Kiln & Blow"
    },
    {
      name: "Metal Art",
      description: "Welded raw iron, hammered copper bowls, bronze plaques, and brutalist wall sculptures.",
      image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80",
      count: 11,
      tag: "Forge & Fire"
    },
    {
      name: "Calligraphy",
      description: "Traditional ink brushstrokes, elegant copperplate script, and modern lettering canvases.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
      count: 16,
      tag: "Ink & Letter"
    },
    {
      name: "Illustration",
      description: "Original pen drawings, screenprints, character studies, and fine engraving plates.",
      image: "https://images.unsplash.com/photo-1618005198143-e52e828a57f2?auto=format&fit=crop&w=600&q=80",
      count: 20,
      tag: "Original Ink"
    },
    {
      name: "Mixed Media",
      description: "Layered visual narratives combining acrylic paint, collage elements, wax, and found metals.",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
      count: 21,
      tag: "Visual Collage"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] pb-24 text-[#111111] text-left">
      
      {/* Premium Hero Panel */}
      <div className="bg-[#111111] text-[#F8F8F6] py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden">
        {/* Subtle decorative gold spotlight */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-3 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-mono font-bold block">Artora Registry</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight">Curated Marketplace Categories</h1>
          <p className="max-w-2xl text-xs md:text-sm text-white/60 font-light">Explore physical masterpieces sorted by discipline. Click any card to filter available items.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Elegant Bento-styled list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.5 }}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-white rounded-3xl border border-[#111111]/5 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-50">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="object-cover w-full h-full group-hover:scale-102 transition duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Tag label overlay */}
                <span className="absolute top-4 left-4 bg-[#111111] text-[8px] text-[#C9A227] font-mono font-bold px-2.5 py-1 rounded uppercase tracking-widest">
                  {cat.tag}
                </span>

                {/* Registry items count overlay */}
                <div className="absolute bottom-4 right-4 text-white font-mono text-[9px] tracking-wider bg-[#111111]/80 px-2.5 py-1 rounded">
                  {cat.count} Original Guild Listings
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-normal text-gray-900 group-hover:text-[#C9A227] transition flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#C9A227]" />
                  </h3>
                  
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-gray-400">
                  <span>Authentic Direct</span>
                  <span className="text-[#C9A227] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Browse Collection</span>
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

    </div>
  );
}

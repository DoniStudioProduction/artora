import { motion } from "motion/react";

interface CategoriesProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  scrollToMarketplace: () => void;
}

interface CategoryCard {
  name: string;
  count: string;
  imageUrl: string;
  colSpanClass: string;
}

export default function Categories({ selectedCategory, setSelectedCategory, scrollToMarketplace }: CategoriesProps) {
  const categoryCards: CategoryCard[] = [
    {
      name: "Paintings",
      count: "120 pieces",
      imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      colSpanClass: "md:col-span-2 md:row-span-2"
    },
    {
      name: "Pottery",
      count: "84 pieces",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80",
      colSpanClass: "md:col-span-1 md:row-span-1"
    },
    {
      name: "Jewelry",
      count: "56 pieces",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      colSpanClass: "md:col-span-1 md:row-span-1"
    },
    {
      name: "Woodwork",
      count: "42 pieces",
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
      colSpanClass: "md:col-span-2 md:row-span-1"
    },
    {
      name: "Fashion",
      count: "65 pieces",
      imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
      colSpanClass: "md:col-span-1 md:row-span-1"
    },
    {
      name: "Home Decor",
      count: "98 pieces",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      colSpanClass: "md:col-span-1 md:row-span-1"
    },
    {
      name: "Digital Art",
      count: "112 pieces",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      colSpanClass: "md:col-span-1 md:row-span-1"
    },
    {
      name: "Sculpture",
      count: "34 pieces",
      imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80",
      colSpanClass: "md:col-span-1 md:row-span-1"
    }
  ];

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    scrollToMarketplace();
  };

  return (
    <section id="featured-categories" className="py-24 bg-[#F8F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="text-left space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
              Curated Craft Sectors
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">
              Browse Featured Categories
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-sans text-xs text-gray-500 max-w-sm text-left leading-relaxed">
            Every category represents a guild of vetted artists who harvest local components and craft exclusively by hand.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]" id="categories-grid">
          {categoryCards.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500 border border-black/5 ${cat.colSpanClass}`}
            >
              {/* Image */}
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Elegant dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Bottom text details */}
              <div className="absolute bottom-6 left-6 right-6 text-left flex flex-col justify-end h-full">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-semibold mb-1 opacity-90">
                  {cat.count}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F8F8F6] font-normal leading-tight group-hover:translate-x-1 transition-transform duration-300">
                  {cat.name}
                </h3>
              </div>

              {/* Subtle accent border */}
              <div className="absolute inset-4 border border-[#C9A227]/0 group-hover:border-[#C9A227]/20 rounded-2xl transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

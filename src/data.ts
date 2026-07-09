import { Product, Creator, CreatorStory } from "./types";

export const CREATORS: Creator[] = [
  {
    id: "creator_ami_tanaka",
    name: "Ami Tanaka",
    specialty: "Contemporary Ceramics & Pottery",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Trained in Kyoto and based in Portland, Ami merges traditional Japanese wood-firing techniques with modern, sculptural silhouettes. Her work focuses on tactile imperfections and natural glaze formations.",
    location: "Portland, Oregon",
    followersCount: 1420,
    featuredWorks: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576016770956-debb63d900ef?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "creator_elena_rostova",
    name: "Elena Rostova",
    specialty: "Abstract Expressionist Painting",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Elena's large-scale canvas works explore memory, atmosphere, and natural light. She works with built-up layers of acrylic and oil pastel to capture the transient mood of northern landscapes.",
    location: "Oslo, Norway",
    followersCount: 3890,
    featuredWorks: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "creator_marcus_vance",
    name: "Marcus Vance",
    specialty: "Heritage Woodcraft & Joinery",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Marcus utilizes fallen hardwoods from the Pacific Northwest to craft furniture and kitchen heirloom pieces that respect the raw, living edge. Every joint is carved by hand using ancient joinery traditions.",
    location: "Seattle, Washington",
    followersCount: 2150,
    featuredWorks: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "creator_siddharth_nair",
    name: "Siddharth Nair",
    specialty: "Architectural & Brutalist Jewelry",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Siddharth designs solid metals into structured, sculptural wearable art. Influenced by modernist architecture, his jewelry highlights raw geometry, sand-cast textures, and clean precious metals.",
    location: "London, United Kingdom",
    followersCount: 1840,
    featuredWorks: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "prod_nebula_ceramic",
    title: "Nebula Wood-Fired Vessel",
    artistId: "creator_ami_tanaka",
    artistName: "Ami Tanaka",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Pottery",
    price: 320,
    rating: 4.9,
    reviewsCount: 18,
    imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    description: "A one-of-a-kind, wood-fired stoneware vessel, hand-thrown in Ami's Portland kiln. The rich texture is a natural outcome of wood ash flying through the kiln over a 48-hour fire, melting into iron and cobalt slips to form deep space nebula glaze formations. No two vessels can ever be identical.",
    materials: ["Portland Local Clay", "Natural Ash Glaze", "Cobalt Slips"],
    dimensions: "12” H x 8” W",
    inStock: 1
  },
  {
    id: "prod_ethereal_echoes",
    title: "Ethereal Echoes Acrylic Canvas",
    artistId: "creator_elena_rostova",
    artistName: "Elena Rostova",
    artistAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Paintings",
    price: 1850,
    rating: 5.0,
    reviewsCount: 12,
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    description: "An evocative abstract expressionist painting on heavy gallery-wrapped Belgian linen. Elena paints with intuitive, fluid strokes using raw charcoal, professional acrylics, and cold wax layers. This piece represents the soft light breaking through Norwegian coastal fog. Signed and dated by the artist on the reverse.",
    materials: ["Belgian Linen", "Artist Grade Acrylics", "Charcoal", "Cold Wax Medium"],
    dimensions: "36” W x 48” H x 1.5” D",
    inStock: 1
  },
  {
    id: "prod_brutalist_brass",
    title: "Brutalist Geometric Brass Ring",
    artistId: "creator_siddharth_nair",
    artistName: "Siddharth Nair",
    artistAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Jewelry",
    price: 165,
    rating: 4.8,
    reviewsCount: 34,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
    description: "A striking, structural statement ring inspired by brutalist architecture. Sand-cast in solid jewelers' brass with hand-filed geometric planes, this piece retains a raw, textured feel on the exterior while featuring a highly polished interior for optimal comfort. Naturally patinas beautifully over time.",
    materials: ["Solid Jewelers Brass", "Precious Metal Polish"],
    dimensions: "Available in US Sizes 7, 8, 9, 10",
    inStock: 5
  },
  {
    id: "prod_oak_burl",
    title: "Hand-Carved Oak Burl Platter",
    artistId: "creator_marcus_vance",
    artistName: "Marcus Vance",
    artistAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Woodwork",
    price: 280,
    rating: 4.9,
    reviewsCount: 22,
    imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    description: "Chiseled from a single, salvaged block of ancient white oak burl. Marcus carefully follows the wood's organic contours, leaving hand-adzed facets on the exterior side and a glass-smooth hand-sanded serving surface. Treated entirely with food-safe cold-pressed walnut oil and local beeswax.",
    materials: ["Salvaged White Oak Burl", "Walnut Oil", "Organic Beeswax"],
    dimensions: "14” L x 11” W x 2” D",
    inStock: 2
  },
  {
    id: "prod_linen_trench",
    title: "Organic Linen Drape Trench",
    artistId: "creator_marcus_vance", // using available profiles for association
    artistName: "Chloe Dubois",
    artistAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Fashion",
    price: 450,
    rating: 4.7,
    reviewsCount: 9,
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    description: "A fluid, light-wearing trench coat handcrafted from heavy organic Irish linen. Custom-dyed with natural plant matter (madder root and oak bark) to achieve a deep, living sandstone hue. Features clean raw-edged collars, hand-carved horn buttons, and deep side welt pockets.",
    materials: ["100% Organic Irish Linen", "Plant Dyes", "Buffalo Horn Buttons"],
    dimensions: "Sizes: S, M, L (Relaxed Fit)",
    inStock: 3
  },
  {
    id: "prod_terracotta_vase",
    title: "Tessellated Terracotta Vase",
    artistId: "creator_ami_tanaka",
    artistName: "Ami Tanaka",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Pottery",
    price: 195,
    rating: 4.8,
    reviewsCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1576016770956-debb63d900ef?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    description: "This structural vase features rhythmic hand-carved geometric patterns along a minimalist, unglazed terracotta body. The interior is fully glazed to guarantee water tightness, making it perfect for fresh cut flora, dry branches, or as a standalone geometric art object on a credenza.",
    materials: ["Local Clay", "Iron Oxide Washes", "Satin Matte Clear Glaze"],
    dimensions: "9” H x 5.5” W",
    inStock: 4
  },
  {
    id: "prod_verdant_horizon",
    title: "Verdant Horizon Oil & Pastel",
    artistId: "creator_elena_rostova",
    artistName: "Elena Rostova",
    artistAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Paintings",
    price: 1200,
    rating: 4.9,
    reviewsCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    description: "Capturing a lush summer evening in the fjords, this piece combines sweeping strokes of professional oil stick and oil pastels over a dense acrylic ground. Features rich forest greens, soft sage, and flashes of coppery amber. Unframed, with beautiful clean-painted edges.",
    materials: ["Belgian Canvas", "Artist Oil Sticks", "Artist Oil Pastels", "Gesso"],
    dimensions: "30” W x 30” H x 1.5” D",
    inStock: 1
  },
  {
    id: "prod_monolith_sconce",
    title: "Monolith Sand-Cast Brass Sconce",
    artistId: "creator_siddharth_nair",
    artistName: "Siddharth Nair",
    artistAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Home Decor",
    price: 340,
    rating: 5.0,
    reviewsCount: 11,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    description: "A heavy, wall-mounted ambient light fixture cast in raw recycled brass. The faceplate features textured sands from the casting process, which diffuses light upwards and downwards in warm, dramatic shadows. Fully wired for global voltage systems with standard LED fittings.",
    materials: ["Recycled Brass", "Ceramic Fixtures", "UL-Listed Cabling"],
    dimensions: "10” H x 4” W x 3.5” D",
    inStock: 2
  },
  {
    id: "prod_cybernetic_dream",
    title: "Quantum Flux Digital Canvas",
    artistId: "creator_elena_rostova",
    artistName: "Kenji Sato",
    artistAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Digital Art",
    price: 95,
    rating: 4.6,
    reviewsCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    description: "An ultra-high-definition, vector-generative artwork printed on premium museum-grade, matte cotton paper with archival pigment inks. It explores algorithmic flow patterns inspired by fluid mechanics and cellular automata. Numbered and hand-signed in a limited edition of 50 prints.",
    materials: ["310gsm Cotton Rag Paper", "Epson Archival Pigment Inks"],
    dimensions: "18” W x 24” H (Includes border)",
    inStock: 15
  },
  {
    id: "prod_prism_sculpture",
    title: "Fractured Light Glass Sculpture",
    artistId: "creator_siddharth_nair",
    artistName: "Julia Stern",
    artistAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    category: "Sculpture",
    price: 850,
    rating: 4.9,
    reviewsCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80",
    secondaryImageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    description: "An incredible kiln-cast, cold-carved optic glass sculpture. Julia meticulously cuts, polishes, and laminates heavy blocks of crystal. When struck by sunlight, it casts complex arrays of rainbow spectrum lines across a room. A gorgeous centerpiece for architectural offices or premium living spaces.",
    materials: ["Optic Lead-Free Crystal", "UV Laminating Resins"],
    dimensions: "8” W x 7” H x 5” D",
    inStock: 1
  }
];

export const CREATOR_STORIES: CreatorStory[] = [
  {
    id: "story_1",
    title: "From Kyoto to Portland: The Healing Power of Clay",
    creatorName: "Ami Tanaka",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1576016770956-debb63d900ef?auto=format&fit=crop&w=1200&q=80",
    publishedDate: "June 24, 2026",
    summary: "How an unexpected apprenticeship in a historic Kyoto pottery house helped Ami re-discover her creative heritage and build a thriving, slow-craft community in the Pacific Northwest.",
    fullStory: `My relationship with clay began when I felt most disconnected from my hands. Working a high-pressure office job in Seattle, I was burning out. On a whim, I took a sabbatical to visit family in Kyoto, and ended up staying for eighteen months, apprenticing under master ceramist Kenzo Ota.

Ota-sensei didn't let me touch the wheel for three months. I was assigned to filter clay, clean the wood ash, and sweep the floor. I learned that pottery is not about rapid creation; it is a communion with the elements. We used a multi-chambered wood kiln (Anagama) that fired for five straight days, requiring round-the-clock stoking of pine logs.

When I returned to the West, I wanted to bring that slow-craft ethos with me. I founded my workshop in Portland with a simple kiln, sourcing clay locally from Oregon soils. On Artora, I find buyers who understand why a vessel takes two weeks of focused labor to complete. It is not just homeware; it is a story of fire, soil, and patience.`
  },
  {
    id: "story_2",
    title: "The Living Grain: Respecting the Wood's Organic Voice",
    creatorName: "Marcus Vance",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
    publishedDate: "May 12, 2026",
    summary: "Marcus Vance shares his philosophies on sourcing fallen timber, interpreting wood burl formations, and crafting heirloom pieces that will outlive their creators by centuries.",
    fullStory: `People often ask me how I choose my lumber. The truth is, I don't. The lumber chooses me. I work almost exclusively with storm-felled or salvaged hardwoods—maple, walnut, white oak—that have lived a full century in the rain and soil of Washington.

When a massive tree falls in a storm, most people see debris. I see a library of stories. The tight grain of a tree indicates years of drought and struggle; the wider grain denotes years of abundant rainfall. Burls—those unusual knotty growths on trunks—are actually the tree's healing responses to external stress. They hold the most complex, beautiful grain patterns in the world.

My work relies heavily on manual hand-planes and Japanese chisels. This is quiet work. You can hear the grain of the wood singing under the blade. If you cut too fast, you tear the grain. If you listen, the wood tells you exactly where it wants to yield. I build pieces to last multiple lifetimes, which is why platforms like Artora are so vital. They connect makers like me to collectors who view furniture not as disposable commodities, but as heritage.`
  },
  {
    id: "story_3",
    title: "Layers of Coastal Fog: painting Oslo's Shifting Light",
    creatorName: "Elena Rostova",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    publishedDate: "April 02, 2026",
    summary: "Elena reveals her quiet morning routines painting along the Oslo Fjord, and how she captures atmospheric humidity and light refraction on heavy Belgian linen.",
    fullStory: `Light in Norway is a living character. In the winter, it clings low to the horizon, casting endless blue and amber shadows. In the summer, it stretches thin and translucent, staying for twenty hours a day.

My studio sits right on the edge of the Oslo Fjord. Every morning at 5:00 AM, I walk down to the water with a thermos of coffee and a sketchbook. I do not paint what I see; I paint what I remember after I close my eyes. The weight of the fog, the sharp scent of salt water, the cold wind on my face.

Back in the studio, I apply layer after layer of thinned acrylic, raw charcoal, and heavy oil pastel. I often scratch back into the wet paint using palette knives or wire brushes, exposing the raw Belgian linen beneath. It is a process of building up and tearing down. I hope that when someone looks at one of my pieces hanging in their living room in New York or Tokyo, they can feel a brief, quiet breath of the North Sea fog.`
  }
];

export const WHY_ARTORA = [
  {
    id: "why_1",
    title: "Direct Artist Support",
    description: "90% of all sales go directly to the artisans. We eliminate middle-man gallery fees so creators can fully fund their craft and thrive independently.",
    icon: "Heart"
  },
  {
    id: "why_2",
    title: "Verified Authenticity",
    description: "Every listing undergoes a rigorous artisan review. Every physical masterpiece is accompanied by a signed Certificate of Authenticity directly from the studio.",
    icon: "ShieldCheck"
  },
  {
    id: "why_3",
    title: "Eco-Conscious Crafting",
    description: "Our community prioritizes sustainably sourced clays, local non-toxic timber, natural plant-based textile dyes, and strictly plastic-free, recyclable gallery packaging.",
    icon: "Leaf"
  },
  {
    id: "why_4",
    title: "Global Artistic Bridge",
    description: "Discover local cultures through their native crafting techniques. We handle global premium shipping so you can collect stories from around the world.",
    icon: "Globe"
  }
];

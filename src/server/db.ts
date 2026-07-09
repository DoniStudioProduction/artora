import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Initialize Prisma Client lazily to prevent start-up crashes if DATABASE_URL is not set
let prisma: PrismaClient | null = null;

const hasDatabaseUrl = () => {
  return typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.trim() !== "";
};

export function getPrisma(): PrismaClient {
  if (!prisma) {
    if (hasDatabaseUrl()) {
      prisma = new PrismaClient();
      console.log("💎 Production Prisma Client initialized with PostgreSQL");
    } else {
      throw new Error("DATABASE_URL environment variable is missing.");
    }
  }
  return prisma;
}

// LOCAL FILE PERSISTENCE FALLBACK (for perfect out-of-the-box sandbox preview experience)
const LOCAL_DB_PATH = path.join(process.cwd(), "artora_local_db.json");

// Initial mock data to seed local DB if it doesn't exist
const getInitialDataset = () => {
  return {
    users: [
      {
        id: "usr_ami_tanaka",
        email: "ami@artora.com",
        passwordHash: "$2a$10$3yqZ8HnOq7U4tLscE93sPef/nreEskU8hD5fI6XlM9gK0F8vA/28q", // password: password
        name: "Ami Tanaka",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
        role: "CREATOR",
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_elena_rostova",
        email: "elena@artora.com",
        passwordHash: "$2a$10$3yqZ8HnOq7U4tLscE93sPef/nreEskU8hD5fI6XlM9gK0F8vA/28q",
        name: "Elena Rostova",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
        role: "CREATOR",
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_marcus_vance",
        email: "marcus@artora.com",
        passwordHash: "$2a$10$3yqZ8HnOq7U4tLscE93sPef/nreEskU8hD5fI6XlM9gK0F8vA/28q",
        name: "Marcus Vance",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
        role: "CREATOR",
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_admin",
        email: "donistudioproduction@gmail.com",
        passwordHash: "$2a$10$3yqZ8HnOq7U4tLscE93sPef/nreEskU8hD5fI6XlM9gK0F8vA/28q",
        name: "Artora Warden",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
        role: "ADMIN",
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ],
    creatorProfiles: [
      {
        id: "creator_ami_tanaka",
        userId: "usr_ami_tanaka",
        name: "Ami Tanaka",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
        specialty: "Contemporary Ceramics & Pottery",
        rating: 4.9,
        ratingCount: 18,
        followersCount: 1420,
        followingCount: 142,
        sales: 1240,
        country: "Japan / USA",
        storyText: "Trained in Kyoto and based in Portland, Ami merges traditional Japanese wood-firing techniques with modern, sculptural silhouettes. Her work focuses on tactile imperfections and natural glaze formations.",
        inspiration: "Japanese Wabi-Sabi philosophy, raw organic clay structures, and moss patterns.",
        materials: ["Portland Local Clay", "Natural Ash Glaze", "Cobalt Slips"],
        productionTime: "48-hour continuous wood kiln firing",
        craftProcess: "Thrown on hand-operated wheels, wood ash glazed, baked inside split-chamber anagama kilns.",
        joinedAt: "2024-03-12T00:00:00.000Z",
        badgeLevel: "ELITE"
      },
      {
        id: "creator_elena_rostova",
        userId: "usr_elena_rostova",
        name: "Elena Rostova",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
        specialty: "Abstract Expressionist Painting",
        rating: 5.0,
        ratingCount: 12,
        followersCount: 3890,
        followingCount: 84,
        sales: 382,
        country: "Norway",
        storyText: "Elena's large-scale canvas works explore memory, atmosphere, and natural light. She works with built-up layers of acrylic and oil pastel to capture the transient mood of northern landscapes.",
        inspiration: "Norwegian coastal fog, midnight sun light reflections, and Nordic solitude.",
        materials: ["Belgian Linen", "Artist Grade Acrylics", "Charcoal", "Cold Wax Medium"],
        productionTime: "3 to 4 weeks of layered application",
        craftProcess: "Intuitive fluid strokes layered with raw charcoal, built up with warm beeswax and artist acrylics.",
        joinedAt: "2024-05-18T00:00:00.000Z",
        badgeLevel: "FEATURED"
      }
    ],
    products: [
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
        inspiration: "Interstellar constellations and raw basalt columns.",
        productionTime: "3 Days",
        storyText: "Every firing is a dance with volcanic energy. The glaze is created from the trees of the surrounding forest.",
        createdAt: "2026-06-01T00:00:00.000Z"
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
        inspiration: "Morning coastal mist and dramatic cold oceans.",
        productionTime: "24 Days",
        storyText: "Linen represents the earth, and the gold-infused wax captures the fleeting glow of dawn.",
        createdAt: "2026-05-15T00:00:00.000Z"
      }
    ],
    categories: [
      { id: "cat_1", name: "Pottery", slug: "pottery", imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&h=300&q=80" },
      { id: "cat_2", name: "Paintings", slug: "paintings", imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&h=300&q=80" },
      { id: "cat_3", name: "Jewelry", slug: "jewelry", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&h=300&q=80" },
      { id: "cat_4", name: "Woodwork", slug: "woodwork", imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=300&h=300&q=80" }
    ],
    orders: [],
    payments: [],
    reviews: [
      {
        id: "rev_1",
        productId: "prod_nebula_ceramic",
        buyerName: "Lord Arthur Sterling",
        buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
        rating: 5,
        comment: "This piece is the crown jewel of my physical collection. The cosmic patterns of iron and cobalt seem to shift in natural morning light. Exquisite craft.",
        imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&h=300&q=80",
        creatorReply: "Thank you, Lord Sterling. It was fired during a full moon, which makes the iron bloom particularly vivid.",
        date: "June 12, 2026"
      }
    ],
    messages: [
      {
        id: "msg_1",
        senderId: "elena@artora.com",
        receiverId: "donistudioproduction@gmail.com",
        threadId: "donistudioproduction@gmail.com_elena@artora.com",
        text: "Warm greetings! The custom commissions for your Nordic installation are prepared. Let me know if you would like me to ship this week.",
        time: "10:15 AM",
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ],
    notifications: [
      {
        id: "notif_1",
        userId: "usr_admin",
        type: "MESSAGE",
        title: "New Message from Elena",
        message: "Warm greetings! The custom commissions for your Nordic installation...",
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ],
    wishlists: [],
    followers: [],
    journals: [
      {
        id: "j_1",
        creatorId: "creator_ami_tanaka",
        title: "Unveiling the Split-Chamber Anagama",
        story: "Just cracked open the kiln after a grueling 48-hour continuous wood fire. The iron-slips have bubbled up into spectacular dark galactic surfaces. Absolute magic.",
        photoUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
        likes: 124,
        comments: [
          { name: "Sir Charles", text: "Truly cosmic, Ami! Put me down for this series immediately." }
        ],
        isSaved: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "j_2",
        creatorId: "creator_elena_rostova",
        title: "Chasing Oslo Coastal Light",
        story: "Spent this morning capturing the transient silver fog on the fjord. This specific gray is achieved by blending natural cold beeswax into black slate pigments.",
        photoUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
        likes: 98,
        comments: [],
        isSaved: true,
        createdAt: new Date().toISOString()
      }
    ],
    collections: [
      { id: "col_1", creatorId: "creator_ami_tanaka", name: "Minimalism", description: "Clean organic shapes and quiet spaces" },
      { id: "col_2", creatorId: "creator_elena_rostova", name: "Luxury Decor", description: "Rich gold accent structures and dramatic backdrops" }
    ],
    reports: [
      { id: "rep_1", type: "CREATOR_APPLY", status: "PENDING", details: "Fiona Gallagher requesting Creator certification. Portfolio URL: fiona-craft.com", createdAt: new Date().toISOString() },
      { id: "rep_2", type: "SYSTEM", status: "INFO", details: "Automated integrity audit: No fraudulent materials detected.", createdAt: new Date().toISOString() }
    ]
  };
};

// Safe Database file readers and writers
export function readLocalDB() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const data = getInitialDataset();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  try {
    const content = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("⚠️ Error reading local JSON database, recreating.", err);
    const data = getInitialDataset();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

export function writeLocalDB(data: any) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("⚠️ Error writing to local JSON database", err);
  }
}

// Check Database mode dynamically
export const isProductionDB = hasDatabaseUrl();

import {
  auth,
  db
} from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  writeBatch
} from "firebase/firestore";
import { CREATORS, PRODUCTS } from "../data";
import { Product, Creator } from "../types";

// ==========================================
// SEEDING FIRESTORE WITH INITIAL PREMIUM DATA
// ==========================================
export async function seedInitialDataIfEmpty() {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    if (productsSnapshot.empty) {
      console.log("🌱 Firestore is empty. Seeding initial premium dataset...");
      
      // 1. Seed Categories
      const categories = [
        { id: "cat_1", name: "Pottery", slug: "pottery", imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&h=300&q=80" },
        { id: "cat_2", name: "Paintings", slug: "paintings", imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&h=300&q=80" },
        { id: "cat_3", name: "Jewelry", slug: "jewelry", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&h=300&q=80" },
        { id: "cat_4", name: "Woodwork", slug: "woodwork", imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=300&h=300&q=80" }
      ];
      for (const cat of categories) {
        await setDoc(doc(db, "categories", cat.id), cat);
      }

      // 2. Seed Creators
      for (const creator of CREATORS) {
        await setDoc(doc(db, "creatorProfiles", creator.id), {
          ...creator,
          userId: creator.id.replace("creator_", "usr_"),
          rating: 5.0,
          ratingCount: 15,
          sales: 120,
          joinedAt: new Date().toISOString(),
          badgeLevel: "ELITE"
        });
        
        // Also create a dummy user doc for each creator
        await setDoc(doc(db, "users", creator.id.replace("creator_", "usr_")), {
          id: creator.id.replace("creator_", "usr_"),
          name: creator.name,
          email: `${creator.name.toLowerCase().replace(/\s+/g, "")}@artora.com`,
          role: "creator",
          avatarUrl: creator.avatarUrl,
          createdAt: new Date().toISOString()
        });
      }

      // 3. Seed Products
      for (const prod of PRODUCTS) {
        await setDoc(doc(db, "products", prod.id), {
          ...prod,
          createdAt: new Date().toISOString(),
          views: Math.floor(Math.random() * 500) + 100,
          status: "Published"
        });
      }

      // 4. Seed Journals
      const journals = [
        {
          id: "j_1",
          creatorId: "creator_ami_tanaka",
          title: "Unveiling the Split-Chamber Anagama",
          story: "Just cracked open the kiln after a grueling 48-hour continuous wood fire. The iron-slips have bubbled up into spectacular dark galactic surfaces. Absolute magic.",
          photoUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
          likes: 124,
          comments: [{ name: "Sir Charles", text: "Truly cosmic, Ami! Put me down for this series immediately." }],
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
          createdAt: new Date().toISOString()
        }
      ];
      for (const j of journals) {
        await setDoc(doc(db, "journals", j.id), j);
      }

      console.log("⭐ Seeding of Firestore completed successfully!");
    }
  } catch (error) {
    console.error("🔴 Error seeding database:", error);
  }
}

// ==========================================
// AUTHENTICATION SERVICES
// ==========================================
export async function registerWithEmail(email: string, pass: string, name: string, role: string, phone: string = "") {
  // Create user in Firebase Auth
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  const firebaseUser = userCred.user;

  // Assign profile role automatically (default buyer, special admin email checks)
  let userRole = role;
  if (email === "donistudioproduction@gmail.com" || email === "admin@artora.com") {
    userRole = "admin";
  }

  const userProfile = {
    id: firebaseUser.uid,
    name,
    email,
    phone,
    role: userRole,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=c9a227`,
    isVerified: false,
    createdAt: new Date().toISOString()
  };

  // Create User document in Firestore
  await setDoc(doc(db, "users", firebaseUser.uid), userProfile);

  // If role is creator, also establish creator profile
  if (userRole === "creator" || userRole === "both") {
    const creatorId = `creator_${firebaseUser.uid}`;
    await setDoc(doc(db, "creatorProfiles", creatorId), {
      id: creatorId,
      userId: firebaseUser.uid,
      name,
      specialty: "Sovereign Artisan",
      avatarUrl: userProfile.avatarUrl,
      bio: "Independent Artisan Guild member committed to physical tactile preservation.",
      location: "Global Guild",
      followersCount: 0,
      featuredWorks: []
    });
  }

  // Send verification email
  try {
    await sendEmailVerification(firebaseUser);
  } catch (e) {
    console.error("Verification email dispatch failed:", e);
  }

  return userProfile;
}

export async function loginWithEmail(email: string, pass: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  const firebaseUser = userCred.user;

  // Retrieve custom Firestore profile
  const docRef = doc(db, "users", firebaseUser.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // Fail-safe default profile
    let role = "buyer";
    if (email === "donistudioproduction@gmail.com" || email === "admin@artora.com") {
      role = "admin";
    }
    const defaultProfile = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || email.split("@")[0],
      email: email,
      role: role,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}&backgroundColor=c9a227`,
      isVerified: firebaseUser.emailVerified,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, "users", firebaseUser.uid), defaultProfile);
    return defaultProfile;
  }
}

export async function logoutUser() {
  await firebaseSignOut(auth);
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// ==========================================
// USER & CREATOR PROFILE SERVICES
// ==========================================
export async function getUsersList() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => doc.data());
}

export async function getCreatorsList() {
  const snapshot = await getDocs(collection(db, "creatorProfiles"));
  return snapshot.docs.map(doc => doc.data());
}

export async function updateUserProfile(userId: string, data: any) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
  
  // If creator, also update creator profile details
  try {
    const creatorRef = doc(db, "creatorProfiles", `creator_${userId}`);
    const creatorSnap = await getDoc(creatorRef);
    if (creatorSnap.exists()) {
      await updateDoc(creatorRef, {
        name: data.name || creatorSnap.data().name,
        avatarUrl: data.avatarUrl || creatorSnap.data().avatarUrl,
        bio: data.bio || creatorSnap.data().bio,
        location: data.location || creatorSnap.data().location
      });
    }
  } catch (err) {
    console.error("Creator Profile side-update failed:", err);
  }
}

// ==========================================
// PRODUCT SERVICES & ADVANCED SEARCHING
// ==========================================
export async function getProductsList(filters?: {
  category?: string;
  creatorId?: string;
  country?: string;
  material?: string;
  sortBy?: "newest" | "popular" | "price_asc" | "price_desc";
}) {
  let q = collection(db, "products");
  const querySnapshot = await getDocs(q);
  let products = querySnapshot.docs.map(doc => doc.data() as Product);

  // Apply filters in-memory to prevent complex Firestore index requirements
  if (filters) {
    if (filters.category && filters.category !== "All") {
      products = products.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.creatorId) {
      products = products.filter(p => p.artistId === filters.creatorId);
    }
    if (filters.country) {
      products = products.filter(p => p.creatorCountry && p.creatorCountry.toLowerCase().includes(filters.country!.toLowerCase()));
    }
    if (filters.material) {
      products = products.filter(p => p.materials && p.materials.some(m => m.toLowerCase().includes(filters.material!.toLowerCase())));
    }
    
    // Sorting
    if (filters.sortBy) {
      if (filters.sortBy === "newest") {
        products.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      } else if (filters.sortBy === "popular") {
        products.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
      } else if (filters.sortBy === "price_asc") {
        products.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === "price_desc") {
        products.sort((a, b) => b.price - a.price);
      }
    }
  }

  return products;
}

export async function addProduct(productData: Partial<Product>) {
  const prodId = `prod_${Date.now()}`;
  const fullProduct = {
    ...productData,
    id: prodId,
    views: 0,
    rating: 5.0,
    reviewsCount: 0,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, "products", prodId), fullProduct);
  return fullProduct;
}

export async function deleteProduct(productId: string) {
  await deleteDoc(doc(db, "products", productId));
}

// ==========================================
// STORAGE MEDIA UPLOADS & OPTIMIZATION (TEMPORARILY MOCKED FOR SPARKS PLAN BYPASS)
// ==========================================
export async function uploadMediaFile(file: File, path: string): Promise<string> {
  console.log(`[Artora Mock Upload] Bypassing Firebase Storage for ${file.name}. Generating placeholder.`);
  
  // Choose placeholder based on common artisan keywords in the filename or general defaults
  const nameLower = file.name.toLowerCase();
  let placeholderUrl = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"; // Art general
  
  if (nameLower.includes("ceramic") || nameLower.includes("pot") || nameLower.includes("clay") || nameLower.includes("vase")) {
    placeholderUrl = "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"; // Ceramic
  } else if (nameLower.includes("paint") || nameLower.includes("canvas") || nameLower.includes("art")) {
    placeholderUrl = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"; // Painting
  } else if (nameLower.includes("wood") || nameLower.includes("chair") || nameLower.includes("table")) {
    placeholderUrl = "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80"; // Woodwork
  } else if (nameLower.includes("jewelry") || nameLower.includes("ring") || nameLower.includes("gold") || nameLower.includes("silver")) {
    placeholderUrl = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"; // Jewelry
  } else if (nameLower.includes("avatar") || nameLower.includes("profile") || nameLower.includes("user")) {
    placeholderUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(file.name)}&backgroundColor=c9a227`; // Avatar
  }

  return placeholderUrl;
}

// ==========================================
// ORDERS & REVIEWS
// ==========================================
export async function createOrder(orderData: any) {
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const fullOrder = {
    ...orderData,
    id: orderId,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, "orders", orderId), fullOrder);

  // Auto-send order system notifications to the client
  await createNotification(orderData.buyerId, {
    type: "Order",
    title: "Artora Order Placed",
    message: `Your golden contract for order ${orderId} has been successfully validated.`,
  });

  return fullOrder;
}

export async function getOrdersList() {
  const snapshot = await getDocs(collection(db, "orders"));
  return snapshot.docs.map(doc => doc.data());
}

export async function addReview(reviewData: any) {
  const reviewId = `rev_${Date.now()}`;
  const fullReview = {
    ...reviewData,
    id: reviewId,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, "reviews", reviewId), fullReview);
  return fullReview;
}

// ==========================================
// NOTIFICATIONS
// ==========================================
export async function createNotification(userId: string, data: {
  type: "Order" | "Follower" | "Message" | "Review" | "System";
  title: string;
  message: string;
}) {
  const notifId = `notif_${Date.now()}`;
  await setDoc(doc(db, "notifications", notifId), {
    id: notifId,
    userId,
    type: data.type,
    title: data.title,
    message: data.message,
    isRead: false,
    createdAt: new Date().toISOString()
  });
}

export async function getNotifications(userId: string) {
  const q = query(collection(db, "notifications"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data());
}

export async function markNotificationRead(notifId: string) {
  await updateDoc(doc(db, "notifications", notifId), { isRead: true });
}

// ==========================================
// MESSAGES ARCHITECTURE
// ==========================================
export async function sendMessage(senderId: string, receiverId: string, text: string) {
  const msgId = `msg_${Date.now()}`;
  const threadId = [senderId, receiverId].sort().join("_");
  
  const msg = {
    id: msgId,
    senderId,
    receiverId,
    threadId,
    text,
    createdAt: new Date().toISOString()
  };
  
  await setDoc(doc(db, "messages", msgId), msg);

  // Notify recipient
  await createNotification(receiverId, {
    type: "Message",
    title: "New Transmission",
    message: text.substring(0, 45) + (text.length > 45 ? "..." : "")
  });

  return msg;
}

export async function getMessagesForThread(threadId: string) {
  const q = query(collection(db, "messages"), where("threadId", "==", threadId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data()).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// ==========================================
// FOLLOWERS, WISHLISTS & JOURNALS
// ==========================================
export async function followCreator(userId: string, creatorId: string) {
  const followId = `${userId}_${creatorId}`;
  await setDoc(doc(db, "followers", followId), {
    id: followId,
    userId,
    creatorId,
    createdAt: new Date().toISOString()
  });
}

export async function getJournalsList() {
  const snapshot = await getDocs(collection(db, "journals"));
  return snapshot.docs.map(doc => doc.data());
}

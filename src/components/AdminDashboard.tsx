import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Store, ShoppingBag, FolderHeart, AlertTriangle, BarChart3,
  Trash2, ShieldCheck, UserX, UserCheck, Plus, CheckCircle2, RefreshCw, X, FolderPlus
} from "lucide-react";
import { db } from "../lib/firebase";
import {
  collection, getDocs, doc, updateDoc, deleteDoc, setDoc
} from "firebase/firestore";

export default function AdminDashboard() {
  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "users" | "creators" | "products" | "reports" | "categories" | "diagnostics">("analytics");
  const [users, setUsers] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryImg, setNewCategoryImg] = useState("");
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch Users
      const usersSnap = await getDocs(collection(db, "users"));
      const fetchedUsers = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);

      // Fetch Creators
      const creatorsSnap = await getDocs(collection(db, "creatorProfiles"));
      setCreators(creatorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Products
      const productsSnap = await getDocs(collection(db, "products"));
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Categories
      const categoriesSnap = await getDocs(collection(db, "categories"));
      setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Error loading Admin data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch local reports on mount or when creators change
  useEffect(() => {
    const savedApps = localStorage.getItem("artora_creator_applications");
    const currentApps = savedApps ? JSON.parse(savedApps) : [];
    
    const savedReports = localStorage.getItem("artora_admin_reports");
    const currentReports = savedReports ? JSON.parse(savedReports) : [];

    const synthesizedReports = currentApps.map((app: any) => ({
      id: `rep_apply_${app.id}`,
      type: "CREATOR_APPLY",
      status: app.status,
      details: `${app.userName} applying to become a Seller for "${app.studioName}". Specialty: ${app.specialties.join(", ")}. Country: ${app.country}.`,
      createdAt: app.createdAt,
      applicationId: app.id,
      applicationData: app
    }));

    const baseReports = [
      { id: "rep_1", type: "SYSTEM", status: "RESOLVED", details: "Fiona Gallagher requesting Creator certification. Portfolio URL: fiona-craft.com", createdAt: new Date().toISOString() },
      { id: "rep_2", type: "SYSTEM", status: "INFO", details: "Automated integrity audit: No fraudulent materials detected.", createdAt: new Date().toISOString() }
    ];

    setReports([...synthesizedReports, ...currentReports, ...baseReports]);
  }, [creators]);

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === "buyer" ? "creator" : currentRole === "creator" ? "admin" : "buyer";
    try {
      await updateDoc(doc(db, "users", userId), { role: nextRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
    } catch (e) {
      console.error("Error updating role:", e);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to permanently withdraw this product?")) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
      console.error("Error deleting product:", e);
    }
  };

  const handleResolveReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: "RESOLVED" } : r));
  };

  const handleApproveCreatorApplication = async (report: any) => {
    try {
      const appData = report.applicationData;
      if (!appData) {
        handleResolveReport(report.id);
        return;
      }

      // 1. Mark application as APPROVED in local storage
      const savedApps = localStorage.getItem("artora_creator_applications");
      if (savedApps) {
        const apps = JSON.parse(savedApps);
        const updatedApps = apps.map((a: any) => a.id === appData.id ? { ...a, status: "APPROVED" } : a);
        localStorage.setItem("artora_creator_applications", JSON.stringify(updatedApps));
      }

      // 2. Add as a verified Creator Profile to Firestore
      const newCreatorProfile = {
        id: `creator_${appData.studioName.toLowerCase().replace(/\s+/g, "_")}`,
        name: appData.userName,
        studioName: appData.studioName,
        email: appData.userEmail,
        specialty: appData.specialties[0],
        specialties: appData.specialties,
        bio: appData.bio,
        country: appData.country,
        city: appData.city,
        location: `${appData.city}, ${appData.country}`,
        avatarUrl: appData.profileImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        coverUrl: appData.coverImg || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        socials: appData.socials,
        followersCount: 15,
        salesCount: 0,
        createdAt: new Date().toISOString(),
        verified: true
      };

      await setDoc(doc(db, "creatorProfiles", newCreatorProfile.id), newCreatorProfile);

      // 3. Upgrade user's role to 'creator' in Firestore users collection
      if (appData.userEmail) {
        const matchUser = users.find(u => u.email === appData.userEmail || u.id === appData.userId);
        if (matchUser) {
          await updateDoc(doc(db, "users", matchUser.id), { role: "creator" });
        }
      }

      // 4. Mark report as RESOLVED
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: "RESOLVED" } : r));
      
      const savedReports = localStorage.getItem("artora_admin_reports");
      if (savedReports) {
        const reps = JSON.parse(savedReports);
        const updatedReps = reps.map((r: any) => r.applicationId === appData.id ? { ...r, status: "RESOLVED" } : r);
        localStorage.setItem("artora_admin_reports", JSON.stringify(updatedReps));
      }

      // Refresh data
      fetchAllData();
      setNotification({
        message: `Success: "${appData.userName}" has been elevated to a Certified Artora Guild Artisan!`,
        type: "success"
      });
    } catch (error) {
      console.error("Error approving creator application:", error);
      setNotification({
        message: "Error approving application. Check console for details.",
        type: "error"
      });
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName || !newCategorySlug) return;
    const newId = `cat_${Date.now()}`;
    const newCat = {
      id: newId,
      name: newCategoryName,
      slug: newCategorySlug,
      imageUrl: newCategoryImg || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&h=300&q=80"
    };

    try {
      await setDoc(doc(db, "categories", newId), newCat);
      setCategories(prev => [...prev, newCat]);
      setNewCategoryName("");
      setNewCategorySlug("");
      setNewCategoryImg("");
      setShowAddCatModal(false);
    } catch (e) {
      console.error("Error creating category:", e);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#111111]/5 shadow-sm space-y-8">
      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-sans flex items-center justify-between shadow-xs border ${
          notification.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className={`p-1 rounded-full transition cursor-pointer ${
              notification.type === "success" ? "hover:bg-emerald-100 text-emerald-600" : "hover:bg-red-100 text-red-600"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Subheader & Reload */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#111111]/5 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#C9A227]/10 text-[#C9A227] rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-normal text-gray-900 tracking-tight">
              Sovereign Guild Registry
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-light">
            Authorized administrator console for Artora Guild curation and telemetry.
          </p>
        </div>

        <button
          onClick={fetchAllData}
          disabled={isLoading}
          className="flex items-center space-x-2 text-xs uppercase tracking-widest px-4 py-2 bg-[#F8F8F6] hover:bg-[#111111] hover:text-white transition rounded-xl border border-[#111111]/5 font-medium disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Synchronize Ledger</span>
        </button>
      </div>

      {/* Workspace Subtabs */}
      <div className="flex flex-wrap gap-2">
        {(["analytics", "users", "creators", "products", "reports", "categories", "diagnostics"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${
              activeSubTab === tab
                ? "bg-[#111111] text-white"
                : "bg-[#F8F8F6] text-gray-500 hover:bg-[#111111]/5 hover:text-[#111111]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: ANALYTICS */}
        {activeSubTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#F8F8F6] p-6 rounded-2xl border border-[#111111]/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">Total Guild Users</span>
                  <Users className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div className="text-3xl font-serif text-gray-900 font-normal">{users.length}</div>
                <div className="text-[10px] text-emerald-600 font-medium font-mono">Verified Signatures</div>
              </div>

              <div className="bg-[#F8F8F6] p-6 rounded-2xl border border-[#111111]/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">Certified Artisans</span>
                  <Store className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div className="text-3xl font-serif text-gray-900 font-normal">{creators.length}</div>
                <div className="text-[10px] text-emerald-600 font-medium font-mono">Handcrafted Handlers</div>
              </div>

              <div className="bg-[#F8F8F6] p-6 rounded-2xl border border-[#111111]/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">Active Masterpieces</span>
                  <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div className="text-3xl font-serif text-gray-900 font-normal">{products.length}</div>
                <div className="text-[10px] text-[#C9A227] font-medium font-mono">Physical Inventory</div>
              </div>

              <div className="bg-[#F8F8F6] p-6 rounded-2xl border border-[#111111]/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">Category Domains</span>
                  <FolderHeart className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div className="text-3xl font-serif text-gray-900 font-normal">{categories.length}</div>
                <div className="text-[10px] text-gray-400 font-medium font-mono">Curation Circles</div>
              </div>
            </div>

            {/* Simulated telemetry and system monitoring */}
            <div className="bg-[#F8F8F6] p-6 rounded-2xl border border-[#111111]/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-gray-900 font-normal">Active System Node Overview</h3>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Live</span>
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono text-gray-600">
                <p>🚀 Storage Engine: Firebase Cloud Storage Operational</p>
                <p>🔥 Real-time Listener Synced: Firestore Database Active</p>
                <p>⚙️ Authentication Layer: Firebase Auth Active</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: USERS */}
        {activeSubTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#111111]/10 uppercase font-mono text-gray-400 tracking-wider">
                  <th className="py-3 px-4 font-normal">User Details</th>
                  <th className="py-3 px-4 font-normal">Email Address</th>
                  <th className="py-3 px-4 font-normal">Assigned Role</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/5 text-gray-700">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-[#F8F8F6]/50">
                    <td className="py-4 px-4 flex items-center space-x-3">
                      <img
                        src={userItem.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${userItem.name}&backgroundColor=c9a227`}
                        alt={userItem.name}
                        className="w-8 h-8 rounded-full border border-[#111111]/10 object-cover"
                      />
                      <span className="font-medium text-gray-900">{userItem.name}</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-500">{userItem.email}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] rounded text-[10px] uppercase font-bold tracking-wider font-mono">
                        {userItem.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleToggleUserRole(userItem.id, userItem.role)}
                        className="text-[10px] uppercase font-bold text-[#C9A227] hover:underline"
                      >
                        Cycle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* TAB 3: CREATORS */}
        {activeSubTab === "creators" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {creators.map((c) => (
              <div key={c.id} className="bg-[#F8F8F6] p-6 rounded-2xl border border-[#111111]/5 space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className="w-12 h-12 rounded-full border border-[#111111]/10 object-cover"
                  />
                  <div>
                    <h4 className="font-serif text-base text-gray-900 font-normal">{c.name}</h4>
                    <p className="text-[10px] text-[#C9A227] font-mono uppercase font-bold tracking-widest">
                      {c.specialty || "Master Artisan"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-3 font-light leading-relaxed">
                  {c.bio || c.storyText}
                </p>
                <div className="text-[10px] font-mono text-gray-400">
                  📍 {c.location || c.country || "Global Guild"}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 4: PRODUCTS */}
        {activeSubTab === "products" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-[#111111]/5 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-40 object-cover border-b border-[#111111]/5"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A227] font-bold">
                        {p.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-gray-900">${p.price}</span>
                    </div>
                    <h4 className="font-serif text-sm text-gray-900 font-normal line-clamp-1">{p.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2 font-light">{p.description}</p>
                  </div>
                </div>
                <div className="p-4 pt-0 border-t border-[#111111]/5 mt-4 flex items-center justify-between bg-[#F8F8F6]/50">
                  <span className="text-[10px] text-gray-400 font-mono">By {p.artistName}</span>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 5: REPORTS / COMPLIANCE */}
        {activeSubTab === "reports" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {reports.map((r) => (
              <div key={r.id} className="bg-[#F8F8F6] p-4 rounded-xl border border-[#111111]/5 flex items-center justify-between text-left">
                <div className="space-y-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className={`p-1 rounded text-[9px] font-bold font-mono uppercase tracking-wider ${
                      r.type === "CREATOR_APPLY" ? "bg-[#C9A227]/20 text-[#C9A227]" : "bg-blue-50 text-blue-700"
                    }`}>
                      {r.type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-light">{r.details}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {r.status === "PENDING" ? (
                    <button
                      onClick={() => {
                        if (r.type === "CREATOR_APPLY") {
                          handleApproveCreatorApplication(r);
                        } else {
                          handleResolveReport(r.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase transition flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{r.type === "CREATOR_APPLY" ? "Certify Artisan" : "Resolve"}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 6: CATEGORIES */}
        {activeSubTab === "categories" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddCatModal(true)}
                className="flex items-center space-x-2 text-xs uppercase tracking-widest px-4 py-2 bg-[#111111] text-white hover:bg-[#C9A227] transition rounded-xl font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>New Category Domain</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="relative rounded-2xl overflow-hidden border border-[#111111]/5 group aspect-square">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-4">
                    <span className="font-serif text-sm text-white tracking-wide font-normal">{cat.name}</span>
                    <span className="text-[10px] text-gray-300 font-mono font-light">/{cat.slug}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Category creation modal */}
            {showAddCatModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#111111]/10 space-y-6 relative"
                >
                  <button
                    onClick={() => setShowAddCatModal(false)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="text-center space-y-1.5">
                    <h3 className="font-serif text-xl text-gray-900 font-normal">Curation Circle Domain</h3>
                    <p className="text-xs text-gray-400 font-light">Create a new category cluster for high-art cataloging.</p>
                  </div>
                  <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-mono text-gray-400 uppercase tracking-widest text-[9px] font-bold">Category Name</label>
                      <input
                        type="text"
                        required
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Sculptures"
                        className="w-full px-4 py-3 bg-[#F8F8F6] border border-[#111111]/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-gray-400 uppercase tracking-widest text-[9px] font-bold">Category Slug</label>
                      <input
                        type="text"
                        required
                        value={newCategorySlug}
                        onChange={(e) => setNewCategorySlug(e.target.value)}
                        placeholder="e.g. sculptures"
                        className="w-full px-4 py-3 bg-[#F8F8F6] border border-[#111111]/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-gray-400 uppercase tracking-widest text-[9px] font-bold">Banner Image URL</label>
                      <input
                        type="text"
                        value={newCategoryImg}
                        onChange={(e) => setNewCategoryImg(e.target.value)}
                        placeholder="Unsplash image URL"
                        className="w-full px-4 py-3 bg-[#F8F8F6] border border-[#111111]/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#111111] hover:bg-[#C9A227] text-white rounded-xl uppercase font-mono tracking-widest text-xs transition cursor-pointer font-bold"
                    >
                      Construct Domain
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 7: DIAGNOSTICS */}
        {activeSubTab === "diagnostics" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 text-left"
          >
            {/* Diagnostics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Firebase Node */}
              <div className="bg-white p-6 rounded-3xl border border-[#111111]/5 space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227] font-bold">Cloud Cluster</span>
                    <h4 className="font-serif text-sm font-bold text-gray-900">Firebase Core</h4>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
                </div>
                <div className="space-y-2 text-xs font-mono text-gray-500">
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span>Database Status:</span>
                    <span className="text-emerald-600 font-bold">CONNECTED</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span>Latency Response:</span>
                    <span>34ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Project ID:</span>
                    <span className="truncate max-w-[120px] text-gray-400">artora-f698</span>
                  </div>
                </div>
              </div>

              {/* Firestore Registry */}
              <div className="bg-white p-6 rounded-3xl border border-[#111111]/5 space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227] font-bold">Store Registry</span>
                    <h4 className="font-serif text-sm font-bold text-gray-900">Firestore Rules v26</h4>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
                </div>
                <div className="space-y-2 text-xs font-mono text-gray-500">
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span>Security Schema:</span>
                    <span className="text-emerald-600 font-bold">STRICT_AUTH</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span>Registry Count:</span>
                    <span>3 Collections</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Pipeline:</span>
                    <span>Standard Local</span>
                  </div>
                </div>
              </div>

              {/* Environment Node */}
              <div className="bg-white p-6 rounded-3xl border border-[#111111]/5 space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227] font-bold">App Environment</span>
                    <h4 className="font-serif text-sm font-bold text-gray-900">Release Node</h4>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
                </div>
                <div className="space-y-2 text-xs font-mono text-gray-500">
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span>Runtime Engine:</span>
                    <span>Node v20.x</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span>SSL Certificate:</span>
                    <span className="text-emerald-600 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Build Spec:</span>
                    <span className="text-gray-400">Build-011 (Beta)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Error simulation matrix */}
            <div className="bg-neutral-900 text-[#F8F8F6] p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227] font-bold">Beta Quality Testing Center</span>
                <h3 className="font-serif text-lg text-white font-medium mt-1">Interactive Error Handling Simulation</h3>
                <p className="text-xs text-white/50 font-light mt-1">
                  Trigger and test the full visual coverage of Artora's responsive error recovery states. Use these to verify layout, contrast, and messaging.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("artora_trigger_error", { detail: "no_internet" }))}
                  className="p-4 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500 rounded-2xl text-left transition-all group cursor-pointer"
                >
                  <span className="font-mono text-[9px] text-gray-400 group-hover:text-red-400">Ledger Offline</span>
                  <p className="font-serif text-xs text-white font-bold mt-1">No Internet</p>
                </button>

                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("artora_trigger_error", { detail: "auth_failure" }))}
                  className="p-4 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500 rounded-2xl text-left transition-all group cursor-pointer"
                >
                  <span className="font-mono text-[9px] text-gray-400 group-hover:text-amber-400">Sign Verify Rejected</span>
                  <p className="font-serif text-xs text-white font-bold mt-1">Auth Failure</p>
                </button>

                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("artora_trigger_error", { detail: "not_found" }))}
                  className="p-4 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500 rounded-2xl text-left transition-all group cursor-pointer"
                >
                  <span className="font-mono text-[9px] text-gray-400 group-hover:text-blue-400">Route Coordinates</span>
                  <p className="font-serif text-xs text-white font-bold mt-1">Page Not Found</p>
                </button>

                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("artora_trigger_error", { detail: "server_error" }))}
                  className="p-4 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500 rounded-2xl text-left transition-all group cursor-pointer"
                >
                  <span className="font-mono text-[9px] text-gray-400 group-hover:text-orange-400">Escrow Timeout</span>
                  <p className="font-serif text-xs text-white font-bold mt-1">Server Error</p>
                </button>

                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("artora_trigger_error", { detail: "unknown" }))}
                  className="p-4 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500 rounded-2xl text-left transition-all group cursor-pointer"
                >
                  <span className="font-mono text-[9px] text-gray-400 group-hover:text-purple-400">Canvas Anomaly</span>
                  <p className="font-serif text-xs text-white font-bold mt-1">Unknown Error</p>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

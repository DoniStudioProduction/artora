import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Fallback credentials auto-loaded from firebase-applet-config.json
const FALLBACK_CONFIG = {
  apiKey: "AIzaSyCBbJ2i36vem8Hj1ajpvHMPE4fBkbzcXFI",
  authDomain: "artora-40b7b.firebaseapp.com",
  projectId: "artora-40b7b",
  storageBucket: "artora-40b7b.firebasestorage.app",
  messagingSenderId: "547938073307",
  appId: "1:547938073307:web:d1ce987f80418521a62afe"
};

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || FALLBACK_CONFIG.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || FALLBACK_CONFIG.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || FALLBACK_CONFIG.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || FALLBACK_CONFIG.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || FALLBACK_CONFIG.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || FALLBACK_CONFIG.appId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (error) {
  console.warn("Firestore persistent local cache initialization failed, falling back to standard getFirestore:", error);
  db = getFirestore(app);
}

const storage = getStorage(app);

export { app, auth, db, storage };

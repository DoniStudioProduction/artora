import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Fallback credentials auto-loaded from firebase-applet-config.json
const FALLBACK_CONFIG = {
  apiKey: "AIzaSyBwKLKx9LlQYdVXwWoIA14FcrYHb_hGOZc",
  authDomain: "gen-lang-client-0578986167.firebaseapp.com",
  projectId: "gen-lang-client-0578986167",
  storageBucket: "gen-lang-client-0578986167.firebasestorage.app",
  messagingSenderId: "157804208166",
  appId: "1:157804208166:web:862ef212e70378421686e7"
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

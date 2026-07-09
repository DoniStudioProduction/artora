import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0578986167";

const app = getApps().length === 0 
  ? initializeApp({ projectId }) 
  : getApp();

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
export const adminStorage = getStorage(app);

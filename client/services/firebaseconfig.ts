// firebase/FirebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDERID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID,
};

// ✅ Useful for debugging missing .env values
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) console.warn(`Missing Firebase env value: ${key}`);
});

// ✅ Prevent initializing Firebase more than once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Create storage instance ONCE
export const storage = getStorage(app);

export default app;

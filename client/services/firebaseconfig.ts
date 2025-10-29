import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDERID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID,
};

// Check if all environment variables are set
const validateFirebaseConfig = (config: Record<string, string | undefined>) => {
  Object.entries(config).forEach(([key, value]) => {
    if (!value) {
      console.warn(`Missing environment variable for Firebase config: ${key}`);
    }
  });
};

validateFirebaseConfig(firebaseConfig);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

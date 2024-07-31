import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// My Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

console.log("env", process.env.NEXT_PUBLIC_SENDER_ID);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

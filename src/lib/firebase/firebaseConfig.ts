
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!firebaseApiKey) {
  console.warn(
    "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing. " +
    "Please ensure you have set it up in your .env file and restarted your development server. " +
    "The app will likely fail to connect to Firebase."
  );
}

if (!firebaseAuthDomain) {
  console.warn(
    "Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing. " +
    "Please ensure you have set it up in your .env file and restarted your development server. " +
    "Authentication will likely fail."
  );
}

if (!firebaseProjectId) {
  console.warn(
    "Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing. " +
    "Please ensure you have set it up in your .env file and restarted your development server."
  );
}

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

// Import Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKthJKjHAA3JN_J_56tnf25rKiNiWk29I",
  authDomain: "studygroupfinder-c46f2.firebaseapp.com",
  projectId: "studygroupfinder-c46f2",
  storageBucket: "studygroupfinder-c46f2.firebasestorage.app",
  messagingSenderId: "39878776041",
  appId: "1:39878776041:web:21714aab83aec6c7b0cc78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

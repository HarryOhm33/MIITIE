// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDpJ95gyzNvelwzhKC0ZHNQ_QNRST8n6g",
  authDomain: "miitie-website.firebaseapp.com",
  projectId: "miitie-website",
  storageBucket: "miitie-website.firebasestorage.app",
  messagingSenderId: "114389693215",
  appId: "1:114389693215:web:07323ab4b1f4f2955df62a",
  measurementId: "G-5WJEB5PG29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

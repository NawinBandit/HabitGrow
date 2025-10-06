// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1ShUgyrMoLMKjBD6jrtlXeABAFVPMXy8",
  authDomain: "habit-grow-11cbf.firebaseapp.com",
  projectId: "habit-grow-11cbf",
  storageBucket: "habit-grow-11cbf.firebasestorage.app",
  messagingSenderId: "681468550703",
  appId: "1:681468550703:web:e4403873e7090aa59f70da",
  measurementId: "G-H073DDPSEP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('✅ User is signed in:', user.email);
  } else {
    console.log('🚫 No user signed in');
  }
}, (error) => {
  console.error('❌ Auth state error:', error);
});
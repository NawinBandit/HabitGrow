// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1ShUgyrMoLMKjBD6jrtlXeABAFVPMXy8",
  authDomain: "habit-grow-11cbf.firebaseapp.com",
  databaseURL: "https://habit-grow-11cbf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "habit-grow-11cbf",
  storageBucket: "habit-grow-11cbf.firebasestorage.app",
  messagingSenderId: "681468550703",
  appId: "1:681468550703:web:e4403873e7090aa59f70da",
  measurementId: "G-H073DDPSEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
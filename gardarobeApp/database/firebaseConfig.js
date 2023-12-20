import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyBBwxfKkl24SsbA4j2J__gdqiVo5XK7QbI",
  authDomain: "wardrobe-4ee30.firebaseapp.com",
  databaseURL:
    "https://wardrobe-4ee30-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wardrobe-4ee30",
  storageBucket: "wardrobe-4ee30.appspot.com",
  messagingSenderId: "81482461757",
  appId: "1:81482461757:web:bd253c8b04fc731e20f054",
  measurementId: "G-MSVKDZH0ZQ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const realtimeDB = getDatabase(app);

export { app, auth, firestore, realtimeDB };

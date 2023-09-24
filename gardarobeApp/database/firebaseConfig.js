import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyCb-as5hyWyAqOqZP1_-1ZAYjX0pXx2tBg",
  authDomain: "database-95c46.firebaseapp.com",
  databaseURL:
    "https://database-95c46-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "database-95c46",
  storageBucket: "database-95c46.appspot.com",
  messagingSenderId: "693275199236",
  appId: "1:693275199236:web:04332aed156a57e80bb251",
};

const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

export { app, auth, firestore, database };

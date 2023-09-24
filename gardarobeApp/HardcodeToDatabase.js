import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyCb-as5hyWyAqOqZP1_-1ZAYjX0pXx2tBg",
  authDomain: "database-95c46.firebaseapp.com",
  projectId: "database-95c46",
  databaseURL:
    "https://database-95c46-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "database-95c46.appspot.com",
  messagingSenderId: "693275199236",
  appId: "1:693275199236:web:04332aed156a57e80bb251",
};

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to your Firebase Realtime Database
const database = getDatabase(firebaseApp);

// Hardcoded data
const hardcodedData = {
    location1: {
      title: "Chateau Motel",
      location: {
        latitude: 55.678153413526765,
        longitude: 12.574362797657678,
      },
      description: "Du har valgt Chateau Motel",
    },
    location2: {
      title: "Hive",
      location: {
        latitude:55.67934817535013, 
        longitude: 12.572940733386416
      },
      description: "Du har valgt Hive.",
    },
    location3: {
        title: "Sjus Bar",
        location: {
          latitude:  55.681281935192025, 
          longitude: 12.579873964073268
        },
        description: "Du har valgt Sjus Bar.",
      },
    // Add more hardcoded data as needed
  };
  

// Reference to the location in the database where you want to store the data
const dataRef = ref(database, "locations/");

// Set the hardcoded data in the database
set(dataRef, hardcodedData)
  .then(() => {
    console.log("Data successfully hardcoded into Firebase");
  })
  .catch((error) => {
    console.error("Error hardcoding data into Firebase:", error);
  });

 
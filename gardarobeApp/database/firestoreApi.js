import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebaseConfig"; // Import the Firestore configuration

// Function to fetch data from Firestore by collection name
export const fetchFirestoreData = async (collectionName) => {
  try {
    // Create a reference to the Firestore collection
    const collectionRef = collection(firestore, collectionName);

    const snapshot = await getDocs(collectionRef);

    // Create an array of objects from the Firestore data
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    throw error;
  }
};

// Other Firestore API functions can be added here as needed

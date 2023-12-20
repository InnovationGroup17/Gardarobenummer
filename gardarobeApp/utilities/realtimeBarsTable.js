// Imports for Firebase database operations and configuration
import { get, ref, set } from "firebase/database";
import { auth, realtimeDB } from "../database/firebaseConfig";

// Function to check if the current user is a host
async function isUserHost() {
  try {
    // Getting the current authenticated user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User is not authenticated");
    }
    const userId = currentUser.uid;
    // Reference to user's data in the database
    const usersRef = ref(realtimeDB, "users/" + userId);
    const userSnapshot = await get(usersRef);
    const userData = userSnapshot.val();

    // Check if the user's type is 'host' and return the status
    return userData && userData.type === "host";
  } catch (error) {
    console.error("Error in isUserHost:", error);
    throw error;
  }
}

// Function to check if the current user is listed in the bars reference
async function isUserInBarsRef() {
  try {
    // Getting the current authenticated user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User is not authenticated");
    }

    const userId = currentUser.uid;
    // Reference to check if the user is in the 'bars' node
    const barsRef = ref(realtimeDB, "bars/" + userId);
    const barsSnapshot = await get(barsRef);

    // Return true if the user's ID is in the barsRef, false otherwise
    return barsSnapshot.exists();
  } catch (error) {
    console.error("Error in isUserInBarsRef:", error);
    throw error;
  }
}

// Function to create hangars in a bar for the host user
async function CreateHangarsInBar() {
  if (await isUserHost()) {
    // Check if the current user already has a bars reference
    if (await isUserInBarsRef()) {
      console.log("User is already in barsRef");
      return;
    }

    // Creating a reference and data structure for bars with multiple hangars
    const barsRef = ref(realtimeDB, "bars/" + auth.currentUser.uid);
    const barsData = {
      hangars: {
        // Initializing each hangar with an empty orderId and available status
        ...[...Array(10)].map((_, index) => ({
          [index + 1]: { orderId: "", hangarStatus: "available" }
        })).reduce((acc, val) => ({ ...acc, ...val }), {})
      },
    };

    // Setting the bars data in the database
    await set(barsRef, barsData);
  }
}

// Exporting CreateHangarsInBar function for use elsewhere in the application
export default CreateHangarsInBar;

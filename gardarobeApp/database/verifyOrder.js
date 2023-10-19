//Denne kode har til formål at sikre at en ordre bliver registreret i den korrekte bar

// Import necessary Firebase services from firebaseConfig.js
import { get, ref } from "firebase/database"; // Correct import for Realtime Database
import { auth, realtimeDB } from "./firebaseConfig"; // Import necessary Firebase services

async function checkIfUserIsHost() {
  // Step 1: Get the User ID from Firebase Authentication
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User is not logged in.");
  }
  const userId = currentUser.uid;
  // Step 2: Locate the "users" table in the Realtime Database
  const usersRef = ref(realtimeDB, "users/" + userId);

  // Step 3: Find the user's data using their User ID
  const userSnapshot = await get(usersRef);

  // Step 4: Check if the "type" attribute is "host"
  const userData = userSnapshot.val();
  if (userData && userData.type === "host") {
    // Step 5: If the user is a host, get the User ID
    return userId;
  } else {
    // Step 6: If the user is not a host, throw an error
    throw new Error("User is not a host.");
  }
}

//Get order data from the Realtime Database
async function getOrderData(data) {
  const orderRef = ref(realtimeDB, "orders/" + data.user + "/" + data.orderId);
  const orderSnapshot = await get(orderRef);
  const orderData = orderSnapshot.val();
  return orderData;
}

// Function to retrieve user data from Realtime Database
// Function to retrieve user data from Realtime Database
async function VerifyOrder(data) {
  let status = false;
  data = JSON.parse(data);
  console.log("verifyOrder:", data);

  try {
    const  orderData = await getOrderData(data);
    const userId = await checkIfUserIsHost(); // Call the function and wait for the result
    const barIDFromOrder = orderData[0].BarData.barId;
    
    if (userId === barIDFromOrder) {
      console.log("User is a host");
      console.log("Order is from this bar");
      console.log("Order is verified");
      status = true;
      return status;
    }

  } catch (error) {
    console.error(error.message);
    // Handle the error if the user is not a host
  }
}

export default VerifyOrder;

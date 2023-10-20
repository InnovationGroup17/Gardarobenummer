//Denne kode har til formål at sikre at en ordre bliver registreret i den korrekte bar

// Import necessary Firebase services from firebaseConfig.js
import { get, ref, set, update } from "firebase/database"; // Correct import for Realtime Database
import { auth, realtimeDB } from "./firebaseConfig"; // Import necessary Firebase services

async function checkIfUserIsHost() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User is not authenticated");
    }
    const userId = currentUser.uid;
    const usersRef = ref(realtimeDB, "users/" + userId);
    const userSnapshot = await get(usersRef);
    const userData = userSnapshot.val();

    if (userData && userData.type === "host") {
      return userId;
    } else {
      throw new Error("User is not a host");
    }
  } catch (error) {
    console.error("Error in checkIfUserIsHost:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

//Get order data from the Realtime Database
async function getOrderData(data) {
  try {
    const orderRef = ref(realtimeDB, "orders/" + data.user + "/" + data.orderId);
    const orderSnapshot = await get(orderRef);
    const orderData = orderSnapshot.val();
    return orderData;
  } catch (error) {
    console.error("Error in getOrderData:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

async function UpdateOrderToScanned(data) {
  try {
    const orderData = await getOrderData(data);
    const status = orderData[1].status;
    console.log("orderData:", status);
    

    
      if (orderData[1].status === "readyToBeScanned") {
        //update status to scanned in realtime database
        const updateStatus = ref(realtimeDB, "orders/" + data.user + "/" + data.orderId + "/1");
        const updateData = {
          payTime: orderData[1].payTime,
          paymentId: orderData[1].paymentId,
          status: "OrderScannedByHost",
        };
        await update(updateStatus, updateData);
      
      } else {error}
    

    // Update the data in the database
    //await set(orderRef, orderData);

    return status;
  } catch (error) {
    console.error("Error in UpdateOrderToScanned:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Function to retrieve user data from Realtime Database
// Function to retrieve user data from Realtime Database
async function VerifyOrder(data) {
  let status = false;
  data = JSON.parse(data);
  console.log("verifyOrder:", data);

  try {
    const orderData = await getOrderData(data);
    const userId = await checkIfUserIsHost(); // Call the function and wait for the result
    const checkStatus = await UpdateOrderToScanned(data);
    const barIDFromOrder = orderData[0].BarData.barId;
  
    console.log("checkStatus:", checkStatus);
    if (userId === barIDFromOrder) {
      console.log("User is a host");
      console.log("Order is from this bar");
      console.log("Order is verified");
      return status = true;
    }
  } catch (error) {
    console.error(error.message);
    // Handle the error if the user is not a host
  }
}

export default VerifyOrder;

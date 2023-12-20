// Firebase and custom utilities imports
import { get, ref, set, update } from "firebase/database";
import { auth, realtimeDB } from "../database/firebaseConfig";
import { getMetroIPAddress } from "./getMetroIPAdress";

// Set up for development mode - getting the server URL using the metro IP
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;

// Function to retrieve order data from Firebase Realtime Database
async function GetOrderData(data) {
  try {
    // Creating a reference to the specific order in the database
    const orderRef = ref(realtimeDB, "orders/" + data.user + "/" + data.orderId);
    // Fetching the order data snapshot
    const orderSnapshot = await get(orderRef);
    // Extracting the data from the snapshot
    const orderData = orderSnapshot.val();
    return orderData;
  } catch (error) {
    console.error("Error in GetOrderData:", error);
    throw error; // Rethrowing the error for handling in the caller function
  }
}

// Function to update the status of an order to 'active'
async function UpdateOrderToActive(data) {
  try {
    // Retrieving order data
    const orderData = await GetOrderData(data);
    // Checking if the order status is 'orderScannedByHost'
    if (orderData[1].status === "orderScannedByHost") {
      // Reference to update the order status in the database
      const updateStatus = ref(realtimeDB, "orders/" + data.user + "/" + data.orderId + "/1");
      // New data to be updated
      const updateData = {
        payTime: orderData[1].payTime,
        paymentId: orderData[1].paymentId,
        status: "active",
      };
      // Performing the update operation
      await update(updateStatus, updateData);
    } else {
      throw new Error("Invalid order status");
    }
    return orderData[1].status;
  } catch (error) {
    console.error("Error in UpdateOrderToActive:", error);
    throw error;
  }
}

// Function to reserve a hangar based on the scanned data
async function reserveHangar(data, orderData) {
  // Parsing the order data from JSON format
  const parsedData = JSON.parse(orderData);
  const user = parsedData.user;
  const order = parsedData.orderId;

  // Getting the current authenticated user
  const currentUser = auth.currentUser;
  // Reference to the hangar in the 'bars' table
  const barsRef = ref(realtimeDB, "bars/" + currentUser.uid + "/hangars/" + data);
  // Reference to update the hangar number in the order
  const orderRef = ref(realtimeDB, "orders/" + user + "/" + order + "/0" + "/hangarNumber");

  try {
    // Checking if the hangar data exists
    const snapshot = await get(barsRef);
    if (snapshot.exists()) {
      // Data exists, reserve the hangar and update the order with hangar number
      const barsData = {
        hangarstatus: "reserved",
        orderId: order,
      };
      await set(barsRef, barsData);
      await set(orderRef, data);
      // Updating the order status to 'active'
      UpdateOrderToActive(parsedData);
    } else {
      // Handle case where QR code scanned does not match any hangar
      console.error("Incorrect QR code was scanned. Data not found in the table.");
      throw new Error("Incorrect QR code was scanned. Data not found in the table.");
    }
  } catch (error) {
    console.error("Error in reserveHangar:", error);
  }
}

// Exporting the reserveHangar function for use in other parts of the application
export default reserveHangar;

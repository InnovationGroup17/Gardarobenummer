// Purpose: To ensure that an order is correctly registered at a specific bar

// Imports Firebase services and utility functions
import { get, ref, update } from "firebase/database";
import { realtimeDB } from "../database/firebaseConfig";
import CheckIfUserIsHost from "./checkUserHost";

// Function to retrieve order data from the Firebase Realtime Database
async function GetOrderData(data) {
  try {
    // Creating a reference to the specific order in the database
    const orderRef = ref(
      realtimeDB,
      "orders/" + data.user + "/" + data.orderId
    );
    // Fetching the order data
    const orderSnapshot = await get(orderRef);
    // Extracting value from the snapshot
    const orderData = orderSnapshot.val();
    return orderData;
  } catch (error) {
    console.error("Error in GetOrderData:", error);
    throw error; // Rethrowing the error for caller to handle
  }
}

// Function to update an order's status
async function UpdateOrderToScanned(data) {
  try {
    // Retrieving order data
    const orderData = await GetOrderData(data);
    // Extracting relevant information from order data
    const status = orderData[1].status;
    const orderHanger = orderData[0].hangarNumber;
    const barId = orderData[0].barId;

    if (status === "active") {
      // Reference to update the order status
      const updateStatus = ref(
        realtimeDB,
        "orders/" + data.user + "/" + data.orderId + "/1"
      );
      // Data to update
      const updateData = {
        payTime: orderData[1].payTime,
        paymentId: orderData[1].paymentId,
        status: "resolved",
      };

      // Reference to update the hangar information
      const hangerRef = ref(
        realtimeDB,
        "bars/" + barId + "/hangars/" + orderHanger
      );
      const barsData = {
        hangarstatus: "available",
        orderId: "",
      };
      // Executing updates
      await update(updateStatus, updateData);
      await update(hangerRef, barsData);

    } else if (status === "readyToBeScanned") {
      // Updating order status to scanned
      const updateStatus = ref(
        realtimeDB,
        "orders/" + data.user + "/" + data.orderId + "/1"
      );
      const updateData = {
        status: "orderScannedByHost",
        payTime: orderData[1].payTime,
        paymentId: orderData[1].paymentId,
      };
      await update(updateStatus, updateData);
    } else {
      // Case when order is already scanned
      throw new Error("Order is already scanned");
    }

    return status;
  } catch (error) {
    console.error("Error in UpdateOrderToScanned:", error);
    throw error; // Rethrowing the error for caller to handle
  }
}

// Function to verify an order against the user's role (host)
async function VerifyOrder(data) {
  let status = "false";
  data = JSON.parse(data);

  try {
    // Getting order data
    const orderData = await GetOrderData(data);
    // Checking if the user is the host for the bar in the order
    const userId = await CheckIfUserIsHost();
    const barIDFromOrder = orderData[0].barId;

    if (userId === barIDFromOrder) {
      // Update the order status if the user is a host
      const checkStatus = await UpdateOrderToScanned(data);
      // Determining the return status based on the order's updated state
      if (checkStatus === "readyToBeScanned") {
        return (status = "true");
      }
      if (checkStatus === "active") {
        return (status = "done");
      }
    }
  } catch (error) {
    console.error(error.message);
    // Handling errors, especially when the user is not a host
  }
}

export default VerifyOrder; // Exporting the VerifyOrder function for use in other parts of the application

import { get, ref, set, update } from "firebase/database";
import { auth, realtimeDB } from "../database/firebaseConfig";
import { getMetroIPAddress } from "./getMetroIPAdress";

//DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
//DEVELOPMENT MODE

async function GetOrderData(data) {
  try {
    const orderRef = ref(
      realtimeDB,
      "orders/" + data.user + "/" + data.orderId
    );
    const orderSnapshot = await get(orderRef);
    const orderData = orderSnapshot.val();
    return orderData;
  } catch (error) {
    console.error("Fejl i getOrderData:", error);
    throw error; // Kast fejlen igen for at blive håndteret af opkaldet
  }
}

async function UpdateOrderToActive(data) {
  try {
    const orderData = await GetOrderData(data);
    const status = orderData[1].status;
    console.log("orderData:", status);

    if (orderData[1].status === "orderScannedByHost") {
      // Opdater status til "active" i Realtime Database
      const updateStatus = ref(
        realtimeDB,
        "orders/" + data.user + "/" + data.orderId + "/1"
      );
      const updateData = {
        payTime: orderData[1].payTime,
        paymentId: orderData[1].paymentId,
        status: "active",
      };

      await update(updateStatus, updateData);
    } else {
      error;
    }

    // Opdater data i databasen
    //await set(orderRef, orderData);

    return status;
  } catch (error) {
    console.error("Fejl i UpdateOrderToScanned:", error);
    throw error; // Kast fejlen igen for at blive håndteret af opkaldet
  }
}

async function reserveHangar(data, orderData) {
  const parsedData = JSON.parse(orderData); // Analyser de scannede data som JSON
  const user = parsedData.user;
  const order = parsedData.orderId;
  console.log("user:", user);

  const currentUser = auth.currentUser;
  console.log("reserveHangar:", data);
  const barsRef = ref(
    realtimeDB,
    "bars/" + currentUser.uid + "/hangars/" + data
  );

  const orderRef = ref(
    realtimeDB,
    "orders/" + user + "/" + order + "/0" + "/hangarNumber"
  );

  try {
    const snapshot = await get(barsRef);
    if (snapshot.exists()) {
      // Data exists in the table, so reserve the hangar status and insert orderData
      const barsData = {
        hangarstatus: "reserved",
        orderId: order,
      };
      await set(barsRef, barsData);
      await set(orderRef, data);
      UpdateOrderToActive(parsedData);
    } else {
      console.log("incorrect qr code was scanned");
      alert("Incorrect QR code was scanned. Data not found in the table.");
      throw new Error(
        "Incorrect QR code was scanned. Data not found in the table."
      );
    }
  } catch (error) {
    console.error("Error in reserveHangar:", error);
  }
}

export default reserveHangar;

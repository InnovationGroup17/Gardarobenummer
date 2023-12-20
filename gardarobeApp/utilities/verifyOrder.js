// Denne kode har til formål at sikre, at en ordre bliver registreret i den korrekte bar

// Importér de nødvendige Firebase-tjenester fra firebaseConfig.js
import { get, ref, set, update } from "firebase/database"; // Korrekt import til Realtime Database
import { auth, realtimeDB } from "../database/firebaseConfig"; // Importér de nødvendige Firebase-tjenester
import CheckIfUserIsHost from "./checkUserHost";

// Hent ordredata fra Realtime Database
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

async function UpdateOrderToScanned(data) {
  try {
    const orderData = await GetOrderData(data);
    const status = orderData[1].status;
    const user = orderData[0].user;
    const orderId = data.orderId;
    const orderHanger = orderData[0].hangarNumber;
    const barId = orderData[0].barId;
    console.log("orderHanger:", orderHanger);

    if (status === "active") {
 
      const updateStatus = ref(
        realtimeDB,
        "orders/" + user + "/" + orderId + "/1"
      );
      const updateData = {
        payTime: orderData[1].payTime,
        paymentId: orderData[1].paymentId,
        status: "resolved",
      };
      console.log("2");
      //fjern reservingen af hangar
      const hangerRef = ref(
        realtimeDB,
        "bars/" + barId + "/hangars/" + orderHanger
      );
      const barsData = {
        hangarstatus: "available",
        orderId: "",
      };
      await update(updateStatus, updateData);
      await update(hangerRef, barsData);
    } else if (status === "readyToBeScanned") {
      console.log("TEST");
      // Opdater status til "scannet" i Realtime Database
      const updateStatus = ref(
        realtimeDB,
        "orders/" + data.user + "/" + data.orderId + "/1"
      );
      const updateData = {
        payTime: orderData[1].payTime,
        paymentId: orderData[1].paymentId,
        status: "orderScannedByHost",
      };
      await update(updateStatus, updateData);
    } else {
      const error = "Ordren er allerede scannet";
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

// Funktion til at hente brugerdata fra Realtime Database
async function VerifyOrder(data) {
  let status = "false";
  data = JSON.parse(data);

  try {
    const orderData = await GetOrderData(data);
    const userId = await CheckIfUserIsHost(); // Kald funktionen og vent på resultatet
    const barIDFromOrder = orderData[0].barId;

    if (userId === barIDFromOrder) {
      const checkStatus = await UpdateOrderToScanned(data);
      console.log("checkStatus:", checkStatus);

      if (checkStatus === "readyToBeScanned") {
        return (status = "true");
      }
      if (checkStatus === "active") {
        return (status = "done");
      }
    }
  } catch (error) {
    console.error(error.message);
    // Håndter fejlen, hvis brugeren ikke er en vært
  }
}

export default VerifyOrder;

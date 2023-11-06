import { get, ref, set, update } from "firebase/database"; // Korrekt import til Realtime Database
import { auth, realtimeDB } from "../database/firebaseConfig"; // Importér de nødvendige Firebase-tjenester

async function isUserHost() {
  let status = false;
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Brugeren er ikke godkendt");
    }
    const userId = currentUser.uid;
    const usersRef = ref(realtimeDB, "users/" + userId);
    const userSnapshot = await get(usersRef);
    const userData = userSnapshot.val();

    if (userData && userData.type === "host") {
      status = true;
      console.log("isUserHost:", status);
      return status;
    } else {
      status = false;
      console.log("isUserHost:", status);
      return status;
    }
  } catch (error) {
    console.error("Fejl i checkIfUserIsHost:", error);
    throw error; // Kast fejlen igen for at blive håndteret af opkaldet
  }
}

async function isUserInBarsRef() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Brugeren er ikke godkendt");
    }

    const userId = currentUser.uid;
    const barsRef = ref(realtimeDB, "bars/" + userId);
    const barsSnapshot = await get(barsRef);

    return barsSnapshot.exists(); // Return true if the user's ID is in barsRef, false otherwise
  } catch (error) {
    console.error("Fejl i isUserInBarsRef:", error);
    throw error; // Re-throw the error for handling by the calling code
  }
}

async function CreateHangarsInBar() {
  const currentUser = auth.currentUser;
  if ((await isUserHost()) === true) {
    //create table called bars in realtimeDB:
    if ((await isUserInBarsRef()) === true) {
      console.log("User is already in barsRef");
      return;
    }

    const barsRef = ref(realtimeDB, "bars/" + currentUser.uid);
    const barsData = {
      hangars: {
        1: {
          orderId: "",
          hangarStatus: "available",
        },
        2: {
          orderId: "",
          hangarStatus: "available",
        },
        3: {
          orderId: "",
          hangarStatus: "available",
        },
        4: {
          orderId: "",
          hangarStatus: "available",
        },
        5: {
          orderId: "",
          hangarStatus: "available",
        },
        6: {
          orderId: "",
          hangarStatus: "available",
        },
        7: {
          orderId: "",
          hangarStatus: "available",
        },
        8: {
          orderId: "",
          hangarStatus: "available",
        },
        9: {
          orderId: "",
          hangarStatus: "available",
        },
        10: {
          orderId: "",
          hangarStatus: "available",
        },
      },
    };
    await set(barsRef, barsData);
  }
}
export default CreateHangarsInBar;

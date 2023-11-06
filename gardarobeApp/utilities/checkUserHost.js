import { get, ref, set, update } from "firebase/database"; // Korrekt import til Realtime Database
import { auth, realtimeDB } from "../database/firebaseConfig"; // Importér de nødvendige Firebase-tjenester

async function CheckIfUserIsHost() {
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
        return userId;
      } else {
        throw new Error("Brugeren er ikke en vært");
      }
    } catch (error) {
      console.error("Fejl i checkIfUserIsHost:", error);
      throw error; // Kast fejlen igen for at blive håndteret af opkaldet
    }
  }
  export default CheckIfUserIsHost;
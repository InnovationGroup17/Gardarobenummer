import { auth, realtimeDB } from "../../../database/firebaseConfig";
import { get, ref } from "firebase/database";

/**
 * Retrieve user data from Firebase Realtime Database.
 * @returns {Object|null} User data if an authenticated user is found, otherwise null.
 */

async function getUserData() {
  // Check for an authenticated user.
  const user = auth.currentUser;

  // If no user is authenticated, return null.
  if (!user) return null;

  // If a user is authenticated, retrieve the user data from the database.
  const userId = user.uid;

  try {
    const usersRef = ref(realtimeDB, `users/${userId}`);
    const snapshot = await get(usersRef);
    const userData = snapshot.exists() ? snapshot.val() : null;

    // Return both the user data and the uid.
    return {
      uid: userId,
      data: userData,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default getUserData;

/** HOW TO USE **
 * import getUserData from './getUserData';
 *
 * // Example usage
 * const user = getUserData();
 * console.log(user);
 *
 */

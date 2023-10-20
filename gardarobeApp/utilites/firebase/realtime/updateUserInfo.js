import { ref, update } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";

/**
 * Updates user data in the realtime database.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} data - The data to update.
 */

export const updateUserInfo = async (userId, data) => {
  try {
    await update(ref(realtimeDB, `users/${userId}`), data);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

/** HOW TO USE **
 * import { updateUserInfo } from './updateUser';
 *
 * // Example usage to update 1 field
 * await updateUserInfo( user.uid,{ key: value })
 *
 * // Example usage to update multiple fields
 * await updateUserInfo( user.uid,{ key1: value1, key2: value2, key3: value3 })
 *
 */

// Import necessary Firebase services from firebaseConfig.js
import { auth, realtimeDB } from './firebaseConfig';

// Function to retrieve user data from Realtime Database
async function getUserData() {
  const user = auth.currentUser;
  
  if (user) {
    const userId = user.uid;

    // Reference to the 'users' table in the Realtime Database
    const usersRef = ref(realtimeDB, 'users/' + userId);

    try {
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData;
      } else {
        return null; // User data not found in the database
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  } else {
    return null; // No user is currently logged in
  }
}

export default getUserData;


/*
Denne kode kan bruges til at hente brugeren, som er logget inds data i andre filer
import getUserData from './getUserData';

import getUserData from './getUserData';

// Example usage
async function main() {
  const userData = await getUserData();

  if (userData) {
    console.log(`Email: ${userData.email}`);
    console.log(`User ID: ${userData.userId}`);
    console.log(`Age: ${userData.age}`);
    console.log(`Display Name: ${userData.displayName}`);
    console.log(`Gender: ${userData.gender}`);
    console.log(`Type: ${userData.type}`);
  } else {
    console.log('No user is currently logged in.');
  }
}

main();


*/
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

export default function QRID() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // To store user data from the database
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    // Set up the real-time listener for Firebase Authentication
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (user) {
      // Fetch user data from the Firebase Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      const unsubscribeDB = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUserData(userData);
      });

      // Return the cleanup functions
      return () => {
        unsubscribeAuth();
        unsubscribeDB();
      };
    }
  }, [auth, user, db]);

  const handleLogOut = async () => {
    await signOut(auth).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  if (!user) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Current user: {user.email}</Text>
      <Text>Current UID: {user.uid}</Text>
      {userData && (
        <>
          <Text>Current displayName: {userData.displayName}</Text>
          <Text>Current Age: {userData.age}</Text>
        </>
      )}
      <Button title="Logout" onPress={handleLogOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: "5%",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});

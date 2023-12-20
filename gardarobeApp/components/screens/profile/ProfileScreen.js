// Importing necessary modules from React, React Native, and Firebase
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native"; // Importing the useNavigation hook for navigation

// Defining the QRID functional component
export default function QRID() {
  // State hooks for managing user and user data
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // To store user data from the database
  const navigation = useNavigation(); // Hook to enable navigation to other screens
  const auth = getAuth(); // Firebase Authentication instance
  const db = getDatabase(); // Firebase Realtime Database instance

  // Effect hook for setting up Firebase Authentication and Database listeners
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the current user
    });

    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const unsubscribeDB = onValue(userRef, (snapshot) => {
        const userData = snapshot.val(); // Fetch user data from Firebase Realtime Database
        setUserData(userData);
      });

      // Cleanup function to unsubscribe from the listeners
      return () => {
        unsubscribeAuth();
        unsubscribeDB();
      };
    }
  }, [auth, user, db]);

  // Function to handle user logout
  const handleLogOut = async () => {
    await signOut(auth).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  // Conditional rendering when the user is not found
  if (!user) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  // Render method defining the UI of the component
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
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate("Edit Profile")}
      />
    </View>
  );
}

// StyleSheet for the QRID component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: "5%",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});

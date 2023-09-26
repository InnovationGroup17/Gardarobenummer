import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import HistoryScreen from "./HistoryScreen";

function ProfileScreen ({ navigation }) {

const [user, setUser] = useState(null);
const auth = getAuth();

  useEffect(() => {
    // Set up the real-time listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Return the cleanup function
    return () => unsubscribe();
  }, [auth]);

  //Ønsker at brugeren skal logge ud 
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
      <Text>Welcome to your profile!</Text>
      <Text>Current user: {user.email}</Text>
      <Button onPress={handleLogOut} title="Log out" />
      <Button title="Go to History Screen"
        onPress={() => {
          // Således vi kan navigere til vores History Screen
          navigation.navigate("History Screen");
        }} />
        <Button title="Go to Payment Terms"
        onPress={() => {
          // Navigation til vores Payment Screen
          navigation.navigate("Payment Screen");
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: "5%",
    backgroundColor: "blue",
    padding: 8,
  },
});

export default ProfileScreen;

// Importing necessary modules and components from React, React Native, and custom hooks
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useAuthListener } from "../../authenticate/RealTime"; // Custom hook for listening to authentication changes
import QRID from "../profile/QRID"; // Importing the QRID component

// Defining the HomeScreen functional component
const HomeScreen = ({ navigation }) => {
  // Using the custom authentication listener hook to check if the user is logged in
  const isUserLoggedIn = useAuthListener();

  // Conditional rendering based on the user's login status
  if (isUserLoggedIn) {
    return <QRID />; // Renders QRID component if the user is logged in
  } else {
    return (
      // View for users who are not logged in, with options to navigate to Sign Up or Log In
      <View style={styles.container}>
        <Button title="Sign Up" onPress={() => navigation.navigate("Signup")} />
        <Button title="Log In" onPress={() => navigation.navigate("Login")} />
      </View>
    );
  }
};

// StyleSheet for the HomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

// Exporting the HomeScreen component for use in other parts of the application
export default HomeScreen;

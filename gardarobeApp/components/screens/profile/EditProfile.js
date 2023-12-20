// Importing necessary modules and hooks from React, React Native, and Firebase
import React, { useState, useEffect } from "react";
import { Button, Text, View, TextInput, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

// Defining the EditProfile functional component
function EditProfile() {
  // State hooks for handling user input and error messages
  const [displayName, setDisplayName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [type, setType] = useState("user");
  const [stripeId, setStripeId] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation(); // Hook to enable navigation to other screens

  // Getting the current authenticated user from Firebase Auth
  const auth = getAuth();
  const user = auth.currentUser;

  // Effect hook to fetch and set user data from Firebase Realtime Database on component mount
  useEffect(() => {
    if (user) {
      const usersRef = ref(realtimeDB, "users/" + user.uid);
      get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log("userData", userData);
          setDisplayName(userData.displayName);
          setSelectedGender(userData.gender);
          setSelectedAge(userData.age);
          setStripeId(userData.stripeId);
        }
      });
    }
  }, [user]);

  // Function to handle profile saving, including updating Firebase Realtime Database
  const handleSaveProfile = async () => {
    try {
      if (user) {
        const usersRef = ref(realtimeDB, "users/" + user.uid);
        const userData = {
          displayName: displayName,
          gender: selectedGender,
          age: selectedAge,
          type: type,
          stripeId: stripeId,
        };

        await set(usersRef, userData);
        navigation.navigate("Profile"); // Navigate to the profile screen after saving
      }
    } catch (error) {
      const errorMessage = error.message;
      setErrorMessage(errorMessage); // Set error message if there is an error
    }
  };

  // Render method defining the UI of the component
  return (
    <View>
      <Text style={styles.header}>Edit Profile</Text>
      <TextInput
        placeholder="Display Name"
        value={displayName}
        onChangeText={(name) => setDisplayName(name)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Gender"
        value={selectedGender}
        onChangeText={(gender) => setSelectedGender(gender)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Age"
        value={selectedAge}
        onChangeText={(age) => setSelectedAge(age)}
        style={styles.inputField}
      />
      {errorMessage && <Text style={styles.error}>Error: {errorMessage}</Text>}
      <Button onPress={handleSaveProfile} title="Save Profile" />
    </View>
  );
}

// StyleSheet for the EditProfile component
const styles = StyleSheet.create({
  error: {
    color: "red",
  },
  inputField: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: 300,
  },
  header: {
    fontSize: 40,
  },
});

// Exporting the component for use in other parts of the application
export default EditProfile;

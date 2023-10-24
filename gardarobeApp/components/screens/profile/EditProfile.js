import React, { useState, useEffect } from "react";
import { Button, Text, View, TextInput, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook


function EditProfile() {
  const [displayName, setDisplayName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation(); // Use the hook to get the navigation object

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user data from Realtime Database on component mount
  useEffect(() => {
    if (user) {
      const usersRef = ref(realtimeDB, "users/" + user.uid);
      get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setDisplayName(userData.displayName);
          setEmail(userData.email);
          setSelectedGender(userData.gender);
          setSelectedAge(userData.age);
        }
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      if (user) {
        // Update additional user data in the Realtime Database
        const usersRef = ref(realtimeDB, "users/" + user.uid);
        const userData = {
          displayName: displayName,
          gender: selectedGender,
          age: selectedAge,
          type: "user",
        };

        await set(usersRef, userData);

        // Navigate to the user's profile or another appropriate screen
        // Replace 'Profile' with the name of your user profile screen
        navigation.navigate("Profile");
      }
    } catch (error) {
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
    }
  };

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

export default EditProfile;

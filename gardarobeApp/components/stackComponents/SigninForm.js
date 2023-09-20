import React, { useState } from "react";
import { Button, Text, View, TextInput, StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook
import { getDatabase, ref, set } from "firebase/database";

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyCb-as5hyWyAqOqZP1_-1ZAYjX0pXx2tBg",
  authDomain: "database-95c46.firebaseapp.com",
  projectId: "database-95c46",
  databaseURL:
    "https://database-95c46-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "database-95c46.appspot.com",
  messagingSenderId: "693275199236",
  appId: "1:693275199236:web:04332aed156a57e80bb251",
};
const firebaseApp = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

function SignUpForm() {
  const navigation = useNavigation(); // Use the hook to get the navigation object

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Add this line
  const [errorMessage, setErrorMessage] = useState(null);

  const auth = getAuth();

  const handleSubmit = async () => {
    try {
      // Create a user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      // Store additional user data in the Realtime Database
      const usersRef = ref(database, "users/" + user.uid); // Create a reference to the user's data
      const userData = {
        email: user.email,
        username: username,
      };
      console.log(userData);
      await set(usersRef, userData);

      navigation.navigate("Home"); // Navigate to HomeScreen upon successful user creation
    } catch (error) {
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
    }
  };

  return (
    <View>
      <Text style={styles.header}>Sign up</Text>
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={(email) => setEmail(email)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry
        style={styles.inputField}
      />
      <TextInput
        placeholder="username"
        value={username}
        onChangeText={(username) => setUsername(username)}
        style={styles.inputField}
      />
      {errorMessage && <Text style={styles.error}>Error: {errorMessage}</Text>}
      <Button onPress={handleSubmit} title="Create user" />
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

export default SignUpForm;

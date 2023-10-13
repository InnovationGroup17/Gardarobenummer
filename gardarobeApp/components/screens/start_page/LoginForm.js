import React, { useState } from "react";
import { Button, Text, View, TextInput, StyleSheet } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook
import GoBackButton from "../../GlobalComponents/GoBackButton";

function LoginForm() {
  const navigation = useNavigation(); // Use the hook to get the navigation object
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const auth = getAuth();

  const handleSubmit = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Home"); // Navigate to HomeScreen upon successful login
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  };

  return (
    <View>
      <GoBackButton />
      <Text style={styles.header}>Log in</Text>
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
      {errorMessage && <Text style={styles.error}>Error: {errorMessage}</Text>}
      <Button onPress={handleSubmit} title="Login" />
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

export default LoginForm;

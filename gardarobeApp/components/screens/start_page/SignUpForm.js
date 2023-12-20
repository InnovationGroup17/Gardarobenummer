import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { ref, set } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";
import GoBackButton from "../../GlobalComponents/GoBackButton";

function SignUpForm() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setUsername] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isGenderPickerVisible, setIsGenderPickerVisible] = useState(false);
  const [isAgePickerVisible, setIsAgePickerVisible] = useState(false);

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

      // Store additional user data in the Realtime Database
      const usersRef = ref(realtimeDB, "users/" + user.uid);
      const userData = {
        displayName: displayName,
        gender: selectedGender,
        age: selectedAge,
        type: "user",
        stripeId: "",
      };
      console.log(userData);
      await set(usersRef, userData);

      navigation.navigate("Home");
    } catch (error) {
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
    }
  };

  const handleGenderSelection = () => {
    setIsGenderPickerVisible(true);
  };

  const handleGenderConfirm = () => {
    setIsGenderPickerVisible(false);
  };

  const handleAgeSelection = () => {
    setIsAgePickerVisible(true);
  };

  const handleAgeConfirm = () => {
    setIsAgePickerVisible(false);
  };

  return (
    <View>
      <GoBackButton />
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
        placeholder="displayName"
        value={displayName}
        onChangeText={(displayName) => setUsername(displayName)}
        style={styles.inputField}
      />
      {/* Custom Gender Picker */}
      <TouchableOpacity
        onPress={handleGenderSelection}
        style={styles.inputField}
      >
        <Text>{selectedGender ? selectedGender : "Select Gender"}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGenderPickerVisible}
        onRequestClose={() => setIsGenderPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedGender}
              onValueChange={(itemValue) => setSelectedGender(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
            <Button title="OK" onPress={handleGenderConfirm} />
          </View>
        </View>
      </Modal>
      {/* End Custom Gender Picker */}
      {/* Custom Age Picker */}
      <TouchableOpacity onPress={handleAgeSelection} style={styles.inputField}>
        <Text>{selectedAge ? selectedAge : "Select Age"}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAgePickerVisible}
        onRequestClose={() => setIsAgePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedAge}
              onValueChange={(itemValue) => setSelectedAge(itemValue)}
            >
              <Picker.Item label="Select Age" value="" />
              {Array.from({ length: 100 }, (_, i) => (
                <Picker.Item label={`${i + 18}`} value={`${i + 18}`} key={i} />
              ))}
            </Picker>
            <Button title="OK" onPress={handleAgeConfirm} />
          </View>
        </View>
      </Modal>
      {/* End Custom Age Picker */}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  button: {
    backgroundColor: "white", // Set your desired background color here
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5, // Optional: add some border radius for rounded corners
  },
  buttonText: {
    color: "#000", // Set your desired button text color here
    fontSize: 16,
  },
});

export default SignUpForm;

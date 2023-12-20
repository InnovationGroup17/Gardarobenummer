// Importing necessary modules and components from React, React Native, and Firebase
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import BackgroundGif from "../../../assets/gifs/ByRk.gif"; // Importing a background GIF
import QRCodeGenerator from "../../../utilities/QRCodeGenerator"; // Importing a custom QR code generator utility
import { useAuthListener } from "../../authenticate/RealTime"; // Custom hook for listening to authentication changes
import { realtimeDB } from "../../../database/firebaseConfig"; // Firebase database configuration
import { ref, get } from "firebase/database"; // Firebase database methods
import { getMetroIPAddress } from "../../../utilities/getMetroIPAdress"; // Utility to get Metro IP address for development
import { useNavigation } from "@react-navigation/native"; // Navigation hook from React Navigation

// Setting up the server URL for development mode
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;

// Defining the Order functional component
const Order = ({ route }) => {
  const navigation = useNavigation();
  const user = useAuthListener(); // Using custom hook to check if the user is logged in

  // Function to handle specific operations when pressed (to be updated later)
  const handlePress = async () => {
    const orderRef = ref(
      realtimeDB,
      `orders/${user.uid}/${route.params.dataToQR.orderId}`
    );

    const snapshot = await get(orderRef);
    const paymentId = snapshot.val()[1].paymentId;

    // Fetch request to the backend for payment capturing (to be moved later)
    await fetch(`${SERVER_URL}/payments/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: paymentId,
      }),
    });
  };

  // Render method defining the UI of the Order component
  return (
    <View style={styles.container}>
      <View style={styles.ticket}>
        <View style={styles.gifContainer}>
          <ImageBackground source={BackgroundGif} style={styles.gif}>
            <QRCodeGenerator // QR code generator component
              value={JSON.stringify(route.params.dataToQR)}
              size={250}
            />
          </ImageBackground>
        </View>
        <View>
          <Text style={styles.ticketText}>Ticket</Text>
        </View>
        <TouchableOpacity // Button to navigate back to the home screen
          style={styles.button}
          onPress={() => {
            navigation.popToTop();
          }}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity // Button for testing purposes
          style={styles.button}
          onPress={() => {
            handlePress();
          }}
        >
          <Text style={styles.buttonText}>Test af sucess</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// StyleSheet for the Order component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  ticket: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  gifContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    borderColor: "#000",
    borderWidth: 2,
    overflow: "hidden",
  },
  gif: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  ticketText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

// Exporting the Order component for use in other parts of the application
export default Order;

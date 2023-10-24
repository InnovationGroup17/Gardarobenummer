import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import BackgroundGif from "../../../assets/gifs/ByRk.gif";
import QRCodeGenerator from "../../../utilities/QRCodeGenerator";
import { useAuthListener } from "../../authenticate/RealTime";
import { realtimeDB } from "../../../database/firebaseConfig";
import { ref, get } from "firebase/database";
import { getMetroIPAddress } from "../../../utilities/getMetroIPAdress";
import { useNavigation } from "@react-navigation/native";

//DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
//DEVELOPMENT MODE

const Order = ({ route }) => {
  const navigation = useNavigation();
  const user = useAuthListener(); //can be used to check that the user is logged in and are the same as on the order

  //NEED TO ME UPDATED LATER. IT WORKS FOR NOW
  const handlePress = async () => {
    //Getting the order from the database
    const orderRef = ref(
      realtimeDB,
      `orders/${user.uid}/${route.params.dataToQR.orderId}`
    );

    //setting the paymentId
    const snapshot = await get(orderRef);
    const paymentId = snapshot.val()[1].paymentId;

    //SHOULD BE MOVED. This is just for testing. IT SHOULD BE MOVED TO AFTER THE HOST HAS ACCEPTED THE ORDER
    //calling the backend to capture the payment
    await fetch(`${SERVER_URL}/payments/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: paymentId,
      }),
    });
    //SHOULD BE MOVED
  };

  return (
    <View style={styles.container}>
      <View style={styles.ticket}>
        <View style={styles.gifContainer}>
          <ImageBackground source={BackgroundGif} style={styles.gif}>
            <QRCodeGenerator
              value={JSON.stringify(route.params.dataToQR)}
              size={250}
            />
          </ImageBackground>
        </View>
        <View>
          <Text style={styles.ticketText}>Ticket</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.popToTop(); //Back to the home screen
          }}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
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

export default Order;

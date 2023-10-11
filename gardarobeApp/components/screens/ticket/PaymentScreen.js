//this page should show the order details
//when the user clicks on the pay button, the order should be saved in the Realtime firestore database
//the user should be redirected to the OrderScreen

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { push, ref, set } from "firebase/database";
import { database } from "../../../database/firebaseConfig";
import { timestamp } from "../../../utilites/timestamp";
import { randomIdGenerator } from "../../../utilites/randomIdGenerator";
import { useAuthListener } from "../../authenticate/RealTime";

const PaymentScreen = ({ route }) => {
  const user = useAuthListener();
  const navigation = useNavigation();
  const order = [
    {
      BarData: {
        barId: route.params.OrderData.BarData.id.id,
        barName: route.params.OrderData.BarData.id.title,
        description: route.params.OrderData.BarData.id.description,
        location: route.params.OrderData.BarData.id.location,
      },
      user: route.params.OrderData.user,
      wardrobe: route.params.OrderData.selectedWardrobes,
      ticketTime: route.params.OrderData.ticketTime,
      totalPrice: route.params.OrderData.totalPrice,
      totalItems: route.params.OrderData.totalItems,
    },
  ];

  const handleSubmit = async () => {
    order.push({
      paymentStatus: true,
      payTime: timestamp(),
      status: "readyToBeScanned",
    });

    const ordersRef = ref(database, `orders/${user.uid}`);
    const newOrderRef = push(ordersRef);
    await set(newOrderRef, order);

    navigation.navigate("OrderScreen", { newOrderRef });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleSubmit();
        }}
      >
        <Text style={styles.buttonText}>Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

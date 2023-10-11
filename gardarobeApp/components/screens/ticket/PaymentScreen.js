//this page should show the order details
//when the user clicks on the pay button, the order should be saved in the Realtime firestore database
//the user should be redirected to the OrderScreen

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  const order = [];

  useEffect(() => {
    order.push(route.params);
    console.log(order);
    
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Order Screen")}
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

//this page should show the order details
//when the user clicks on the pay button, the order should be saved in the Realtime firestore database
//the user should be redirected to the OrderScreen

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { push, ref, set } from "firebase/database";
import { database } from "../../../database/firebaseConfig";
import { timestamp } from "../../../utilites/timestamp";
import { useAuthListener } from "../../authenticate/RealTime";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";

const SERVER_URL = "http://192.168.1.105:5001";

const PaymentScreen = ({ route }) => {
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
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

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${SERVER_URL}/payments/intents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: order[0].totalPrice * 100 }),
    });
    if (!response.ok) {
      console.log("Error", response);
    }
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  };

  const handlePayPress = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Please enter Complete card details");
      return;
    }
    const billingDetails = {
      email: "test@test.dk", //HARDCODED
    };
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      if (error) {
        console.log(error);
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "card",
          billingDetails: billingDetails,
        });
        console.log("paymentIntent", paymentIntent);
        if (error) {
          console.log("Payment confirmation error", error);
        } else if (paymentIntent) {
          console.log("Success");
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  //NEED TO BE INTEGRATED INTO THE PAYMENT PROCESS
  /**
   * const handleSubmit = async () => {
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
   */ //END OF INTEGRATION

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment Screen</Text>
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={{
          backgroundColor: "#FFFFFF",
          textColor: "#000000",
        }}
        style={{
          width: "100%",
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log("focusField", focusedField);
        }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handlePayPress();
        }}
        disabled={loading}
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

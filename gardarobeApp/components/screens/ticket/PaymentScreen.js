import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { push, ref, set } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";
import { timestamp } from "../../../utilites/timestamp";
import { useAuthListener } from "../../authenticate/RealTime";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { getMetroIPAddress } from "../../../utilites/getMetroIPAdress";

//DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
//DEVELOPMENT MODE

//PaymentScreen-komponentet
const PaymentScreen = ({ route }) => {
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  const user = useAuthListener();
  const navigation = useNavigation();
  const order = [
    {
      BarData: {
        //Bør opdateres så det kun er id på baren
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

  //call backend to create a payment intent and return the client secret
  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${SERVER_URL}/payments/intents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: order[0].totalPrice * 100, //converts amunt to xx,yy (e.g. amount = 100 => 100,00)
      }),
    });
    //Error handling
    if (!response.ok) {
      console.log("Error", response);
    }

    //return the client secret
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  };

  //handle the payment process and save the order in the Realtime firestore database
  const handlePayPress = async () => {
    //Check if the card details are complete
    if (!cardDetails?.complete) {
      Alert.alert("Please enter Complete card details");
      return;
    }
    //additional billing details
    const billingDetails = {
      email: user.email,
    };

    //Try Catch block to handle the payment process
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();

      //Error handling for getting the client secret
      if (error) {
        console.log("Error Fetching: ", error);
      } else {
        // Details to the confirmPayment method
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          paymentMethodType: "Card",
          billingDetails: billingDetails,
        });
        //Error handling for the payment process
        if (error) {
          console.log("Error in payment: ", error);
        } else if (paymentIntent) {
          //Payment was successfull (it is Uncaptured as wanted)
          order.push({
            payTime: timestamp(), //save the time of the Uncaptured payment
            status: "readyToBeScanned", //set the status of the order to readyToBeScanned
            paymentId: paymentIntent.id, //save the paymentId from Stripe
          });

          //save the order in the Realtime firestore database
          const ordersRef = ref(realtimeDB, `orders/${user.uid}`);
          const newOrderRef = push(ordersRef);
          await set(newOrderRef, order);

          //navigate to the OrderScreen with the dataToQR object
          let dataToQR = {
            orderId: newOrderRef.key,
            user: user.uid,
          };
          navigation.navigate("OrderScreen", { dataToQR });
        }
      }
    } catch (e) {
      //Error handling for the whole process
      console.log("Error", e);
    }
  };

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

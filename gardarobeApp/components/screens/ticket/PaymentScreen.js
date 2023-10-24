/*
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { get, push, ref, set } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";
import { timestamp } from "../../../utilites/timestamp";
import {
  CardField,
  PaymentIntent,
  useConfirmPayment,
  useStripe,
} from "@stripe/stripe-react-native";
import { getMetroIPAddress } from "../../../utilites/getMetroIPAdress";
import getUserData from "../../../utilites/firebase/realtime/getUserData";

//DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
//DEVELOPMENT MODE

//PaymentScreen-komponentet
const PaymentScreen = ({ route }) => {
  const [userDetails, setUserDetails] = useState({ uid: null, data: null });
  const [cardDetails, setCardDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { confirmPayment, loading } = useConfirmPayment();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [sheetLoading, setSheetLoading] = useState(false);
  const [isPaymentSheetInitialized, setIsPaymentSheetInitialized] =
    useState(false);
  const navigation = useNavigation();
  const order = [
    {
      barId: route.params.OrderData.BarData.id.id,
      user: route.params.OrderData.user,
      wardrobe: route.params.OrderData.selectedWardrobes,
      ticketTime: route.params.OrderData.ticketTime,
      totalPrice: route.params.OrderData.totalPrice,
      totalItems: route.params.OrderData.totalItems,
    },
  ];

  useEffect(() => {
    async function getUser() {
      try {
        const user = await getUserData();
        setUserDetails(user);
        if (user?.data?.stripeId) {
          initializePaymentSheet();
          setSheetLoading(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getUser();
  }, []);

  //call backend to create a payment intent and return the client secret
  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${SERVER_URL}/payments/intents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: order[0].totalPrice * 100, //converts amunt to xx,yy (e.g. amount = 100 => 100,00)
        customer: userDetails.data.stripeId,
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

  const fetchPaymentSheetParams = async () => {
    // Wait for userDetails.data.stripeId to be available
    while (!userDetails?.data?.stripeId) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
    }
    console.log("stripeId", userDetails.data.stripeId);

    const response = await fetch(`${SERVER_URL}/payments/payment-sheet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: order[0].totalPrice * 100,
        customer: userDetails.data.stripeId,
      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return { paymentIntent, ephemeralKey, customer };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    console.log("publishableKey", paymentIntent.id);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setIsPaymentSheetInitialized(true);
    }
  };

  const openPaymentSheet = async () => {
    console.log("hej", isPaymentSheetInitialized);
    if (isPaymentSheetInitialized === false) {
      Alert.alert("Error", "Payment sheet is not initialized yet.");
      return;
    }

    const { error } = await presentPaymentSheet();

    if (error) {
      console.log("Error in payment: ", error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  //handle the payment process and save the order in the Realtime firestore database
  const handlePayPress = async () => {
    //Check if the card details are complete
    if (!cardDetails?.complete) {
      Alert.alert("Please enter Complete card details");
      return;
    }

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
          paymentMethodType: "Card", // Add this line
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
          const ordersRef = ref(realtimeDB, `orders/${userDetails.uid}`);
          const newOrderRef = push(ordersRef);
          await set(newOrderRef, order);

          //navigate to the OrderScreen with the dataToQR object
          let dataToQR = {
            orderId: newOrderRef.key,
            user: userDetails.uid,
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
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
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
          <Button
            disabled={!isPaymentSheetInitialized}
            title="Open Sheet"
            onPress={openPaymentSheet}
          />
        </>
      )}
    </View>
  );
};

export default PaymentScreen;

//Styling
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
*/

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, push, set } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";
import { timestamp } from "../../../utilites/timestamp";
import { useStripe } from "@stripe/stripe-react-native";
import { getMetroIPAddress } from "../../../utilites/getMetroIPAdress";
import getUserData from "../../../utilites/firebase/realtime/getUserData";

// DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
// DEVELOPMENT MODE

const PaymentScreen = ({ route }) => {
  const [userDetails, setUserDetails] = useState({ uid: null, data: null });
  const [isPaymentSheetInitialized, setIsPaymentSheetInitialized] =
    useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
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

  useEffect(() => {
    async function getUser() {
      try {
        const user = await getUserData();
        setUserDetails(user);

        // Initialize payment sheet after setting userDetails and ensuring stripeId is available
        if (user?.data?.stripeId) {
          initializePaymentSheet(user.data.stripeId, order[0].totalPrice);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    getUser();
  }, []);
  const fetchPaymentSheetParams = async (id, totalPrice) => {
    console.log("Body", id);
    console.log("Body", totalPrice * 100);
    const response = await fetch(`${SERVER_URL}/payments/payment-sheet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice * 100,
        customer: id,
      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return { paymentIntent, ephemeralKey, customer };
  };

  const initializePaymentSheet = async (id, totalPrice) => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams(id, totalPrice);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    console.log("Error", error);
    if (!error) {
      setIsPaymentSheetInitialized(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      //Payment was successful (it is Uncaptured)
      order.push({
        payTime: timestamp(), //save the time of the Uncaptured payment
        status: "readyToBeScanned", //set the status of the order to readyToBeScanned
        paymentId: paymentIntent.id, //save the paymentId from Stripe
      });

      //save the order in the Realtime firestore database
      const ordersRef = ref(realtimeDB, `orders/${userDetails.uid}`);
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, order);

      //navigate to the OrderScreen with the dataToQR object
      let dataToQR = {
        orderId: newOrderRef.key,
        user: userDetails.uid,
      };
      navigation.navigate("OrderScreen", { dataToQR });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment Screen</Text>
      <Button
        disabled={!isPaymentSheetInitialized}
        title="Pay"
        onPress={openPaymentSheet}
      />
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
});

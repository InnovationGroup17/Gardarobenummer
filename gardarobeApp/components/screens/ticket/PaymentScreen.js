// Importing necessary modules and components from React, React Native, Stripe, and Firebase
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Navigation hook from React Navigation
import { ref, push, set } from "firebase/database"; // Firebase database methods
import { realtimeDB } from "../../../database/firebaseConfig"; // Firebase database configuration
import { timestamp } from "../../../utilities/timestamp"; // Utility function for getting the current timestamp
import { useStripe } from "@stripe/stripe-react-native"; // Stripe hook for handling payment
import { getMetroIPAddress } from "../../../utilities/getMetroIPAdress"; // Utility to get Metro IP address for development
import getUserData from "../../../utilities/firebase/realtime/getUserData"; // Utility function to get user data

// Setting up the server URL for development mode
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;

// Defining the PaymentScreen functional component
const PaymentScreen = ({ route }) => {
  const [userDetails, setUserDetails] = useState({ uid: null, data: null });
  const [paymentIdInfo, setPaymentIdInfo] = useState();
  const [isPaymentSheetInitialized, setIsPaymentSheetInitialized] =
    useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const navigation = useNavigation();
  const order = [
    {
      barId: route.params.OrderData.BarData.id.id,
      user: route.params.OrderData.user,
      wardrobe: route.params.OrderData.selectedWardrobes,
      ticketTime: route.params.OrderData.ticketTime,
      totalPrice: route.params.OrderData.totalPrice,
      totalItems: route.params.OrderData.totalItems,
      hangarNumber: ""
    },
  ];

  // Effect hook to fetch user data and initialize payment sheet
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

  // Function to fetch payment sheet parameters from the backend
  const fetchPaymentSheetParams = async (id, totalPrice) => {
    const response = await fetch(`${SERVER_URL}/payments/payment-sheet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice * 100,
        customer: id,
      }),
    });

    const {
      paymentIntentInfo,
      paymentId,
      paymentIntent,
      ephemeralKey,
      customer,
    } = await response.json();
    return { paymentId, paymentIntent, ephemeralKey, customer };
  };

  // Function to initialize the payment sheet
  const initializePaymentSheet = async (id, totalPrice) => {
    const { paymentId, paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams(id, totalPrice);

    setPaymentIdInfo(paymentId);

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
    if (error) {
      console.log("Error initializing payment sheet: ", error);
    } else {
      setIsPaymentSheetInitialized(true);
    }
  };

  // Function to open the payment sheet and handle payment
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      // Payment was successful (it is Uncaptured)
      order.push({
        payTime: timestamp(), // Save the time of the Uncaptured payment
        status: "readyToBeScanned", // Set the status of the order to readyToBeScanned
        paymentId: paymentIdInfo, // Save the paymentId from Stripe
      });

      // Save the order in the Realtime Firestore database
      try {
        const ordersRef = ref(realtimeDB, `orders/${userDetails.uid}`);
        const newOrderRef = push(ordersRef);
        await set(newOrderRef, order);

        // Navigate to the OrderScreen with the dataToQR object
        let dataToQR = {
          orderId: newOrderRef.key,
          user: userDetails.uid,
        };
        navigation.navigate("OrderScreen", { dataToQR });
      } catch (dbError) {
        console.error("Error saving order to database:", dbError);
      }
    }
  };

  // Render method defining the UI of the PaymentScreen component
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

// StyleSheet for the PaymentScreen component
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

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, push, set } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";
import { timestamp } from "../../../utilities/timestamp";
import { useStripe } from "@stripe/stripe-react-native";
import { getMetroIPAddress } from "../../../utilities/getMetroIPAdress";
import getUserData from "../../../utilities/firebase/realtime/getUserData";

// DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
// DEVELOPMENT MODE

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
      hangarNumber:""
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

  //
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
    console.log("paymentIntentInfo: ", paymentIntentInfo.payment_method_options);
    return { paymentId, paymentIntent, ephemeralKey, customer };
  };

  //
  const initializePaymentSheet = async (id, totalPrice) => {
    const { paymentId, paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams(id, totalPrice);

    console.log("paymentId: ", paymentId);
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
    }

    if (!error) {
      setIsPaymentSheetInitialized(true);
    }
  };

  //
  const openPaymentSheet = async () => {
    console.log("paymentIdInfo: ", paymentIdInfo);
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      //Payment was successful (it is Uncaptured)
      order.push({
        payTime: timestamp(), //save the time of the Uncaptured payment
        status: "readyToBeScanned", //set the status of the order to readyToBeScanned
        paymentId: paymentIdInfo, //save the paymentId from Stripe
      });

      //save the order in the Realtime firestore database
      try {
        const ordersRef = ref(realtimeDB, `orders/${userDetails.uid}`);
        const newOrderRef = push(ordersRef);
        await set(newOrderRef, order);

        //navigate to the OrderScreen with the dataToQR object
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

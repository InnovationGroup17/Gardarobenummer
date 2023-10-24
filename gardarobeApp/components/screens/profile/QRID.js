import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import QRCodeGenerator from "../../../utilities/QRCodeGenerator";
import { realtimeDB } from "../../../database/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function QRID() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [qrData, setQRData] = useState({}); // To store user data for the QR code
  //const [qrCodeKey, setQRCodeKey] = useState(""); Flyttet til QRCodeGenerator.js
  const auth = getAuth();
  const db = realtimeDB;

  useEffect(() => {
    // Set up the real-time listener for Firebase Authentication
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (user) {
      // Fetch user data from the Firebase Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      const unsubscribeDB = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUserData(userData);
      });

      // Return the cleanup functions
      return () => {
        unsubscribeAuth();
        unsubscribeDB();
      };
    }
  }, [auth, user, db]);

  // Regenerate QR code data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        //Fetch orders from the Firebase Realtime Database
        const orderRef = ref(db, `orders/${user.uid}`);
        onValue(orderRef, (snapshot) => {
          const allOrders = snapshot.val();
          let newestActiveOrderData = null;
          let newestTime = null;
          let newestOrderId = null;

          // Find the active orders
          for (let orderId in allOrders) {
            const orderArray = allOrders[orderId];
            const activeOrder = orderArray.find(
              (order) => order.status === "active"
            );

            // Check if an active order was found
            if (activeOrder) {
              const currentTime = new Date(activeOrder.payTime); // Convert the 'payTime' of the active order into a JavaScript Date object

              // Check if this is the first active order found, if the current order's time is more recent than the previously found active order's time
              if (!newestTime || currentTime > newestTime) {
                newestTime = currentTime; // Update the 'newestTime' to the time of the current active order
                newestActiveOrderData = orderArray; // Store the data of the current active order as the most recent active order found so far
                newestOrderId = orderId; // Store the ID of the current active order as the ID of the most recent active order found so far
              }
            }
          }
          // Set the QR code data to the newest active order
          if (newestActiveOrderData) {
            setQRData({
              orderId: newestOrderId,
              orderData: newestActiveOrderData,
            });
          } else {
            setQRData({});
          }
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, db]);

  if (!user) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCodeGenerator value={JSON.stringify(qrData)} size={200} />
      <Text>Current UID: {user.uid}</Text>
      {userData && (
        <>
          <Text>Current displayName: {userData.displayName}</Text>
          <Text>Current Age: {userData.age}</Text>
        </>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("OrderHistory");
        }}
      >
        <Text style={{ color: "white" }}>Order History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "5%",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

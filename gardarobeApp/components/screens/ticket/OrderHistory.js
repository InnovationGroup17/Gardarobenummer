import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuthListener } from "../../authenticate/RealTime";
import { realtimeDB } from "../../../database/firebaseConfig";
import { ref, onValue } from "firebase/database";

//Order history component
const OrderHistory = () => {
  const user = useAuthListener();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch orders from the database as the component mounts
  useEffect(() => {
    if (user) {
      //Fetch orders from the Firebase Realtime Database
      const orderRef = ref(realtimeDB, `orders/${user.uid}`);
      //get the orders from the database
      const unsubscribe = onValue(orderRef, (snapshot) => {
        const allOrders = snapshot.val();

        if (allOrders) {
          //sort the orders by status and time and map them to an array
          const sortedOrders = Object.entries(allOrders)
            .sort(([idA, orderA], [idB, orderB]) => {
              const timeA = new Date(orderA[0].ticketTime).getTime();
              const timeB = new Date(orderB[0].ticketTime).getTime();
              if (
                // Sort by status first (active orders first)
                orderA[1].status === "active" &&
                orderB[1].status !== "active"
              ) {
                return -1;
              } else if (
                orderA[1].status !== "active" &&
                orderB[1].status === "active"
              ) {
                return 1;
              } else {
                // Sort by time if status is the same
                return timeB - timeA;
              }
            })
            .map(([id, order]) => ({ id, ...order }));

          //set the orders
          setOrders(sortedOrders);
        }
      });

      return () => {
        // Cleanup the listener when the component is unmounted
        unsubscribe();
      };
    }
  }, [user]);

  // New function to handle order clicks
  const handleOrderClick = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Collapse if already expanded
    } else {
      setExpandedOrderId(orderId); // Expand the clicked order
    }
  };

  return (
    // Render the orders as a FlatList with a TouchableOpacity
    //Should be looked at regarding the styling and relevant information
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleOrderClick(item.id)}>
          <View style={styles.orderContainer}>
            <Text>Bar Name: {item[0].BarData.barName}</Text>
            <Text>Ticket Time: {item[0].ticketTime}</Text>
            <Text>Total Items: {item[0].totalItems}</Text>
            <Text>Total Price: {item[0].totalPrice}</Text>
            {/* Add other order details as needed */}
          </View>
          {expandedOrderId === item.id && ( // Conditionally render based on expandedOrderId
            <View style={styles.paymentContainer}>
              <Text>Payment Time: {item[1].payTime}</Text>
              <Text>Payment ID: {item[1].paymentId}</Text>
              <Text>Status: {item[1].status}</Text>
              {/* Add other payment details as needed */}
            </View>
          )}
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  orderContainer: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
  },
  paymentContainer: {
    padding: 10,
    backgroundColor: "#d1c4e9",
    marginBottom: 10,
  },
});

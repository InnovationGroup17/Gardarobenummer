import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Loading from "../../GlobalComponents/loading/Loading";
import { useAuthListener } from "../../authenticate/RealTime";
import { fetchFirestoreData } from "../../../utilities/firebase/firestore/firestoreApi";
import { realtimeDB } from "../../../database/firebaseConfig";
import { ref, onValue } from "firebase/database";

const OrderHistory = () => {
  const user = useAuthListener();
  const [orders, setOrders] = useState([]);
  const [allBars, setAllBars] = useState([]);
  const [isLoadingBars, setIsLoadingBars] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchBars();
  }, []);

  useEffect(() => {
    if (user && !isLoadingBars) {
      fetchOrders(user.uid);
    }
  }, [user, isLoadingBars]);

  const fetchBars = async () => {
    try {
      const bars = await fetchFirestoreData("Bars");
      setAllBars(bars);
      setIsLoadingBars(false);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = (userId) => {
    const orderRef = ref(realtimeDB, `orders/${userId}`);
    const unsubscribe = onValue(orderRef, (snapshot) => {
      const allOrders = snapshot.val();
      if (allOrders) {
        const ordersWithBarInfo = mapOrdersWithBarInfo(allOrders);
        setOrders(ordersWithBarInfo);
      }
    });
    return () => unsubscribe();
  };

  const mapOrdersWithBarInfo = (allOrders) => {
    return Object.entries(allOrders).map(([id, order]) => {
      const barData = allBars.find((bar) => bar.id === order[0].barId);
      return {
        id,
        orderInfo: order[0],
        paymentInfo: order[1],
        barTitle: barData.title,
      };
    });
  };

  const sortedOrders = useMemo(() => {
    return orders.sort((a, b) => {
      const timeA = new Date(a.orderInfo.ticketTime).getTime();
      const timeB = new Date(b.orderInfo.ticketTime).getTime();
      if (
        a.paymentInfo.status === "active" &&
        b.paymentInfo.status !== "active"
      ) {
        return -1;
      } else if (
        a.paymentInfo.status !== "active" &&
        b.paymentInfo.status === "active"
      ) {
        return 1;
      } else {
        return timeB - timeA;
      }
    });
  }, [orders]);

  const handleOrderClick = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  return isLoadingBars ? (
    <Loading />
  ) : (
    <FlatList
      style={styles.flatListContainer}
      contentContainerStyle={styles.flatListContent}
      data={sortedOrders}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleOrderClick(item.id)}>
          <View
            style={[
              styles.orderContainer,
              expandedOrderId === item.id
                ? {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    paddingBottom: 3,
                    marginBottom: 0,
                  }
                : {
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  },
            ]}
          >
            <Text>Bar: {item.barTitle}</Text>
            <Text>Status: {item.paymentInfo.status}</Text>
            <Text>Ticket Time: {item.orderInfo.ticketTime}</Text>
          </View>
          {expandedOrderId === item.id && (
            <View style={styles.paymentContainer}>
              <Text>Payment ID: {item.paymentInfo.paymentId}</Text>
              <Text>Total Items: {item.orderInfo.totalItems}</Text>
              <Text>Total Price: {item.orderInfo.totalPrice} kr.</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Example background color
  },
  flatListContent: {
    padding: 10,
  },
  orderContainer: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  paymentContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 10,
    paddingTop: 1,
    paddingHorizontal: 15,
    backgroundColor: "#C0C0C0",
    marginTop: 0,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default OrderHistory;

import React, { useState, useEffect } from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import BackgroundGif from "../../../assets/gifs/ByRk.gif";
import QRCodeGenerator from "../../../utilites/QRCodeGenerator";
import { database } from "../../../database/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useAuthListener } from "../../authenticate/RealTime";

const Order = ({ route }) => {
  const [orderData, setOrderData] = useState([]);
  const user = useAuthListener();

  useEffect(() => {
    const findOrder = () => {
      if (user) {
        const orderRef = ref(
          database,
          `orders/${user.uid}/${route.params.order[1].orderId}`
        );
        onValue(orderRef, (snapshot) => {
          const data = snapshot.val();
          console.log(data);
          setOrderData(data);
        });
      }
    };
    findOrder();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.ticket}>
        <View style={styles.gifContainer}>
          <ImageBackground source={BackgroundGif} style={styles.gif}>
            <QRCodeGenerator value={JSON.stringify(orderData)} size={250} />
          </ImageBackground>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  ticket: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  gifContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    borderColor: "#000",
    borderWidth: 2,
    overflow: "hidden",
  },
  gif: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  ticketText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Order;

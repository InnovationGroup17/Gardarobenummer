import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import BackgroundGif from "../../assets/gifs/ByRk.gif";
import QRCodeGenerator from "./QRCodeGenerator";

const Ticket = ({ route }) => {
  const data = route.params.ticketData;
  console.log(data.ticketNumber);
  console.log(data.userData.email);
  console.log(data.time);

  const QrData = {
    ticketNumber: 1,
    userData: {
      email: "En email",
      password: data.userData.password,
    },
    time: data.time,
  };

  return (
    <View style={styles.container}>
      <View style={styles.ticket}>
        <View style={styles.gifContainer}>
          <ImageBackground source={BackgroundGif} style={styles.gif}>
            <QRCodeGenerator value={JSON.stringify(QrData)} size={250} />
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
    backgroundColor: "grey",
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

export default Ticket;

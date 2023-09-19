import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import BackgroundGif from "../../assets/gifs/ByRk.gif";

const Ticket = ({ route }) => {
  const data = route.params.ticketData;
  console.log("Ticket made: " + data);
  return (
    <View style={styles.container}>
      <View style={styles.ticket}>
        <View style={styles.gifContainer}>
          <ImageBackground source={BackgroundGif} style={styles.gif}>
            <Text style={styles.ticketText}>Your Ticket</Text>
            <Text style={styles.ticketText}>
              Ticket number: {data.ticketNumber}
            </Text>
            <Text style={styles.ticketText}>Bar: </Text>
            <Text style={styles.ticketText}>User: {data.userData.email} </Text>
            <Text style={styles.ticketText}>Time: {data.time} </Text>
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

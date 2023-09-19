import React from "react";
import { View, Text, StyleSheet } from "react-native";

//design of a ticket. It should take in some props from the QRscanner and display them
const Ticket = ({ route }) => {
  const { ticketData } = route.params;
  console.log(ticketData);
  return (
    <View style={styles.ticket}>
      <Text style={styles.ticketText}>Ticket:</Text>
      <Text style={styles.ticketText}>Ticket number: {ticketData}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ticket: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Ticket;

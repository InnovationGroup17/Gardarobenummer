import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import QRCodeScanner from "./src/components/QRCodeScanner";

export default function App() {
  return (
    <View style={styles.container}>
      <QRCodeScanner />
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
  },
});

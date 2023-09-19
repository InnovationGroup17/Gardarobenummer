import { Button, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import { timestamp } from "../../utilites/timestamp";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

//Qr scanner komponent, der benytter sig af BarCodeScanner komponenten fra expo
const QrScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  //Metode til at få adgang til kameraet på enheden
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    // Set up the real-time listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Return the cleanup function
    return () => unsubscribe();
  }, [auth]);

  //Metode til at håndtere scanninger af QR koder og lave en ticket med dataen fra QR koden
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let ticketData = { ticketNumber: data, userData: user };
    navigation.navigate("Ticket", { ticketData, time: timestamp() });
  };

  //Hvis der ikke er givet adgang til kameraet, så returneres en tekst, der informerer om dette
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //Hvis der er givet adgang til kameraet, så returneres BarCodeScanner komponenten fra expo
  return (
    <View style={styles.constainer}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

export default QrScanner;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: "center",
  },
  scanner: {
    flex: 1,
  },
});

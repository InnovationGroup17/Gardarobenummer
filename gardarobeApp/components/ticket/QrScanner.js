import { Button, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import { timestamp } from "../../utilites/timestamp";
import { getAuth } from "@firebase/auth";
import { useAuthListener } from "../authenticate/RealTime";

// Qr scanner komponent, der benytter sig af BarCodeScanner komponenten fra expo
const QrScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Metode til at få adgang til kameraet på enheden
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Metode til at håndtere scanninger af QR koder og lave en ticket med dataen fra QR koden
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    let user = getAuth().currentUser;
    let parsedData = JSON.parse(data);

    let ticketData = {
      ticketNumber: parsedData.number,
      bar: parsedData.bar,
      uid: user.uid,
      item: parsedData.genstand,
      status: "active",
      time: timestamp(),
    };
    navigation.navigate("Ticket", { ticketData });
  };

  // Hvis der ikke er givet adgang til kameraet, så returneres en tekst, der informerer om dette
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Hvis der er givet adgang til kameraet, så returneres BarCodeScanner komponenten fra expo
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

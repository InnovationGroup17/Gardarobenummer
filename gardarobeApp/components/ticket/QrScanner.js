import { Button, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";

//Qr scanner komponent, der benytter sig af BarCodeScanner komponenten fra expo
const QrScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  //Metode til at få adgang til kameraet på enheden
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  //Metode til at håndtere scanninger af QR koder og lave en ticket med dataen fra QR koden
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(data);
    setTicketData(data);
    navigation.navigate("Ticket", { ticketData: data });
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
      {
        (scanned,
        ticketData && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        ))
      }
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

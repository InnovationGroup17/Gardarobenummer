// Date: 18.09.2020
import { Button, StyleSheet, Text, View, Linking } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as React from "react";

//Qr scanner komponent, der benytter sig af BarCodeScanner komponenten fra expo
const QrScanner = () => {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);

  //Metode til at få adgang til kameraet på enheden
  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  //Metode til at håndtere scanninger. Denne metode bliver kaldt, når der scannes en QR kode
  
  //!!!!!Skal sættes op med en metode, der sender dataen videre til databasen. !!!!!
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let collectedData = [];
    collectedData.push(data, type);
    console.log("Data: " + collectedData[0]);
    console.log("Type: " + collectedData[1]);
    Linking.openURL(data);
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
    flexDirection: "column",
    justifyContent: "center",
  },
  button: {},
  scanner: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

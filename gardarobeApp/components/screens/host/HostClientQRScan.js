import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { getPermisionBarCodeScanner } from "../../../utilities/getPermisionBarCodeScanner";
import VerifyOrder from "../../../utilities/verifyOrder";
import { useNavigation } from "@react-navigation/native"; // Importer brugen af useNavigation-hooket

// QR-scannerkomponent, der bruger BarCodeScanner-komponenten fra expo
const HostClientQR = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation(); // Brug hooket til at hente navigationsobjektet

  useEffect(() => {
    setHasPermission(getPermisionBarCodeScanner()); // Få tilladelse til at bruge stregkodescanneren

    const fetchData = async () => {
      try {
        // Hent data (i øjeblikket en tom funktion, kan bruges til datahentning)
      } catch (error) {
        console.error(error); // Log eventuelle fejl, der opstår under datahentning
      }
    };
    fetchData(); // Kald fetchData-funktionen, når komponenten monteres
  }, []);

  // Metode til at håndtere scanninger af QR-koder til håndtering af ordredata
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true); // Marker stregkoden som scannet

    try {
      const status = await VerifyOrder(data); // Verificer de scannede ordredata
      const parsedData = JSON.parse(data); // Analyser de scannede data som JSON
      const user = parsedData.user;
      const order = parsedData.orderId;

      console.log("status", status); // Log status for ordreverifikation

      alert(`Stregkode med bruger-ID ${user} og ${order} er blevet scannet!`); // Vis en meddelelse med bruger- og ordredetaljer
      if (status === true) {
        navigation.navigate("HostHangerQRScan", data); // Navigér til skærmen "HostHangerQRScan", hvis ordren er verificeret
      } else error; // Ellers kast en fejl

      // Du kan fortsætte med at bruge de analyserede data efter behov
    } catch (error) {
      console.error("Fejl ved analyse af JSON:", error); // Log en fejl, hvis JSON-analysen mislykkes
      // Håndter fejlen eller giv brugeren feedback
    }
  };

  // Hvis der ikke er givet tilladelse til kameraet, så returneres en tekst, der informerer herom
  if (hasPermission === null) {
    return <Text>Anmoder om kameratilladelse</Text>;
  }
  if (hasPermission === false) {
    return <Text>Ingen adgang til kameraet</Text>;
  }

  // Hvis der er givet adgang til kameraet, så returneres BarCodeScanner-komponenten fra expo
  return (
    <View style={styles.constainer}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      {scanned && (
        <Button
          title={"Tryk for at scanne igen"}
          onPress={() => setScanned(false)}
        />
      )}
    </View>
  );
};

export default HostClientQR;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: "center",
  },
  scanner: {
    flex: 1,
  },
});

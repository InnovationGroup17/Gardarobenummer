import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { getPermisionBarCodeScanner } from "../../../utilities/getPermisionBarCodeScanner";
import { useRoute } from "@react-navigation/native";
import reserveHangar from "../../../utilities/reserveHanger";
import { ref, get } from "firebase/database";
import { realtimeDB } from "../../../database/firebaseConfig";
import { getMetroIPAddress } from "../../../utilities/getMetroIPAdress";
import { useNavigation } from "@react-navigation/native";

//DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
//DEVELOPMENT MODE

// QR-scannerkomponent, der bruger BarCodeScanner-komponenten fra expo
const HostClientQR = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const orderData = route.params;
  const jsonRoute = JSON.parse(route.params); //VIGTIGT AT VI ARBEJDER MED ORDENTLIT DATA
  console.log("orderData:", orderData);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

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
    if (data === orderData) {
      console.log("data:", data);
      console.log("orderdata:", orderData);
      setScanned(true); // Marker stregkoden som scannet
      return alert("Du har scannet den forkerte QR kode");
    }
    await reserveHangar(data, orderData);

    //Gennemfør Betaling
    const payment = async (order, user) => {
      const orderRef = ref(realtimeDB, `orders/${user}/${order}`);
      const snapshot = await get(orderRef);
      const paymentId = snapshot.val()[1].paymentId;
      await fetch(`${SERVER_URL}/payments/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: paymentId,
        }),
      });
    };

    payment(jsonRoute.orderId, jsonRoute.user); //Gennemfør Betaling
    navigation.popToTop();
    try {
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

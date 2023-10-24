import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { timestamp } from "../../../utilities/timestamp";
import { getAuth } from "@firebase/auth";
import { getPermisionBarCodeScanner } from "../../../utilites/getPermisionBarCodeScanner";
import { fetchFirestoreData } from "../../../utilites/firebase/firestore/firestoreApi";
import { useNavigation } from "@react-navigation/native";

// Qr scanner komponent, der benytter sig af BarCodeScanner komponenten fra expo
const QrScanner = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [firestoreData, setFirestoreData] = useState(null);
  const collectionName = "Bars";

  useEffect(() => {
    setHasPermission(getPermisionBarCodeScanner());

    const fetchData = async () => {
      try {
        const data = await fetchFirestoreData(collectionName);
        setFirestoreData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [collectionName]);

  // Metode til at håndtere scanninger af QR koder og lave en ticket med dataen fra QR koden
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    let user = getAuth().currentUser;
    let parsedData = JSON.parse(data);
    const id = firestoreData.find((item) => item.id === parsedData.id);

    let BarData = {
      id: id, //bar id
      uid: user.uid, // user id
      time: timestamp(),
    };

    navigation.navigate("SelectWardrope", { BarData });
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

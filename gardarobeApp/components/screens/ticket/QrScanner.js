import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { timestamp } from "../../../utilities/timestamp";
import { getAuth } from "@firebase/auth";
import { getPermisionBarCodeScanner } from "../../../utilities/getPermisionBarCodeScanner";
import { fetchFirestoreData } from "../../../utilities/firebase/firestore/firestoreApi";
import { useNavigation } from "@react-navigation/native";

// QR scanner component that uses the BarCodeScanner component from expo
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

  // Method to handle QR code scans and create a ticket with data from the QR code
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    let user = getAuth().currentUser;
    let parsedData = JSON.parse(data);
    const id = firestoreData.find((item) => item.id === parsedData.id);

    let BarData = {
      id: id, // bar id
      uid: user.uid, // user id
      time: timestamp(),
    };

    navigation.navigate("SelectWardrope", { BarData });
  };

  // If camera permission hasn't been granted yet, display a message requesting permission
  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  // If access to the camera is denied, display a message indicating this
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // If camera permission is granted, render the BarCodeScanner component from expo
  return (
    <View style={styles.container}>
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
  container: {
    flex: 1,
    justifyContent: "center",
  },
  scanner: {
    flex: 1,
  },
});

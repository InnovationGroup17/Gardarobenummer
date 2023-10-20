import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { getPermisionBarCodeScanner } from "../../../utilites/getPermisionBarCodeScanner";
import VerifyOrder from "../../../database/verifyOrder";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook


// Qr scanner komponent, der benytter sig af BarCodeScanner komponenten fra expo
const HostClientQR = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation(); // Use the hook to get the navigation object

  useEffect(() => {
    setHasPermission(getPermisionBarCodeScanner());

    const fetchData = async () => {
      try {
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Metode til at håndtere scanninger af QR koder til håndtering af order data
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      const status = await VerifyOrder(data);
      const parsedData = JSON.parse(data); // Parse the data as JSON
      const user = parsedData.user;
      const order = parsedData.orderId;
      // console.log("user", user);
      // console.log("order", order);
      //now log the return VerifyOrder(data) to the console
      
      console.log("status", status)
      if(status === true){
        navigation.navigate("HostHangerQRScan")
      }


      alert(`Bar code with user ID ${user} and ${order} has been scanned!`);

      // You can continue to use the parsed data as needed in your application
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // Handle the error or provide feedback to the user
    }
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

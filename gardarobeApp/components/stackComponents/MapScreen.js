import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Alert } from "react-native";
import * as Location from "expo-location";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Initialize Firebase with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb-as5hyWyAqOqZP1_-1ZAYjX0pXx2tBg",
  authDomain: "database-95c46.firebaseapp.com",
  projectId: "database-95c46",
  databaseURL:
    "https://database-95c46-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "database-95c46.appspot.com",
  messagingSenderId: "693275199236",
  appId: "1:693275199236:web:04332aed156a57e80bb251",
};
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

export default function MapScreen() {
  const [initialRegion, setInitialRegion] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locationOfInterest, setLocationOfInterest] = useState([]); // Store the locations of interest

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsCollection = collection(firestore, "Bars");
        const querySnapshot = await getDocs(locationsCollection);

        const locationsData = [];
        querySnapshot.forEach((doc) => {
          const location = doc.data();
          locationsData.push(location);
        });

        setLocations(locationsData);

        // Log the fetched data
        console.log("Fetched Data:", locationsData);

        // Create objects for locationOfInterest using a for loop
        const interestLocations = [];
        for (let i = 0; i < locationsData.length; i++) {
          interestLocations.push({
            title: locationsData[i].title,
            location: {
              latitude: locationsData[i].location.latitude,
              longitude: locationsData[i].location.longitude,
            },
            description: locationsData[i].description,
          });
        }

        // Set the locationOfInterest state
        setLocationOfInterest(interestLocations);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  const showLocationOfInterest = () => {
    return locationOfInterest.map((item, index) => {
      return (
        <Marker
          key={index}
          coordinate={item.location}
          title={item.title}
          description={item.description}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {initialRegion ? (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
        >
          {showLocationOfInterest()}
        </MapView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

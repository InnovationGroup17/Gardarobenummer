import React, { useState, useEffect } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { StyleSheet, View, Alert, Text, TouchableOpacity, Button } from "react-native";
import * as Location from "expo-location";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig, firestore } from "../../database/firebaseConfig";

// Initialize Firebase with your Firebase project configuration
firebaseConfig;

export default function MapScreen() {
  const [initialRegion, setInitialRegion] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locationOfInterest, setLocationOfInterest] = useState([]);

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

  const renderCallout = (item) => {
    return (
      <Callout>
        <View>
          <Text>{item.title}</Text>
          <Text>{item.description}</Text>
          <Button title="Coose location" onPress={() => handleChooseLocation(item)}/>
        </View>
      </Callout>
    );
  };

  const handleChooseLocation = (selectedLocation) => {
    // Implement your logic for handling the selected location here
    console.log("Selected Location:", selectedLocation);
    // For example, you can display an alert with the location details
    Alert.alert(
      "Location Selected",
      `You chose the location: ${selectedLocation.title}`,
      [
        {
          text: "OK",
          onPress: () => {
            // Handle OK button press if needed
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {initialRegion ? (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
        >
          {locationOfInterest.map((item, index) => (
            <Marker
              key={index}
              coordinate={item.location}
              title={item.title}
              description={item.description}
            >
              {renderCallout(item)}
            </Marker>
          ))}
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

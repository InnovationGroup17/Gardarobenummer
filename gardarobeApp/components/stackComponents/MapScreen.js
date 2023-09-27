import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text, Button } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { fetchFirestoreData } from "../../database/firestoreApi";

export default function MapScreen({ navigation }) {
  const [initialRegion, setInitialRegion] = useState(null);
  const [locationOfInterest, setLocationOfInterest] = useState([]); // Store the locations of interest
  const collectionName = "Bars";
  const [count, setCount] = useState(0);

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
        const fetchData = await fetchFirestoreData(collectionName);

        // Create objects for locationOfInterest using a for loop
        const interestLocations = [];
        for (let i = 0; i < fetchData.length; i++) {
          interestLocations.push({
            title: fetchData[i].title,
            location: {
              latitude: fetchData[i].location.latitude,
              longitude: fetchData[i].location.longitude,
            },
            description: fetchData[i].description,
            id: fetchData[i].id,
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
        >
          <Callout>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text> {count}</Text>
            <Button
              style={styles.button}
              title="Choose location"
              onPress={() => {
                console.log("Button pressed");
                console.log("Count before:", count);
                setCount(count + 1);
                console.log("Count after:", count);
              }}
            />
          </Callout>
        </Marker>
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
  button: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
});

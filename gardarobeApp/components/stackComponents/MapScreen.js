import React, { useState, useEffect } from "react";
import MapView, { Marker} from "react-native-maps";
import { StyleSheet, View, Alert } from "react-native";
import * as Location from "expo-location";

// Chateau Motel coordinates: 55.678153413526765, 12.574362797657678

let locationOfInterest = [
  {
    title: "Chateau Motel",
    location: { latitude: 55.678153413526765, longitude: 12.574362797657678 },
    description: "Du har valgt Chateau Motel",
  },
];

export default function MapScreen() {
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    (async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      // Get the device's current location
      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
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
          {/* Wrap the string within a <Text> component */}
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
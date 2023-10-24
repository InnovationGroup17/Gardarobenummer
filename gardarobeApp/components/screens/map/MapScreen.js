import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import MapView, { Callout, Marker, CalloutSubview } from "react-native-maps";
import * as Location from "expo-location";
import { fetchFirestoreData } from "../../../database/firestoreApi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { timestamp } from "../../../utilities/timestamp";

export default function MapScreen() {
  const navigation = useNavigation();
  const [initialRegion, setInitialRegion] = useState(null);
  const [locationOfInterest, setLocationOfInterest] = useState([]); // Store the locations of interest
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const [firestoreData, setFirestoreData] = useState(null);
  const collectionName = "Bars";

  useEffect(() => {
    // Set up the real-time listener for Firebase Authentication
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

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
        setFirestoreData(fetchData);

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

  const handleMarkerPress = (item) => {
    let user = getAuth().currentUser; // Get the current user
    let id = firestoreData.find((bar) => bar.id === item.id);

    //NEEDS TO BE MADE LIKE THIS TO WORK
    let BarData = {
      id: id,
      uid: user.uid,
      time: timestamp(),
    };
    navigation.navigate("SelectWardrope", { BarData });
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
              <Callout>
                <View>
                  <Text>{item.title}</Text>
                  <Text>{item.description}</Text>
                  <CalloutSubview
                    style={styles.button}
                    onPress={() => {
                      handleMarkerPress(item);
                    }}
                  >
                    <Text>Go to bar</Text>
                  </CalloutSubview>
                </View>
              </Callout>
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
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
});

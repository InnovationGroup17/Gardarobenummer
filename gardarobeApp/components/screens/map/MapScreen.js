// Importing necessary modules from React, React Native, and other libraries
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import MapView, { Callout, Marker, CalloutSubview } from "react-native-maps";
import * as Location from "expo-location";
import { fetchFirestoreData } from "../../../utilities/firebase/firestore/firestoreApi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { timestamp } from "../../../utilities/timestamp";
import Loading from "../../GlobalComponents/loading/Loading";

// Defining the MapScreen component
export default function MapScreen() {
  // State variables for managing component state
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [initialRegion, setInitialRegion] = useState(null);
  const [locationOfInterest, setLocationOfInterest] = useState([]); // Store the locations of interest
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const [firestoreData, setFirestoreData] = useState(null);
  const collectionName = "Bars";

  // Effect hook for Firebase authentication listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

  // Effect hook for requesting location permission and setting initial map region
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

  // Effect hook for fetching data from Firestore and updating component state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchData = await fetchFirestoreData(collectionName);
        setFirestoreData(fetchData);

        // Process Firestore data to create locationOfInterest objects
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
        setLocationOfInterest(interestLocations);
        setIsLoading(false); // Hide loading screen after data is loaded
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle marker press on the map
  const handleMarkerPress = (item) => {
    let user = getAuth().currentUser; // Get the current user
    let id = firestoreData.find((bar) => bar.id === item.id);

    let BarData = {
      id: id,
      uid: user.uid,
      time: timestamp(),
    };
    navigation.navigate("SelectWardrope", { BarData });
  };

  // Conditional rendering based on isLoading state
  if (isLoading) {
    return <Loading />;
  }

  // Main render method for the MapScreen component
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

// StyleSheet for the MapScreen component
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

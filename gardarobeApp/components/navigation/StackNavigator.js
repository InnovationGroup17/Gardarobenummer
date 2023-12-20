// Import necessary hooks and components from React, Firebase, and React Navigation
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { realtimeDB } from "../../database/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";

// Import the navigation and screen components
import TabNavigator from "./TabNavigator";
import QRID from "../screens/profile/QRID";
import ProfileScreen from "../screens/profile/ProfileScreen";
import MapScreen from "../screens/map/MapScreen";
import PaymentScreen from "../screens/ticket/PaymentScreen";
import Order from "../screens/ticket/Order";
import QrScanner from "../screens/ticket/QrScanner";
import SelectWardrope from "../screens/ticket/SelectWardrope";
import OrderHistory from "../screens/ticket/OrderHistory";
import HostStart from "../screens/host/HostStart";
import HostClientQR from "../screens/host/HostClientQRScan";
import HostHangerQRScan from "../screens/host/HostHangerQRScan";
import HostTabNavigator from "../hostNavigation/HostTabNavigator";
import EditProfile from "../screens/profile/EditProfile";

// Create a new stack navigator instance
const Stack = createStackNavigator();

function StackNavigator() {
  // State for tracking the current user and user data
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Initialize Firebase authentication
  const auth = getAuth();

  useEffect(() => {
    // Set up a real-time listener for Firebase Authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // If user is authenticated, fetch their data from Firebase Realtime Database
    if (user) {
      const userRef = ref(realtimeDB, `users/${user.uid}`);
      const unsubscribeDB = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUserData(userData.type);
      });

      // Return cleanup functions for unsubscribing the listeners
      return () => {
        unsubscribeAuth();
        unsubscribeDB();
      };
    }
  }, [auth, user, realtimeDB]);

  // Render stack navigator based on user data (user type)
  if (userData === "user") {
    return (
      // Navigator for regular users with various screens
      <Stack.Navigator initialRouteName="Tab">
        <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="QRID" component={QRID} />
        <Stack.Screen name="Profile Screen" component={ProfileScreen} />
        <Stack.Screen name="Map Screen" component={MapScreen} />
        <Stack.Screen name="OrderScreen" component={Order} />
        <Stack.Screen name="Payment Screen" component={PaymentScreen} />
        <Stack.Screen name="Qr Scanner" component={QrScanner} />
        <Stack.Screen name="SelectWardrope" component={SelectWardrope} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} />
        <Stack.Screen name="Edit Profile" component={EditProfile} />
      </Stack.Navigator>
    );
  } else if (userData === "host") {
    return (
      // Navigator for host users with different screens
      <Stack.Navigator initialRouteName="HostTabNavigator">
        <Stack.Screen name="HostTabNavigator" component={HostTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="HostStart" component={HostStart} options={{ headerShown: false }}/>
        <Stack.Screen name="HostClientQR" component={HostClientQR} />
        <Stack.Screen name="HostHangerQRScan" component={HostHangerQRScan} />
      </Stack.Navigator>
    );
  } else {
    // Render nothing if userData is not set
    return null;
  }
}

// Export the StackNavigator for use in other parts of the app
export default StackNavigator;

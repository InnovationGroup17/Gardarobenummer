import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { realtimeDB } from "../../database/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import TabNavigator from "./TabNavigator";
import QRID from "../screens/profile/QRID";
import ProfileScreen from "../screens/profile/ProfileScreen";
import MapScreen from "../screens/map/MapScreen";
import PaymentScreen from "../screens/ticket/PaymentScreen";
import Order from "../screens/ticket/Order";
import QrScanner from "../screens/ticket/QrScanner";
import SelectWardrope from "../screens/ticket/selectWardrope";
import OrderHistory from "../screens/ticket/OrderHistory";
import HostStart from "../screens/host/HostStart";
import HostClientQR from "../screens/host/HostClientQRScan";
import HostHangerQRScan from "../screens/host/HostHangerQRScan";
import HostTabNavigator from "../hostNavigation/HostTabNavigator";
import EditProfile from "../screens/profile/EditProfile";

//Her instantieres en StackNavigator.
const Stack = createStackNavigator();

function StackNavigator() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // To store user data from the database
  const auth = getAuth();

  useEffect(() => {
    // Set up the real-time listener for Firebase Authentication
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (user) {
      // Fetch user data from the Firebase Realtime Database
      const userRef = ref(realtimeDB, `users/${user.uid}`);
      const unsubscribeDB = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUserData(userData.type);
      });

      // Return the cleanup functions
      return () => {
        unsubscribeAuth();
        unsubscribeDB();
      };
    }
  }, [auth, user, realtimeDB]);

  if (userData === "user") {
    return (
      <Stack.Navigator initialRouteName="Tab">
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={"QRID"} component={QRID} />
        <Stack.Screen name={"Profile Screen"} component={ProfileScreen} />
        <Stack.Screen name={"Map Screen"} component={MapScreen} />
        <Stack.Screen name={"OrderScreen"} component={Order} />
        <Stack.Screen name={"Payment Screen"} component={PaymentScreen} />
        <Stack.Screen name={"Qr Scanner"} component={QrScanner} />
        <Stack.Screen name={"SelectWardrope"} component={SelectWardrope} />
        <Stack.Screen name={"OrderHistory"} component={OrderHistory} />
        <Stack.Screen name={"Edit Profile"} component={EditProfile} />
      </Stack.Navigator>
    );
  } else if (userData === "host") {
    return (
      <Stack.Navigator initialRouteName="HostTabNavigator">
        <Stack.Screen
          name="HostTabNavigator"
          component={HostTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="HostStart" component={HostStart} />
        <Stack.Screen name="HostClientQR" component={HostClientQR} />
        <Stack.Screen name="HostHangerQRScan" component={HostHangerQRScan} />
      </Stack.Navigator>
    );
  } else {
    return null;
  }
}

export default StackNavigator;

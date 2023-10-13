import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuthListener } from "./authenticate/RealTime";
import StartStackNavigator from "./navigation/StartStackNavigator";
import DrawNavigator from "./navigation/DrawNavigator";
import { realtimeDB } from "../database/firebaseConfig";

const RootStack = createStackNavigator();

export default function Compiler() {
  const user = useAuthListener();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      // Fetch user data from the Firebase Realtime Database
      const userRef = realtimeDB.ref(`users/${user.uid}`);
      const unsubscribeDB = realtimeDB.onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUserData(userData);
      });

      // Return the cleanup functions
      return () => {
        unsubscribeDB();
      };
    }
  }, [user]);

  return (
    <RootStack.Navigator>
      {user ? (
        userData.type === "user" ? (
          <RootStack.Screen
            name="app"
            component={DrawNavigator}
            options={{ headerShown: false }}
          />
        ) : userData.type === "host" ? (
          <RootStack.Screen
            name="host"
            component={StartStackNavigator}
            options={{ headerShown: false }}
          />
        ) : null
      ) : (
        <RootStack.Screen name="Ticketly" component={StartStackNavigator} />
      )}
    </RootStack.Navigator>
  );
}

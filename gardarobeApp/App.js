import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Compiled from "./components/Compiler";

const App = () => {
  return (
    <View style={styles.constainer}>
      <Compiled />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: "center",
  },
});

/*
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import SignUpForm from "./components/stackComponents/SigninForm";
import LoginForm from "./components/stackComponents/LoginForm";
import ProfileScreen from "./components/ProfileScreen";
import MapScreen from "./components/stackComponents/MapScreen";
import QrScanner from "./components/stackComponents/QrScanner";

const app = initializeApp(firebaseConfig);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Scan QR" component={QrScanner} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function HomeScreen({ navigation }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    // Set an authentication state observer and get user data
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsUserLoggedIn(true);
      } else {
        // User is signed out
        setIsUserLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (isUserLoggedIn) {
    return <MapScreen />;
  } else {
    return (
      <View style={styles.container}>
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate("Sign Up")}
        />
        <Button title="Log In" onPress={() => navigation.navigate("Log In")} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    // Set an authentication state observer and get user data
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsUserLoggedIn(true);
      } else {
        // User is signed out
        setIsUserLoggedIn(false);
      }
    });

    // Cleanup the observer on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isUserLoggedIn ? "HomeTabs" : "HomeScreen"}
      >
        {isUserLoggedIn ? (
          <>
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Sign Up" component={SignUpForm} />
            <Stack.Screen name="Log In" component={LoginForm} />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
*/


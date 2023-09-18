import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
  //function to make icons for the different tabs
  const getTabBarIcon =
    (name) =>
    ({ color, size }) =>
      <FontAwesome name={name} color={color} size={size} />;

  return (
    //add different icons for the different tabs
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: getTabBarIcon("home"),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: getTabBarIcon("map"),
        }}
      />
      <Tab.Screen
        name="Scan QR"
        component={QrScanner}
        options={{
          tabBarIcon: getTabBarIcon("qrcode"),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: getTabBarIcon("user"),
        }}
      />
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
      </View>
    );
  }
}

export default function Compiled() {
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

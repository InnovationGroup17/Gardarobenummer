import * as React from "react";
import { useState, useEffect } from "react";  // Add this line
import { StyleSheet, Text, View, Button } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import SignUpForm from "./components/stackComponents/SigninForm";
import LoginForm from "./components/stackComponents/LoginForm";
import { firebaseConfig } from "./firebaseConfig";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./components/ProfileScreen";
import MapScreen from "./components/stackComponents/MapScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";



const app = initializeApp(firebaseConfig);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
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

    // Cleanup the observer on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <View style={styles.container}>
      {!isUserLoggedIn && (
        <>
          <Button title="Sign Up" onPress={() => navigation.navigate("Sign Up")} />
          <Button title="Log In" onPress={() => navigation.navigate("Log In")} />
        </>
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeTabs">
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Sign Up" component={SignUpForm} />
        <Stack.Screen name="Log In" component={LoginForm} />
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

import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import SignUpForm from "./components/stackComponents/SigninForm";
import LoginForm from "./components/stackComponents/LoginForm";
import { firebaseConfig } from "./firebaseConfig";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "./components/ProfileScreen";
import MapScreen from "./components/stackComponents/MapScreen";

const app = initializeApp(firebaseConfig);

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Sign Up" onPress={() => navigation.navigate("Sign Up")} />
      <Button title="Log In" onPress={() => navigation.navigate("Log In")} />
      <Button title="Map" onPress={() => navigation.navigate("Map")} />
    </View>
  );
}

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Sign Up" component={SignUpForm} />
          <Stack.Screen name="Log In" component={LoginForm} />
          <Stack.Screen name="Map" component={MapScreen} />
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
  }, profileScreen: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: '5%',
    backgroundColor: '#ecf0f1',
    padding: 8,
},
});

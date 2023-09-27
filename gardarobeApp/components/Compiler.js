import { StyleSheet, View, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { useAuthListener } from "./authenticate/RealTime";
import SignUpForm from "./stackComponents/SigninForm";
import LoginForm from "./stackComponents/LoginForm";
import ProfileScreen from "./ProfileScreen";
import MapScreen from "./stackComponents/MapScreen";
import TicketNavigation from "./ticket/TicketNavigation";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const getTabBarIcon =
    (name) =>
    ({ color, size }) =>
      <FontAwesome name={name} color={color} size={size} />;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Homes"
        component={HomeScreen}
        options={{
          tabBarIcon: getTabBarIcon("home"),
          headerShown: false 
        }}
      />
      <Tab.Screen
      name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: getTabBarIcon("map"),
          headerShown: false 
        }}
      />
      <Tab.Screen
        name="Ticket"
        component={TicketNavigation}
        options={{
          tabBarIcon: getTabBarIcon("ticket"),
          headerShown: false 
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: getTabBarIcon("user"),
          headerShown: false 
        }}
      />
    </Tab.Navigator>
  );
}

function HomeScreen({ navigation }) {
  const isUserLoggedIn = useAuthListener();

  if (isUserLoggedIn) {
    return <ProfileScreen />; //angiver Startpunkt efter login.
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

export default function Compiler() {
  const isUserLoggedIn = useAuthListener();

  return (
      <Stack.Navigator
        initialRouteName={isUserLoggedIn ? "HomeTabs" : "HomeScreen"}
      >
        {isUserLoggedIn ? (
          <>
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs} //benytter HomeTabs
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

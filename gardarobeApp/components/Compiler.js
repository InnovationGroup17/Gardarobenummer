import { StyleSheet, View, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { useAuthListener } from "./authenticate/RealTime";
import SignUpForm from "./stackComponents/SigninForm";
import LoginForm from "./stackComponents/LoginForm";
import ProfileScreen from "./ProfileScreen";
import MapScreen from "./stackComponents/MapScreen";
import TicketNavigation from "./ticket/TicketNavigation";
import QrScanner from "./ticket/QrScanner";

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
        name="Ticket"
        component={TicketNavigation}
        options={{
          tabBarIcon: getTabBarIcon("ticket"),
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
  const isUserLoggedIn = useAuthListener();

  if (isUserLoggedIn) {
<<<<<<< Updated upstream
    return <QrScanner />; //startside på homeScreen
=======
    return <ProfileScreen />; //angiver Startpunkt efter login.
>>>>>>> Stashed changes
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
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isUserLoggedIn ? "HomeTabs" : "HomeScreen"}
      >
        {isUserLoggedIn ? (
          <>
            <Stack.Screen
              name="HomeTabs"
<<<<<<< Updated upstream
              component={HomeTabs} //benytter HomeTabs
=======
              component={HomeTabs}
>>>>>>> Stashed changes
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

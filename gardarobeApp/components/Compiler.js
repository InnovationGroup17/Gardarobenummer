import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useAuthListener } from "./authenticate/RealTime";
import SignUpForm from "./stackComponents/SigninForm";
import LoginForm from "./stackComponents/LoginForm";
import SelectWardrope from "./ticket/selectWardrope";
import Ticket from "./ticket/Ticket";
import HomeTabs from "./navigation/TabNavigator";
import HomeScreen from "./HomeScreen";

const Stack = createStackNavigator();

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
            options={{ headerShown: false, headerTitle: "Home" }}
          />
          <Stack.Screen
            name="SelectWardrope"
            component={SelectWardrope}
            options={{ headerTitle: "Select" }}
          />
          <Stack.Screen name="Ticket" component={Ticket} />
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

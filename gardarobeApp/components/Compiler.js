import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useAuthListener } from "./authenticate/RealTime";
import SignUpForm from "./screens/start_page/SigninForm";
import LoginForm from "./screens/start_page/LoginForm";
import SelectWardrope from "./screens/ticket/selectWardrope";
import Order from "./screens/ticket/Order";
import HomeTabs from "./navigation/TabNavigator";
import HomeScreen from "./screens/start_page/StartPage";

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
          <Stack.Screen
            name="Order"
            component={Order}
            options={{ headerTitle: "Order" }}
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

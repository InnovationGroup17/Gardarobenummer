import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuthListener } from "./authenticate/RealTime";
import StartStackNavigator from "./navigation/StartStackNavigator";
import DrawNavigator from "./navigation/DrawNavigator";

const RootStack = createStackNavigator();

export default function Compiler() {
  const isUserLoggedIn = useAuthListener();

  return (
    <RootStack.Navigator>
      {isUserLoggedIn ? (
        <RootStack.Screen
          name="app"
          component={DrawNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <RootStack.Screen name="Ticketly" component={StartStackNavigator} />
      )}
    </RootStack.Navigator>
  );
}

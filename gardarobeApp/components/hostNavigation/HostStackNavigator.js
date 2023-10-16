import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import hostStart from "../screens/host/HostStart";
import HostTabNavigator from "./HostTabNavigator";

const StartStack = createStackNavigator();

function HostStackNavigator() {
  return (
    <StartStack.Navigator
      initialRouteName="hostStart"
      screenOptions={{ headerShown: false }}
    >
      <StartStack.Screen name="hostStart" component={hostStart} />
    </StartStack.Navigator>
  );
}

export default HostStackNavigator;

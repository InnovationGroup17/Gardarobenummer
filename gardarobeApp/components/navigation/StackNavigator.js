import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import QRID from "../screens/profile/QRID";
import ProfileScreen from "../screens/profile/ProfileScreen";
import MapScreen from "../screens/map/MapScreen";
import PaymentScreen from "../screens/ticket/PaymentScreen";
import Order from "../screens/ticket/Order";
import QrScanner from "../screens/ticket/QrScanner";
import SelectWardrope from "../screens/ticket/selectWardrope";

//Her instantieres en StackNavigator.
const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Tab">
      <Stack.Screen
        name="Tab"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={"QRID"} component={QRID} />
      <Stack.Screen name={"Profile Screen"} component={ProfileScreen} />
      <Stack.Screen name={"Map Screen"} component={MapScreen} />
      <Stack.Screen name={"Order Screen"} component={Order} />
      <Stack.Screen name={"Payment Screen"} component={PaymentScreen} />
      <Stack.Screen name={"Qr Scanner"} component={QrScanner} />
      <Stack.Screen name={"SelectWardrope"} component={SelectWardrope} />
    </Stack.Navigator>
  );
}

export default StackNavigator;

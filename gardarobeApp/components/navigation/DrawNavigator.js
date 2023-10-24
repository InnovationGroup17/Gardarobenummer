import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TermsOfConditions from "../screens/drawer/TermsOfConditions";
import AboutUs from "../screens/drawer/AboutUs";
import ShareWithFriends from "../screens/drawer/ShareWithFriends";
import StackNavigator from "./StackNavigator";

const Drawer = createDrawerNavigator();

function DrawNavigator() {
  return (
    <Drawer.Navigator initialRouteName="TabNavigator">
      <Drawer.Screen
        name="Home"
        component={StackNavigator}
        options={{ headerShown: true, headerTitle: "Ticketly" }} //APP NAME
      />
      <Drawer.Screen name="Share with friends" component={ShareWithFriends} />
      <Drawer.Screen name="Terms of conditions" component={TermsOfConditions} />
      <Drawer.Screen name="About us" component={AboutUs} />
    </Drawer.Navigator>
  );
}

export default DrawNavigator;

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HostStart from "../screens/host/HostStart";
import HostClientQR from "../screens/host/HostClientQRScan";
import HostHangerQRScan from "../screens/host/HostHangerQRScan";

const Tab = createBottomTabNavigator();

function HostTabNavigator() {
  const getTabBarIcon =
    (name) =>
    ({ color, size }) =>
      <FontAwesome name={name} color={color} size={size} />;

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="HostStart"
        component={HostStart}
        options={{
          tabBarIcon: getTabBarIcon("home"),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="HostClientQR"
        component={HostClientQR}
        options={{
          tabBarIcon: getTabBarIcon("map"),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="HostHanger"
        component={HostHangerQRScan}
        options={{
          tabBarIcon: getTabBarIcon("camera"),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default HostTabNavigator;

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HomeScreen from "../screens/start_page/StartPage";
import MapScreen from "../screens/map/MapScreen";
import QrScanner from "../screens/ticket/QrScanner";
import ProfileScreen from "../screens/profile/ProfileScreen";

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
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: getTabBarIcon("map"),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={QrScanner}
        options={{
          tabBarIcon: getTabBarIcon("camera"),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: getTabBarIcon("user"),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeTabs;

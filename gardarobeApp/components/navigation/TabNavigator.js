// Import necessary modules and components
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Import screen components for each tab
import QRID from "../screens/profile/QRID";
import MapScreen from "../screens/map/MapScreen";
import QrScanner from "../screens/ticket/QrScanner";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Create a new bottom tab navigator instance
const Tab = createBottomTabNavigator();

function TabNavigator() {
  // Function to generate tabBar icons based on icon name
  const getTabBarIcon =
    (name) =>
    ({ color, size }) =>
      <FontAwesome name={name} color={color} size={size} />;

  // Render the component
  return (
    // Configure the Tab Navigator
    <Tab.Navigator initialRouteName="Home">
      {/* Define the Home tab with a custom icon and no header */}
      <Tab.Screen
        name="Home"
        component={QRID}
        options={{
          tabBarIcon: getTabBarIcon("home"),
          headerShown: false,
        }}
      />
      {/* Define the Map tab with a custom icon and no header */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: getTabBarIcon("map"),
          headerShown: false,
        }}
      />
      {/* Define the Scan tab with a custom icon and no header */}
      <Tab.Screen
        name="Scan"
        component={QrScanner}
        options={{
          tabBarIcon: getTabBarIcon("camera"),
          headerShown: false,
        }}
      />
      {/* Define the Profile tab with a custom icon and no header */}
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

// Export the TabNavigator for use in other parts of the app
export default TabNavigator;

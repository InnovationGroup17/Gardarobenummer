// Import necessary hooks and components from React and React Navigation
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Import screen components for the drawer navigator
import TermsOfConditions from "../screens/drawer/TermsOfConditions";
import AboutUs from "../screens/drawer/AboutUs";
import ShareWithFriends from "../screens/drawer/ShareWithFriends";
import StackNavigator from "./StackNavigator"; // Import the stack navigator

// Create a new drawer navigator instance
const Drawer = createDrawerNavigator();

// Define the DrawNavigator functional component
function DrawNavigator() {
  // Render the component
  return (
    // Drawer Navigator with initial route set to 'TabNavigator'
    <Drawer.Navigator initialRouteName="TabNavigator">
      {/* Drawer Screen for 'Home', using the StackNavigator component */}
      <Drawer.Screen
        name="Home"
        component={StackNavigator}
        options={{ headerShown: true, headerTitle: "Ticketly" }} // Options with header title
      />
      {/* Drawer Screen for 'Share with friends' */}
      <Drawer.Screen name="Share with friends" component={ShareWithFriends} />
      {/* Drawer Screen for 'Terms of conditions' */}
      <Drawer.Screen name="Terms of conditions" component={TermsOfConditions} />
      {/* Drawer Screen for 'About us' */}
      <Drawer.Screen name="About us" component={AboutUs} />
    </Drawer.Navigator>
  );
}

// Export the DrawNavigator for use in other parts of the app
export default DrawNavigator;

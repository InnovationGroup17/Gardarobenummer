// Import React and necessary components from React Navigation
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import screen components for the start stack
import StartPage from "../screens/start_page/StartPage";
import LoginScreen from "../screens/start_page/LoginForm";
import SignupScreen from "../screens/start_page/SignUpForm";

// Create a new stack navigator instance
const StartStack = createStackNavigator();

function StartStackNavigator() {
  // Render the component
  return (
    // Configure the Start Stack Navigator
    <StartStack.Navigator
      initialRouteName="StartPage" // Set the initial route to StartPage
      screenOptions={{ headerShown: false }} // Hide the header for all screens
    >
      {/* Define the Start Page screen */}
      <StartStack.Screen name="StartPage" component={StartPage} />
      {/* Define the Login screen */}
      <StartStack.Screen name="Login" component={LoginScreen} />
      {/* Define the Signup screen */}
      <StartStack.Screen name="Signup" component={SignupScreen} />
    </StartStack.Navigator>
  );
}

// Export the StartStackNavigator for use in other parts of the app
export default StartStackNavigator;

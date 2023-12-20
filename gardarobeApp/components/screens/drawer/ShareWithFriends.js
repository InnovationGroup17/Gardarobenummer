// Import React and necessary components from React Native
import React from "react";
import { Text, View } from "react-native";

// Import global styles
import GlobalStyles from "../../../globalstyles/Globalstyles";

// Define the ShareWithFriends functional component
export default function ShareWithFriends() {
  // Render the component
  return (
    // Use a View component with global container styles
    <View style={GlobalStyles.container}>
      {/* Display the text "ShareWithFriends" inside a Text component */}
      <Text>ShareWithFriends</Text>
    </View>
  );
}

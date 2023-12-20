// Import React and necessary components from React Native
import React from "react";
import {Text, View} from "react-native";

// Import global styles
import GlobalStyles from "../../../globalstyles/Globalstyles";

// Define the AboutUs functional component
export default function AboutUs() {
  // Render the component
  return (
    // Use a View component with global container styles
    <View style={GlobalStyles.container}>
      {/* Display the text inside a Text component */}
      <Text>Terms og condition</Text>
    </View>
  );
}

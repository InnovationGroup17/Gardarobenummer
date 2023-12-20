// Import React and necessary components from React Native
import React from "react";
import { Text, View } from "react-native";

// Import global styles
import GlobalStyles from "../../../globalstyles/Globalstyles";

// Define the TermsOfConditions functional component
export default function TermsOfConditions() {
  // Render the component
  return (
    // Use a View component with global container styles from GlobalStyles
    <View style={GlobalStyles.container}>
      {/* Display the text "Terms og condition" inside a Text component */}
      <Text>Terms og condition</Text>
    </View>
  );
}

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GoBackButtonStyles from "../../globalstyles/ButtonStyles";

function GoBackButton() {
  const navigation = useNavigation();
  return (
    <View style={GoBackButtonStyles.buttonContainer}>
      <TouchableOpacity
        style={GoBackButtonStyles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={GoBackButtonStyles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default GoBackButton;

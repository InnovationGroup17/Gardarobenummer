import * as React from "react";
import SignUpForm from "./stackComponents/SignUpForm";
import LoginForm from "./stackComponents/LoginForm";
import ProfileScreen from ".stackComponents/ProfileScreen";
import { createStackNavigator } from "@react-navigation/stack";

//Her instantieres en StackNavigator.
const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Homepage">
      <Stack.Screen name={"Signup"} component={SignUpForm} />
      <Stack.Screen name={"Login"} component={LoginForm} />
      <Stack.Screen name={"Profile Screen"} component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;

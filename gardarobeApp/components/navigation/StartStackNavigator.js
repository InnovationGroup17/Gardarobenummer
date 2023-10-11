import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartPage from "../screens/start_page/StartPage";
import LoginScreen from "../screens/start_page/LoginForm";
import SignupScreen from "../screens/start_page/SignUpForm";

const StartStack = createStackNavigator();

function StartStackNavigator() {
  return (
    <StartStack.Navigator
      initialRouteName="StartPage"
      screenOptions={{ headerShown: false,  }}
    >
      <StartStack.Screen name="StartPage" component={StartPage} />
      <StartStack.Screen name="Login" component={LoginScreen} />
      <StartStack.Screen name="Signup" component={SignupScreen} />
    </StartStack.Navigator>
  );
}

export default StartStackNavigator;

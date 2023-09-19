import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//screens
import QrScanner from "./QrScanner";
import Ticket from "./Ticket";

const Stack = createStackNavigator();

const TicketNavigation = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="QR" >
        <Stack.Screen name="QR" component={QrScanner} />
        <Stack.Screen name="Ticket" component={Ticket} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TicketNavigation;

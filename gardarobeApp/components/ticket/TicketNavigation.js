import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//screens
import QrScanner from "./QrScanner";
import Ticket from "./Ticket";
import SelectWardrope from "./selectWardrope";

const Stack = createStackNavigator();

const TicketNavigation = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="SelectWardrope">
        <Stack.Screen
          name="finalTicket"
          component={Ticket}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="SelectWardrope"
          component={SelectWardrope}
          options={{ headerTitle: "", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TicketNavigation;

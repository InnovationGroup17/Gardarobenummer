import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TermsOfConditions from "./TermsOfConditions";
import AboutUs from "./AboutUs";
import ShareWithFriends from "./ShareWithFriends";
import GlobalStyles from "../../globalstyles/Globalstyles";
import Compiler from "../Compiler";

const Drawer = createDrawerNavigator();

export default function DrawNavigator() {
  return (
      <NavigationContainer>
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={Compiler} />
            <Drawer.Screen name="Share with friends" component={ShareWithFriends} />
            <Drawer.Screen name="Terms of conditions" component={TermsOfConditions} />
            <Drawer.Screen name="About us" component={AboutUs} />  
        </Drawer.Navigator>
      </NavigationContainer>
  );
}

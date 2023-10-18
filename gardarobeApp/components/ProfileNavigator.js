import React from "react";
import ProfileScreen from "./ProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HistoryScreen from "./HistoryScreen";
import PaymentScreen from "./PaymentScreen";
import GroupScreen from "./GroupScreen";
import FriendsScreen from "./FriendsScreen";

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    //Omgivelse af navigationsstrukturen
    //Stack.Navigator, som indeholder en liste af stackskærme og deres konfigurationer
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile" >
        <Stack.Screen name ="Profile Screen" component={ProfileScreen}/>
        <Stack.Screen name="History Screen" component={HistoryScreen} />
        <Stack.Screen nname="Payment Screen" component={PaymentScreen}/>
        <Stack.Screen name="GroupScreen" component={GroupScreen}/>
        <Stack.Screen name="FriendsScreen" component={FriendsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProfileNavigator;

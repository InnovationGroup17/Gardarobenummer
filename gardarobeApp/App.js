import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Compiled from "./components/Compiler";
import DrawerNavigator from "./components/DrawNavigator/drawNavigator";
import { NavigationContainer } from "@react-navigation/native";


export default function App() {
  return (
   <DrawerNavigator/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

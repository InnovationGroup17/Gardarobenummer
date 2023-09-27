import {StyleSheet } from "react-native";
import React from "react";
import DrawerNavigator from "./components/DrawNavigator/drawNavigator";


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

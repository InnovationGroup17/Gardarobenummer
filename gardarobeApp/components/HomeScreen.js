import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useAuthListener } from "./authenticate/RealTime";
import QRID from "./profile/QRID";

const HomeScreen = ({ navigation }) => {
  const isUserLoggedIn = useAuthListener();

  if (isUserLoggedIn) {
    return <QRID />; //angiver Startpunkt efter login.
  } else {
    return (
      <View style={styles.container}>
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate("Sign Up")}
        />
        <Button title="Log In" onPress={() => navigation.navigate("Log In")} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;

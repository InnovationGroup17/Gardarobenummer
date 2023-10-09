import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import DrawerNavigator from "./components/navigation/DrawNavigator";
import { initStripe } from "@stripe/stripe-react-native";

export default function App() {
  useEffect(() => {
    initStripe({
      publishableKey:
        "pk_test_51NzHQxAu5ko6Dm7GK9HSzRghvBoupGKUR6lHq6HYKGsXwvivhQI2tjHgQdJmf9tOmfmqU8eUx18KPnTJzfHwJYEw00IesVKr6x",
    });
  }, []);
  return <DrawerNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

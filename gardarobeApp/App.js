import { StyleSheet } from "react-native";
import DrawerNavigator from "./components/navigation/DrawNavigator";

export default function App() {
  return <DrawerNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

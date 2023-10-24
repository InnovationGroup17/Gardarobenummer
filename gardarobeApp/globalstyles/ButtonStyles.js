import { StyleSheet } from "react-native";
import { globalColors } from "./globalColors";

const GoBackButtonStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: `${globalColors.dark}`, // Set your desired background color here
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5, // Optional: add some border radius for rounded corners
  },
  buttonText: {
    color: "#fff", // Set your desired button text color here
    fontSize: 16,
  },
});

export default GoBackButtonStyles;

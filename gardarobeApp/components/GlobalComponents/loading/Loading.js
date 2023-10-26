import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import SpinningImage from "./SpinningImage"; // Replace with the actual path to your SpinningImage component

const Loading = () => {
  const [dotIndex, setDotIndex] = useState(1);

  const renderDots = () => {
    const sequences = [
      [".", " ", " "],
      [".", ".", " "],
      [".", ".", "."],
      [" ", ".", "."],
      [" ", " ", "."],
    ];
    return sequences[dotIndex].join("");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prevIndex) => (prevIndex + 1) % 5); // There are 5 sequences
    }, 500); // Change the dot position every 500 milliseconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <SpinningImage />
      <Text style={styles.text}>Loading{renderDots()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF", // You can set a background color if you want
  },
  text: {
    fontSize: 18,
    marginTop: 20, // Add some margin to separate the text from the spinning image
  },
});

export default Loading;

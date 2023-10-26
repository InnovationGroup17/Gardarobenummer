import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import loadingImage from "../../../assets/images/loading.jpeg";

const SpinningImage = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1, //Times to spin around
        duration: 2500, // Adjust the speed
        easing: Easing.linear, // Easing function to create smooth animation
        useNativeDriver: true, //smooth animation to next frame
      })
    ).start(); // Starts the animation
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1], // Input range is from 0 (0 degrees) to 1 (360 degrees)
    outputRange: ["0deg", "360deg"], // Output range is from 0 degrees (0 radians) to 360 degrees (2π radians)
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[styles.imageStyle, { transform: [{ rotate: spin }] }]}
        source={loadingImage} //loading image
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 250,
    height: 250,
    backgroundColor: "transparent",
  },
});

export default SpinningImage;

import React from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import QRCodeBackground from "../../assets/gifs/ByRk.gif"; // Import your background image

const QRCodeWithBackground = ({ value, size }) => {
  return (
    <QRCode
      value={value} // The data you want to encode in the QR code
      size={size || 200} // Set the size of the QR code (default is 200)
      color="purple" // Color of the QR code
      backgroundColor="transparent" // Make the QR code background transparent
    />
  );
};

const styles = StyleSheet.create({
  qrCodeBackground: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QRCodeWithBackground;

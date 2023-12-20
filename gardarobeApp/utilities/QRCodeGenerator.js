import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

// A custom QRCode component that allows setting the background to transparent and changing the color
const QRCodeWithBackground = ({ value, size }) => {
  // State variable to force re-render of the QR code
  const [qrCodeKey, setQRCodeKey] = useState("");

  useEffect(() => {
    // Generate a random key to force re-render of QR code when the component mounts
    setQRCodeKey(Math.random().toString(36).substring(7));
  }, []);

  return (
    <QRCode
      value={value} // The data you want to encode in the QR code
      size={size || 200} // Set the size of the QR code (default is 200)
      key={qrCodeKey} // Force re-render of QR code when the key changes
      backgroundColor="transparent" // Make the QR code background transparent
      color="purple" // Color of the QR code
    />
  );
};

const styles = StyleSheet.create({
  qrCodeStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QRCodeWithBackground;

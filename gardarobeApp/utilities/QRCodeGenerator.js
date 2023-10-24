import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRCodeWithBackground = ({ value, size }) => {
  const [qrCodeKey, setQRCodeKey] = useState(""); // Key to force re-render of QR code

  useEffect(() => {
    // Generate a random key to force re-render of QR code
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

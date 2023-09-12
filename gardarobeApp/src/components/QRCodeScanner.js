import React, { Component } from "react";
import { View } from "react-native";
import { CameraKitCameraScreen } from "react-native-camera-kit";

class QRCodeScanner extends Component {
  onQRCodeScan(qrCodeResult) {
    // Handle the scanned QR code result here
    console.log("Scanned QR Code:", qrCodeResult);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CameraKitCameraScreen
          showFrame
          scanBarcode
          laserColor={"red"}
          frameColor={"yellow"}
          colorForScannerFrame={"blue"}
          onReadCode={(event) =>
            this.onQRCodeScan(event.nativeEvent.codeStringValue)
          }
        />
      </View>
    );
  }
}

export default QRCodeScanner;

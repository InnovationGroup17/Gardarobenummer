import { BarCodeScanner } from "expo-barcode-scanner";

export const getPermisionBarCodeScanner = async () => {
  try {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting barcode scanner permission:", error);
    return false;
  }
};

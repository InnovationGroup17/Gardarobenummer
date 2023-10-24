import { NativeModules } from "react-native";

export const getMetroIPAddress = () => {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  const scriptHostname = scriptURL.split("://")[1].split(":")[0];
  return scriptHostname;
};

import { Platform, PlatformColor } from "react-native";

export const colors = {
  light: {
    primary: Platform.select({
      ios: PlatformColor("link"), // "#007aff"
      android: "#1c1c1c",
    }),
    disabled: Platform.select({
      ios: PlatformColor("systemGray4"), // "#d1d4d9"
      android: "#d1d4d9",
    }),
    background: Platform.select({
      ios: "#F8F8F8",
      android: "#FCFCFC",
    }),
  },
  dark: {
    primary: Platform.select({
      ios: PlatformColor("label"), // "#fafafa"
      android: "#fafafa",
    }),
    disabled: Platform.select({
      ios: PlatformColor("systemGray"), // "#929292"
      android: "#929292",
    }),
    background: Platform.select({
      ios: "#555756",
      android: "#333333",
    }),
  },
};

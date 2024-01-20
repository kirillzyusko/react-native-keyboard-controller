import { Platform, PlatformColor } from "react-native";

type Color = ReturnType<typeof PlatformColor> | string;

export const colors = {
  light: {
    primary: Platform.select<Color>({
      ios: "rgba(0, 122, 255, 1.0)", // PlatformColor("link"), // "#007aff"
      android: "#2c2c2c",
    }),
    disabled: Platform.select<Color>({
      ios: "rgba(209, 212, 217, 1.0)", // PlatformColor("systemGray4"), // "#d1d4d9"
      android: "#B0BEC5",
    }),
    background: Platform.select({
      ios: "#F8F8F8",
      android: "#ECEFF1",
    }),
  },
  dark: {
    primary: Platform.select<Color>({
      ios: PlatformColor("label"), // "#fafafa"
      android: "#fafafa",
    }),
    disabled: Platform.select<Color>({
      ios: PlatformColor("systemGray"), // "#929292"
      android: "#707070",
    }),
    background: Platform.select({
      ios: "#555756",
      android: "#2C2C2E",
    }),
  },
};

import { Platform, PlatformColor } from "react-native";

import type { ColorValue } from "react-native";

type Theme = {
  /** Color for arrow when it's enabled */
  primary: ColorValue;
  /** Color for arrow when it's disabled */
  disabled: ColorValue;
  /** Keyboard toolbar background color */
  background: ColorValue;
  /** Color for ripple effect (on button touch) on Android */
  ripple: ColorValue;
};
export type KeyboardToolbarTheme = {
  light: Theme;
  dark: Theme;
};

export const colors: KeyboardToolbarTheme = {
  light: {
    primary: Platform.select<ColorValue>({
      ios: PlatformColor("link"), // "#007aff"
      default: "#2c2c2c",
    }),
    disabled: Platform.select<ColorValue>({
      ios: PlatformColor("systemGray4"), // "#d1d4d9"
      default: "#B0BEC5",
    }),
    background: Platform.select({
      ios: "#F8F8F8",
      default: "#f3f3f4",
    }),
    ripple: "#bcbcbcbc",
  },
  dark: {
    primary: Platform.select<ColorValue>({
      ios: PlatformColor("label"), // "#fafafa"
      default: "#fafafa",
    }),
    disabled: Platform.select<ColorValue>({
      ios: PlatformColor("systemGray"), // "#929292"
      default: "#707070",
    }),
    background: Platform.select({
      ios: "#555756",
      default: "#2C2C2E",
    }),
    ripple: "#F8F8F888",
  },
};

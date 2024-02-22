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

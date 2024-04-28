import type { ColorValue } from "react-native";

type Theme = {
  /** Color for arrow when it's enabled */
  primary: ColorValue;
  /** Color for arrow when it's disabled */
  disabled: ColorValue;
  /** Keyboard toolbar background color */
  background: string;
  /** Color for ripple effect (on button touch) on Android */
  ripple: ColorValue;
};
export type KeyboardToolbarTheme = {
  light: Theme;
  dark: Theme;
};
type HexSymbol =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f";
export type HEX = `${HexSymbol}${HexSymbol}`;

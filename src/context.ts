import { createContext, useContext } from "react";
import { Animated } from "react-native";

import type React from "react";

export type AnimatedContext = {
  /**
   * A value between `0` and `1` indicating keyboard position, where `0` means keyboard is closed and `1` means keyboard is fully visible.
   * Represented as `Animated.Value`.
   */
  progress: Animated.Value;
  /** Negative keyboard height. Represented as an `Animated` node. */
  height: Animated.AnimatedNode;
};
export type KeyboardAnimationContext = {
  /** Whether KeyboardController library is active or not. */
  enabled: boolean;
  /** Object that stores animated values that reflect the keyboard's current position and movement. */
  animated: AnimatedContext;
  /** Method to enable/disable KeyboardController library. */
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};
const NOOP = () => {};
const defaultContext: KeyboardAnimationContext = {
  enabled: true,
  animated: {
    progress: new Animated.Value(0),
    height: Animated.multiply(new Animated.Value(0), -1),
  },
  setEnabled: NOOP,
};

export const KeyboardContext = createContext(defaultContext);

/**
 * A hook that returns a reference to {@link KeyboardAnimationContext} object.
 *
 * @returns Object {@link KeyboardAnimationContext|containing} keyboard-controller context.
 * @example
 * ```ts
 *   const context = useKeyboardContext();
 * ```
 */
export const useKeyboardContext = () => {
  const context = useContext(KeyboardContext);

  if (__DEV__ && context === defaultContext) {
    console.warn(
      "Couldn't find real values for `KeyboardContext`. Please make sure you're inside of `KeyboardProvider` - otherwise functionality of `react-native-keyboard-controller` will not work.",
    );
  }

  return context;
};
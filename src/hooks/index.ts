import { useEffect } from "react";

import { AndroidSoftInputModes } from "../constants";
import { useKeyboardContext } from "../context";
import { KeyboardController } from "../module";

import type { AnimatedContext } from "../context";

/**
 * Hook that sets the Android soft input mode to adjust resize on mount and
 * restores default mode on unmount. This ensures the keyboard behavior is consistent
 * on all Android versions.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-controller#setinputmode-|Documentation} page for more details.
 */
export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
};

/**
 * Hook that provides animated (`height`/`progress`) values for tracking keyboard movement.
 * Automatically sets the resize mode for Android.
 *
 * @returns Object {@link AnimatedContext|containing} animated values for keyboard movement.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-animation|Documentation} page for more details.
 */
export const useKeyboardAnimation = (): AnimatedContext => {
  useResizeMode();
  const context = useKeyboardContext();

  return context.animated;
};

/**
 * Hook for controlling keyboard controller module.
 * Allows to disable/enable it and check the actual state.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/hooks/module/use-keyboard-controller|Documentation} page for more details.
 */
export function useKeyboardController() {
  const context = useKeyboardContext();

  return { setEnabled: context.setEnabled, enabled: context.enabled };
}

export * from "./useWindowDimensions";
export * from "./useKeyboardState";
import { useEffect, useLayoutEffect } from "react";

import { AndroidSoftInputModes } from "../constants";
import { useKeyboardContext } from "../context";
import { KeyboardController } from "../module";

import type { AnimatedContext, ReanimatedContext } from "../context";
import type { FocusedInputHandler, KeyboardHandler } from "../types";
import type { DependencyList } from "react";

/**
 * Hook that sets the Android soft input mode to adjust resize.
 * This ensures the keyboard properly resizes the screen content.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useResizeMode();
 *   return <View />;
 * }
 * ```
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
 * Hook that provides animated values for keyboard movement.
 * Automatically sets the resize mode for Android.
 *
 * @returns {AnimatedContext} Object containing animated values for keyboard movement
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { height, progress } = useKeyboardAnimation();
 *   return <Animated.View style={{ transform: [{ translateY: height }] }} />;
 * }
 * ```
 */
export const useKeyboardAnimation = (): AnimatedContext => {
  useResizeMode();
  const context = useKeyboardContext();

  return context.animated;
};

/**
 * Hook that provides reanimated values for keyboard movement.
 * Automatically sets the resize mode for Android.
 *
 * @returns {ReanimatedContext} Object containing reanimated values for keyboard movement
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { height, progress } = useReanimatedKeyboardAnimation();
 *   return <Reanimated.View style={{ transform: [{ translateY: height }] }} />;
 * }
 * ```
 */
export const useReanimatedKeyboardAnimation = (): ReanimatedContext => {
  useResizeMode();
  const context = useKeyboardContext();

  return context.reanimated;
};

/**
 * Generic hook for handling keyboard events.
 *
 * @param {KeyboardHandler} handler - Object containing keyboard event handlers
 * @param {DependencyList} [deps] - Dependencies array for the effect
 * @example
 * ```tsx
 * function MyComponent() {
 *   useGenericKeyboardHandler({
 *     onStart: (e) => console.log('Keyboard started moving'),
 *     onMove: (e) => console.log('Keyboard is moving'),
 *     onEnd: (e) => console.log('Keyboard finished moving')
 *   });
 *   return <View />;
 * }
 * ```
 */
export function useGenericKeyboardHandler(
  handler: KeyboardHandler,
  deps?: DependencyList,
) {
  const context = useKeyboardContext();

  useLayoutEffect(() => {
    const cleanup = context.setKeyboardHandlers(handler);

    return () => cleanup();
  }, deps);
}

/**
 * Hook for handling keyboard events with automatic resize mode.
 *
 * @param {KeyboardHandler} handler - Object containing keyboard event handlers
 * @param {DependencyList} [deps] - Dependencies array for the effect
 * @example
 * ```tsx
 * function MyComponent() {
 *   useKeyboardHandler({
 *     onStart: (e) => console.log('Keyboard started moving'),
 *     onMove: (e) => console.log('Keyboard is moving'),
 *     onEnd: (e) => console.log('Keyboard finished moving')
 *   });
 *   return <View />;
 * }
 * ```
 */
export function useKeyboardHandler(
  handler: KeyboardHandler,
  deps?: DependencyList,
) {
  useResizeMode();
  useGenericKeyboardHandler(handler, deps);
}

/**
 * Hook for controlling keyboard behavior.
 *
 * @returns {Object} Object containing keyboard control functions and state
 * @property {function} setEnabled - Function to enable/disable keyboard handling
 * @property {boolean} enabled - Current enabled state
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { setEnabled, enabled } = useKeyboardController();
 *   return (
 *     <Button
 *       title={enabled ? 'Disable' : 'Enable'}
 *       onPress={() => setEnabled(!enabled)}
 *     />
 *   );
 * }
 * ```
 */
export function useKeyboardController() {
  const context = useKeyboardContext();

  return { setEnabled: context.setEnabled, enabled: context.enabled };
}

/**
 * Hook that provides reanimated values for the currently focused input.
 *
 * @returns {Object} Object containing reanimated values for focused input
 * @property {Reanimated.SharedValue} input - Shared value containing focused input layout
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { input } = useReanimatedFocusedInput();
 *   return <Reanimated.View style={{ height: input.value?.layout.height }} />;
 * }
 * ```
 */
export function useReanimatedFocusedInput() {
  const context = useKeyboardContext();

  return { input: context.layout };
}

/**
 * Hook for handling focused input events.
 *
 * @param {FocusedInputHandler} handler - Object containing focused input event handlers
 * @param {DependencyList} [deps] - Dependencies array for the effect
 * @example
 * ```tsx
 * function MyComponent() {
 *   useFocusedInputHandler({
 *     onChangeText: (e) => console.log('Text changed:', e.text),
 *     onSelectionChange: (e) => console.log('Selection changed:', e.selection)
 *   });
 *   return <View />;
 * }
 * ```
 */
export function useFocusedInputHandler(
  handler: FocusedInputHandler,
  deps?: DependencyList,
) {
  const context = useKeyboardContext();

  useLayoutEffect(() => {
    const cleanup = context.setInputHandlers(handler);

    return () => cleanup();
  }, deps);
}

export * from "./useWindowDimensions";
export * from "./useKeyboardState";

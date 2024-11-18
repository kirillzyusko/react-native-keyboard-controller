import { useEffect, useLayoutEffect } from "react";

import { AndroidSoftInputModes } from "../constants";
import { useKeyboardContext } from "../context";
import { KeyboardController } from "../module";

import type { AnimatedContext, ReanimatedContext } from "../context";
import type { FocusedInputHandler, KeyboardHandler } from "../types";
import type { DependencyList } from "react";

export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
};

export const useKeyboardAnimation = (): AnimatedContext => {
  useResizeMode();
  const context = useKeyboardContext();

  return context.animated;
};

export const useReanimatedKeyboardAnimation = (): ReanimatedContext => {
  useResizeMode();
  const context = useKeyboardContext();

  return context.reanimated;
};

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

export function useKeyboardHandler(
  handler: KeyboardHandler,
  deps?: DependencyList,
) {
  useResizeMode();
  useGenericKeyboardHandler(handler, deps);
}

export function useKeyboardController() {
  const context = useKeyboardContext();

  return { setEnabled: context.setEnabled, enabled: context.enabled };
}

export function useReanimatedFocusedInput() {
  const context = useKeyboardContext();

  return { input: context.layout };
}

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

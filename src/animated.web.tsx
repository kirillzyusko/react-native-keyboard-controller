/// <reference lib="dom" />

import "./web/event-emitter";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, Easing } from "react-native";
import {
  Easing as ReanimatedEasing,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { KeyboardContext } from "./context";
import { useAnimatedValue, useSharedHandlers } from "./internal";
import { DURATION } from "./web/constants";
import FocusedInputHolder from "./web/FocusedInputHolder";

import type { KeyboardAnimationContext } from "./context";
import type {
  FocusedInputLayoutChangedEvent,
  KeyboardProviderProps,
} from "./types";

const BEZIER = [
  0.19919472913616398, 0.010644531250000006, 0.27920937042459737, 0.91025390625,
] as const;
const ANIMATED_EASING = Easing.bezier(...BEZIER);
const REANIMATED_EASING = ReanimatedEasing.bezier(...BEZIER);

// TODO: (x) animated values (Animated + Reanimated)
// TODO: (x) event emitter
// TODO: (x) set enabled
// TODO: (-) animated keyboard handler
// TODO: (?) interactive keyboard dismissal
// TODO: focused input tracking
// TODO: KeyboardController module
// TODO: VIEWS implementation
// TODO: view commands

/**
 * A component that wrap your app. Under the hood it works with {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-controller-view|KeyboardControllerView} to receive events during keyboard movements,
 * maps these events to `Animated`/`Reanimated` values and store them in context.
 *
 * @param props - Provider props, such as `statusBarTranslucent`, `navigationBarTranslucent`, etc.
 * @returns A component that should be mounted in root of your App layout.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-provider|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardProvider>
 *   <NavigationContainer />
 * </KeyboardProvider>
 * ```
 */
export const KeyboardProvider = (props: KeyboardProviderProps) => {
  const { children, enabled: initiallyEnabled = true } = props;
  // state
  const [enabled, setEnabled] = useState(initiallyEnabled);
  // animated values
  const progress = useAnimatedValue(0);
  const height = useAnimatedValue(0);
  // shared values
  const progressSV = useSharedValue(0);
  const heightSV = useSharedValue(0);
  const layout = useSharedValue<FocusedInputLayoutChangedEvent | null>(null);
  const [setKeyboardHandlers, sendKeyboardEvent] = useSharedHandlers();
  const [setInputHandlers, sendInputEvent] = useSharedHandlers();
  const update = useCallback(async () => {}, []);
  // memo
  const context = useMemo<KeyboardAnimationContext>(
    () => ({
      enabled,
      animated: { progress: progress, height: Animated.multiply(height, -1) },
      reanimated: { progress: progressSV, height: heightSV },
      layout,
      update,
      setKeyboardHandlers,
      setInputHandlers,
      setEnabled,
    }),
    [enabled],
  );

  useEffect(() => {
    if ("virtualKeyboard" in navigator) {
      navigator.virtualKeyboard.overlaysContent = enabled;
    }
  }, [enabled]);
  useEffect(() => {
    if (!("virtualKeyboard" in navigator)) {
      return;
    }
    let processedKeyboardHeight = -1;

    navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
      const { height: keyboardHeight } = event.target.boundingRect;

      if (processedKeyboardHeight === keyboardHeight) {
        return;
      }

      processedKeyboardHeight = keyboardHeight;

      // eslint-disable-next-line react-compiler/react-compiler
      heightSV.value = withTiming(-keyboardHeight, {
        duration: DURATION,
        easing: REANIMATED_EASING,
      });
      progressSV.value = withTiming(
        keyboardHeight > 0 ? 1 : 0,
        {
          duration: DURATION,
          easing: REANIMATED_EASING,
        },
        (finished) => {
          if (finished) {
            requestAnimationFrame(() => {
              sendKeyboardEvent("onKeyboardMoveEnd", {
                progress: progressSV.value,
                height: -heightSV.value,
                duration: DURATION,
                target: FocusedInputHolder.get(),
              });
            });
          }
        },
      );

      console.log("geometry changed", event.target.boundingRect);

      sendKeyboardEvent("onKeyboardMoveStart", {
        progress: keyboardHeight > 0 ? 1 : 0,
        height: keyboardHeight,
        duration: DURATION,
        target: FocusedInputHolder.get(),
      });

      // TODO: why without "-" sign here?
      Animated.timing(height, {
        toValue: keyboardHeight,
        duration: DURATION,
        useNativeDriver: false,
        easing: ANIMATED_EASING,
      }).start();
      Animated.timing(progress, {
        toValue: keyboardHeight > 0 ? 1 : 0,
        duration: DURATION,
        useNativeDriver: false,
        easing: ANIMATED_EASING,
      }).start();
    });
  }, []);

  useAnimatedReaction(
    () => progressSV.value,
    (p) => {
      sendKeyboardEvent("onKeyboardMove", {
        progress: p,
        height: -heightSV.value,
        duration: DURATION,
        target: FocusedInputHolder.get(),
      });
    },
    [],
  );

  return (
    <KeyboardContext.Provider value={context}>
      {children}
    </KeyboardContext.Provider>
  );
};

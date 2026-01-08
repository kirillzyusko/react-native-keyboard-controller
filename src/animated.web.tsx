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
// TODO: (-) focused input tracking (selection)
// TODO: (?) interactive keyboard dismissal
// TODO: focused input tracking (layout)
// TODO: focused input tracking (text)
// TODO: KeyboardController module
// TODO: VIEWS implementation
// TODO: view commands
// TODO: create `KeyboardControllerView` on web?

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
  useEffect(() => {
    const getCaretCoordinates = (
      element: HTMLInputElement | HTMLTextAreaElement,
      position: number,
    ) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      // Create a hidden div to measure text dimensions
      const div = document.createElement("div");

      // Copy element styles to the div
      div.style.font = style.font;
      div.style.fontSize = style.fontSize;
      div.style.fontFamily = style.fontFamily;
      div.style.fontWeight = style.fontWeight;
      div.style.letterSpacing = style.letterSpacing;
      div.style.textTransform = style.textTransform;
      div.style.direction = style.direction;
      div.style.position = "absolute";
      div.style.left = "-9999px";
      div.style.top = "-9999px";
      div.style.whiteSpace = "nowrap"; // For input elements (single line)

      // For textarea, we need to handle wrapping
      if (element.tagName === "TEXTAREA") {
        div.style.lineHeight = style.lineHeight;
        div.style.padding = style.padding;
        div.style.border = style.border;
        div.style.width = `${(element as HTMLTextAreaElement).clientWidth}px`;
        div.style.whiteSpace = "pre-wrap";
        div.style.wordWrap = "break-word";
        div.style.overflowWrap = "break-word";
      } else {
        // For input, we need to copy padding and border for accurate measurement
        div.style.paddingLeft = style.paddingLeft;
        div.style.paddingRight = style.paddingRight;
        div.style.borderLeftWidth = style.borderLeftWidth;
        div.style.borderRightWidth = style.borderRightWidth;
      }

      // Set the div's content to match element up to cursor position
      const content = element.value.substring(0, position);

      div.textContent = content;

      // Add a span to mark the end for measurement
      const span = document.createElement("span");

      span.textContent = element.value.substring(position) || ".";
      div.appendChild(span);

      document.body.appendChild(div);

      // Get the span's position relative to the div
      const spanRect = span.getBoundingClientRect();
      const divRect = div.getBoundingClientRect();

      // Calculate position relative to viewport
      let x, y;

      if (element.tagName === "INPUT") {
        // For input, span is at the end of the single line
        x = spanRect.left;
        y = rect.top;
      } else {
        // For textarea, calculate relative position
        x = rect.left + (spanRect.left - divRect.left);
        y = rect.top + (spanRect.top - divRect.top);
      }

      document.body.removeChild(div);

      // Adjust for element scroll
      const scrollX = element.scrollLeft || 0;
      const scrollY = element.scrollTop || 0;

      return {
        x: x - scrollX,
        y: y - scrollY,
      };
    };

    const emitSelectionEvent = (
      element: HTMLInputElement | HTMLTextAreaElement,
    ) => {
      const startPos = element.selectionStart ?? 0;
      const endPos = element.selectionEnd ?? 0;
      const startCoords = getCaretCoordinates(element, startPos);
      const endCoords = getCaretCoordinates(element, endPos);

      const event = {
        target: element,
        selection: {
          start: {
            x: Math.round(startCoords.x),
            y: Math.round(startCoords.y),
            position: startPos,
          },
          end: {
            x: Math.round(endCoords.x),
            y: Math.round(endCoords.y),
            position: endPos,
          },
        },
      };

      sendInputEvent("onFocusedInputSelectionChanged", event);
    };

    const handleFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        emitSelectionEvent(el as HTMLInputElement | HTMLTextAreaElement);
      }
    };

    const handleSelectionChange = () => {
      const active = document.activeElement as HTMLElement;

      if (
        active &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
      ) {
        emitSelectionEvent(active as HTMLInputElement | HTMLTextAreaElement);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [sendInputEvent]);

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

import React, { useEffect, useMemo, useState } from "react";
import { Animated, Platform, StyleSheet } from "react-native";
import Reanimated, { useSharedValue } from "react-native-reanimated";

import { KeyboardControllerView } from "./bindings";
import { KeyboardContext } from "./context";
import { useAnimatedValue, useSharedHandlers } from "./internal";
import { applyMonkeyPatch, revertMonkeyPatch } from "./monkey-patch";
import {
  useAnimatedKeyboardHandler,
  useFocusedInputLayoutHandler,
  useFocusedInputTextHandler,
} from "./reanimated";

import type { KeyboardAnimationContext } from "./context";
import type {
  FocusedInputHandler,
  FocusedInputLayoutChangedEvent,
  KeyboardControllerProps,
  KeyboardHandler,
  NativeEvent,
} from "./types";
import type { ViewStyle } from "react-native";

const KeyboardControllerViewAnimated = Reanimated.createAnimatedComponent(
  Animated.createAnimatedComponent(
    KeyboardControllerView,
  ) as React.FC<KeyboardControllerProps>,
);

type Styles = {
  container: ViewStyle;
  hidden: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  hidden: {
    display: "none",
    position: "absolute",
  },
});

type KeyboardProviderProps = {
  children: React.ReactNode;
  /**
   * Set the value to `true`, if you use translucent status bar on Android.
   * If you already control status bar translucency via `react-native-screens`
   * or `StatusBar` component from `react-native`, you can ignore it.
   * Defaults to `false`.
   *
   * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/14
   * @platform android
   */
  statusBarTranslucent?: boolean;
  /**
   * Set the value to `true`, if you use translucent navigation bar on Android.
   * Defaults to `false`.
   *
   * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/119
   * @platform android
   */
  navigationBarTranslucent?: boolean;
  /**
   * A boolean prop indicating whether the module is enabled. It indicate only initial state,
   * i. e. if you try to change this prop after component mount it will not have any effect.
   * To change the property in runtime use `useKeyboardController` hook and `setEnabled` method.
   * Defaults to `true`.
   */
  enabled?: boolean;
};

export const KeyboardProvider = ({
  children,
  statusBarTranslucent,
  navigationBarTranslucent,
  enabled: initiallyEnabled = true,
}: KeyboardProviderProps) => {
  // state
  const [enabled, setEnabled] = useState(initiallyEnabled);
  // animated values
  const progress = useAnimatedValue(0);
  const height = useAnimatedValue(0);
  // shared values
  const progressSV = useSharedValue(0);
  const heightSV = useSharedValue(0);
  const layout = useSharedValue<FocusedInputLayoutChangedEvent | null>(null);
  const [setKeyboardHandlers, broadcastKeyboardEvents] =
    useSharedHandlers<KeyboardHandler>();
  const [setInputHandlers, broadcastInputEvents] =
    useSharedHandlers<FocusedInputHandler>();
  // memo
  const context = useMemo<KeyboardAnimationContext>(
    () => ({
      enabled,
      animated: { progress: progress, height: Animated.multiply(height, -1) },
      reanimated: { progress: progressSV, height: heightSV },
      layout,
      setKeyboardHandlers,
      setInputHandlers,
      setEnabled,
    }),
    [enabled],
  );
  const style = useMemo(
    () => [
      styles.hidden,
      { transform: [{ translateX: height }, { translateY: progress }] },
    ],
    [],
  );
  const onKeyboardMove = useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              progress,
              height,
            },
          },
        ],
        { useNativeDriver: true },
      ),
    [],
  );
  // handlers
  const updateSharedValues = (event: NativeEvent, platforms: string[]) => {
    "worklet";

    if (platforms.includes(Platform.OS)) {
      progressSV.value = event.progress;
      heightSV.value = -event.height;
    }
  };
  const keyboardHandler = useAnimatedKeyboardHandler(
    {
      onKeyboardMoveStart: (event: NativeEvent) => {
        "worklet";

        broadcastKeyboardEvents("onStart", event);
        updateSharedValues(event, ["ios"]);
      },
      onKeyboardMove: (event: NativeEvent) => {
        "worklet";

        broadcastKeyboardEvents("onMove", event);
        updateSharedValues(event, ["android"]);
      },
      onKeyboardMoveEnd: (event: NativeEvent) => {
        "worklet";

        broadcastKeyboardEvents("onEnd", event);
      },
      onKeyboardMoveInteractive: (event: NativeEvent) => {
        "worklet";

        updateSharedValues(event, ["android", "ios"]);
        broadcastKeyboardEvents("onInteractive", event);
      },
    },
    [],
  );
  const inputLayoutHandler = useFocusedInputLayoutHandler(
    {
      onFocusedInputLayoutChanged: (e) => {
        "worklet";

        if (e.target !== -1) {
          layout.value = e;
        } else {
          layout.value = null;
        }
      },
    },
    [],
  );
  const inputTextHandler = useFocusedInputTextHandler(
    {
      onFocusedInputTextChanged: (e) => {
        "worklet";

        broadcastInputEvents("onChangeText", e);
      },
    },
    [],
  );
  // effects
  useEffect(() => {
    if (enabled) {
      applyMonkeyPatch();
    } else {
      revertMonkeyPatch();
    }
  }, [enabled]);

  return (
    <KeyboardContext.Provider value={context}>
      <KeyboardControllerViewAnimated
        enabled={enabled}
        onKeyboardMoveReanimated={keyboardHandler}
        onKeyboardMoveStart={Platform.OS === "ios" ? onKeyboardMove : undefined}
        onKeyboardMove={Platform.OS === "android" ? onKeyboardMove : undefined}
        onKeyboardMoveInteractive={onKeyboardMove}
        onFocusedInputLayoutChangedReanimated={inputLayoutHandler}
        onFocusedInputTextChangedReanimated={inputTextHandler}
        navigationBarTranslucent={navigationBarTranslucent}
        statusBarTranslucent={statusBarTranslucent}
        style={styles.container}
      >
        {children}
      </KeyboardControllerViewAnimated>
      <Animated.View
        // we are using this small hack, because if the component (where
        // animated value has been used) is unmounted, then animation will
        // stop receiving events (seems like it's react-native optimization).
        // So we need to keep a reference to the animated value, to keep it's
        // always mounted (keep a reference to an animated value).
        //
        // To test why it's needed, try to open screen which consumes Animated.Value
        // then close it and open it again (for example 'Animated transition').
        style={style}
      />
    </KeyboardContext.Provider>
  );
};

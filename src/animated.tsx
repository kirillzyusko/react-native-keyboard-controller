/* eslint react/jsx-sort-props: off */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Platform, StyleSheet } from "react-native";
import {
  controlEdgeToEdgeValues,
  isEdgeToEdge,
} from "react-native-is-edge-to-edge";
import Reanimated, { useSharedValue } from "react-native-reanimated";

import { KeyboardControllerView } from "./bindings";
import { KeyboardContext } from "./context";
import { focusedInputEventsMap, keyboardEventsMap } from "./event-mappings";
import { useAnimatedValue, useEventHandlerRegistration } from "./internal";
import { KeyboardController } from "./module";
import {
  useAnimatedKeyboardHandler,
  useFocusedInputLayoutHandler,
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

const IS_EDGE_TO_EDGE = isEdgeToEdge();

const KeyboardControllerViewAnimated = Reanimated.createAnimatedComponent(
  Animated.createAnimatedComponent(KeyboardControllerView),
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
   * @platform android
   * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/14
   */
  statusBarTranslucent?: boolean;
  /**
   * Set the value to `true`, if you use translucent navigation bar on Android.
   * Defaults to `false`.
   *
   * @platform android
   * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/119
   */
  navigationBarTranslucent?: boolean;
  /**
   * A boolean property indicating whether to keep edge-to-edge mode always enabled (even when you disable the module).
   * Defaults to `false`.
   *
   * @platform android
   * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/592
   */
  preserveEdgeToEdge?: boolean;
  /**
   * A boolean prop indicating whether the module is enabled. It indicate only initial state
   * (if you try to change this prop after component mount it will not have any effect).
   * To change the property in runtime use `useKeyboardController` hook and `setEnabled` method.
   * Defaults to `true`.
   */
  enabled?: boolean;
  /**
   * A boolean prop indicating whether to preload the keyboard to reduce time-to-interaction (TTI) on first input focus.
   * Defaults to `true`.
   *
   * @platform ios
   */
  preload?: boolean;
};

// capture `Platform.OS` in separate variable to avoid deep workletization of entire RN package
// see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/393 and https://github.com/kirillzyusko/react-native-keyboard-controller/issues/294 for more details
const OS = Platform.OS;

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
  const {
    children,
    statusBarTranslucent,
    navigationBarTranslucent,
    preserveEdgeToEdge,
    enabled: initiallyEnabled = true,
    preload = true,
  } = props;
  // ref
  const viewTagRef = useRef<React.Component<KeyboardControllerProps>>(null);
  // state
  const [enabled, setEnabled] = useState(initiallyEnabled);
  // animated values
  const progress = useAnimatedValue(0);
  const height = useAnimatedValue(0);
  // shared values
  const progressSV = useSharedValue(0);
  const heightSV = useSharedValue(0);
  const layout = useSharedValue<FocusedInputLayoutChangedEvent | null>(null);
  const setKeyboardHandlers = useEventHandlerRegistration<KeyboardHandler>(
    keyboardEventsMap,
    viewTagRef,
  );
  const setInputHandlers = useEventHandlerRegistration<FocusedInputHandler>(
    focusedInputEventsMap,
    viewTagRef,
  );
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
        // Setting useNativeDriver to true on web triggers a warning due to the absence of a native driver for web. Therefore, it is set to false.
        { useNativeDriver: Platform.OS !== "web" },
      ),
    [],
  );
  // handlers
  const updateSharedValues = (event: NativeEvent, platforms: string[]) => {
    "worklet";

    if (platforms.includes(OS)) {
      // eslint-disable-next-line react-compiler/react-compiler
      progressSV.value = event.progress;
      heightSV.value = -event.height;
    }
  };
  const keyboardHandler = useAnimatedKeyboardHandler(
    {
      onKeyboardMoveStart: (event: NativeEvent) => {
        "worklet";

        updateSharedValues(event, ["ios"]);
      },
      onKeyboardMove: (event: NativeEvent) => {
        "worklet";

        updateSharedValues(event, ["android"]);
      },
      onKeyboardMoveInteractive: (event: NativeEvent) => {
        "worklet";

        updateSharedValues(event, ["android", "ios"]);
      },
      onKeyboardMoveEnd: (event: NativeEvent) => {
        "worklet";

        updateSharedValues(event, ["android"]);
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

  useEffect(() => {
    if (preload) {
      KeyboardController.preload();
    }
  }, [preload]);

  if (__DEV__) {
    controlEdgeToEdgeValues({
      statusBarTranslucent,
      navigationBarTranslucent,
      preserveEdgeToEdge,
    });
  }

  return (
    <KeyboardContext.Provider value={context}>
      <KeyboardControllerViewAnimated
        ref={viewTagRef}
        enabled={enabled}
        navigationBarTranslucent={IS_EDGE_TO_EDGE || navigationBarTranslucent}
        statusBarTranslucent={IS_EDGE_TO_EDGE || statusBarTranslucent}
        preserveEdgeToEdge={IS_EDGE_TO_EDGE || preserveEdgeToEdge}
        style={styles.container}
        // on*Reanimated prop must precede animated handlers to work correctly
        onKeyboardMoveReanimated={keyboardHandler}
        onKeyboardMoveStart={OS === "ios" ? onKeyboardMove : undefined}
        onKeyboardMove={OS === "android" ? onKeyboardMove : undefined}
        onKeyboardMoveInteractive={onKeyboardMove}
        onKeyboardMoveEnd={OS === "android" ? onKeyboardMove : undefined}
        onFocusedInputLayoutChangedReanimated={inputLayoutHandler}
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

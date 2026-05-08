/* eslint react/jsx-sort-props: off */
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Platform, StyleSheet } from "react-native";
import {
  controlEdgeToEdgeValues,
  isEdgeToEdge,
} from "react-native-is-edge-to-edge";

import { KeyboardControllerView } from "./bindings";
import { KeyboardContext } from "./context";
import { useAnimatedValue } from "./internal";
import { KeyboardController } from "./module";

import type { KeyboardControllerProps, KeyboardProviderProps } from "./types";
import type { ViewStyle } from "react-native";

const IS_EDGE_TO_EDGE = isEdgeToEdge();

const KeyboardControllerViewAnimated = Animated.createAnimatedComponent(
  KeyboardControllerView as React.ComponentClass<KeyboardControllerProps>,
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

// capture `Platform.OS` in separate variable to avoid issues with deep imports
const OS = Platform.OS;

/**
 * A component that wrap your app. Under the hood it works with {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-controller-view|KeyboardControllerView} to receive events during keyboard movements,
 * maps these events to `Animated` values and stores them in context.
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
  // state
  const [enabled, setEnabled] = useState(initiallyEnabled);
  // animated values
  const progress = useAnimatedValue(0);
  const height = useAnimatedValue(0);
  // memo
  const context = useMemo(
    () => ({
      enabled,
      animated: { progress, height: Animated.multiply(height, -1) },
      setEnabled,
    }),
    [enabled],
  );
  const style = useMemo(
    () => [
      styles.hidden,
      // Reference both values so they keep receiving events even when all
      // consumers (e.g. KeyboardAvoidingView) are unmounted.
      { paddingBottom: progress, paddingTop: height },
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
        // useNativeDriver: false is required to support non-transform animated
        // styles (e.g. paddingBottom in KeyboardAvoidingView).
        { useNativeDriver: false },
      ),
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
        enabled={enabled}
        navigationBarTranslucent={IS_EDGE_TO_EDGE || navigationBarTranslucent}
        statusBarTranslucent={IS_EDGE_TO_EDGE || statusBarTranslucent}
        preserveEdgeToEdge={IS_EDGE_TO_EDGE || preserveEdgeToEdge}
        style={styles.container}
        onKeyboardMoveStart={OS === "ios" ? onKeyboardMove : undefined}
        onKeyboardMove={OS === "android" ? onKeyboardMove : undefined}
        onKeyboardMoveInteractive={onKeyboardMove}
        onKeyboardMoveEnd={OS === "android" ? onKeyboardMove : undefined}
      >
        {children}
      </KeyboardControllerViewAnimated>
      <Animated.View
        // Keep a reference to the animated values so they continue receiving
        // events even when all consumers (e.g. KeyboardAvoidingView) are unmounted.
        style={style}
      />
    </KeyboardContext.Provider>
  );
};
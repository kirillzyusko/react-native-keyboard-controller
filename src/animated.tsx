import React, { useMemo } from 'react';
import { Animated, Platform, StyleSheet, ViewStyle } from 'react-native';
import Reanimated, { useSharedValue } from 'react-native-reanimated';

import { KeyboardContext } from './context';
import {
  useAnimatedKeyboardHandler,
  useSharedHandlers,
  useAnimatedValue,
} from './internal';
import { KeyboardControllerView } from './native';

import type {
  KeyboardControllerProps,
  KeyboardHandler,
  NativeEvent,
} from './types';

const KeyboardControllerViewAnimated = Reanimated.createAnimatedComponent(
  Animated.createAnimatedComponent(
    KeyboardControllerView
  ) as React.FC<KeyboardControllerProps>
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
    display: 'none',
    position: 'absolute',
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
};

export const KeyboardProvider = ({
  children,
  statusBarTranslucent,
  navigationBarTranslucent,
}: KeyboardProviderProps) => {
  // animated values
  const progress = useAnimatedValue(0);
  const height = useAnimatedValue(0);
  // shared values
  const progressSV = useSharedValue(0);
  const heightSV = useSharedValue(0);
  const { setHandlers, broadcast } = useSharedHandlers<KeyboardHandler>();
  // memo
  const context = useMemo(
    () => ({
      animated: { progress: progress, height: Animated.multiply(height, -1) },
      reanimated: { progress: progressSV, height: heightSV },
      setHandlers,
    }),
    []
  );
  const style = useMemo(
    () => [
      styles.hidden,
      { transform: [{ translateX: height }, { translateY: progress }] },
    ],
    []
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
        { useNativeDriver: true }
      ),
    []
  );
  // handlers
  const updateSharedValues = (event: NativeEvent, platforms: string[]) => {
    'worklet';

    if (platforms.includes(Platform.OS)) {
      progressSV.value = event.progress;
      heightSV.value = -event.height;
    }
  };
  const handler = useAnimatedKeyboardHandler(
    {
      onKeyboardMoveStart: (event: NativeEvent) => {
        'worklet';

        broadcast('onStart', event);
        updateSharedValues(event, ['ios']);
      },
      onKeyboardMove: (event: NativeEvent) => {
        'worklet';

        broadcast('onMove', event);
        updateSharedValues(event, ['android']);
      },
      onKeyboardMoveEnd: (event: NativeEvent) => {
        'worklet';

        broadcast('onEnd', event);
      },
      onKeyboardMoveInteractive: (event: NativeEvent) => {
        'worklet';

        updateSharedValues(event, ['android', 'ios']);
        broadcast('onInteractive', event);
      },
    },
    []
  );

  return (
    <KeyboardContext.Provider value={context}>
      <KeyboardControllerViewAnimated
        onKeyboardMoveReanimated={handler}
        onKeyboardMoveStart={Platform.OS === 'ios' ? onKeyboardMove : undefined}
        onKeyboardMove={Platform.OS === 'android' ? onKeyboardMove : undefined}
        onKeyboardMoveInteractive={onKeyboardMove}
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

import React, { useContext, useMemo } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import Reanimated, {
  useEvent,
  useHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  EventWithName,
  KeyboardControllerProps,
  KeyboardControllerView,
  NativeEvent,
  useResizeMode,
} from './native';

const KeyboardControllerViewAnimated = Reanimated.createAnimatedComponent(
  Animated.createAnimatedComponent(
    KeyboardControllerView
  ) as React.FC<KeyboardControllerProps>
);

type AnimatedContext = {
  progress: Animated.Value;
  height: Animated.Value;
};
type ReanimatedContext = {
  progress: Reanimated.SharedValue<number>;
  height: Reanimated.SharedValue<number>;
};
type KeyboardAnimationContext = {
  animated: AnimatedContext;
  reanimated: ReanimatedContext;
};
const defaultContext: KeyboardAnimationContext = {
  animated: {
    progress: new Animated.Value(0),
    height: new Animated.Value(0),
  },
  reanimated: {
    progress: { value: 0 },
    height: { value: 0 },
  },
};
const KeyboardContext = React.createContext(defaultContext);

export const useKeyboardAnimation = (): AnimatedContext => {
  useResizeMode();
  const context = useContext(KeyboardContext);

  return context.animated;
};

export const useReanimatedKeyboardAnimation = (): ReanimatedContext => {
  useResizeMode();
  const context = useContext(KeyboardContext);

  return context.reanimated;
};

function useAnimatedKeyboardHandler<TContext extends Record<string, unknown>>(
  handlers: {
    onKeyboardMove?: (e: NativeEvent, context: TContext) => void;
  },
  dependencies?: ReadonlyArray<unknown>
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

  return useEvent(
    (event: EventWithName<NativeEvent>) => {
      'worklet';
      const { onKeyboardMove } = handlers;

      if (onKeyboardMove && event.eventName.endsWith('onKeyboardMove')) {
        onKeyboardMove(event, context);
      }
    },
    ['onKeyboardMove'],
    doDependenciesDiffer
  );
}

type Styles = {
  container: ViewStyle;
  hidden: ViewStyle;
};

export const styles = StyleSheet.create<Styles>({
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
};

export const KeyboardProvider = ({
  children,
  statusBarTranslucent,
}: KeyboardProviderProps) => {
  const progress = useMemo(() => new Animated.Value(0), []);
  const height = useMemo(() => new Animated.Value(0), []);
  const progressSV = useSharedValue(0);
  const heightSV = useSharedValue(0);
  const context = useMemo(
    () => ({
      animated: { progress: progress, height: height },
      reanimated: { progress: progressSV, height: heightSV },
    }),
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

  const handler = useAnimatedKeyboardHandler(
    {
      onKeyboardMove: (event: NativeEvent) => {
        'worklet';
        progressSV.value = event.progress;
        heightSV.value = event.height;
      },
    },
    []
  );

  return (
    <KeyboardContext.Provider value={context}>
      <KeyboardControllerViewAnimated
        onKeyboardMoveReanimated={handler}
        onKeyboardMove={onKeyboardMove}
        statusBarTranslucent={statusBarTranslucent}
        style={styles.container}
      >
        <>
          <Animated.View
            style={[
              // we are using this small hack, because if the component (where
              // animated value has been used) is unmounted, then animation will
              // stop receiving events (seems like it's react-native optimization).
              // So we need to keep a reference to the animated value, to keep it's
              // always mounted (keep a reference to an animated value).
              //
              // To test why it's needed, try to open screen which consumes Animated.Value
              // then close it and open it again (for example 'Animated transition').
              styles.hidden,
              { transform: [{ translateX: height }, { translateY: progress }] },
            ]}
          />
          {children}
        </>
      </KeyboardControllerViewAnimated>
    </KeyboardContext.Provider>
  );
};

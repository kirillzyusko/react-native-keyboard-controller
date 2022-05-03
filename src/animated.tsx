import React, { useContext, useMemo, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import Reanimated, {
  useAnimatedProps,
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
export type KeyboardUI = Reanimated.SharedValue<{
  position: number;
  opacity: number;
}>;
type InteractiveKeyboardContext = {
  isScrollActive: Reanimated.SharedValue<boolean>;
  keyboard: KeyboardUI;
};
type KeyboardAnimationContext = {
  animated: AnimatedContext;
  reanimated: ReanimatedContext;
  interactive: InteractiveKeyboardContext;
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
  interactive: {
    isScrollActive: { value: false },
    keyboard: { value: { position: 0, opacity: 1 } },
  },
};
export const KeyboardContext = React.createContext(defaultContext);

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

export const useInteractiveKeyboardContext = (): InteractiveKeyboardContext => {
  const context = useContext(KeyboardContext);

  return context.interactive;
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
  // mapping of the animated values
  const progress = useRef(new Animated.Value(0)).current;
  const height = useRef(new Animated.Value(0)).current;
  const progressSV = useSharedValue(0);
  const heightSV = useSharedValue(0);
  // interactive keyboard
  const isScrollActive = useSharedValue(false);
  const keyboard = useSharedValue({
    position: 0,
    opacity: 1,
  });
  // context
  const context = useMemo<KeyboardAnimationContext>(
    () => ({
      animated: { progress: progress, height: height },
      reanimated: { progress: progressSV, height: heightSV },
      interactive: { isScrollActive, keyboard },
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

  const animatedProps = useAnimatedProps(() => {
    return {
      isScrollActive: isScrollActive.value,
      keyboard: keyboard.value,
    };
  }, []);

  return (
    <KeyboardContext.Provider value={context}>
      <KeyboardControllerViewAnimated
        onKeyboardMoveReanimated={handler}
        onKeyboardMove={onKeyboardMove}
        animatedProps={animatedProps}
        statusBarTranslucent={statusBarTranslucent}
        style={styles.container}
      >
        <>
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
          {children}
        </>
      </KeyboardControllerViewAnimated>
    </KeyboardContext.Provider>
  );
};

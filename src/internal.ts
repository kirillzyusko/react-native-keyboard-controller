import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import type {
  FocusedInputTextChangedEvent,
  Handlers,
  NativeEvent,
} from './types';

/**
 * Hook for storing worklet handlers (objects with keys, where values are worklets).
 * Returns methods for setting handlers and broadcasting events in them.
 *
 * T is a generic that looks like:
 * @example
 * {
 *  onEvent: () => {},
 *  onEvent2: () => {},
 * }
 */
export function useSharedHandlers<
  T extends Record<string, (event: NativeEvent) => void>
>() {
  const handlers = useSharedValue<Handlers<T>>({});
  const jsHandlers = useRef<Handlers<T>>({});

  // since js -> worklet -> js call is asynchronous, we can not write handlers
  // straight into shared variable (using current shared value as a previous result),
  // since there may be a race condition in a call, and closure may have out-of-dated
  // values. As a result, some of handlers may be not written to "all handlers" object.
  // Below we are writing all handlers to `ref` and afterwards synchronize them with
  // shared value (since `refs` are not referring to actual value in worklets).
  // This approach allow us to update synchronously handlers in js thread (and it assures,
  // that it will have all of them) and then update them in worklet thread (calls are
  // happening in FIFO order, so we will always have actual value).
  const updateSharedHandlers = () => {
    handlers.value = jsHandlers.current;
  };
  const setHandlers = useCallback((handler: Handlers<T>) => {
    jsHandlers.current = {
      ...jsHandlers.current,
      ...handler,
    };
    updateSharedHandlers();
  }, []);
  const broadcast = (type: keyof T, event: NativeEvent) => {
    'worklet';

    Object.keys(handlers.value).forEach((key) =>
      handlers.value[key]?.[type]?.(event)
    );
  };

  return { setHandlers, broadcast };
}

// TODO: think on how to reduce code duplication?
export function useHandlers<
  T extends Record<string, (event: FocusedInputTextChangedEvent) => void>
>() {
  const handlers = useRef<Handlers<T>>({});

  const setHandlers = useCallback((handler: Handlers<T>) => {
    handlers.current = {
      ...handlers.current,
      ...handler,
    };
  }, []);

  const broadcast = (type: keyof T, event: FocusedInputTextChangedEvent) => {
    Object.keys(handlers.current).forEach((key) =>
      handlers.current[key]?.[type]?.(event)
    );
  };

  return { setHandlers, broadcast };
}

/**
 * TS variant of `useAnimatedValue` hook which is added in RN 0.71
 * A better alternative of storing animated values in refs, since
 * it doesn't recreate a new `Animated.Value` object on every re-render
 * and therefore consumes less memory. We can not use a variant from
 * RN, since this library supports earlier versions of RN.
 *
 * @see https://github.com/facebook/react-native/commit/e22217fe8b9455e32695f88ca835e11442b0a937
 */
export function useAnimatedValue(
  initialValue: number,
  config?: Animated.AnimatedConfig
): Animated.Value {
  const ref = useRef<Animated.Value | null>(null);

  if (ref.current == null) {
    ref.current = new Animated.Value(initialValue, config);
  }

  return ref.current;
}

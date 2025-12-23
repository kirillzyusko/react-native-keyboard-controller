import { useCallback, useRef } from "react";
import { Animated } from "react-native";
import {
  type EventHandlerProcessed,
  useSharedValue,
} from "react-native-reanimated";

import { findNodeHandle } from "./utils/findNodeHandle";

import type { Handlers } from "./types";

type ComponentOrHandle = Parameters<typeof findNodeHandle>[0];

type WorkletHandler = {
  registerForEvents: (viewTag: number) => void;
  unregisterFromEvents: (viewTag: number) => void;
};

type WorkletHandlerOrWorkletHandlerObject =
  | WorkletHandler
  | {
      workletEventHandler: WorkletHandler;
    };

/**
 * An internal hook that helps to register workletized event handlers.
 *
 * @param viewTagRef - Ref to the view that produces events.
 * @returns A function that registers supplied event handlers.
 * @example
 * ```ts
 * const setKeyboardHandlers = useEventHandlerRegistration<KeyboardHandler>(
 *     keyboardEventsMap,
 *     viewTagRef,
 * );
 * ```
 */
export function useEventHandlerRegistration(
  viewTagRef: React.MutableRefObject<ComponentOrHandle>,
) {
  const onRegisterHandler = (handler: EventHandlerProcessed<never, never>) => {
    const currentHandler =
      handler as unknown as WorkletHandlerOrWorkletHandlerObject;
    const attachWorkletHandlers = () => {
      const viewTag = findNodeHandle(viewTagRef.current);

      if (__DEV__ && !viewTag) {
        console.warn(
          "Can not attach worklet handlers for `react-native-keyboard-controller` because view tag can not be resolved. Be sure that `KeyboardProvider` is fully mounted before registering handlers. If you think it is a bug in library, please open an issue.",
        );
      }

      if (viewTag) {
        if ("workletEventHandler" in currentHandler) {
          currentHandler.workletEventHandler.registerForEvents(viewTag);
        } else {
          currentHandler.registerForEvents(viewTag);
        }
      }
    };

    if (viewTagRef.current) {
      attachWorkletHandlers();
    } else {
      // view may not be mounted yet - defer registration until call-stack becomes empty
      queueMicrotask(attachWorkletHandlers);
    }

    return () => {
      const viewTag = findNodeHandle(viewTagRef.current);

      if (viewTag) {
        if ("workletEventHandler" in currentHandler) {
          currentHandler.workletEventHandler.unregisterFromEvents(viewTag);
        } else {
          currentHandler.unregisterFromEvents(viewTag);
        }
      }
    };
  };

  return onRegisterHandler;
}

type UntypedHandler = Record<string, (event: never) => void>;
type SharedHandlersReturnType<T extends UntypedHandler> = [
  (handler: EventHandlerProcessed<never, never>) => () => void,
  <K extends keyof T>(type: K, event: Parameters<T[K]>[0]) => void,
];

/**
 * Hook for storing worklet handlers (objects with keys, where values are worklets).
 * Returns methods for setting handlers and broadcasting events in them.
 *
 * @template T - Handlers object, like `{ onStart: (e) => {}, onMove: (e) => {} }`.
 * @returns A tuple of `setHandlers` and `broadcast` methods.
 * @example
 * ```ts
 * const [setHandlers, broadcast] = useSharedHandlers<KeyboardHandler>();
 *
 * setHandlers({
 *   onStart: (e) => {
 *     "worklet";
 *
 *     // your handler for keyboard start
 *   },
 *   onMove: (e) => {
 *     "worklet";
 *
 *     // your handler for keyboard movement
 *   },
 * });
 * ```
 */
export function useSharedHandlers<
  T extends UntypedHandler,
>(): SharedHandlersReturnType<T> {
  const handlers = useSharedValue<
    Record<string, EventHandlerProcessed<never, never>>
  >({});
  const jsHandlers = useRef<
    Record<string, EventHandlerProcessed<never, never>>
  >({});

  // since js -> worklet -> js call is asynchronous, we can not write handlers
  // straight into shared variable (using current shared value as a previous result),
  // since there may be a race condition in a call, and closure may have out-of-dated
  // values. As a result, some of handlers may be not written to "all handlers" object.
  // Below we are writing all handlers to `ref` and afterwards synchronize them with
  // shared value (since `refs` are not referring to actual value in worklets).
  // This approach allow us to update synchronously handlers in js thread (and it assures,
  // that it will have all of them) and then update them in worklet thread (calls are
  // happening in FIFO order, so we will always have actual value).
  const updateSharedHandlers = useCallback(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    handlers.value = jsHandlers.current;
  }, [handlers]);
  const setHandlers = useCallback(
    (handler: EventHandlerProcessed<never, never>) => {
      const uuid = Math.random().toString(36).slice(-6);

      jsHandlers.current = {
        ...jsHandlers.current,
        [uuid]: handler,
      };
      updateSharedHandlers();

      return () => {
        delete jsHandlers.current[uuid];
        updateSharedHandlers();
      };
    },
    [updateSharedHandlers],
  );
  const broadcast = <K extends keyof T>(
    type: K,
    event: Parameters<T[K]>[0],
  ) => {
    "worklet";

    console.log(handlers.value, type, event);

    Object.keys(handlers.value).forEach((key) => {
      // TODO: fix TS errors and cleanup unused code (like async write?)
      // TODO: can be also handlers.value[key].worklet?
      handlers.value[key].workletEventHandler?.worklet?.({
        eventName: type,
        ...event,
      });
    });
  };

  return [setHandlers, broadcast];
}

/**
 * TS variant of `useAnimatedValue` hook which is added in RN 0.71
 * A better alternative of storing animated values in refs, since
 * it doesn't recreate a new `Animated.Value` object on every re-render
 * and therefore consumes less memory. We can not use a variant from
 * RN, since this library supports earlier versions of RN.
 *
 * @param initialValue - Initial value of the animated value (numeric).
 * @param config - Additional {@link Animated.AnimatedConfig|configuration} for the animated value.
 * @returns Properly memoized {@link Animated.Value|Animated} value.
 * @see https://github.com/facebook/react-native/commit/e22217fe8b9455e32695f88ca835e11442b0a937
 * @example
 * ```ts
 * const progress = useAnimatedValue(0);
 * ```
 */
export function useAnimatedValue(
  initialValue: number,
  config?: Animated.AnimatedConfig,
): Animated.Value {
  const ref = useRef<Animated.Value | null>(null);

  if (ref.current === null) {
    ref.current = new Animated.Value(initialValue, config);
  }

  return ref.current;
}

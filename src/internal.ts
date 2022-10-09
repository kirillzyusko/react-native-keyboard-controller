import { useCallback, useRef } from 'react';
import { useEvent, useHandler, useSharedValue } from 'react-native-reanimated';

import type { EventWithName, NativeEvent } from './types';

export function useAnimatedKeyboardHandler<
  TContext extends Record<string, unknown>
>(
  handlers: {
    onKeyboardMoveStart?: (e: NativeEvent, context: TContext) => void;
    onKeyboardMove?: (e: NativeEvent, context: TContext) => void;
    onKeyboardMoveEnd?: (e: NativeEvent, context: TContext) => void;
  },
  dependencies?: ReadonlyArray<unknown>
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

  return useEvent(
    (event: EventWithName<NativeEvent>) => {
      'worklet';
      const { onKeyboardMoveStart, onKeyboardMove, onKeyboardMoveEnd } =
        handlers;

      if (
        onKeyboardMoveStart &&
        event.eventName.endsWith('onKeyboardMoveStart')
      ) {
        onKeyboardMoveStart(event, context);
      }

      if (onKeyboardMove && event.eventName.endsWith('onKeyboardMove')) {
        onKeyboardMove(event, context);
      }

      if (onKeyboardMoveEnd && event.eventName.endsWith('onKeyboardMoveEnd')) {
        onKeyboardMoveEnd(event, context);
      }
    },
    ['onKeyboardMoveStart', 'onKeyboardMove', 'onKeyboardMoveEnd'],
    doDependenciesDiffer
  );
}

type Handlers<T> = Record<string, T>;

// TODO: T - overkill?
// TODO: make types correct (type is not a string)
export function useSharedHandlers<T>() {
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
  const broadcast = (type: string, event: NativeEvent) => {
    'worklet';

    Object.keys(handlers.value).forEach((key) =>
      handlers.value[key]?.[type]?.(event)
    );
  };

  return { setHandlers, broadcast };
}

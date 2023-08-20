import { useEvent, useHandler } from 'react-native-reanimated';

import type { EventWithName, NativeEvent } from './types';

export function useAnimatedKeyboardHandler<
  TContext extends Record<string, unknown>
>(
  handlers: {
    onKeyboardMoveStart?: (e: NativeEvent, context: TContext) => void;
    onKeyboardMove?: (e: NativeEvent, context: TContext) => void;
    onKeyboardMoveEnd?: (e: NativeEvent, context: TContext) => void;
    onKeyboardMoveInteractive?: (e: NativeEvent, context: TContext) => void;
  },
  dependencies?: ReadonlyArray<unknown>
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

  return useEvent(
    (event: EventWithName<NativeEvent>) => {
      'worklet';
      const {
        onKeyboardMoveStart,
        onKeyboardMove,
        onKeyboardMoveEnd,
        onKeyboardMoveInteractive,
      } = handlers;

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

      if (
        onKeyboardMoveInteractive &&
        event.eventName.endsWith('onKeyboardMoveInteractive')
      ) {
        onKeyboardMoveInteractive(event, context);
      }
    },
    [
      'onKeyboardMoveStart',
      'onKeyboardMove',
      'onKeyboardMoveEnd',
      'onKeyboardMoveInteractive',
    ],
    doDependenciesDiffer
  );
}

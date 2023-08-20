import { useEvent, useHandler } from 'react-native-reanimated';

import type { EventWithName, KeyboardHandlerHook, NativeEvent } from './types';

export const useAnimatedKeyboardHandler: KeyboardHandlerHook<
  Record<string, unknown>,
  EventWithName<NativeEvent>
> = (handlers, dependencies) => {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

  return useEvent(
    (event) => {
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
};

import { useEvent, useHandler } from "react-native-reanimated";

import type {
  EventWithName,
  FocusedInputLayoutChangedEvent,
  FocusedInputLayoutHandlerHook,
  KeyboardHandlerHook,
  NativeEvent,
} from "./types";

type EventContext = Record<string, unknown>;

export const useAnimatedKeyboardHandler: KeyboardHandlerHook<
  EventContext,
  EventWithName<NativeEvent>
> = (handlers, dependencies) => {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

  return useEvent(
    (event) => {
      "worklet";
      const {
        onKeyboardMoveStart,
        onKeyboardMove,
        onKeyboardMoveEnd,
        onKeyboardMoveInteractive,
      } = handlers;

      if (
        onKeyboardMoveStart &&
        event.eventName.endsWith("onKeyboardMoveStart")
      ) {
        onKeyboardMoveStart(event, context);
      }

      if (onKeyboardMove && event.eventName.endsWith("onKeyboardMove")) {
        onKeyboardMove(event, context);
      }

      if (onKeyboardMoveEnd && event.eventName.endsWith("onKeyboardMoveEnd")) {
        onKeyboardMoveEnd(event, context);
      }

      if (
        onKeyboardMoveInteractive &&
        event.eventName.endsWith("onKeyboardMoveInteractive")
      ) {
        onKeyboardMoveInteractive(event, context);
      }
    },
    [
      "onKeyboardMoveStart",
      "onKeyboardMove",
      "onKeyboardMoveEnd",
      "onKeyboardMoveInteractive",
    ],
    doDependenciesDiffer,
  );
};

export const useFocusedInputLayoutHandler: FocusedInputLayoutHandlerHook<
  EventContext,
  EventWithName<FocusedInputLayoutChangedEvent>
> = (handlers, dependencies) => {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

  return useEvent(
    (event) => {
      "worklet";
      const { onFocusedInputLayoutChanged } = handlers;

      if (
        onFocusedInputLayoutChanged &&
        event.eventName.endsWith("onFocusedInputLayoutChanged")
      ) {
        onFocusedInputLayoutChanged(event, context);
      }
    },
    ["onFocusedInputLayoutChanged"],
    doDependenciesDiffer,
  );
};

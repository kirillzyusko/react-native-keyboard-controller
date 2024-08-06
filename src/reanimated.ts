import type {
  EventWithName,
  FocusedInputLayoutChangedEvent,
  FocusedInputLayoutHandlerHook,
  FocusedInputSelectionChangedEvent,
  FocusedInputSelectionHandlerHook,
  FocusedInputTextChangedEvent,
  FocusedInputTextHandlerHook,
  KeyboardHandlerHook,
  NativeEvent,
} from "./types";

const NOOP = () => () => {};

export const useAnimatedKeyboardHandler: KeyboardHandlerHook<
  Record<string, unknown>,
  EventWithName<NativeEvent>
> = NOOP;
export const useFocusedInputLayoutHandler: FocusedInputLayoutHandlerHook<
  Record<string, unknown>,
  EventWithName<FocusedInputLayoutChangedEvent>
> = NOOP;

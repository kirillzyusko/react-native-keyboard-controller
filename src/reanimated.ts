import type {
  EventWithName,
  FocusedInputLayoutChangedEvent,
  FocusedInputLayoutHandlerHook,
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
export const useFocusedInputTextHandler: FocusedInputTextHandlerHook<
  Record<string, unknown>,
  EventWithName<FocusedInputTextChangedEvent>
> = NOOP;

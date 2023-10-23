import type {
  EventWithName,
  FocusedInputHandlerHook,
  FocusedInputLayoutChangedEvent,
  KeyboardHandlerHook,
  NativeEvent,
} from './types';

const NOOP = () => () => {};
export const useAnimatedKeyboardHandler: KeyboardHandlerHook<
  Record<string, unknown>,
  EventWithName<NativeEvent>
> = NOOP;
export const useFocusedInputHandler: FocusedInputHandlerHook<
  Record<string, unknown>,
  EventWithName<FocusedInputLayoutChangedEvent>
> = NOOP;

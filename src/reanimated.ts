import type {
  EventWithName,
  FocusedInputLayoutChangedEvent,
  FocusedInputLayoutHandlerHook,
  KeyboardHandlerHook,
  NativeEvent,
} from "./types";

export {
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useHandler,
} from "react-native-reanimated";

const NOOP = () => () => {};

export const useAnimatedKeyboardHandler: KeyboardHandlerHook<
  Record<string, unknown>,
  EventWithName<NativeEvent>
> = NOOP;
export const useFocusedInputLayoutHandler: FocusedInputLayoutHandlerHook<
  Record<string, unknown>,
  EventWithName<FocusedInputLayoutChangedEvent>
> = NOOP;

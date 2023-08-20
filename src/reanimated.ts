import type { EventWithName, KeyboardHandlerHook, NativeEvent } from './types';

export const useAnimatedKeyboardHandler: KeyboardHandlerHook<
  Record<string, unknown>,
  EventWithName<NativeEvent>
> = () => () => {};

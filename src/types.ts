import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// DirectEventHandler events declaration

export type NativeEvent = {
  progress: number;
  height: number;
};
export type EventWithName<T> = {
  eventName: string;
} & T;

// native View/Module declarations

export type KeyboardControllerProps = {
  onKeyboardMove: (e: NativeSyntheticEvent<EventWithName<NativeEvent>>) => void;
  // fake prop used to activate reanimated bindings
  onKeyboardMoveReanimated: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>
  ) => void;
  statusBarTranslucent?: boolean;
} & ViewProps;

export type KeyboardControllerModule = {
  // android only
  setDefaultMode: () => void;
  setInputMode: (mode: number) => void;
  // native event module stuff
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
};

// Event module declarations

export type KeyboardControllerEvents =
  | 'keyboardWillShow'
  | 'keyboardDidShow'
  | 'keyboardWillHide'
  | 'keyboardDidHide';
export type KeyboardEventData = {
  height: number;
};

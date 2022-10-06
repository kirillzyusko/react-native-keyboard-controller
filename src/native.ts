import { useEffect } from 'react';
import {
  NativeEventEmitter,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';

export enum AndroidSoftInputModes {
  SOFT_INPUT_ADJUST_NOTHING = 48,
  SOFT_INPUT_ADJUST_PAN = 32,
  SOFT_INPUT_ADJUST_RESIZE = 16,
  SOFT_INPUT_ADJUST_UNSPECIFIED = 0,
}

export type NativeEvent = {
  progress: number;
  height: number;
};
export type EventWithName<T> = {
  eventName: string;
} & T;
export type KeyboardControllerProps = {
  onKeyboardMove: (e: NativeSyntheticEvent<EventWithName<NativeEvent>>) => void;
  // fake prop used to activate reanimated bindings
  onKeyboardMoveReanimated: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>
  ) => void;
  statusBarTranslucent?: boolean;
} & ViewProps;
type KeyboardController = {
  // android only
  setDefaultMode: () => void;
  setInputMode: (mode: AndroidSoftInputModes) => void;
};

const RCTKeyboardController =
  require('./specs/NativeKeyboardController').default;
export const KeyboardController = RCTKeyboardController as KeyboardController;

const eventEmitter = new NativeEventEmitter(RCTKeyboardController);
type KeyboardControllerEvents =
  | 'keyboardWillShow'
  | 'keyboardDidShow'
  | 'keyboardWillHide'
  | 'keyboardDidHide';
type KeyboardEvent = {
  height: number;
};
export const KeyboardEvents = {
  addListener: (
    name: KeyboardControllerEvents,
    cb: (e: KeyboardEvent) => void
  ) => eventEmitter.addListener('KeyboardController::' + name, cb),
};
export const KeyboardControllerView =
  require('./specs/KeyboardControllerViewNativeComponent').default;

export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
};

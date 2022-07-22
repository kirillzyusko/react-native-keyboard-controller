import { useEffect } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  NativeModules,
  NativeEventEmitter,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';

import { isTurboModuleEnabled } from './architecture';

const LINKING_ERROR =
  `The package 'react-native-keyboard-controller' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

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

const ComponentName = 'KeyboardControllerView';

const RCTKeyboardController = isTurboModuleEnabled
  ? require('./NativeKeyboardController').default
  : NativeModules.KeyboardController;
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
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<KeyboardControllerProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
};

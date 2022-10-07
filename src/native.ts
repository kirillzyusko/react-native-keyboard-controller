import { Platform, NativeEventEmitter } from 'react-native';

import type {
  KeyboardControllerEvents,
  KeyboardControllerModule,
  KeyboardEventData,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-keyboard-controller' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// copied from `android.view.WindowManager.LayoutParams`
export enum AndroidSoftInputModes {
  SOFT_INPUT_ADJUST_NOTHING = 48,
  SOFT_INPUT_ADJUST_PAN = 32,
  SOFT_INPUT_ADJUST_RESIZE = 16,
  SOFT_INPUT_ADJUST_UNSPECIFIED = 0,
  SOFT_INPUT_IS_FORWARD_NAVIGATION = 256,
  SOFT_INPUT_MASK_ADJUST = 240,
  SOFT_INPUT_MASK_STATE = 15,
  SOFT_INPUT_MODE_CHANGED = 512,
  SOFT_INPUT_STATE_ALWAYS_HIDDEN = 3,
  SOFT_INPUT_STATE_ALWAYS_VISIBLE = 5,
  SOFT_INPUT_STATE_HIDDEN = 2,
  SOFT_INPUT_STATE_UNCHANGED = 1,
  SOFT_INPUT_STATE_UNSPECIFIED = 0,
  SOFT_INPUT_STATE_VISIBLE = 4,
}

const RCTKeyboardController =
  require('./specs/NativeKeyboardController').default;
export const KeyboardController = (
  RCTKeyboardController
    ? RCTKeyboardController
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        }
      )
) as KeyboardControllerModule;

const eventEmitter = new NativeEventEmitter(KeyboardController);

export const KeyboardEvents = {
  addListener: (
    name: KeyboardControllerEvents,
    cb: (e: KeyboardEventData) => void
  ) => eventEmitter.addListener('KeyboardController::' + name, cb),
};
export const KeyboardControllerView =
  require('./specs/KeyboardControllerViewNativeComponent').default;

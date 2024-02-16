import { NativeEventEmitter, Platform } from "react-native";

import type {
  FocusedInputEventsModule,
  KeyboardControllerModule,
  KeyboardControllerProps,
  KeyboardEventsModule,
  KeyboardGestureAreaProps,
} from "./types";

const LINKING_ERROR =
  `The package 'react-native-keyboard-controller' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

const RCTKeyboardController =
  require("./specs/NativeKeyboardController").default;
export const KeyboardController = (
  RCTKeyboardController
    ? RCTKeyboardController
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        },
      )
) as KeyboardControllerModule;

const KEYBOARD_CONTROLLER_NAMESPACE = "KeyboardController::";
const eventEmitter = new NativeEventEmitter(KeyboardController);

export const KeyboardEvents: KeyboardEventsModule = {
  addListener: (name, cb) =>
    eventEmitter.addListener(KEYBOARD_CONTROLLER_NAMESPACE + name, cb),
};
/**
 * This API is not documented, it's for internal usage only (for now), and is a subject to potential breaking changes in future.
 * Use it with cautious.
 */
export const FocusedInputEvents: FocusedInputEventsModule = {
  addListener: (name, cb) =>
    eventEmitter.addListener(KEYBOARD_CONTROLLER_NAMESPACE + name, cb),
};
export const KeyboardControllerView: React.FC<KeyboardControllerProps> =
  require("./specs/KeyboardControllerViewNativeComponent").default;
export const KeyboardGestureArea: React.FC<KeyboardGestureAreaProps> =
  Platform.OS === "android" && Platform.Version >= 30
    ? require("./specs/KeyboardGestureAreaNativeComponent").default
    : ({ children }: KeyboardGestureAreaProps) => children;

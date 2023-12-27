import { NativeEventEmitter, Platform } from "react-native";

import type {
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

const eventEmitter = new NativeEventEmitter(KeyboardController);

export const KeyboardEvents: KeyboardEventsModule = {
  addListener: (name, cb) =>
    eventEmitter.addListener("KeyboardController::" + name, cb),
};
export const KeyboardControllerView: React.FC<KeyboardControllerProps> =
  require("./specs/KeyboardControllerViewNativeComponent").default;
export const KeyboardGestureArea: React.FC<KeyboardGestureAreaProps> =
  Platform.OS === "android" && Platform.Version >= 30
    ? require("./specs/KeyboardGestureAreaNativeComponent").default
    : ({ children }: KeyboardGestureAreaProps) => children;

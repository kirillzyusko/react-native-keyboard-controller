import { View } from "react-native";

import type {
  FocusedInputEventsModule,
  KeyboardControllerNativeModule,
  KeyboardControllerProps,
  KeyboardEventsModule,
  KeyboardGestureAreaProps,
  OverKeyboardViewProps,
  WindowDimensionsEventsModule,
} from "./types";
import type { EmitterSubscription } from "react-native";

const NOOP = () => {};

export const KeyboardControllerNative: KeyboardControllerNativeModule = {
  setDefaultMode: NOOP,
  setInputMode: NOOP,
  dismiss: NOOP,
  setFocusTo: NOOP,
  addListener: NOOP,
  removeListeners: NOOP,
};
/**
 * An event emitter that provides a way to subscribe to next keyboard events:
 * - `keyboardWillShow`;
 * - `keyboardDidShow`;
 * - `keyboardWillHide`;
 * - `keyboardDidHide`.
 *
 * Use `addListener` function to add your event listener for a specific keyboard event.
 */
export const KeyboardEvents: KeyboardEventsModule = {
  addListener: () => ({ remove: NOOP } as EmitterSubscription),
};
/**
 * This API is not documented, it's for internal usage only (for now), and is a subject to potential breaking changes in future.
 * Use it with cautious.
 */
export const FocusedInputEvents: FocusedInputEventsModule = {
  addListener: () => ({ remove: NOOP } as EmitterSubscription),
};
export const WindowDimensionsEvents: WindowDimensionsEventsModule = {
  addListener: () => ({ remove: NOOP } as EmitterSubscription),
};
/**
 * A view that sends events whenever keyboard or focused events are happening.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-controller-view|Documentation} page for more details.
 */
export const KeyboardControllerView =
  View as unknown as React.FC<KeyboardControllerProps>;
/**
 * A view that defines a region on the screen, where gestures will control the keyboard position.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-gesture-area|Documentation} page for more details.
 */
export const KeyboardGestureArea =
  View as unknown as React.FC<KeyboardGestureAreaProps>;
export const RCTOverKeyboardView =
  View as unknown as React.FC<OverKeyboardViewProps>;

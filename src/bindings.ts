import { View } from "react-native";

import type {
  FocusedInputEventsModule,
  KeyboardControllerModule,
  KeyboardControllerProps,
  KeyboardEventsModule,
  KeyboardGestureAreaProps,
} from "./types";
import type { EmitterSubscription } from "react-native";

const NOOP = () => {};
export const KeyboardController: KeyboardControllerModule = {
  setDefaultMode: NOOP,
  setInputMode: NOOP,
  dismiss: NOOP,
  setFocusTo: NOOP,
  addListener: NOOP,
  removeListeners: NOOP,
};
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
export const KeyboardControllerView =
  View as unknown as React.FC<KeyboardControllerProps>;
export const KeyboardGestureArea =
  View as unknown as React.FC<KeyboardGestureAreaProps>;

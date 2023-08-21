import { EmitterSubscription, View } from 'react-native';
import type {
  KeyboardControllerModule,
  KeyboardControllerProps,
  KeyboardEventsModule,
  KeyboardGestureAreaProps,
} from './types';

const NOOP = () => {};
export const KeyboardController: KeyboardControllerModule = {
  setDefaultMode: NOOP,
  setInputMode: NOOP,
  addListener: NOOP,
  removeListeners: NOOP,
};
export const KeyboardEvents: KeyboardEventsModule = {
  addListener: () => ({ remove: NOOP } as EmitterSubscription),
};
export const KeyboardControllerView =
  View as unknown as React.FC<KeyboardControllerProps>;
export const KeyboardGestureArea =
  View as unknown as React.FC<KeyboardGestureAreaProps>;

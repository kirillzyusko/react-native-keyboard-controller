import React, { useRef, useMemo, useEffect } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  Animated,
  Easing,
  NativeModules,
  Keyboard,
  NativeEventEmitter,
  NativeSyntheticEvent,
} from 'react-native';

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
  style?: ViewStyle;
  children: React.ReactNode;
  onKeyboardMove: (e: NativeSyntheticEvent<EventWithName<NativeEvent>>) => void;
  // fake prop used to activate reanimated bindings
  onKeyboardMoveReanimated: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>
  ) => void;
};
type KeyboardController = {
  // android only
  setDefaultMode: () => void;
  setInputMode: (mode: AndroidSoftInputModes) => void;
};

const ComponentName = 'KeyboardControllerView';

const RCTKeyboardController = NativeModules.KeyboardController;
export const KeyboardController = RCTKeyboardController as KeyboardController;

const eventEmitter = new NativeEventEmitter(RCTKeyboardController);
type KeyboardControllerEvents =
  | 'keyboardWillShow'
  | 'keyboardDidShow'
  | 'keyboardWillHide'
  | 'keyboardDidHide';
type KeyboardEvent = {
  height: number; // TODO: it will be always present?
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

// cubic-bezier(.17,.67,.34,.94)
export const defaultAndroidEasing = Easing.bezier(0.4, 0.0, 0.2, 1);
type KeyboardAnimation = {
  progress: Animated.Value;
  height: Animated.Value;
};

export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
};

const availableOSEventType = Platform.OS === 'ios' ? 'Will' : 'Did';

/**
 * An experimental implementation of tracing keyboard appearance.
 * Switch an input mode to adjust resize mode. In this case all did* events
 * are triggering before keyboard appears, and using some approximations
 * it tries to mimicries a native transition.
 *
 * @returns {Animated.Value}
 */
export const useKeyboardAnimationReplica = (): KeyboardAnimation => {
  const height = useRef(new Animated.Value(0));
  const progress = useRef(new Animated.Value(0));
  const animation = useMemo(
    () => ({
      height: height.current,
      progress: progress.current,
    }),
    []
  );

  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
  useEffect(() => {
    const listener = Keyboard.addListener(
      `keyboard${availableOSEventType}Show`,
      (e) => {
        Animated.timing(height.current, {
          toValue: -e.endCoordinates.height,
          duration: e.duration !== 0 ? e.duration : 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }).start();

        return () => listener.remove();
      }
    );
  }, []);
  useEffect(() => {
    const listener = Keyboard.addListener(
      `keyboard${availableOSEventType}Hide`,
      (e) => {
        Animated.timing(height.current, {
          toValue: 0,
          duration: e.duration !== 0 ? e.duration : 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }).start();

        return () => listener.remove();
      }
    );
  }, []);

  return animation;
};

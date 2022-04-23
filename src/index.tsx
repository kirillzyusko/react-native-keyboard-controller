import React, { useRef, useContext, useMemo, useEffect } from 'react';
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
  StyleSheet,
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

type KeyboardControllerProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  onProgress: (progress: Animated.Value) => void;
};
type KeyboardController = {
  // android only
  enable: () => void;
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
const KeyboardControllerViewAnimated = Animated.createAnimatedComponent(
  KeyboardControllerView
) as React.FC<KeyboardControllerProps>;

// cubic-bezier(.17,.67,.34,.94)
export const defaultAndroidEasing = Easing.bezier(0.4, 0.0, 0.2, 1);
const defaultContext = {
  progress: new Animated.Value(0),
};
const KeyboardContext = React.createContext(defaultContext);

export const useKeyboardProgress = (): Animated.Value => {
  useEffect(() => {
    KeyboardController.enable(); // TODO: maybe it can be enabled on provider level?
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
  const value = useContext(KeyboardContext).progress;

  return value;
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
export const useKeyboardReplicaProgress = (): Animated.Value => {
  const replica = React.useRef(new Animated.Value(0));

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
        Animated.timing(replica.current, {
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
        Animated.timing(replica.current, {
          toValue: 0,
          duration: e.duration !== 0 ? e.duration : 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }).start();

        return () => listener.remove();
      }
    );
  }, []);

  return replica.current;
};

type Styles = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
});

export const KeyboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const progress = useRef(new Animated.Value(0));
  const context = useMemo(() => ({ progress: progress.current }), [progress]);
  const onProgress = useRef(
    Animated.event(
      [
        {
          nativeEvent: {
            progress: progress.current,
          },
        },
      ],
      { useNativeDriver: true }
    )
  );

  return (
    <KeyboardContext.Provider value={context}>
      <KeyboardControllerViewAnimated
        onProgress={onProgress.current}
        style={styles.container}
      >
        {children}
      </KeyboardControllerViewAnimated>
    </KeyboardContext.Provider>
  );
};

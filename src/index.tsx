import React, { useRef, useContext, useMemo, useEffect } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  Animated,
  Easing,
  NativeModules,
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
  setDefaultMode: () => void;
  setInputMode: (mode: AndroidSoftInputModes) => void;
};

const ComponentName = 'KeyboardControllerView';

export const KeyboardController =
  NativeModules.KeyboardController as KeyboardController;
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

export const useKeyboardProgress = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
  const value = useContext(KeyboardContext).progress;

  return value;
};

export const KeyboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const progress = useRef(new Animated.Value(0));
  const context = useMemo(() => ({ progress: progress.current }), [progress]);

  return (
    <KeyboardContext.Provider value={context}>
      <KeyboardControllerViewAnimated
        onProgress={Animated.event(
          [
            {
              nativeEvent: {
                progress: progress.current,
              },
            },
          ],
          { useNativeDriver: true }
        )}
        style={{ flex: 1 }}
      >
        {children}
      </KeyboardControllerViewAnimated>
    </KeyboardContext.Provider>
  );
};

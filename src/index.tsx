import React, { useRef, useContext, useMemo } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  Animated,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-keyboard-controller' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

type KeyboardControllerProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  onProgress: (progress: Animated.Value) => void;
};

const ComponentName = 'KeyboardControllerView';

export const KeyboardControllerView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<KeyboardControllerProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
const KeyboardControllerViewAnimated = Animated.createAnimatedComponent(
  KeyboardControllerView
) as React.FC<KeyboardControllerProps>;

const defaultContext = {
  progress: new Animated.Value(0),
};
const KeyboardContext = React.createContext(defaultContext);

export const useKeyboardProgress = () => {
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

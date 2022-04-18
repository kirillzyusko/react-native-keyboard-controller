import React, { useRef, useContext, useMemo } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  Animated,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-keyboard-events' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

type KeyboardEventsProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  onProgress: (progress: Animated.Value) => void;
};

const ComponentName = 'KeyboardEventsView';

export const KeyboardEventsView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<KeyboardEventsProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

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
      <KeyboardEventsView
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
      >
        {children}
      </KeyboardEventsView>
    </KeyboardContext.Provider>
  );
};

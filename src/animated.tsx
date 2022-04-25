import React, { useRef, useContext, useMemo } from 'react';
import { Animated } from 'react-native';
import {
  KeyboardControllerProps,
  KeyboardControllerView,
  useResizeMode,
} from './native';
import { styles } from './styles';

const KeyboardControllerViewAnimated = Animated.createAnimatedComponent(
  KeyboardControllerView
) as React.FC<KeyboardControllerProps>;

type KeyboardAnimation = {
  progress: Animated.Value;
  height: Animated.Value;
};
const defaultContext: KeyboardAnimation = {
  progress: new Animated.Value(0),
  height: new Animated.Value(0),
};
const KeyboardContext = React.createContext(defaultContext);

export const useKeyboardAnimation = (): KeyboardAnimation => {
  useResizeMode();
  const context = useContext(KeyboardContext);

  return context;
};

export const KeyboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const progress = useRef(new Animated.Value(0));
  const height = useRef(new Animated.Value(0));
  const context = useMemo(
    () => ({ progress: progress.current, height: height.current }),
    []
  );
  const onKeyboardMove = useRef(
    Animated.event(
      [
        {
          nativeEvent: {
            progress: progress.current,
            height: height.current,
          },
        },
      ],
      { useNativeDriver: true }
    )
  );

  return (
    <KeyboardContext.Provider value={context}>
      <KeyboardControllerViewAnimated
        onKeyboardMove={onKeyboardMove.current}
        style={styles.container}
      >
        {children}
      </KeyboardControllerViewAnimated>
    </KeyboardContext.Provider>
  );
};

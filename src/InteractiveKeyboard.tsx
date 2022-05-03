import React, { useRef } from 'react';

import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Reanimated, { useAnimatedGestureHandler } from 'react-native-reanimated';

import { styles } from './styles';

type Props = {
  children: React.ReactNode;
  handler: ReturnType<typeof useAnimatedGestureHandler>;
};

const offset = [-1, 1];
const InteractiveKeyboard = ({ children, handler }: Props) => {
  const handlerRef = useRef();

  return (
    <PanGestureHandler
      activeOffsetY={offset}
      activeOffsetX={offset}
      onGestureEvent={handler}
      simultaneousHandlers={handlerRef}
    >
      <Reanimated.View style={styles.container}>
        <NativeViewGestureHandler ref={handlerRef}>
          {children}
        </NativeViewGestureHandler>
      </Reanimated.View>
    </PanGestureHandler>
  );
};

export default InteractiveKeyboard;

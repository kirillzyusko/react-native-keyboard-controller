import React, { useRef } from 'react';

import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Reanimated, { useAnimatedGestureHandler } from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  handler: ReturnType<typeof useAnimatedGestureHandler>;
};

const InteractiveKeyboard = ({ children, handler }: Props) => {
  const handlerRef = useRef();

  return (
    <PanGestureHandler
      onGestureEvent={handler}
      simultaneousHandlers={handlerRef}
    >
      {/* TODO: don't use inline styles */}
      <Reanimated.View style={{ flex: 1 }}>
        <NativeViewGestureHandler ref={handlerRef}>
          {children}
        </NativeViewGestureHandler>
      </Reanimated.View>
    </PanGestureHandler>
  );
};

export default InteractiveKeyboard;

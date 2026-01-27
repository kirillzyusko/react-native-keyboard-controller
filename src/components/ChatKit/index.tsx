import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  ScrollView,
  type ScrollViewProps,
  View,
} from "react-native";
import { useAnimatedProps, useAnimatedStyle } from "react-native-reanimated";

import { KeyboardEvents } from "../../bindings";
import { useKeyboardAnimation, useKeyboardState } from "../../hooks";
import useCombinedRef from "../hooks/useCombinedRef";

// import { useKeyboardAnimation } from "./hooks";

import type Reanimated from "react-native-reanimated";

export type ChatKitScrollViewProps = {
  //
} & ScrollViewProps;

const ChatScrollView = forwardRef<
  Reanimated.ScrollView,
  React.PropsWithChildren<ChatKitScrollViewProps>
>(({ children, ...rest }, ref) => {
  /*const { animatedRef, translateY, padding, offset, scroll } =
    useKeyboardAnimation();

  const onRef = useCombinedRef(ref, animatedRef);

  const s = useAnimatedStyle(
    () => ({
      // it'll deliver stable FPS on all devices
      // transform: [{ translateY: translateY.value }],
      // do a resize only once per animation cycle, not on every animation frame
      // paddingTop: padding.value,
    }),
    [],
  );

  const animatedProps = useAnimatedProps(
    () => ({
      contentOffset: {
        x: 0,
        y: offset.value + translateY.value,
      },
    }),
    [],
  );

  const s1 = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -translateY.value }],
      maxHeight: 600 - padding.value,
    }),
    [],
  );

  const s2 = useAnimatedStyle(
    () => ({
      maxHeight: 800 - padding.value,
    }),
    [],
  );

  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -translateY.value * 1 }],
    }),
    [],
  );
  const fakeView = useAnimatedStyle(
    () => ({
      height: padding.value,
    }),
    [],
  );*/

  const scrollViewRef = useRef(null);
  const { height } = useKeyboardAnimation();

  const [padding, setPadding] = useState(0);
  const [padding2, setPadding2] = useState(0);
  const [offset, setOffset] = useState(0);
  const keyboardHeightRef = useRef(0);

  useEffect(() => {
    const s1 = KeyboardEvents.addListener("keyboardDidShow", (e) => {
      setPadding2(0);
      setPadding(e.height);
      keyboardHeightRef.current = e.height;
    });
    const s2 = KeyboardEvents.addListener("keyboardDidHide", () => {
      setPadding2(keyboardHeightRef.current);
      setPadding(0);
      setTimeout(() => {
        setPadding2(0);
        setPadding(0);
      }, 16);
    });

    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateY: height }] }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        // ref={onRef}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 0,
        }}
        {...rest}
      >
        <View style={{ height: padding }} />
        {children}
      </Animated.ScrollView>
    </Animated.View>
  );
});

const ChatKit = {
  ScrollView: ChatScrollView,
};

export default ChatKit;

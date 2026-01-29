import React, { forwardRef } from "react";
import {
  scrollTo,
  useAnimatedRef,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import Reanimated from "react-native-reanimated";

import { useKeyboardHandler } from "../../hooks";
import useCombinedRef from "../hooks/useCombinedRef";
import ScrollViewWithBottomPadding from "../ScrollViewWithBottomPadding";

import type { AnimatedScrollViewComponent } from "../ScrollViewWithBottomPadding";
import type { ScrollViewProps } from "react-native";

// import { useKeyboardAnimation } from "./hooks";

export type ChatKitScrollViewProps = {
  ScrollViewComponent: AnimatedScrollViewComponent;
} & ScrollViewProps;

const ChatScrollView = forwardRef<
  Reanimated.ScrollView,
  React.PropsWithChildren<ChatKitScrollViewProps>
>(({ children, ScrollViewComponent = Reanimated.ScrollView, ...rest }, ref) => {
  /*const { animatedRef, translateY, padding, offset, scroll } =
    useKeyboardAnimation();

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

  const scrollViewRef = useAnimatedRef<Reanimated.ScrollView>();
  const offsetBeforeScroll = useSharedValue(0);
  const scroll = useScrollViewOffset(scrollViewRef);
  const onRef = useCombinedRef(ref, scrollViewRef);

  const spacer = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        if (e.height > 0) {
          // eslint-disable-next-line react-compiler/react-compiler
          offsetBeforeScroll.value = scroll.value;
          spacer.value = e.height;
        }
      },
      onMove: (e) => {
        "worklet";

        scrollTo(scrollViewRef, 0, offsetBeforeScroll.value + e.height, false);
      },
      onEnd: (e) => {
        "worklet";

        spacer.value = e.height;
      },
    },
    [],
  );

  return (
    <ScrollViewWithBottomPadding
      ref={onRef}
      {...rest}
      bottomPadding={spacer}
      ScrollViewComponent={ScrollViewComponent}
    >
      {children}
    </ScrollViewWithBottomPadding>
  );
});

const ChatKit = {
  ScrollView: ChatScrollView,
};

export default ChatKit;

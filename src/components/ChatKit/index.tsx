import React, { forwardRef } from "react";
import Reanimated, {
  scrollTo,
  useAnimatedProps,
  useAnimatedRef,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

import { ClippingScrollView } from "../../bindings";
import { useKeyboardHandler } from "../../hooks";
import useCombinedRef from "../hooks/useCombinedRef";

import type { ScrollViewProps } from "react-native";

// import { useKeyboardAnimation } from "./hooks";

export type ChatKitScrollViewProps = {
  //
} & ScrollViewProps;

const ReanimatedClippingScrollView =
  Reanimated.createAnimatedComponent(ClippingScrollView);

const ChatScrollView = forwardRef<
  Reanimated.ScrollView,
  React.PropsWithChildren<ChatKitScrollViewProps>
>(({ children, ...rest }, ref) => {
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

  const spacerStyle = useAnimatedProps(() => {
    return {
      contentInsetBottom: spacer.value,
    };
  }, []);

  return (
    <ReanimatedClippingScrollView animatedProps={spacerStyle}>
      <Reanimated.ScrollView ref={onRef} {...rest} style={{ paddingTop: 20 }}>
        {children}
      </Reanimated.ScrollView>
    </ReanimatedClippingScrollView>
  );
});

const ChatKit = {
  ScrollView: ChatScrollView,
};

export default ChatKit;

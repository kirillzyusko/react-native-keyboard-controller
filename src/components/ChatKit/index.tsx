import React, { forwardRef } from "react";
import Reanimated, {
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";

import useCombinedRef from "../hooks/useCombinedRef";

import { useKeyboardAnimation } from "./hooks";

import type { ScrollViewProps } from "react-native";

export type ChatKitScrollViewProps = {
  //
} & ScrollViewProps;

const ChatScrollView = forwardRef<
  Reanimated.ScrollView,
  React.PropsWithChildren<ChatKitScrollViewProps>
>(({ children, ...rest }, ref) => {
  const { animatedRef, translateY, padding, offset, scroll } =
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
      height: translateY.value,
    }),
    [],
  );

  return (
    <Reanimated.View style={}>
      <Reanimated.ScrollView ref={onRef} {...rest}>
        <Reanimated.View style={scrollViewStyle}>
          <Reanimated.View style={fakeView} />
          {children}
        </Reanimated.View>
      </Reanimated.ScrollView>
    </Reanimated.View>
  );
});

const ChatKit = {
  ScrollView: ChatScrollView,
};

export default ChatKit;

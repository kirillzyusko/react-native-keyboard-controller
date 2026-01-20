import React, { forwardRef, useCallback } from "react";
import Reanimated, {
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useKeyboardAnimation } from "./hooks";

import type { ScrollViewProps } from "react-native";

export type ChatKitScrollViewProps = {
  //
} & ScrollViewProps;

const ChatScrollView = forwardRef<
  Reanimated.ScrollView,
  React.PropsWithChildren<ChatKitScrollViewProps>
>(({ children, ...rest }, ref) => {
  const { animatedRef, translateY, padding, offset } = useKeyboardAnimation();

  const onRef = useCallback(
    (assignedRef: Reanimated.ScrollView) => {
      if (typeof ref === "function") {
        ref(assignedRef);
      } else if (ref) {
        ref.current = assignedRef;
      }

      animatedRef(assignedRef);
    },
    [animatedRef, ref],
  );

  const s = useAnimatedStyle(
    () => ({
      // it'll deliver stable FPS on all devices
      transform: [{ translateY: -translateY.value }],
      // do a resize only once per animation cycle, not on every animation frame
      paddingTop: padding.value,
    }),
    [],
  );

  const animatedProps = useAnimatedProps(
    () => ({
      contentOffset: {
        x: 0,
        y: offset.value,
      },
    }),
    [],
  );

  return (
    <Reanimated.ScrollView ref={onRef} {...rest} animatedProps={animatedProps}>
      <Reanimated.View style={s}>{children}</Reanimated.View>
    </Reanimated.ScrollView>
  );
});

const ChatKit = {
  ScrollView: ChatScrollView,
};

export default ChatKit;

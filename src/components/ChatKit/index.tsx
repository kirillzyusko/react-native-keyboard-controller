import React, { forwardRef } from "react";
import { useAnimatedRef, useAnimatedStyle } from "react-native-reanimated";
import Reanimated from "react-native-reanimated";

import useCombinedRef from "../hooks/useCombinedRef";
import ScrollViewWithBottomPadding from "../ScrollViewWithBottomPadding";

import { useChatKeyboard } from "./useChatKeyboard";

import type { ChatKitScrollViewProps } from "./types";

const ChatScrollView = forwardRef<
  Reanimated.ScrollView,
  React.PropsWithChildren<ChatKitScrollViewProps>
>(
  (
    {
      children,
      ScrollViewComponent = Reanimated.ScrollView,
      inverted = false,
      keyboardLiftBehavior = "always",
      freeze = false,
      ...rest
    },
    ref,
  ) => {
    const scrollViewRef = useAnimatedRef<Reanimated.ScrollView>();
    const onRef = useCombinedRef(ref, scrollViewRef);

    const { padding, contentOffsetY, containerTranslateY } = useChatKeyboard(
      scrollViewRef,
      { inverted, keyboardLiftBehavior, freeze },
    );

    const containerStyle = useAnimatedStyle(
      () => ({
        transform: [{ translateY: containerTranslateY.value }],
      }),
      [],
    );

    return (
      <ScrollViewWithBottomPadding
        ref={onRef}
        {...rest}
        bottomPadding={padding}
        containerStyle={containerStyle}
        contentOffsetY={contentOffsetY}
        inverted={inverted}
        ScrollViewComponent={ScrollViewComponent}
      >
        {children}
      </ScrollViewWithBottomPadding>
    );
  },
);

const ChatKit = {
  ScrollView: ChatScrollView,
};

export default ChatKit;

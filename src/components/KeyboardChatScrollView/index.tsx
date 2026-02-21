import React, { forwardRef } from "react";
import { View } from "react-native";
import { useAnimatedRef } from "react-native-reanimated";
import Reanimated from "react-native-reanimated";

import useCombinedRef from "../hooks/useCombinedRef";
import ScrollViewWithBottomPadding from "../ScrollViewWithBottomPadding";

import { useChatKeyboard } from "./useChatKeyboard";

import type { KeyboardChatScrollViewProps } from "./types";

const KeyboardChatScrollView = forwardRef<
  Reanimated.ScrollView,
  React.PropsWithChildren<KeyboardChatScrollViewProps>
>(
  (
    {
      children,
      ScrollViewComponent = Reanimated.ScrollView,
      inverted = false,
      keyboardLiftBehavior = "always",
      freeze = false,
      offset = 0,
      ...rest
    },
    ref,
  ) => {
    const scrollViewRef = useAnimatedRef<Reanimated.ScrollView>();
    const onRef = useCombinedRef(ref, scrollViewRef);

    const { padding, contentOffsetY } = useChatKeyboard(scrollViewRef, {
      inverted,
      keyboardLiftBehavior,
      freeze,
      offset,
    });

    return (
      <ScrollViewWithBottomPadding
        ref={onRef}
        {...rest}
        bottomPadding={padding}
        contentOffsetY={contentOffsetY}
        inverted={inverted}
        ScrollViewComponent={ScrollViewComponent}
      >
        {inverted ? (
          // The only thing it can break is `StickyHeader`, but it's already broken in FlatList and other lists
          // don't support this functionality, so we can add additional view here
          // The correct fix would be to add a new prop in ScrollView that allows
          // to customize children extraction logic and skip custom view
          <View collapsable={false} nativeID="container">
            {children}
          </View>
        ) : (
          children
        )}
      </ScrollViewWithBottomPadding>
    );
  },
);

export default KeyboardChatScrollView;

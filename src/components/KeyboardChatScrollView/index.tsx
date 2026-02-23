import React, { forwardRef, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAnimatedRef, useAnimatedStyle } from "react-native-reanimated";
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

    const { padding, currentHeight, contentOffsetY } = useChatKeyboard(
      scrollViewRef,
      {
        inverted,
        keyboardLiftBehavior,
        freeze,
        offset,
      },
    );

    // Invisible view whose animated style changes every frame during keyboard
    // animation. On Fabric, this forces Reanimated to schedule a commit,
    // which flushes the scrollTo call in the same frame (fixing desynchronization).
    // see https://github.com/software-mansion/react-native-reanimated/issues/9000
    const commitStyle = useAnimatedStyle(
      () => ({
        transform: [{ translateY: -currentHeight.value }],
      }),
      [],
    );
    const commit = useMemo(
      () => [styles.commitView, commitStyle],
      [commitStyle],
    );

    return (
      <>
        <ScrollViewWithBottomPadding
          ref={onRef}
          {...rest}
          bottomPadding={padding}
          contentOffsetY={contentOffsetY}
          inverted={inverted}
          ScrollViewComponent={ScrollViewComponent}
        >
          {children}
        </ScrollViewWithBottomPadding>
        <Reanimated.View style={commit} />
      </>
    );
  },
);

const styles = StyleSheet.create({
  commitView: {
    display: "none",
    position: "absolute",
  },
});

export default KeyboardChatScrollView;

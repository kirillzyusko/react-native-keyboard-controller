import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import {
  makeMutable,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import Reanimated from "react-native-reanimated";

import useCombinedRef from "../hooks/useCombinedRef";
import ScrollViewWithBottomPadding from "../ScrollViewWithBottomPadding";

import { useChatKeyboard } from "./useChatKeyboard";
import { useExtraContentPadding } from "./useExtraContentPadding";

import type { KeyboardChatScrollViewProps } from "./types";
import type { LayoutChangeEvent } from "react-native";

const ZERO_CONTENT_PADDING = makeMutable(0);
const ZERO_BLANK_SPACE = makeMutable(0);

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
      extraContentPadding = ZERO_CONTENT_PADDING,
      blankSpace = ZERO_BLANK_SPACE,
      applyWorkaroundForContentInsetHitTestBug = false,
      onLayout: onLayoutProp,
      onContentSizeChange: onContentSizeChangeProp,
      ...rest
    },
    ref,
  ) => {
    const scrollViewRef = useAnimatedRef<Reanimated.ScrollView>();
    const onRef = useCombinedRef(ref, scrollViewRef);
    const freezeSV = useDerivedValue(() =>
      typeof freeze === "boolean" ? freeze : freeze.value,
    );
    const {
      padding,
      currentHeight,
      contentOffsetY,
      scroll,
      layout,
      size,
      onLayout: onLayoutInternal,
      onContentSizeChange: onContentSizeChangeInternal,
    } = useChatKeyboard(scrollViewRef, {
      inverted,
      keyboardLiftBehavior,
      freeze: freezeSV,
      offset,
      blankSpace,
      extraContentPadding,
    });

    useExtraContentPadding({
      scrollViewRef,
      extraContentPadding,
      keyboardPadding: padding,
      blankSpace,
      scroll,
      layout,
      size,
      contentOffsetY,
      inverted,
      keyboardLiftBehavior,
      freeze: freezeSV,
    });

    const totalPadding = useDerivedValue(() =>
      Math.max(blankSpace.value, padding.value + extraContentPadding.value),
    );

    // Scroll indicator inset = keyboard + extraContentPadding (excludes blankSpace).
    // Apps that render into the unsafe area can supply a negative
    // scrollIndicatorInsets adjustment at the application layer.
    const indicatorPadding = useDerivedValue(
      () => padding.value + extraContentPadding.value,
    );

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        onLayoutInternal(e);
        onLayoutProp?.(e);
      },
      [onLayoutInternal, onLayoutProp],
    );

    const onContentSizeChange = useCallback(
      (w: number, h: number) => {
        onContentSizeChangeInternal(w, h);
        onContentSizeChangeProp?.(w, h);
      },
      [onContentSizeChangeInternal, onContentSizeChangeProp],
    );

    // Invisible view whose animated style changes every frame during keyboard
    // animation. On Fabric, this forces Reanimated to schedule a commit,
    // which flushes the scrollTo call in the same frame (fixing de-synchronization).
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
          applyWorkaroundForContentInsetHitTestBug={
            applyWorkaroundForContentInsetHitTestBug
          }
          bottomPadding={totalPadding}
          contentOffsetY={contentOffsetY}
          inverted={inverted}
          scrollIndicatorPadding={indicatorPadding}
          ScrollViewComponent={ScrollViewComponent}
          onContentSizeChange={onContentSizeChange}
          onLayout={onLayout}
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

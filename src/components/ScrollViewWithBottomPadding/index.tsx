import React, { forwardRef } from "react";
import { Platform, View } from "react-native";
import Reanimated, {
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";

import { ClippingScrollView } from "../../bindings";

import styles from "./styles";

import type { ScrollViewProps } from "react-native";
import type { SharedValue } from "react-native-reanimated";

const OS = Platform.OS;
const ReanimatedClippingScrollView =
  OS === "android"
    ? Reanimated.createAnimatedComponent(ClippingScrollView)
    : ClippingScrollView;

type AnimatedScrollViewProps = React.ComponentProps<
  typeof Reanimated.ScrollView
>;

export type AnimatedScrollViewComponent = React.ForwardRefExoticComponent<
  AnimatedScrollViewProps & React.RefAttributes<Reanimated.ScrollView>
>;

type ScrollViewWithBottomPaddingProps = {
  ScrollViewComponent: AnimatedScrollViewComponent;
  children?: React.ReactNode;
  inverted?: boolean;
  bottomPadding: SharedValue<number>;
  /** Absolute Y content offset (iOS only, for KeyboardChatScrollView). */
  contentOffsetY?: SharedValue<number>;
} & ScrollViewProps;

const ScrollViewWithBottomPadding = forwardRef<
  Reanimated.ScrollView,
  ScrollViewWithBottomPaddingProps
>(
  (
    {
      ScrollViewComponent,
      bottomPadding,
      contentInset,
      scrollIndicatorInsets,
      inverted,
      contentOffsetY,
      children,
      ...rest
    },
    ref,
  ) => {
    const prevContentOffsetY = useSharedValue<number | null>(null);

    const animatedProps = useAnimatedProps(() => {
      const insetTop = inverted ? bottomPadding.value : 0;
      const insetBottom = !inverted ? bottomPadding.value : 0;
      const bottom = insetBottom + (contentInset?.bottom || 0);
      const top = insetTop + (contentInset?.top || 0);

      const result: Record<string, unknown> = {
        // iOS prop
        contentInset: {
          bottom: bottom,
          top: top,
          right: contentInset?.right,
          left: contentInset?.left,
        },
        scrollIndicatorInsets: {
          bottom: bottom,
          top: top,
          right: scrollIndicatorInsets?.right,
          left: scrollIndicatorInsets?.left,
        },
        // Android prop
        contentInsetBottom: insetBottom,
        contentInsetTop: insetTop,
      };

      if (contentOffsetY) {
        const curr = contentOffsetY.value;

        if (curr !== prevContentOffsetY.value) {
          // eslint-disable-next-line react-compiler/react-compiler
          prevContentOffsetY.value = curr;
          result.contentOffset = { x: 0, y: curr };
        }
      }

      return result;
    }, [
      contentInset?.bottom,
      contentInset?.top,
      contentInset?.right,
      contentInset?.left,
      scrollIndicatorInsets?.bottom,
      scrollIndicatorInsets?.top,
      scrollIndicatorInsets?.right,
      scrollIndicatorInsets?.left,
      inverted,
      contentOffsetY,
    ]);

    return (
      <ReanimatedClippingScrollView
        animatedProps={animatedProps}
        style={styles.container}
      >
        <ScrollViewComponent ref={ref} animatedProps={animatedProps} {...rest}>
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
        </ScrollViewComponent>
      </ReanimatedClippingScrollView>
    );
  },
);

export default ScrollViewWithBottomPadding;

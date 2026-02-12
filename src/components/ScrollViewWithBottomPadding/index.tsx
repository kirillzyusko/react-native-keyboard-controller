import React, { forwardRef } from "react";
import { Platform } from "react-native";
import Reanimated, { useAnimatedProps } from "react-native-reanimated";

import { ClippingScrollView } from "../../bindings";

import styles from "./styles";

import type { ScrollViewProps, StyleProp, ViewStyle } from "react-native";
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
  /** Absolute Y content offset (iOS only, for ChatKit). */
  contentOffsetY?: SharedValue<number>;
  /** Style applied to the container wrapper (Android only, for ChatKit translateY). */
  containerStyle?: StyleProp<ViewStyle>;
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
      containerStyle,
      children,
      style,
      ...rest
    },
    ref,
  ) => {
    const animatedProps = useAnimatedProps(() => {
      const bottom = inverted
        ? 0
        : bottomPadding.value + (contentInset?.bottom || 0);
      const top = !inverted
        ? 0
        : bottomPadding.value + (contentInset?.top || 0);

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
        contentInsetBottom: bottomPadding.value,
      };

      if (contentOffsetY) {
        result.contentOffset = { x: 0, y: contentOffsetY.value };
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
        style={[
          styles.container,
          OS === "android" ? containerStyle : undefined,
        ]}
      >
        <ScrollViewComponent
          ref={ref}
          animatedProps={animatedProps}
          style={style}
          {...rest}
        >
          {children}
        </ScrollViewComponent>
      </ReanimatedClippingScrollView>
    );
  },
);

export default ScrollViewWithBottomPadding;

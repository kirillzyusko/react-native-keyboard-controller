import React, { forwardRef } from "react";
import { Platform } from "react-native";
import Reanimated, { useAnimatedProps } from "react-native-reanimated";

import { ClippingScrollView } from "../../bindings";

import styles from "./styles";

import type { ScrollViewProps } from "react-native";
import type { SharedValue } from "react-native-reanimated";

const ReanimatedClippingScrollView =
  Platform.OS === "android"
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

      return {
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
        contentInsetBottom: inverted ? 0 : bottomPadding.value,
      };
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
    ]);

    return (
      <ReanimatedClippingScrollView
        animatedProps={animatedProps}
        style={styles.container}
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

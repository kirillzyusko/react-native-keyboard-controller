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
  bottomPadding: SharedValue<number>;
} & ScrollViewProps;

const ScrollViewWithBottomPadding = forwardRef<
  Reanimated.ScrollView,
  ScrollViewWithBottomPaddingProps
>(
  (
    { ScrollViewComponent, bottomPadding, contentInset, children, ...rest },
    ref,
  ) => {
    const animatedProps = useAnimatedProps(
      () => ({
        // iOS prop
        contentInset: {
          bottom: bottomPadding.value + (contentInset?.bottom || 0),
          top: contentInset?.top,
          right: contentInset?.right,
          left: contentInset?.left,
        },
        // Android prop
        contentInsetBottom: bottomPadding.value,
      }),
      [
        contentInset?.bottom,
        contentInset?.top,
        contentInset?.right,
        contentInset?.left,
      ],
    );

    return (
      <ReanimatedClippingScrollView
        animatedProps={animatedProps}
        style={styles.container}
      >
        <ScrollViewComponent ref={ref} animatedProps={animatedProps} {...rest}>
          {children}
        </ScrollViewComponent>
      </ReanimatedClippingScrollView>
    );
  },
);

export default ScrollViewWithBottomPadding;

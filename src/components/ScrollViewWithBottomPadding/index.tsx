import React, { forwardRef } from "react";
import { Platform } from "react-native";
import Reanimated, { useAnimatedProps } from "react-native-reanimated";

import { ClippingScrollView } from "../../bindings";

import styles from "./styles";

import type { ScrollView, ScrollViewProps } from "react-native";
import type { SharedValue } from "react-native-reanimated";

const ReanimatedClippingScrollView =
  Platform.OS === "android"
    ? Reanimated.createAnimatedComponent(ClippingScrollView)
    : ClippingScrollView;

type Props = {
  ScrollViewComponent: React.ComponentType<ScrollViewProps>;
  children?: React.ReactNode;
  bottomPadding: SharedValue<number>;
} & ScrollViewProps;

const ScrollViewWithBottomPadding = forwardRef<
  ScrollView,
  React.PropsWithChildren<Props>
>(({ ScrollViewComponent, bottomPadding, children, ...rest }: Props, ref) => {
  const animatedProps = useAnimatedProps(
    () => ({
      // iOS prop
      contentInset: {
        bottom: bottomPadding.value,
      },
      // Android prop
      contentInsetBottom: bottomPadding.value,
    }),
    [],
  );

  return (
    <ReanimatedClippingScrollView
      animatedProps={animatedProps}
      style={styles.container}
    >
      <ScrollViewComponent
        // @ts-expect-error TODO: Please FIXME later
        ref={ref}
        animatedProps={animatedProps}
        {...rest}
      >
        {children}
      </ScrollViewComponent>
    </ReanimatedClippingScrollView>
  );
});

export default ScrollViewWithBottomPadding;

import React, { useMemo } from "react";
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";

import useColorScheme from "../hooks/useColorScheme";

import type { KeyboardToolbarTheme } from "./types";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type ButtonProps = {
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID: string;
  rippleRadius?: number;
  style?: ViewStyle;
  theme: KeyboardToolbarTheme;
};

const ButtonIOS = ({
  children,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: PropsWithChildren<ButtonProps>) => {
  // immediately switch to plain view to avoid animation flickering
  // when fade out animation happens and view becomes disabled
  const Container = disabled
    ? (View as unknown as typeof TouchableOpacity)
    : TouchableOpacity;
  const accessibilityState = useMemo(() => ({ disabled }), [disabled]);

  return (
    <Container
      accessibilityState={accessibilityState}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={style}
      testID={testID}
    >
      {children}
    </Container>
  );
};
const ButtonAndroid = ({
  children,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
  rippleRadius = 18,
  style,
  theme,
}: PropsWithChildren<ButtonProps>) => {
  const colorScheme = useColorScheme();
  const accessibilityState = useMemo(() => ({ disabled }), [disabled]);
  const ripple = useMemo(
    () =>
      TouchableNativeFeedback.Ripple(
        theme[colorScheme].ripple,
        true,
        rippleRadius,
      ),
    [colorScheme, rippleRadius, theme],
  );

  return (
    <TouchableNativeFeedback
      accessibilityState={accessibilityState}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      background={ripple}
      testID={testID}
      style={style}
    >
      <View style={style}>{children}</View>
    </TouchableNativeFeedback>
  );
};

export default Platform.select({
  android: ButtonAndroid,
  default: ButtonIOS,
});

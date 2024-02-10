import React, { useMemo } from "react";
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";

import useColorScheme from "../hooks/useColorScheme";

import { colors } from "./colors";

import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID: string;
  rippleRadius?: number;
  style?: ViewStyle;
};

const ButtonIOS = ({
  children,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: PropsWithChildren<Props>) => {
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
}: PropsWithChildren<Props>) => {
  const theme = useColorScheme();
  const accessibilityState = useMemo(() => ({ disabled }), [disabled]);
  const ripple = useMemo(
    () =>
      TouchableNativeFeedback.Ripple(colors[theme].ripple, true, rippleRadius),
    [theme, rippleRadius],
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

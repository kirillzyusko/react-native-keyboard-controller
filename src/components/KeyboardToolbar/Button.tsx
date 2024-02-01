import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import type { PropsWithChildren } from "react";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID: string;
};

const Button = ({
  children,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: PropsWithChildren<Props>) => {
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
      testID={testID}
    >
      {children}
    </Container>
  );
};

export default Button;

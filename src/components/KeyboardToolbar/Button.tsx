import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import type { PropsWithChildren } from "react";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint: string;
};

const Button = ({
  children,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
}: PropsWithChildren<Props>) => {
  const Container = disabled ? View : TouchableOpacity;
  const accessibilityState = useMemo(() => ({ disabled }), [disabled]);

  return (
    <Container
      accessibilityState={accessibilityState}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
    >
      {children}
    </Container>
  );
};

export default Button;

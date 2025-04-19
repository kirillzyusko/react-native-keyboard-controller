import React from "react";
import { Platform, View } from "react-native";

import { RCTKeyboardExtender } from "../../bindings";
import { useWindowDimensions } from "../../hooks";

import type { KeyboardExtenderProps } from "../../types";
import type { PropsWithChildren } from "react";

// TODO: should be in views because on Android we gonna use KeyboardStickyView?
const KeyboardExtender = ({
  children,
  enabled = false,
}: PropsWithChildren<KeyboardExtenderProps>) => {
  const { width } = useWindowDimensions();

  // iOS-only component
  if (Platform.OS !== "ios") {
    return <>{children}</>;
  }

  return (
    <RCTKeyboardExtender enabled={enabled}>
      <View style={{ width }}>{children}</View>
    </RCTKeyboardExtender>
  );
};

export default KeyboardExtender;

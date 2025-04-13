import React from "react";
import { Platform } from "react-native";

import { RCTKeyboardExtender } from "../../bindings";

import type { KeyboardExtenderProps } from "../../types";
import type { PropsWithChildren } from "react";

// TODO: should be in views because on Android we gonna use KeyboardStickyView?
const KeyboardExtender = ({
  children,
  enabled = false,
}: PropsWithChildren<KeyboardExtenderProps>) => {
  // iOS-only component
  if (Platform.OS !== "ios") {
    return <>{children}</>;
  }

  return (
    <RCTKeyboardExtender enabled={enabled}>{children}</RCTKeyboardExtender>
  );
};

export default KeyboardExtender;

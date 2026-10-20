import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { Platform, useWindowDimensions } from "react-native";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";

export default function KeyboardAnimation() {
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  // Modern iOS stacks subtract an extra top inset from the content height.
  // Paper keeps that space below its content, partly under the landscape tabs.
  const bottomInset =
    Platform.OS === "ios" && width > height
      ? Math.max(headerHeight - 54, 0)
      : 0;

  return <KeyboardAnimationTemplate style={{ marginBottom: -bottomInset }} />;
}

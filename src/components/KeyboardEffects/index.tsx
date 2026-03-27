import React, { forwardRef, useMemo } from "react";
import { Platform, StyleSheet, View as RNView } from "react-native";

import KeyboardStickyView from "../KeyboardStickyView";

import type { KeyboardStickyViewProps } from "../KeyboardStickyView";
import type { View } from "react-native";

const KEYBOARD_HAS_ROUNDED_CORNERS =
  Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 26;

export type KeyboardEffectsProps = KeyboardStickyViewProps;

/**
 * A component that renders content behind the keyboard. Since the keyboard
 * is translucent, the content (colors, gradients, animations) will blend
 * through and create visual effects on the keyboard.
 *
 * On iOS 26+ the keyboard has rounded corners, and the effect view
 * automatically matches that shape.
 *
 * @returns A view component positioned behind the keyboard.
 * @example
 * ```tsx
 * <KeyboardEffects>
 *   <View style={{ flex: 1, backgroundColor: "purple" }} />
 * </KeyboardEffects>
 * ```
 */
const KeyboardEffects = forwardRef<
  View,
  React.PropsWithChildren<KeyboardEffectsProps>
>(({ children, ...props }, ref) => {
  const containerStyle = useMemo(
    () => [styles.container, KEYBOARD_HAS_ROUNDED_CORNERS && styles.rounded],
    [],
  );

  return (
    <KeyboardStickyView ref={ref} {...props}>
      <RNView style={containerStyle}>{children}</RNView>
    </KeyboardStickyView>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    height: 999,
  },
  rounded: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
});

export default KeyboardEffects;

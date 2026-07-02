import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { View as RNView, StyleSheet } from "react-native";

import { KEYBOARD_BORDER_RADIUS } from "../../constants";
import { KeyboardController } from "../../module";
import KeyboardStickyView from "../KeyboardStickyView";

import type { KeyboardStickyViewProps } from "../KeyboardStickyView";
import type { View } from "react-native";

export const KEYBOARD_HAS_ROUNDED_CORNERS = KEYBOARD_BORDER_RADIUS > 0;
const translucentEffectTokens = new Set<symbol>();

const setTranslucentForToken = (token: symbol, enabled: boolean) => {
  const hadToken = translucentEffectTokens.has(token);

  if (enabled) {
    translucentEffectTokens.add(token);
  } else {
    translucentEffectTokens.delete(token);
  }

  if (hadToken !== enabled) {
    KeyboardController.setTranslucent(translucentEffectTokens.size > 0);
  }
};

export type KeyboardEffectsProps = {
  /**
   * Whether the keyboard backdrop should be translucent.
   *
   * @default false
   */
  translucent?: boolean;
} & KeyboardStickyViewProps;

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
>(({ translucent, children, ...props }, ref) => {
  const translucentToken = useRef(Symbol("KeyboardEffects"));
  const containerStyle = useMemo(
    () => [
      styles.container,
      KEYBOARD_HAS_ROUNDED_CORNERS && !translucent && styles.rounded,
    ],
    [translucent],
  );

  useEffect(() => {
    setTranslucentForToken(translucentToken.current, Boolean(translucent));

    return () => {
      setTranslucentForToken(translucentToken.current, false);
    };
  }, [translucent]);

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
    borderTopLeftRadius: KEYBOARD_BORDER_RADIUS,
    borderTopRightRadius: KEYBOARD_BORDER_RADIUS,
    overflow: "hidden",
  },
});

export default KeyboardEffects;

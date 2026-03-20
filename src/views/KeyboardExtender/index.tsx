import React from "react";
import { Animated } from "react-native";

import { KeyboardBackgroundView } from "../../bindings";
import { KeyboardStickyView } from "../../components";
import { useKeyboardAnimation } from "../../hooks";

import type { KeyboardExtenderProps } from "../../types";
import type { PropsWithChildren } from "react";

const AnimatedKeyboardBackgroundView = Animated.createAnimatedComponent(
  KeyboardBackgroundView,
);

/**
 * A component that embeds its children into the keyboard thus enhancing keyboard functionality.
 *
 * @param props - Component props.
 * @returns A view component that renders inside the keyboard above all system buttons.
 * @example
 * ```tsx
 * <KeyboardExtender>
 *   <Button>10$</Button>
 *   <Button>20$</Button>
 *   <Button>50$</Button>
 * </KeyboardExtender>
 * ```
 */
const KeyboardExtender = (props: PropsWithChildren<KeyboardExtenderProps>) => {
  const { children, enabled = true } = props;
  const { progress } = useKeyboardAnimation();

  return (
    <KeyboardStickyView enabled={enabled}>
      <AnimatedKeyboardBackgroundView style={{ opacity: progress }}>
        {children}
      </AnimatedKeyboardBackgroundView>
    </KeyboardStickyView>
  );
};

export default KeyboardExtender;

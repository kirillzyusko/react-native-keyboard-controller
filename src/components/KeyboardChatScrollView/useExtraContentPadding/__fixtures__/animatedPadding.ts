import { sv } from "../../../../__fixtures__/sv";

import { createRender, reactionEffect } from "./setup";

import type { KeyboardLiftBehavior } from "../../useChatKeyboard/types";
import type { SharedValue } from "react-native-reanimated";

export type Padding = SharedValue<number> & {
  _animation?: { finished?: boolean } | null;
};

type SetupOptions = {
  scroll: number;
  padding?: number;
  keyboardPadding?: number;
  inverted?: boolean;
  keyboardLiftBehavior?: KeyboardLiftBehavior;
  size?: number;
};

// Renders the hook on the iOS (`contentOffsetY`) path and returns helpers
// that mimic how Reanimated drives `extraContentPadding`.
export const setupAnimatedPadding = ({
  scroll: initialScroll,
  padding: initialPadding = 0,
  keyboardPadding = 0,
  inverted = false,
  keyboardLiftBehavior = "always",
  size = 2000,
}: SetupOptions) => {
  const padding = sv(initialPadding) as Padding;
  const scroll = sv(initialScroll);
  const contentOffsetY = sv(initialScroll);
  const freeze = sv(false);

  padding._animation = null;

  createRender()({
    extraContentPadding: padding,
    keyboardPadding: sv(keyboardPadding),
    scroll,
    layout: sv({ width: 390, height: 800 }),
    size: sv({ width: 390, height: size }),
    contentOffsetY,
    inverted,
    keyboardLiftBehavior,
    freeze,
  });

  return {
    padding,
    scroll,
    contentOffsetY,
    freeze,
    // `padding.value = withTiming(...)`: Reanimated creates a new animation object
    startAnimation: () => {
      padding._animation = {};
    },
    // `padding.value = 10`: Reanimated resets `_animation` to `null`
    setWithoutAnimation: () => {
      padding._animation = null;
    },
    // one frame: padding gets a new value and the reaction runs
    frame: (value: number) => {
      const previous = padding.value;

      padding.value = value;
      reactionEffect(value, previous);
    },
  };
};

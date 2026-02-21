import { useSharedValue } from "react-native-reanimated";

import { useKeyboardHandler } from "../../../hooks";
import useScrollState from "../../hooks/useScrollState";

import {
  computeIOSContentOffset,
  getEffectiveHeight,
  isScrollAtEnd,
  shouldShiftContent,
} from "./helpers";

import type { UseChatKeyboardOptions, UseChatKeyboardReturn } from "./types";
import type { AnimatedRef } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

/**
 * Hook that manages keyboard-driven scrolling for chat-style scroll views.
 * Calculates padding (extra scrollable space) and content shift values,
 * using iOS-specific strategy (contentOffset set once in onStart).
 *
 * @param scrollViewRef - Animated ref to the scroll view.
 * @param options - Configuration for inverted and keyboardLiftBehavior.
 * @returns Shared values for padding and contentOffsetY.
 * @example
 * ```tsx
 * const { padding, contentOffsetY } = useChatKeyboard(ref, {
 *   inverted: false,
 *   keyboardLiftBehavior: "always",
 * });
 * ```
 */
function useChatKeyboard(
  scrollViewRef: AnimatedRef<Reanimated.ScrollView>,
  options: UseChatKeyboardOptions,
): UseChatKeyboardReturn {
  const { inverted, keyboardLiftBehavior, freeze, offset } = options;

  const padding = useSharedValue(0);
  const contentOffsetY = useSharedValue(0);
  const targetKeyboardHeight = useSharedValue(0);

  const { layout, size, offset: scroll } = useScrollState(scrollViewRef);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        if (freeze) {
          return;
        }

        if (e.height > 0) {
          // eslint-disable-next-line react-compiler/react-compiler
          targetKeyboardHeight.value = e.height;
        }

        const effective = getEffectiveHeight(
          e.height,
          targetKeyboardHeight.value,
          offset,
        );

        const atEnd = isScrollAtEnd(
          scroll.value,
          layout.value.height,
          size.value.height,
          inverted,
        );

        // persistent mode: when keyboard shrinks, snap to end or hold position
        if (
          keyboardLiftBehavior === "persistent" &&
          effective < padding.value
        ) {
          padding.value = effective;

          if (atEnd) {
            if (inverted) {
              contentOffsetY.value = -effective;
            } else {
              contentOffsetY.value = Math.max(
                size.value.height - layout.value.height + effective,
                0,
              );
            }
          } else {
            // Preserve current scroll position so the animated props
            // don't re-apply the stale contentOffset from keyboard open
            contentOffsetY.value = scroll.value;
          }

          return;
        }

        const relativeScroll = inverted
          ? scroll.value + padding.value
          : scroll.value - padding.value;

        padding.value = effective;

        if (!shouldShiftContent(keyboardLiftBehavior, atEnd)) {
          return;
        }

        contentOffsetY.value = computeIOSContentOffset(
          relativeScroll,
          effective,
          size.value.height,
          layout.value.height,
          inverted,
        );
      },
      onMove: () => {
        "worklet";

        // iOS doesn't need per-frame updates (contentOffset handles it)
      },
      onEnd: (e) => {
        "worklet";

        if (freeze) {
          return;
        }

        const effective = getEffectiveHeight(
          e.height,
          targetKeyboardHeight.value,
          offset,
        );

        padding.value = effective;
      },
    },
    [inverted, keyboardLiftBehavior, freeze, offset],
  );

  return {
    padding,
    contentOffsetY,
  };
}

export { useChatKeyboard };

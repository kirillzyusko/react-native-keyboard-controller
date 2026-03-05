import { useSharedValue } from "react-native-reanimated";

import { useKeyboardHandler } from "../../../hooks";
import useScrollState from "../../hooks/useScrollState";

import {
  computeIOSContentOffset,
  getBlankAbsorbed,
  getEffectiveHeight,
  getScrollEffective,
  getVisibleBlankFraction,
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
  const {
    inverted,
    keyboardLiftBehavior,
    freeze,
    offset,
    blankSize,
    extraContentPadding,
  } = options;

  const padding = useSharedValue(0);
  const currentHeight = useSharedValue(0);
  const contentOffsetY = useSharedValue(0);
  const targetKeyboardHeight = useSharedValue(0);

  const {
    layout,
    size,
    offset: scroll,
    onLayout,
    onContentSizeChange,
  } = useScrollState(scrollViewRef);

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

        // Scale blank absorption by how much of the blank is visible.
        // Fully visible → full absorption; fully off-screen → no absorption.
        const visibleFraction = getVisibleBlankFraction(
          scroll.value,
          layout.value.height,
          size.value.height,
          blankSize.value,
          inverted,
        );
        const blankAbsorbed =
          visibleFraction >= 1
            ? getBlankAbsorbed(blankSize.value, extraContentPadding.value)
            : 0;
        const scrollEff = getScrollEffective(effective, blankAbsorbed);
        const actualTotalPadding = Math.max(
          blankSize.value,
          effective + extraContentPadding.value,
        );

        // persistent mode: when keyboard shrinks, snap to end or hold position
        if (
          keyboardLiftBehavior === "persistent" &&
          effective < padding.value
        ) {
          padding.value = effective;

          if (atEnd) {
            if (inverted) {
              contentOffsetY.value = -actualTotalPadding;
            } else {
              contentOffsetY.value = Math.max(
                size.value.height - layout.value.height + actualTotalPadding,
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

        // never mode: when keyboard shrinks and at end, snap to end
        // to avoid ghost padding
        if (
          keyboardLiftBehavior === "never" &&
          effective < padding.value &&
          atEnd
        ) {
          padding.value = effective;

          if (inverted) {
            contentOffsetY.value = -actualTotalPadding;
          } else {
            contentOffsetY.value = Math.max(
              size.value.height - layout.value.height + actualTotalPadding,
              0,
            );
          }

          return;
        }

        // Undo only the scroll displacement that was actually applied
        // (not the full padding, which includes blank-absorbed portion)
        const prevScrollEff = getScrollEffective(padding.value, blankAbsorbed);
        const relativeScroll = inverted
          ? scroll.value + prevScrollEff
          : scroll.value - prevScrollEff;

        padding.value = effective;

        if (!shouldShiftContent(keyboardLiftBehavior, atEnd)) {
          // Preserve current scroll position so animated props
          // don't re-apply a stale contentOffset when padding changes
          contentOffsetY.value = scroll.value;

          return;
        }

        // When blankSize fully absorbs the keyboard opening, preserve current scroll position
        // (only when keyboard is open — effective > 0 — not when closing)
        if (scrollEff === 0 && blankAbsorbed > 0 && effective > 0) {
          contentOffsetY.value = scroll.value;

          return;
        }

        contentOffsetY.value = computeIOSContentOffset(
          relativeScroll,
          scrollEff,
          size.value.height,
          layout.value.height,
          inverted,
          actualTotalPadding,
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
    [inverted, keyboardLiftBehavior, freeze, offset, extraContentPadding],
  );

  return {
    padding,
    currentHeight,
    contentOffsetY,
    scroll,
    layout,
    size,
    onLayout,
    onContentSizeChange,
  };
}

export { useChatKeyboard };

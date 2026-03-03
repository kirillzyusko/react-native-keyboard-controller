import { scrollTo, useSharedValue } from "react-native-reanimated";

import { useKeyboardHandler } from "../../../hooks";
import useScrollState from "../../hooks/useScrollState";

import {
  clampedScrollTarget,
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
 * using per-frame scrollTo updates (Android and other platforms).
 *
 * @param scrollViewRef - Animated ref to the scroll view.
 * @param options - Configuration for inverted and keyboardLiftBehavior.
 * @returns Shared values for padding and contentOffsetY (always `undefined`).
 * @example
 * ```tsx
 * const { padding } = useChatKeyboard(ref, { inverted: false, keyboardLiftBehavior: "always" });
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
  const offsetBeforeScroll = useSharedValue(0);
  const targetKeyboardHeight = useSharedValue(0);
  const closing = useSharedValue(false);
  const blankFractionOnOpen = useSharedValue(0);
  const {
    layout,
    size,
    offset: scroll,
    onLayout,
    onContentSizeChange,
  } = useScrollState(scrollViewRef);
  const clampScrollIfNeeded = (
    effective: number,
    totalPaddingForMaxScroll?: number,
  ) => {
    "worklet";

    const paddingForMax =
      totalPaddingForMaxScroll !== undefined
        ? totalPaddingForMaxScroll
        : effective;
    const maxScroll = Math.max(
      size.value.height - layout.value.height + paddingForMax,
      0,
    );

    if (scroll.value > maxScroll) {
      scrollTo(scrollViewRef, 0, maxScroll, false);
    }
  };

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
          closing.value = false;
        } else {
          closing.value = true;
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
          getBlankAbsorbed(blankSize.value, extraContentPadding.value) *
          visibleFraction;
        const scrollEff = getScrollEffective(effective, blankAbsorbed);

        if (inverted && e.duration === -1) {
          // Android inverted: skip post-interactive snap-back events
          // (duration === -1 means the keyboard is re-establishing its
          // position after an interactive gesture, not a real animation)
          return;
        } else if (e.height > 0) {
          // Android: keyboard opening — set padding + capture scroll position
          blankFractionOnOpen.value = visibleFraction;
          padding.value = effective;
          offsetBeforeScroll.value = scroll.value;

          if (!inverted && keyboardLiftBehavior === "whenAtEnd" && !atEnd) {
            // Sentinel: don't scroll in onMove (non-inverted only)
            offsetBeforeScroll.value = -1;
          } else if (!inverted && scrollEff === 0) {
            // blankSize fully absorbs the keyboard — prevent scroll
            offsetBeforeScroll.value = -1;
          } else if (inverted && scrollEff === 0) {
            // blankSize fully absorbs the keyboard — guard for inverted
            offsetBeforeScroll.value = scroll.value;
          }
        } else {
          // Android: keyboard closing — re-capture scroll position
          if (inverted) {
            offsetBeforeScroll.value = scroll.value;
          } else {
            // Preserve "whenAtEnd" sentinel: if open didn't shift, close shouldn't either
            if (offsetBeforeScroll.value !== -1) {
              // Non-inverted: undo only the actual scroll displacement
              // (accounting for blank absorption at open time)
              const prevBlankAbsorbed =
                getBlankAbsorbed(blankSize.value, extraContentPadding.value) *
                blankFractionOnOpen.value;
              const prevScrollEff = getScrollEffective(
                padding.value,
                prevBlankAbsorbed,
              );

              offsetBeforeScroll.value = scroll.value - prevScrollEff;
            }
          }
        }
      },
      onMove: (e) => {
        "worklet";

        if (freeze) {
          return;
        }

        currentHeight.value = e.height;

        if (inverted) {
          // Skip post-interactive snap-back (duration === -1)
          if (e.duration === -1) {
            return;
          }

          const effective = getEffectiveHeight(
            e.height,
            targetKeyboardHeight.value,
            offset,
          );

          const blankAbsorbed =
            getBlankAbsorbed(blankSize.value, extraContentPadding.value) *
            blankFractionOnOpen.value;
          const scrollEff = getScrollEffective(effective, blankAbsorbed);
          const actualTotalPadding = Math.max(
            blankSize.value,
            effective + extraContentPadding.value,
          );

          // Check if we should shift content based on position when keyboard started
          const wasAtEnd = isScrollAtEnd(
            offsetBeforeScroll.value,
            layout.value.height,
            size.value.height,
            inverted,
          );

          // "never" at end: scroll along when keyboard closes to avoid jump
          if (
            keyboardLiftBehavior === "never" &&
            wasAtEnd &&
            effective < padding.value
          ) {
            padding.value = effective;

            if (scrollEff === 0 && blankAbsorbed > 0) {
              return;
            }

            scrollTo(scrollViewRef, 0, 0, false);

            return;
          }

          if (!shouldShiftContent(keyboardLiftBehavior, wasAtEnd)) {
            // Closing, not shifting: reduce padding to avoid gap
            if (closing.value && effective < padding.value) {
              padding.value = effective;
              clampScrollIfNeeded(effective, actualTotalPadding);
            }

            return;
          }

          // When blankSize fully absorbs the keyboard, skip scroll
          if (scrollEff === 0 && blankAbsorbed > 0) {
            return;
          }

          // Persistent: don't let shift decrease
          if (keyboardLiftBehavior === "persistent") {
            const currentShift =
              offsetBeforeScroll.value + padding.value - scroll.value;

            if (effective < currentShift) {
              // When at end, allow scrolling back (snap to end + reduce padding)
              if (wasAtEnd) {
                padding.value = effective;
                scrollTo(scrollViewRef, 0, 0, false);
              } else if (closing.value) {
                // Not at end: reduce padding to avoid gap
                padding.value = effective;
                clampScrollIfNeeded(effective, actualTotalPadding);
              }

              return;
            }
          }

          const target = offsetBeforeScroll.value + padding.value - scrollEff;

          scrollTo(scrollViewRef, 0, target, false);
        } else {
          const effective = getEffectiveHeight(
            e.height,
            targetKeyboardHeight.value,
            offset,
          );

          const blankAbsorbed =
            getBlankAbsorbed(blankSize.value, extraContentPadding.value) *
            blankFractionOnOpen.value;
          const scrollEff = getScrollEffective(effective, blankAbsorbed);
          const actualTotalPadding = Math.max(
            blankSize.value,
            effective + extraContentPadding.value,
          );

          // "never" closing: clamp scroll to valid range as inset shrinks
          if (
            keyboardLiftBehavior === "never" &&
            closing.value &&
            effective < padding.value
          ) {
            clampScrollIfNeeded(effective, actualTotalPadding);

            return;
          }

          if (!shouldShiftContent(keyboardLiftBehavior, true)) {
            return;
          }

          // "whenAtEnd" sentinel check (also used for blankSize full absorption)
          if (offsetBeforeScroll.value === -1) {
            if (closing.value) {
              // Keyboard didn't shift on open; ensure valid position on close
              clampScrollIfNeeded(effective, actualTotalPadding);
            }

            return;
          }

          // "persistent" closing: maintain position, clamped to valid range
          if (keyboardLiftBehavior === "persistent" && closing.value) {
            const keepAt = offsetBeforeScroll.value + padding.value;
            const maxScroll = Math.max(
              size.value.height - layout.value.height + actualTotalPadding,
              0,
            );

            scrollTo(scrollViewRef, 0, Math.min(keepAt, maxScroll), false);

            return;
          }

          const target = clampedScrollTarget(
            offsetBeforeScroll.value,
            scrollEff,
            size.value.height,
            layout.value.height,
            actualTotalPadding,
          );

          scrollTo(scrollViewRef, 0, target, false);
        }
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
    currentHeight,
    contentOffsetY: undefined,
    scroll,
    layout,
    size,
    onLayout,
    onContentSizeChange,
  };
}

export { useChatKeyboard };

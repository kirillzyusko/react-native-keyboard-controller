import { scrollTo, useSharedValue } from "react-native-reanimated";

import { useKeyboardHandler } from "../../../hooks";
import useScrollState from "../../hooks/useScrollState";

import {
  clampedScrollTarget,
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
 * using per-frame scrollTo updates (Android and other platforms).
 *
 * @param scrollViewRef - Animated ref to the scroll view.
 * @param options - Configuration for inverted and keyboardLiftBehavior.
 * @returns Shared values for padding and contentOffsetY (always `undefined`).
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
  const offsetBeforeScroll = useSharedValue(0);
  const targetKeyboardHeight = useSharedValue(0);
  const closing = useSharedValue(false);

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

        if (inverted && e.duration === -1) {
          // Android inverted: skip post-interactive snap-back events
          // (duration === -1 means the keyboard is re-establishing its
          // position after an interactive gesture, not a real animation)
          return;
        } else if (e.height > 0) {
          // Android: keyboard opening — set padding + capture scroll position
          padding.value = effective;
          offsetBeforeScroll.value = scroll.value;

          if (!inverted && keyboardLiftBehavior === "whenAtEnd" && !atEnd) {
            // Sentinel: don't scroll in onMove (non-inverted only)
            offsetBeforeScroll.value = -1;
          }
        } else {
          // Android: keyboard closing — re-capture scroll position
          if (inverted) {
            offsetBeforeScroll.value = scroll.value;
          } else {
            // Preserve "whenAtEnd" sentinel: if open didn't shift, close shouldn't either
            if (offsetBeforeScroll.value !== -1) {
              // Non-inverted: subtract padding to get the "natural" position
              // so onMove smoothly scrolls back from where the user is now
              offsetBeforeScroll.value = scroll.value - padding.value;
            }
          }
        }
      },
      onMove: (e) => {
        "worklet";

        if (freeze) {
          return;
        }

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
            scrollTo(scrollViewRef, 0, 0, false);

            return;
          }

          if (!shouldShiftContent(keyboardLiftBehavior, wasAtEnd)) {
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
              }

              return;
            }
          }

          const target = offsetBeforeScroll.value + padding.value - effective;

          scrollTo(scrollViewRef, 0, target, false);
        } else {
          const effective = getEffectiveHeight(
            e.height,
            targetKeyboardHeight.value,
            offset,
          );

          // "never" closing: scroll along when at end to avoid jump
          if (
            keyboardLiftBehavior === "never" &&
            closing.value &&
            effective < padding.value
          ) {
            const wasAtEnd = isScrollAtEnd(
              offsetBeforeScroll.value + padding.value,
              layout.value.height,
              size.value.height,
              false,
            );

            if (wasAtEnd) {
              const target = clampedScrollTarget(
                offsetBeforeScroll.value,
                effective,
                size.value.height,
                layout.value.height,
              );

              scrollTo(scrollViewRef, 0, target, false);
            } else {
              // Clamp to valid range as padding shrinks
              const maxScroll = Math.max(
                size.value.height - layout.value.height + effective,
                0,
              );

              if (scroll.value > maxScroll) {
                scrollTo(scrollViewRef, 0, maxScroll, false);
              }
            }

            return;
          }

          if (!shouldShiftContent(keyboardLiftBehavior, true)) {
            return;
          }

          // "whenAtEnd" sentinel check
          if (offsetBeforeScroll.value === -1) {
            if (closing.value) {
              // Keyboard didn't shift on open; ensure valid position on close
              const maxScroll = Math.max(
                size.value.height - layout.value.height + effective,
                0,
              );

              if (scroll.value > maxScroll) {
                scrollTo(scrollViewRef, 0, maxScroll, false);
              }
            }

            return;
          }

          // "persistent" closing: maintain position, clamped to valid range
          if (keyboardLiftBehavior === "persistent" && closing.value) {
            const keepAt = offsetBeforeScroll.value + padding.value;
            const maxScroll = Math.max(
              size.value.height - layout.value.height + effective,
              0,
            );

            scrollTo(scrollViewRef, 0, Math.min(keepAt, maxScroll), false);

            return;
          }

          const target = clampedScrollTarget(
            offsetBeforeScroll.value,
            effective,
            size.value.height,
            layout.value.height,
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
    contentOffsetY: undefined,
  };
}

export { useChatKeyboard };

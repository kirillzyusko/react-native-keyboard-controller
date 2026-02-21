import { Platform } from "react-native";
import { interpolate, scrollTo, useSharedValue } from "react-native-reanimated";

import { useKeyboardHandler } from "../../../hooks";
import useScrollState from "../../hooks/useScrollState";

import {
  clampedScrollTarget,
  computeIOSContentOffset,
  isScrollAtEnd,
  shouldShiftContent,
} from "./helpers";

import type { AnimatedRef, SharedValue } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

const OS = Platform.OS;

type KeyboardLiftBehavior = "always" | "whenAtEnd" | "persistent" | "never";

type UseChatKeyboardOptions = {
  inverted: boolean;
  keyboardLiftBehavior: KeyboardLiftBehavior;
  freeze: boolean;
  offset: number;
};

type UseChatKeyboardReturn = {
  /** Extra scrollable space (= keyboard height). Used as contentInset on iOS, contentInsetBottom/contentInsetTop on Android. */
  padding: SharedValue<number>;
  /** Absolute Y content offset for iOS (set once in onStart). `undefined` on Android. */
  contentOffsetY: SharedValue<number> | undefined;
};

/**
 * Hook that manages keyboard-driven scrolling for chat-style scroll views.
 * Calculates padding (extra scrollable space) and content shift values,
 * using the optimal strategy per platform.
 *
 * @param scrollViewRef - Animated ref to the scroll view.
 * @param options - Configuration for inverted and keyboardLiftBehavior.
 * @returns Shared values for padding and contentOffsetY (iOS).
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
  const offsetBeforeScroll = useSharedValue(0);
  const targetKeyboardHeight = useSharedValue(0);

  const { layout, size, offset: scroll } = useScrollState(scrollViewRef);

  const getEffectiveHeight = (height: number): number => {
    "worklet";

    if (offset === 0 || targetKeyboardHeight.value === 0) {
      return height;
    }

    return interpolate(
      height,
      [0, targetKeyboardHeight.value],
      [0, Math.max(targetKeyboardHeight.value - offset, 0)],
    );
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
        }

        const effective = getEffectiveHeight(e.height);

        const atEnd = isScrollAtEnd(
          scroll.value,
          layout.value.height,
          size.value.height,
          inverted,
        );

        if (OS === "ios") {
          // iOS: set padding + contentOffset once in onStart
          // persistent mode: when keyboard shrinks, snap to end or hold position
          if (
            keyboardLiftBehavior === "persistent" &&
            effective < padding.value
          ) {
            padding.value = effective;

            if (atEnd) {
              // Snap to the end of content instead of reverting to pre-keyboard position
              if (inverted) {
                contentOffsetY.value = -effective;
              } else {
                contentOffsetY.value = Math.max(
                  size.value.height - layout.value.height + effective,
                  0,
                );
              }
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
        } else if (inverted && e.duration === -1) {
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
            // Non-inverted: subtract padding to get the "natural" position
            // so onMove smoothly scrolls back from where the user is now
            offsetBeforeScroll.value = scroll.value - padding.value;
          }
        }
      },
      onMove: (e) => {
        "worklet";

        if (freeze) {
          return;
        }

        // iOS doesn't need per-frame updates (contentOffset handles it)
        if (OS === "ios") {
          return;
        }

        if (inverted) {
          // Skip post-interactive snap-back (duration === -1)
          if (e.duration === -1) {
            return;
          }

          const effective = getEffectiveHeight(e.height);

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
          const effective = getEffectiveHeight(e.height);

          // "never" at end: scroll along when keyboard closes to avoid jump
          if (keyboardLiftBehavior === "never" && effective < padding.value) {
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
            }

            return;
          }

          if (!shouldShiftContent(keyboardLiftBehavior, true)) {
            return;
          }

          // "whenAtEnd" sentinel check
          if (offsetBeforeScroll.value === -1) {
            return;
          }

          if (
            keyboardLiftBehavior === "persistent" &&
            effective < scroll.value - offsetBeforeScroll.value
          ) {
            // When at end, allow scrolling back to natural end position
            const wasAtEnd = isScrollAtEnd(
              offsetBeforeScroll.value + padding.value,
              layout.value.height,
              size.value.height,
              false,
            );

            if (!wasAtEnd) {
              return;
            }
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

        const effective = getEffectiveHeight(e.height);

        padding.value = effective;
      },
    },
    [inverted, keyboardLiftBehavior, freeze, offset],
  );

  return {
    padding,
    contentOffsetY: OS === "ios" ? contentOffsetY : undefined,
  };
}

export { useChatKeyboard };
export type { KeyboardLiftBehavior };

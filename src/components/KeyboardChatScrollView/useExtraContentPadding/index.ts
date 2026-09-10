import { useCallback } from "react";
import { Platform } from "react-native";
import {
  scrollTo,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";

import { IS_FABRIC } from "../../../architecture";
import { isScrollAtEnd, shouldShiftContent } from "../useChatKeyboard/helpers";

import type { KeyboardLiftBehavior } from "../useChatKeyboard/types";
import type { AnimatedRef, SharedValue } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

type UseExtraContentPaddingOptions = {
  scrollViewRef: AnimatedRef<Reanimated.ScrollView>;
  extraContentPadding: SharedValue<number>;
  /** Keyboard-only padding from useChatKeyboard — used to compute total padding for clamping. */
  keyboardPadding: SharedValue<number>;
  /** Minimum inset floor — used to absorb keyboard and extraContentPadding changes. */
  blankSpace: SharedValue<number>;
  /** Current vertical scroll offset. */
  scroll: SharedValue<number>;
  /** Visible viewport dimensions. */
  layout: SharedValue<{ width: number; height: number }>;
  /** Total content dimensions. */
  size: SharedValue<{ width: number; height: number }>;
  /** IOS only — when provided, sets contentOffset atomically with contentInset. */
  contentOffsetY?: SharedValue<number>;
  inverted: boolean;
  keyboardLiftBehavior: KeyboardLiftBehavior;
  freeze: SharedValue<boolean>;
};

const OS = Platform.OS;

/**
 * Hook that reacts to `extraContentPadding` changes and conditionally
 * adjusts the scroll position using `scrollTo` on both iOS and Android.
 *
 * Padding extension (scrollable range) is handled externally via a
 * `useDerivedValue` that sums keyboard padding + extra content padding.
 * This hook only handles the scroll correction.
 *
 * @param options - Configuration and shared values.
 * @example
 * ```tsx
 * useExtraContentPadding({ scrollViewRef, extraContentPadding, ... });
 * ```
 */
function useExtraContentPadding(options: UseExtraContentPaddingOptions): void {
  const {
    scrollViewRef,
    extraContentPadding,
    keyboardPadding,
    blankSpace,
    scroll,
    layout,
    size,
    contentOffsetY,
    inverted,
    keyboardLiftBehavior,
    freeze,
  } = options;

  // The offset we last asked the scroll view to move to, and the observed
  // `scroll` value it was derived from. `scroll` is fed by native scroll
  // events, but our own writes are programmatic (`contentOffsetY` through
  // animatedProps on Fabric, a deferred `scrollTo` on Android), so a fast
  // animation (e.g. `withTiming` on `extraContentPadding`) can run several
  // reaction frames before a single scroll event lands. While that is the case
  // `scroll` still reports the pre-animation offset and rebasing on it makes
  // every frame throw away the previous frames' shifts.
  const lastCommanded = useSharedValue<number | null>(null);
  const lastObservedScroll = useSharedValue(0);

  const scrollToTarget = useCallback(
    (target: number) => {
      "worklet";

      // Remember the command and the observed offset it was based on, so the
      // next frame can tell whether a scroll event has landed since.
      // eslint-disable-next-line react-compiler/react-compiler
      lastCommanded.value = target;
      lastObservedScroll.value = scroll.value;

      if (contentOffsetY && IS_FABRIC) {
        contentOffsetY.value = target;
      } else if (OS === "android") {
        // Defer scrollTo so the animatedProps inset commit lands first;
        // otherwise the native ScrollView clamps to the old range.
        requestAnimationFrame(() => {
          // check that view is still mounted and ref is actual
          // otherwise it may lead to a crash
          if (!scrollViewRef()) {
            return;
          }
          scrollTo(scrollViewRef, 0, target, false);
        });
      } else {
        scrollTo(scrollViewRef, 0, target, false);
      }
    },
    [scrollViewRef, contentOffsetY, scroll, lastCommanded, lastObservedScroll],
  );

  useAnimatedReaction(
    () => extraContentPadding.value,
    (current, previous) => {
      if (freeze.value || previous === null) {
        return;
      }

      const rawDelta = current - previous;

      if (rawDelta === 0) {
        return;
      }

      // Compute effective delta considering blankSpace floor
      const previousTotal = Math.max(
        blankSpace.value,
        keyboardPadding.value + previous,
      );
      const currentTotal = Math.max(
        blankSpace.value,
        keyboardPadding.value + current,
      );
      const effectiveDelta = currentTotal - previousTotal;

      if (effectiveDelta === 0) {
        // blankSpace absorbed the change
        return;
      }

      const atEnd = isScrollAtEnd(
        scroll.value,
        layout.value.height,
        size.value.height,
        inverted,
      );

      // "persistent": scroll on grow, hold position on shrink (unless at end)
      if (
        keyboardLiftBehavior === "persistent" &&
        effectiveDelta < 0 &&
        !atEnd
      ) {
        return;
      }

      if (!shouldShiftContent(keyboardLiftBehavior, atEnd)) {
        return;
      }

      // Build on the offset we last commanded as long as no scroll event has
      // landed since, because that write is still in flight. As soon as `scroll`
      // moves (a real user drag, or the native view reporting our own write
      // back) we rebase on it, so an actual gesture always wins.
      const base =
        lastCommanded.value !== null &&
        scroll.value === lastObservedScroll.value
          ? lastCommanded.value
          : scroll.value;

      let target: number;

      if (inverted) {
        target = Math.max(base - effectiveDelta, -currentTotal);
      } else {
        const maxScroll = Math.max(
          size.value.height - layout.value.height + currentTotal,
          0,
        );

        target = Math.min(base + effectiveDelta, maxScroll);
      }

      scrollToTarget(target);
    },
    [inverted, keyboardLiftBehavior],
  );
}

export { useExtraContentPadding };
export type { UseExtraContentPaddingOptions };

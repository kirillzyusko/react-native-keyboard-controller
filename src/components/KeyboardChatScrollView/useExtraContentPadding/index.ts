import { useCallback } from "react";
import { Platform } from "react-native";
import { scrollTo, useSharedValue } from "react-native-reanimated";

import { IS_FABRIC } from "../../../architecture";
import { useAnimatedReaction } from "../../../reanimated";
import { isScrollAtEnd, shouldShiftContent } from "../useChatKeyboard/helpers";

import type { KeyboardLiftBehavior } from "../useChatKeyboard/types";
import type { AnimatedRef, SharedValue } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

type InternalSharedValue<Value> = SharedValue<Value> & {
  _animation?: object | null;
};

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
  const animationOffset = useSharedValue<number | null>(null);

  const scrollToTarget = useCallback(
    (target: number) => {
      "worklet";

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
    [scrollViewRef, contentOffsetY],
  );

  useAnimatedReaction(
    () => extraContentPadding.value,
    (current, previous) => {
      if (freeze.value || previous === null) {
        // eslint-disable-next-line react-compiler/react-compiler
        animationOffset.value = null;

        return;
      }

      // Reanimated clears this on a plain assignment; `finished` differs
      // between Reanimated 3 and 4, so only check for the animation itself.
      const hasAnimation = Boolean(
        (extraContentPadding as InternalSharedValue<number>)._animation,
      );

      if (!hasAnimation) {
        animationOffset.value = null;
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
        animationOffset.value = null;

        return;
      }

      if (!shouldShiftContent(keyboardLiftBehavior, atEnd)) {
        animationOffset.value = null;

        return;
      }

      const offset = animationOffset.value ?? scroll.value;

      if (inverted) {
        const target = Math.max(offset - effectiveDelta, -currentTotal);

        if (hasAnimation) {
          animationOffset.value = target;
        }
        scrollToTarget(target);
      } else {
        const maxScroll = Math.max(
          size.value.height - layout.value.height + currentTotal,
          0,
        );
        // Clamp at 0 as well: when the content is shorter than the viewport a
        // shrinking padding makes `effectiveDelta` negative while `scroll.value`
        // is already 0, so the target would go below the top of the content.
        const target = Math.max(
          Math.min(offset + effectiveDelta, maxScroll),
          0,
        );

        if (hasAnimation) {
          animationOffset.value = target;
        }
        scrollToTarget(target);
      }
    },
    [inverted, keyboardLiftBehavior],
  );
}

export { useExtraContentPadding };
export type { UseExtraContentPaddingOptions };

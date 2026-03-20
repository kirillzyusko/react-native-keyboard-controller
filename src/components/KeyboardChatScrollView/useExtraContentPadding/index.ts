import { scrollTo, useAnimatedReaction } from "react-native-reanimated";

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
  inverted: boolean;
  keyboardLiftBehavior: KeyboardLiftBehavior;
  freeze: boolean;
};

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
    inverted,
    keyboardLiftBehavior,
    freeze,
  } = options;

  useAnimatedReaction(
    () => extraContentPadding.value,
    (current, previous) => {
      if (freeze || previous === null) {
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

      if (inverted) {
        const target = Math.max(scroll.value - effectiveDelta, -currentTotal);

        scrollTo(scrollViewRef, 0, target, false);
      } else {
        const maxScroll = Math.max(
          size.value.height - layout.value.height + currentTotal,
          0,
        );
        const target = Math.min(scroll.value + effectiveDelta, maxScroll);

        scrollTo(scrollViewRef, 0, target, false);
      }
    },
    [inverted, keyboardLiftBehavior, freeze],
  );
}

export { useExtraContentPadding };
export type { UseExtraContentPaddingOptions };

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

      const delta = current - previous;

      if (delta === 0) {
        return;
      }

      const totalPadding = keyboardPadding.value + current;

      const atEnd = isScrollAtEnd(
        scroll.value,
        layout.value.height,
        size.value.height,
        inverted,
      );

      // "persistent": scroll on grow, hold position on shrink (unless at end)
      if (keyboardLiftBehavior === "persistent" && delta < 0 && !atEnd) {
        return;
      }

      if (!shouldShiftContent(keyboardLiftBehavior, atEnd)) {
        return;
      }

      if (inverted) {
        const target = Math.max(scroll.value - delta, -totalPadding);

        scrollTo(scrollViewRef, 0, target, false);
      } else {
        const maxScroll = Math.max(
          size.value.height - layout.value.height + totalPadding,
          0,
        );
        const target = Math.min(scroll.value + delta, maxScroll);

        scrollTo(scrollViewRef, 0, target, false);
      }
    },
    [inverted, keyboardLiftBehavior, freeze],
  );
}

export { useExtraContentPadding };
export type { UseExtraContentPaddingOptions };

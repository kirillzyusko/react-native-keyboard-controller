import { Platform } from "react-native";
import { scrollTo, useSharedValue } from "react-native-reanimated";

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
};

type UseChatKeyboardReturn = {
  /** Extra scrollable space (= keyboard height). Used as contentInset on iOS, contentInsetBottom on Android. */
  padding: SharedValue<number>;
  /** Absolute Y content offset for iOS (set once in onStart). `undefined` on Android. */
  contentOffsetY: SharedValue<number> | undefined;
  /** TranslateY for the container wrapper on Android inverted lists. 0 otherwise. */
  containerTranslateY: SharedValue<number>;
};

/**
 * Hook that manages keyboard-driven scrolling for chat-style scroll views.
 * Calculates padding (extra scrollable space) and content shift values,
 * using the optimal strategy per platform.
 *
 * @param scrollViewRef - Animated ref to the scroll view.
 * @param options - Configuration for inverted and keyboardLiftBehavior.
 * @returns Shared values for padding, contentOffsetY (iOS), and containerTranslateY (Android inverted).
 * @example
 * ```tsx
 * const { padding, contentOffsetY, containerTranslateY } = useChatKeyboard(ref, {
 *   inverted: false,
 *   keyboardLiftBehavior: "always",
 * });
 * ```
 */
function useChatKeyboard(
  scrollViewRef: AnimatedRef<Reanimated.ScrollView>,
  options: UseChatKeyboardOptions,
): UseChatKeyboardReturn {
  const { inverted, keyboardLiftBehavior, freeze } = options;

  const padding = useSharedValue(0);
  const contentOffsetY = useSharedValue(0);
  const containerTranslateY = useSharedValue(0);
  const offsetBeforeScroll = useSharedValue(0);

  const { layout, size, offset: scroll } = useScrollState(scrollViewRef);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        if (freeze) {
          return;
        }

        const atEnd = isScrollAtEnd(
          scroll.value,
          layout.value.height,
          size.value.height,
        );

        if (OS === "ios") {
          // iOS: set padding + contentOffset once in onStart
          const relativeScroll = inverted
            ? scroll.value + padding.value
            : scroll.value - padding.value;

          // eslint-disable-next-line react-compiler/react-compiler
          padding.value = e.height;

          if (!shouldShiftContent(keyboardLiftBehavior, atEnd)) {
            return;
          }

          if (
            keyboardLiftBehavior === "persistent" &&
            e.height < padding.value
          ) {
            return;
          }

          contentOffsetY.value = computeIOSContentOffset(
            relativeScroll,
            e.height,
            size.value.height,
            layout.value.height,
            inverted,
          );
        } else if (e.height > 0) {
          // Android: keyboard opening — set padding + capture scroll position
          padding.value = e.height;
          offsetBeforeScroll.value = scroll.value;

          if (keyboardLiftBehavior === "whenAtEnd" && !atEnd) {
            // Sentinel: don't scroll in onMove
            offsetBeforeScroll.value = -1;
          }
        } else {
          // Android: keyboard closing — re-capture from current position
          // so onMove smoothly scrolls back from where the user is now
          offsetBeforeScroll.value = scroll.value - padding.value;
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

        if (!shouldShiftContent(keyboardLiftBehavior, true)) {
          return;
        }

        // "whenAtEnd" sentinel check
        if (offsetBeforeScroll.value === -1) {
          return;
        }

        if (inverted) {
          // Android inverted: translateY on container
          if (
            keyboardLiftBehavior === "persistent" &&
            e.height < Math.abs(containerTranslateY.value)
          ) {
            return;
          }

          containerTranslateY.value = -e.height;
        } else {
          // Android non-inverted: scrollTo per-frame
          if (
            keyboardLiftBehavior === "persistent" &&
            e.height < scroll.value - offsetBeforeScroll.value
          ) {
            return;
          }

          const target = clampedScrollTarget(
            offsetBeforeScroll.value,
            e.height,
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

        padding.value = e.height;

        if (
          OS !== "ios" &&
          inverted &&
          e.height === 0 &&
          keyboardLiftBehavior !== "persistent"
        ) {
          containerTranslateY.value = 0;
        }
      },
    },
    [inverted, keyboardLiftBehavior, freeze],
  );

  return {
    padding,
    contentOffsetY: OS === "ios" ? contentOffsetY : undefined,
    containerTranslateY,
  };
}

export { useChatKeyboard };
export type { KeyboardLiftBehavior };

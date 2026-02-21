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
  const { inverted, keyboardLiftBehavior, freeze, offset } = options;

  const padding = useSharedValue(0);
  const contentOffsetY = useSharedValue(0);
  const containerTranslateY = useSharedValue(0);
  const offsetBeforeScroll = useSharedValue(0);
  const targetKeyboardHeight = useSharedValue(0);
  const lockedScrollPosition = useSharedValue(-1);
  const prevInteractiveHeight = useSharedValue(-1);

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
        } else if (e.height > 0) {
          // Android: keyboard opening — set padding + capture scroll position
          padding.value = effective;
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

        const effective = getEffectiveHeight(e.height);

        if (inverted) {
          // Android inverted: translateY on container
          if (
            keyboardLiftBehavior === "persistent" &&
            effective < Math.abs(containerTranslateY.value)
          ) {
            return;
          }

          containerTranslateY.value = -effective;
        } else {
          // Android non-inverted: scrollTo per-frame
          if (
            keyboardLiftBehavior === "persistent" &&
            effective < scroll.value - offsetBeforeScroll.value
          ) {
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
      onInteractive: (e) => {
        "worklet";

        if (freeze || OS === "ios") {
          return;
        }

        const effective = getEffectiveHeight(e.height);

        if (inverted) {
          const maxEffective = getEffectiveHeight(targetKeyboardHeight.value);
          const prevEffective = prevInteractiveHeight.value;
          const isFirstInteractive = prevEffective === -1;

          prevInteractiveHeight.value = effective;

          if (isFirstInteractive) {
            // first interactive event of a gesture session — lock scroll
            lockedScrollPosition.value = scroll.value;
          } else if (
            (prevEffective === maxEffective && effective === maxEffective) ||
            (prevEffective === 0 && effective === 0)
          ) {
            // keyboard stayed at rest position for consecutive frames — unlock
            // so the user can scroll freely while keyboard is fully visible/hidden
            lockedScrollPosition.value = -1;
          } else if (
            (prevEffective === 0 && effective > 0) ||
            (prevEffective === maxEffective && effective < maxEffective)
          ) {
            // keyboard left a rest position — re-lock at current scroll
            lockedScrollPosition.value = scroll.value;
          }

          if (lockedScrollPosition.value !== -1) {
            scrollTo(scrollViewRef, 0, lockedScrollPosition.value, false);
          }

          containerTranslateY.value = -effective;
        }
      },
      onEnd: (e) => {
        "worklet";

        if (freeze) {
          return;
        }

        const effective = getEffectiveHeight(e.height);

        padding.value = effective;
        lockedScrollPosition.value = -1;
        prevInteractiveHeight.value = -1;

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
    [inverted, keyboardLiftBehavior, freeze, offset],
  );

  return {
    padding,
    contentOffsetY: OS === "ios" ? contentOffsetY : undefined,
    containerTranslateY,
  };
}

export { useChatKeyboard };
export type { KeyboardLiftBehavior };

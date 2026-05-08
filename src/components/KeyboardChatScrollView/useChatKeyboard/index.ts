import { scrollTo, useSharedValue } from "react-native-reanimated";

import { useKeyboardHandler } from "../../../hooks";
import useScrollState from "../../hooks/useScrollState";

import {
  clampedScrollTarget,
  getEffectiveHeight,
  getScrollEffective,
  getVisibleMinimumPaddingFraction,
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
    blankSpace,
    extraContentPadding,
  } = options;

  const padding = useSharedValue(0);
  const currentHeight = useSharedValue(0);
  const offsetBeforeScroll = useSharedValue(0);
  const targetKeyboardHeight = useSharedValue(0);
  const closing = useSharedValue(false);
  // Visible portion of blankSpace at the moment the keyboard started opening. Snapshot
  // from onStart — used by onMove to keep the per-frame math stable as the keyboard
  // animates. Must match iOS's per-frame formula: `absorbed = max(0, visiblePadding -
  // extraContent)`, NOT `(blankSpace - extra) * fraction` (which scales `extra` by
  // fraction and gives a smaller absorption than iOS when the blank is only partially
  // visible, causing under-shift on short content).
  const visiblePaddingOnOpen = useSharedValue(0);
  const actualOpenShift = useSharedValue(0);
  const {
    layout,
    size,
    offset: scroll,
    onLayout,
    onContentSizeChange,
  } = useScrollState(scrollViewRef);
  // On Android, `size.value.height` comes from native scroll events where the
  // ScrollView reads `contentView.getHeight()` (= bottom - top). The decorator extends
  // `contentView.bottom` by the applied inset to provide the blank-space scroll range,
  // so `size.value.height` is "natural content + applied inset". iOS reports pure
  // natural height via `contentSize` (contentInset is reported separately). To align
  // Android's `isScrollAtEnd` with iOS, subtract the applied inset here. The applied
  // inset at any moment equals what `ScrollViewWithBottomPadding` writes to
  // `contentInsetBottom + contentInsetTop`, which is `max(blankSpace, padding +
  // extraContentPadding)` (i.e. `bottomPadding.value` from chat).
  const naturalContentHeight = (): number => {
    "worklet";
    const appliedInset = Math.max(
      blankSpace.value,
      padding.value + extraContentPadding.value,
    );

    return Math.max(0, size.value.height - appliedInset);
  };
  const clampScrollIfNeeded = (
    effective: number,
    totalPaddingForMaxScroll?: number,
  ) => {
    "worklet";

    const paddingForMax =
      totalPaddingForMaxScroll !== undefined
        ? totalPaddingForMaxScroll
        : effective;
    // Use the natural content height (not `size.value.height`, which on Android already
    // includes the applied inset via the decorator's `child.bottom` extension) so we
    // don't double-count the inset when computing the scrollable range.
    const maxScroll = Math.max(
      naturalContentHeight() - layout.value.height + paddingForMax,
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

        if (freeze.value) {
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
          naturalContentHeight(),
          inverted,
        );

        // Scale minimum padding absorption by how much of it is visible.
        // Proportional, NOT a binary gate: for short content the viewport always shows
        // content+blank, and blankSpace can never be "fully visible" (visibleFraction <
        // 1) because blank extends beyond viewport. A binary gate would skip absorption
        // entirely and we'd shift by the full keyboard height, pushing short content off
        // the top. Matches iOS's per-frame math (index.ios.ts: `visibleFraction *
        // blankSpace`).
        const visibleFraction = getVisibleMinimumPaddingFraction(
          scroll.value,
          layout.value.height,
          naturalContentHeight(),
          blankSpace.value,
          inverted,
        );
        const visiblePadding = visibleFraction * blankSpace.value;
        const minimumPaddingAbsorbed = Math.max(
          0,
          visiblePadding - extraContentPadding.value,
        );
        const scrollEffective = getScrollEffective(
          effective,
          minimumPaddingAbsorbed,
        );

        if (inverted && e.duration === -1) {
          // Android inverted: skip post-interactive snap-back events
          // (duration === -1 means the keyboard is re-establishing its
          // position after an interactive gesture, not a real animation)
          return;
        } else if (e.height > 0) {
          // Android: keyboard opening — set padding + capture scroll position
          visiblePaddingOnOpen.value = visiblePadding;
          padding.value = effective;
          offsetBeforeScroll.value = scroll.value;

          if (!inverted && keyboardLiftBehavior === "whenAtEnd" && !atEnd) {
            // Sentinel: don't scroll in onMove (non-inverted only)
            offsetBeforeScroll.value = -1;
          } else if (!inverted && scrollEffective === 0) {
            // blankSpace fully absorbs the keyboard — prevent scroll
            offsetBeforeScroll.value = -1;
          } else if (inverted && scrollEffective === 0) {
            // blankSpace fully absorbs the keyboard — guard for inverted
            offsetBeforeScroll.value = scroll.value;
          }
        } else {
          // Android: keyboard closing — re-capture scroll position
          if (inverted) {
            offsetBeforeScroll.value = scroll.value;
          } else {
            // Preserve "whenAtEnd" sentinel: if open didn't shift, close shouldn't either
            if (offsetBeforeScroll.value !== -1) {
              // Use the actual displacement recorded at end of open animation
              // (not the theoretical value) so close is symmetric with open
              offsetBeforeScroll.value = scroll.value - actualOpenShift.value;
            }
          }
        }
      },
      onMove: (e) => {
        "worklet";

        if (freeze.value) {
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

          const minimumPaddingAbsorbed = Math.max(
            0,
            visiblePaddingOnOpen.value - extraContentPadding.value,
          );
          const scrollEffective = getScrollEffective(
            effective,
            minimumPaddingAbsorbed,
          );
          const actualTotalPadding = Math.max(
            blankSpace.value,
            effective + extraContentPadding.value,
          );

          // Check if we should shift content based on position when keyboard started
          const wasAtEnd = isScrollAtEnd(
            offsetBeforeScroll.value,
            layout.value.height,
            naturalContentHeight(),
            inverted,
          );

          // "never" at end: scroll along when keyboard closes to avoid jump
          if (
            keyboardLiftBehavior === "never" &&
            wasAtEnd &&
            effective < padding.value
          ) {
            padding.value = effective;

            if (scrollEffective === 0 && minimumPaddingAbsorbed > 0) {
              return;
            }

            scrollTo(scrollViewRef, 0, 0, false);

            return;
          }

          if (!shouldShiftContent(keyboardLiftBehavior, wasAtEnd)) {
            // Closing, not shifting: reduce padding to avoid gap. Clamp BEFORE
            // mutating padding.value — `clampScrollIfNeeded` reads
            // `naturalContentHeight()` which subtracts `padding.value` from the
            // native-reported `size.value.height`. On Android the native hasn't
            // applied the new inset yet, so `size.value.height` still reflects the
            // pre-mutation inset; computing with the post-mutation `padding.value`
            // would overestimate the natural content and inflate maxScroll.
            if (closing.value && effective < padding.value) {
              clampScrollIfNeeded(effective, actualTotalPadding);
              padding.value = effective;
            }

            return;
          }

          // When blankSpace fully absorbs the keyboard, skip scroll
          if (scrollEffective === 0 && minimumPaddingAbsorbed > 0) {
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
                // Not at end: reduce padding to avoid gap. Clamp BEFORE mutating
                // padding.value (see comment above in the !shouldShift branch).
                clampScrollIfNeeded(effective, actualTotalPadding);
                padding.value = effective;
              }

              return;
            }
          }

          const target =
            offsetBeforeScroll.value + padding.value - scrollEffective;

          scrollTo(scrollViewRef, 0, target, false);
        } else {
          // Skip post-interactive snap-back events. When the user drags on the scroll
          // view with the keyboard open, Android emits `onMove` with `duration === -1`
          // as the keyboard re-establishes position. Without this guard, the scrollTo
          // below would override the user's in-progress drag — causing the scroll
          // position to snap back when the user lifts their finger.
          if (e.duration === -1) {
            return;
          }

          const effective = getEffectiveHeight(
            e.height,
            targetKeyboardHeight.value,
            offset,
          );

          const minimumPaddingAbsorbed = Math.max(
            0,
            visiblePaddingOnOpen.value - extraContentPadding.value,
          );
          const scrollEffective = getScrollEffective(
            effective,
            minimumPaddingAbsorbed,
          );
          const actualTotalPadding = Math.max(
            blankSpace.value,
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

          // "whenAtEnd" sentinel check (also used for blankSpace full absorption)
          if (offsetBeforeScroll.value === -1) {
            if (closing.value) {
              // Keyboard didn't shift on open; ensure valid position on close
              clampScrollIfNeeded(effective, actualTotalPadding);
            }

            return;
          }

          // "persistent" closing: maintain the actual shift applied during open. Using
          // `padding.value` here was wrong when blankSpace absorbed part of the keyboard
          // — the shift during open was only the uncovered-by-blankSpace portion, NOT
          // the full keyboard height, so `offsetBefore + padding` over-scrolled on
          // close. `actualOpenShift` records the real clamped shift captured at the end
          // of the open animation.
          if (keyboardLiftBehavior === "persistent" && closing.value) {
            const keepAt = offsetBeforeScroll.value + actualOpenShift.value;
            const maxScroll = Math.max(
              naturalContentHeight() - layout.value.height + actualTotalPadding,
              0,
            );

            scrollTo(scrollViewRef, 0, Math.min(keepAt, maxScroll), false);

            return;
          }

          const target = clampedScrollTarget(
            offsetBeforeScroll.value,
            scrollEffective,
            naturalContentHeight(),
            layout.value.height,
            actualTotalPadding,
          );

          scrollTo(scrollViewRef, 0, target, false);

          // Track actual (clamped) displacement during open for symmetric close
          if (!closing.value) {
            actualOpenShift.value = target - offsetBeforeScroll.value;
          }
        }
      },
      onEnd: (e) => {
        "worklet";

        if (freeze.value) {
          return;
        }

        const effective = getEffectiveHeight(
          e.height,
          targetKeyboardHeight.value,
          offset,
        );

        padding.value = effective;

        // Record actual scroll displacement so close can be symmetric
        if (effective > 0 && offsetBeforeScroll.value !== -1) {
          actualOpenShift.value = scroll.value - offsetBeforeScroll.value;
        }
      },
    },
    [inverted, keyboardLiftBehavior, offset],
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

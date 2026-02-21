import { interpolate } from "react-native-reanimated";

import type { KeyboardLiftBehavior } from "./types";

const AT_END_THRESHOLD = 20;

/**
 * Map the current keyboard height to an effective height that accounts for a
 * fixed offset (e.g. bottom safe-area or tab-bar height).
 *
 * @param height - Current keyboard height.
 * @param targetKeyboardHeight - Full target keyboard height (captured on keyboard open).
 * @param offset - Fixed distance between the scroll-view bottom and the screen bottom.
 * @returns Effective height after subtracting the offset proportionally.
 * @example
 * ```ts
 * getEffectiveHeight(300, 300, 50); // 250
 * getEffectiveHeight(150, 300, 50); // 125
 * ```
 */
export function getEffectiveHeight(
  height: number,
  targetKeyboardHeight: number,
  offset: number,
): number {
  "worklet";

  if (offset === 0 || targetKeyboardHeight === 0) {
    return height;
  }

  return interpolate(
    height,
    [0, targetKeyboardHeight],
    [0, Math.max(targetKeyboardHeight - offset, 0)],
  );
}

/**
 * Check whether the scroll view is at the end of its content.
 *
 * For non-inverted lists the "end" is the bottom of the content.
 * For inverted lists the "end" is the top (scroll offset near 0),
 * because that is where the latest messages are displayed.
 *
 * @param scrollOffset - Current vertical scroll offset.
 * @param layoutHeight - Visible height of the scroll view.
 * @param contentHeight - Total height of the scrollable content.
 * @param inverted - Whether the list is inverted.
 * @returns `true` if the scroll position is within the threshold of the content end.
 * @example
 * ```ts
 * const atEnd = isScrollAtEnd(100, 800, 920); // true (100 + 800 >= 920 - 20)
 * const atEndInverted = isScrollAtEnd(5, 800, 2000, true); // true (5 <= 20)
 * ```
 */
export function isScrollAtEnd(
  scrollOffset: number,
  layoutHeight: number,
  contentHeight: number,
  inverted: boolean = false,
): boolean {
  "worklet";

  if (inverted) {
    return scrollOffset <= AT_END_THRESHOLD;
  }

  return scrollOffset + layoutHeight >= contentHeight - AT_END_THRESHOLD;
}

/**
 * Decide whether content should be shifted based on the keyboard lift behavior.
 *
 * @param behavior - The configured keyboard lift behavior.
 * @param isAtEnd - Whether the scroll view is currently at the end.
 * @returns `true` if content should be shifted.
 * @example
 * ```ts
 * shouldShiftContent("always", false); // true
 * shouldShiftContent("whenAtEnd", false); // false
 * ```
 */
export function shouldShiftContent(
  behavior: KeyboardLiftBehavior,
  isAtEnd: boolean,
): boolean {
  "worklet";

  switch (behavior) {
    case "always":
      return true;
    case "never":
      return false;
    case "whenAtEnd":
      return isAtEnd;
    case "persistent":
      return true;
  }
}

/**
 * Compute the clamped scroll target for non-inverted lists.
 *
 * @param offsetBeforeScroll - Scroll position before keyboard appeared.
 * @param keyboardHeight - Current keyboard height.
 * @param contentHeight - Total height of the scrollable content.
 * @param layoutHeight - Visible height of the scroll view.
 * @returns Clamped scroll target between 0 and maxScroll.
 * @example
 * ```ts
 * clampedScrollTarget(100, 300, 1000, 800); // 400
 * ```
 */
export function clampedScrollTarget(
  offsetBeforeScroll: number,
  keyboardHeight: number,
  contentHeight: number,
  layoutHeight: number,
): number {
  "worklet";

  const maxScroll = Math.max(contentHeight - layoutHeight + keyboardHeight, 0);

  return Math.min(Math.max(offsetBeforeScroll + keyboardHeight, 0), maxScroll);
}

/**
 * Compute contentOffset.y for iOS lists.
 *
 * @param relativeScroll - Scroll position relative to current inset.
 * @param keyboardHeight - Target keyboard height.
 * @param contentHeight - Total height of the scrollable content.
 * @param layoutHeight - Visible height of the scroll view.
 * @param inverted - Whether the list is inverted.
 * @returns The absolute contentOffset.y to set.
 * @example
 * ```ts
 * computeIOSContentOffset(100, 300, 1000, 800, false); // 400
 * ```
 */
export function computeIOSContentOffset(
  relativeScroll: number,
  keyboardHeight: number,
  contentHeight: number,
  layoutHeight: number,
  inverted: boolean,
): number {
  "worklet";

  if (inverted) {
    const maxScroll = Math.max(contentHeight - layoutHeight, 0);

    return Math.max(
      Math.min(relativeScroll - keyboardHeight, maxScroll),
      -keyboardHeight,
    );
  }

  const maxScroll = Math.max(contentHeight - layoutHeight + keyboardHeight, 0);

  return Math.min(Math.max(keyboardHeight + relativeScroll, 0), maxScroll);
}

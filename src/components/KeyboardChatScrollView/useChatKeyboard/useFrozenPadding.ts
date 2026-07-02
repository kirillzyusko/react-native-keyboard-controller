import { useAnimatedReaction } from "react-native-reanimated";

import { getEffectiveHeight } from "./helpers";

import type { SharedValue } from "react-native-reanimated";

type UseFrozenPaddingOptions = {
  /** Latest observed keyboard height, tracked even while frozen. */
  currentHeight: SharedValue<number>;
  /** When `true`, keyboard-driven layout writes are skipped. */
  freeze: SharedValue<boolean>;
  /** The distance between the bottom of the screen and the `ScrollView`. */
  offset: number;
  /** Keyboard-driven padding managed by `useChatKeyboard`. */
  padding: SharedValue<number>;
  /** Height of the fully opened keyboard. */
  targetKeyboardHeight: SharedValue<number>;
};

/**
 * Hook that reconciles keyboard padding after a frozen interval.
 *
 * Keyboard handlers skip layout writes while `freeze` is enabled, so if the
 * keyboard opens or closes during the frozen interval `padding` keeps a stale
 * value (e.g. the open-keyboard height after a frozen dismissal). Recompute it
 * from the latest observed keyboard height as soon as `freeze` transitions
 * back to `false`.
 *
 * @param options - Shared values tracked by `useChatKeyboard` plus the scroll view `offset`.
 * @param options.currentHeight - Latest observed keyboard height, tracked even while frozen.
 * @param options.freeze - When `true`, keyboard-driven layout writes are skipped.
 * @param options.offset - The distance between the bottom of the screen and the `ScrollView`.
 * @param options.padding - Keyboard-driven padding managed by `useChatKeyboard`.
 * @param options.targetKeyboardHeight - Height of the fully opened keyboard.
 * @example
 * ```ts
 * useFrozenPadding({ currentHeight, freeze, offset, padding, targetKeyboardHeight });
 * ```
 */
function useFrozenPadding({
  currentHeight,
  freeze,
  offset,
  padding,
  targetKeyboardHeight,
}: UseFrozenPaddingOptions): void {
  useAnimatedReaction(
    () => freeze.value,
    (isFrozen, wasFrozen) => {
      if (!isFrozen && wasFrozen === true) {
        // eslint-disable-next-line react-compiler/react-compiler
        padding.value = getEffectiveHeight(
          currentHeight.value,
          targetKeyboardHeight.value,
          offset,
        );
      }
    },
    [offset],
  );
}

export { useFrozenPadding };

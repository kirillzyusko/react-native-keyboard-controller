import { useMemo } from "react";
import { Platform } from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
} from "react-native-reanimated";

import { isScrollAtEnd } from "./useChatKeyboard/helpers";

import type { SharedValue } from "react-native-reanimated";

type EndVisibleCallback = (visible: boolean) => void;

type Options = {
  scroll: SharedValue<number>;
  layout: SharedValue<{ width: number; height: number }>;
  size: SharedValue<{ width: number; height: number }>;
  inverted: boolean;
  /**
   * Inset currently applied to the native ScrollView. Used on Android to subtract the
   * blank-space extension from `size.value.height` (which on Android includes it,
   * because the decorator extends `contentView.bottom`). On iOS the native scroll event
   * reports natural content size independent of `contentInset`, so no adjustment
   * needed.
   */
  appliedInset: SharedValue<number>;
  onEndVisible?: EndVisibleCallback;
};

const hasWorkletHash = (value: unknown): boolean =>
  typeof value === "function" &&
  !!(value as unknown as Record<string, unknown>).__workletHash;

const IS_ANDROID = Platform.OS === "android";

export const useEndVisible = ({
  scroll,
  layout,
  size,
  inverted,
  appliedInset,
  onEndVisible,
}: Options) => {
  const isWorklet = useMemo(() => hasWorkletHash(onEndVisible), [onEndVisible]);

  const isAtEnd = useDerivedValue(() => {
    // Wait until the scroll view has been measured to avoid a spurious initial
    // `true` on a (0,0,0) layout (the helper would otherwise treat unmeasured
    // state as "at end" because 0 + 0 >= 0 - threshold).
    if (layout.value.height === 0 || size.value.height === 0) {
      return null;
    }

    const naturalContentHeight = IS_ANDROID
      ? Math.max(0, size.value.height - appliedInset.value)
      : size.value.height;

    return isScrollAtEnd(
      scroll.value,
      layout.value.height,
      naturalContentHeight,
      inverted,
    );
  });

  useAnimatedReaction(
    () => isAtEnd.value,
    (current, previous) => {
      if (current === null || current === previous || !onEndVisible) {
        return;
      }

      if (isWorklet) {
        onEndVisible(current);
      } else {
        runOnJS(onEndVisible)(current);
      }
    },
    [onEndVisible, isWorklet, inverted],
  );
};

import { renderHook } from "@testing-library/react-native";
import { useAnimatedRef } from "react-native-reanimated";

import type { useChatKeyboard } from "..";
import type Reanimated from "react-native-reanimated";

export type KeyboardEvent = { height: number };
export type Handlers = {
  onStart: (e: KeyboardEvent) => void;
  onMove: (e: KeyboardEvent) => void;
  onEnd: (e: KeyboardEvent) => void;
};

export const mockOffset = { value: 0 };
export const mockLayout = { value: { width: 390, height: 800 } };
export const mockSize = { value: { width: 390, height: 2000 } };

export const KEYBOARD = 300;
export const mockScrollTo = jest.fn();

/** Reset mock scroll state to defaults. */
export function reset() {
  mockOffset.value = 0;
  mockLayout.value = { width: 390, height: 800 };
  mockSize.value = { width: 390, height: 2000 };
}

/**
 * Common beforeEach: reset modules, inject trackable scrollTo, reset state.
 *
 * @example setupBeforeEach()
 */
export function setupBeforeEach() {
  jest.resetModules();

  jest.doMock("react-native-reanimated", () => ({
    ...require("react-native-reanimated/mock"),
    scrollTo: mockScrollTo,
    interpolate: (value: number, input: number[], output: number[]) => {
      "worklet";

      if (input[1] === 0) {
        return 0;
      }

      const progress = (value - input[0]) / (input[1] - input[0]);

      return output[0] + progress * (output[1] - output[0]);
    },
  }));

  reset();
  mockScrollTo.mockClear();
}

/**
 * Render the hook with optional freeze (defaults to `false`).
 *
 * @param options - Hook configuration (freeze is optional, defaults to false).
 * @returns renderHook result.
 * @example render({ inverted: false, keyboardLiftBehavior: "always" })
 */
export function render(
  options: Omit<Parameters<typeof useChatKeyboard>[1], "freeze" | "offset"> & {
    freeze?: boolean;
    offset?: number;
  },
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("..") as { useChatKeyboard: typeof useChatKeyboard };

  return renderHook(() => {
    const ref = useAnimatedRef<Reanimated.ScrollView>();

    return mod.useChatKeyboard(ref, {
      ...options,
      freeze: options.freeze ?? false,
      offset: options.offset ?? 0,
    });
  });
}

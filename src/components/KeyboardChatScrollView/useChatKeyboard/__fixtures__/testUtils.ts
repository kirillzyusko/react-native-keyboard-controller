import { renderHook } from "@testing-library/react-native";
import { useAnimatedRef } from "react-native-reanimated";

import type { useChatKeyboard } from "..";
import type Reanimated from "react-native-reanimated";

export type KeyboardEvent = { height: number; duration?: number };
export type Handlers = {
  onStart: (e: KeyboardEvent) => void;
  onMove: (e: KeyboardEvent) => void;
  onInteractive: (e: KeyboardEvent) => void;
  onEnd: (e: KeyboardEvent) => void;
};

export const mockOffset = { value: 0 };
export const mockLayout = { value: { width: 390, height: 800 } };
export const mockSize = { value: { width: 390, height: 2000 } };

export const KEYBOARD = 300;
export const mockScrollTo = jest.fn();

/**
 * Linear interpolate mock matching Reanimated's `interpolate` signature.
 *
 * @param value - The input value to interpolate.
 * @param input - Input range `[min, max]`.
 * @param output - Output range `[min, max]`.
 * @returns The interpolated value.
 * @example mockInterpolate(150, [0, 300], [0, 250]); // 125
 */
export function mockInterpolate(
  value: number,
  input: number[],
  output: number[],
): number {
  "worklet";

  if (input[1] === 0) {
    return 0;
  }

  const progress = (value - input[0]) / (input[1] - input[0]);

  return output[0] + progress * (output[1] - output[0]);
}

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
    interpolate: mockInterpolate,
  }));

  reset();
  mockScrollTo.mockClear();
}

type RenderOptions = Omit<
  Parameters<typeof useChatKeyboard>[1],
  "freeze" | "offset"
> & {
  freeze?: boolean;
  offset?: number;
};

/**
 * Create a render function that loads the hook from the given module path.
 *
 * @param modulePath - Relative path to the hook module (e.g. `"../index.ios"` or `"../index"`).
 * @returns A render function bound to that module.
 * @example const render = createRender("../index.ios");
 */
export function createRender(modulePath: string) {
  return function render(options: RenderOptions) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(modulePath) as {
      useChatKeyboard: typeof useChatKeyboard;
    };

    return renderHook(() => {
      const ref = useAnimatedRef<Reanimated.ScrollView>();

      return mod.useChatKeyboard(ref, {
        ...options,
        freeze: options.freeze ?? false,
        offset: options.offset ?? 0,
      });
    });
  };
}

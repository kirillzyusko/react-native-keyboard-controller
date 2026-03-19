import { renderHook } from "@testing-library/react-native";
import { useAnimatedRef } from "react-native-reanimated";

import { useExtraContentPadding } from "..";
import { sv } from "../../../../__fixtures__/sv";

import type { SharedValue } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

export const mockScrollTo = jest.fn();
export let reactionEffect: (current: number, previous: number | null) => void;

export const flushRAF = () => new Promise((resolve) => setTimeout(resolve, 0));

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  scrollTo: (...args: unknown[]) => mockScrollTo(...args),
  useAnimatedReaction: (
    producer: () => number,
    effect: (current: number, previous: number | null) => void,
  ) => {
    producer();
    reactionEffect = effect;
  },
}));

type RenderOptions = Omit<
  Parameters<typeof useExtraContentPadding>[0],
  "scrollViewRef" | "blankSpace"
> & {
  blankSpace?: SharedValue<number>;
};

export const createRender = () => {
  return function render(options: RenderOptions) {
    return renderHook(() => {
      const ref = useAnimatedRef<Reanimated.ScrollView>();

      useExtraContentPadding({
        scrollViewRef: ref,
        blankSpace: options.blankSpace ?? sv(0),
        ...options,
      });
    });
  };
};

beforeEach(() => {
  mockScrollTo.mockClear();
});

/**
 * Temporarily removes `nativeFabricUIManager` from global to simulate legacy
 * (bridge) architecture for the duration of the provided callback.
 *
 * @param fn - Callback to run under legacy arch conditions.
 */
export function withLegacyArch(fn: () => void) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const original = (global as any).nativeFabricUIManager;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).nativeFabricUIManager = undefined;

  try {
    fn();
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).nativeFabricUIManager = original;
  }
}

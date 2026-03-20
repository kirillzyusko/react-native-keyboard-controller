import { renderHook } from "@testing-library/react-native";
import { useAnimatedRef } from "react-native-reanimated";

import { sv } from "../../../../__fixtures__/sv";

import type { useExtraContentPadding } from "..";
import type { SharedValue } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

export const mockScrollTo = jest.fn();
export let reactionEffect: (current: number, previous: number | null) => void;

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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("..") as {
      useExtraContentPadding: typeof useExtraContentPadding;
    };

    return renderHook(() => {
      const ref = useAnimatedRef<Reanimated.ScrollView>();

      mod.useExtraContentPadding({
        scrollViewRef: ref,
        blankSpace: options.blankSpace ?? sv(0),
        ...options,
      });
    });
  };
};

beforeEach(() => {
  jest.resetModules();
  mockScrollTo.mockClear();
});

import { renderHook } from "@testing-library/react-native";
import { useAnimatedRef } from "react-native-reanimated";

import type { useExtraContentPadding } from "..";
import type { SharedValue } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

export const mockScrollTo = jest.fn();
export let reactionEffect: (current: number, previous: number | null) => void;

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  scrollTo: (...args: unknown[]) => mockScrollTo(...args),
  useAnimatedReaction: (
    _producer: () => number,
    effect: (current: number, previous: number | null) => void,
  ) => {
    reactionEffect = effect;
  },
}));

export const sv = <T>(initial: T): SharedValue<T> => {
  return { value: initial } as SharedValue<T>;
};

type RenderOptions = Omit<
  Parameters<typeof useExtraContentPadding>[0],
  "scrollViewRef"
>;

export const createRender = () => {
  return function render(options: RenderOptions) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("..") as {
      useExtraContentPadding: typeof useExtraContentPadding;
    };

    return renderHook(() => {
      const ref = useAnimatedRef<Reanimated.ScrollView>();

      mod.useExtraContentPadding({ scrollViewRef: ref, ...options });
    });
  };
};

beforeEach(() => {
  jest.resetModules();
  mockScrollTo.mockClear();
});

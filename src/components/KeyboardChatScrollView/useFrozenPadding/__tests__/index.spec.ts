import { renderHook } from "@testing-library/react-native";

import { useFrozenPadding } from "..";
import { sv } from "../../../../__fixtures__/sv";

import type { SharedValue } from "react-native-reanimated";

type KeyboardEvent = { height: number; duration?: number };
type Handlers = {
  onStart: (e: KeyboardEvent) => void;
  onMove: (e: KeyboardEvent) => void;
  onEnd: (e: KeyboardEvent) => void;
};
type Reaction = {
  producer: () => unknown;
  effect: (current: unknown, previous: unknown | null) => void;
  previous: unknown;
};

const KEYBOARD = 300;

let handlers: Handlers = {
  onStart: jest.fn(),
  onMove: jest.fn(),
  onEnd: jest.fn(),
};
const reactions: Reaction[] = [];

jest.mock("../../../../hooks", () => ({
  useKeyboardHandler: jest.fn((h: Handlers) => {
    handlers = h;
  }),
  useResizeMode: jest.fn(),
}));

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  interpolate: (value: number, input: number[], output: number[]) => {
    const progress = (value - input[0]) / (input[1] - input[0]);

    return output[0] + progress * (output[1] - output[0]);
  },
  useAnimatedReaction: (
    producer: () => unknown,
    effect: (current: unknown, previous: unknown | null) => void,
  ) => {
    reactions.push({
      producer,
      effect,
      previous: producer(),
    });
  },
}));

/** Run registered Reanimated reactions after mutating mocked shared values. */
function flushAnimatedReactions() {
  for (const reaction of reactions) {
    const current = reaction.producer();

    reaction.effect(current, reaction.previous);
    reaction.previous = current;
  }
}

/**
 * Render `useFrozenPadding` with a fresh padding shared value.
 *
 * @param options - Hook inputs owned by the test.
 * @param options.freeze - The `freeze` shared value driven by the test.
 * @param options.offset - The distance between the bottom of the screen and the `ScrollView`.
 * @returns The padding shared value owned by the caller.
 * @example const { padding } = render({ freeze: sv(false) });
 */
function render(options: { freeze: SharedValue<boolean>; offset?: number }) {
  const padding = sv(0);

  renderHook(() =>
    useFrozenPadding({
      freeze: options.freeze,
      offset: options.offset ?? 0,
      padding,
    }),
  );

  return { padding };
}

beforeEach(() => {
  reactions.length = 0;
});

describe("`useFrozenPadding`", () => {
  it("should reset padding when the keyboard closes while frozen", () => {
    const freeze = sv(false);
    const { padding } = render({ freeze });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    handlers.onEnd({ height: KEYBOARD });
    // `useChatKeyboard` applied the open-keyboard padding before the freeze
    padding.value = KEYBOARD;

    freeze.value = true;
    flushAnimatedReactions();
    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 120 });
    handlers.onEnd({ height: 0 });
    expect(padding.value).toBe(KEYBOARD);

    freeze.value = false;
    flushAnimatedReactions();

    expect(padding.value).toBe(0);
  });

  it("should apply the open-keyboard padding when the keyboard opens while frozen", () => {
    const freeze = sv(true);
    const { padding } = render({ freeze, offset: 50 });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 150 });
    handlers.onEnd({ height: KEYBOARD });
    expect(padding.value).toBe(0);

    freeze.value = false;
    flushAnimatedReactions();

    // getEffectiveHeight(300, 300, 50)
    expect(padding.value).toBe(KEYBOARD - 50);
  });

  it("should keep padding intact when the keyboard did not move while frozen", () => {
    const freeze = sv(false);
    const { padding } = render({ freeze });

    handlers.onStart({ height: KEYBOARD });
    handlers.onEnd({ height: KEYBOARD });
    padding.value = KEYBOARD;

    freeze.value = true;
    flushAnimatedReactions();
    freeze.value = false;
    flushAnimatedReactions();

    expect(padding.value).toBe(KEYBOARD);
  });

  it("should not touch padding on unrelated freeze transitions", () => {
    const freeze = sv(false);
    const { padding } = render({ freeze });

    handlers.onEnd({ height: 0 });
    padding.value = KEYBOARD;

    // false → true must not reconcile (writes are only skipped from now on)
    freeze.value = true;
    flushAnimatedReactions();

    expect(padding.value).toBe(KEYBOARD);
  });
});

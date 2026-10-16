import { renderHook } from "@testing-library/react-native";
import { useAnimatedRef } from "react-native-reanimated";

import { sv } from "../../../__fixtures__/sv";
import { useFrozenPadding } from "../useFrozenPadding";

import type { useChatKeyboard } from "../useChatKeyboard";
import type { KeyboardLiftBehavior } from "../useChatKeyboard/types";
import type Reanimated from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

type KeyboardEvent = { height: number; duration?: number };
type Handlers = {
  onStart?: (e: KeyboardEvent) => void;
  onMove?: (e: KeyboardEvent) => void;
  onInteractive?: (e: KeyboardEvent) => void;
  onEnd?: (e: KeyboardEvent) => void;
};
type Reaction = {
  producer: () => unknown;
  effect: (current: unknown, previous: unknown | null) => void;
  previous: unknown;
};

const KEYBOARD = 300;
const OFFSET = 20;

// `KeyboardChatScrollView` registers one keyboard handler per hook; dispatch
// every event to all of them, in registration order.
const handlerSets: Handlers[] = [];
const keyboard = {
  start: (height: number) =>
    handlerSets.forEach((h) => h.onStart?.({ height })),
  move: (height: number) => handlerSets.forEach((h) => h.onMove?.({ height })),
  end: (height: number) => handlerSets.forEach((h) => h.onEnd?.({ height })),
  transition(from: number, to: number) {
    this.start(to);
    this.move((from + to) / 2);
    this.move(to);
    this.end(to);
  },
};

const mockOffset = { value: 0 };
const mockLayout = { value: { width: 390, height: 800 } };
const mockSize = { value: { width: 390, height: 2000 } };
const mockScrollTo = jest.fn();
const mockReactions: Reaction[] = [];

jest.mock("../../../hooks", () => ({
  useKeyboardHandler: jest.fn((h: Handlers) => {
    handlerSets.push(h);
  }),
  useResizeMode: jest.fn(),
}));

jest.mock("../../hooks/useScrollState", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    offset: mockOffset,
    layout: mockLayout,
    size: mockSize,
  })),
}));

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  scrollTo: (_ref: unknown, _x: number, y: number) => mockScrollTo(y),
  interpolate: (value: number, input: number[], output: number[]) => {
    if (input[1] === input[0]) {
      return output[0];
    }

    const progress = (value - input[0]) / (input[1] - input[0]);

    return output[0] + progress * (output[1] - output[0]);
  },
  useAnimatedReaction: (
    producer: () => unknown,
    effect: (current: unknown, previous: unknown | null) => void,
  ) => {
    mockReactions.push({ producer, effect, previous: producer() });
  },
}));

/** Run registered reactions whose producer value changed. */
function flushAnimatedReactions() {
  for (const reaction of mockReactions) {
    const current = reaction.producer();

    if (current !== reaction.previous) {
      reaction.effect(current, reaction.previous);
      reaction.previous = current;
    }
  }
}

/**
 * Render `useChatKeyboard` together with `useFrozenPadding`, the way
 * `KeyboardChatScrollView` wires them.
 *
 * @param modulePath - `"../useChatKeyboard/index.ios"` or `"../useChatKeyboard/index.ts"`.
 * @param options - Hook options under test.
 * @param options.inverted - Whether the list is inverted.
 * @param options.keyboardLiftBehavior - The lift behavior under test.
 * @returns The hook result and the `freeze` shared value driven by the test.
 * @example const { result, freeze } = render("../useChatKeyboard/index.ios", {});
 */
function render(
  modulePath: string,
  options: { inverted?: boolean; keyboardLiftBehavior?: KeyboardLiftBehavior },
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(modulePath) as {
    useChatKeyboard: typeof useChatKeyboard;
  };
  const freeze: SharedValue<boolean> = sv(false);

  const { result } = renderHook(() => {
    const ref = useAnimatedRef<Reanimated.ScrollView>();
    const chat = mod.useChatKeyboard(ref, {
      inverted: options.inverted ?? false,
      keyboardLiftBehavior: options.keyboardLiftBehavior ?? "always",
      freeze,
      offset: OFFSET,
      blankSpace: sv(0),
      extraContentPadding: sv(0),
    });

    useFrozenPadding({ freeze, offset: OFFSET, padding: chat.padding });

    return chat;
  });

  return { result, freeze };
}

/**
 * Write `freeze` and flush the reactions that observe it, so
 * `useFrozenPadding`'s thaw reaction runs before the next keyboard event.
 *
 * @param freeze - The `freeze` shared value returned by `render`.
 * @param value - The new `freeze` value.
 * @example setFreeze(freeze, false);
 */
function setFreeze(freeze: SharedValue<boolean>, value: boolean) {
  freeze.value = value;
  flushAnimatedReactions();
}

beforeEach(() => {
  handlerSets.length = 0;
  mockReactions.length = 0;
  mockScrollTo.mockClear();
  mockOffset.value = 0;
  mockLayout.value = { width: 390, height: 800 };
  mockSize.value = { width: 390, height: 2000 };
});

describe.each([
  ["iOS", "../useChatKeyboard/index.ios"],
  ["Android", "../useChatKeyboard/index.ts"],
])("`KeyboardChatScrollView` frozen transitions — %s", (_, modulePath) => {
  it("should apply the offset-adjusted padding after a first open while frozen", () => {
    const { result, freeze } = render(modulePath, {});

    setFreeze(freeze, true);
    keyboard.transition(0, KEYBOARD);
    setFreeze(freeze, false);

    expect(result.current.padding.value).toBe(KEYBOARD - OFFSET);
  });
});

describe("`KeyboardChatScrollView` frozen transitions — iOS", () => {
  it("should not replay a shift on the live close after a frozen open", () => {
    const { result, freeze } = render("../useChatKeyboard/index.ios", {});

    mockOffset.value = 1200;
    setFreeze(freeze, true);
    keyboard.transition(0, KEYBOARD);
    setFreeze(freeze, false);

    keyboard.start(0);

    expect(result.current.contentOffsetY!.value).toBe(1200);
  });
});

describe("`KeyboardChatScrollView` frozen transitions — Android", () => {
  it("should not scroll on the live close after a frozen open", () => {
    const { freeze } = render("../useChatKeyboard/index.ts", {});

    // a live open and close leave a recorded shift behind
    keyboard.transition(0, KEYBOARD);
    keyboard.transition(KEYBOARD, 0);
    mockOffset.value = 1200;
    mockScrollTo.mockClear();

    setFreeze(freeze, true);
    keyboard.transition(0, KEYBOARD);
    setFreeze(freeze, false);
    keyboard.transition(KEYBOARD, 0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should not jump an inverted list away from the end when a frozen close thaws mid-animation", () => {
    const { freeze } = render("../useChatKeyboard/index.ts", {
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
    });

    mockOffset.value = 600;
    keyboard.transition(0, KEYBOARD);
    mockScrollTo.mockClear();

    setFreeze(freeze, true);
    keyboard.start(0);
    keyboard.move(200);
    setFreeze(freeze, false);
    keyboard.move(100);
    keyboard.move(0);
    keyboard.end(0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should not scroll an inverted list away from the end on the live close after a frozen open", () => {
    const { freeze } = render("../useChatKeyboard/index.ts", {
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
    });

    mockOffset.value = 600;
    setFreeze(freeze, true);
    keyboard.transition(0, KEYBOARD);
    setFreeze(freeze, false);
    keyboard.transition(KEYBOARD, 0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});

import { renderHook } from "@testing-library/react-native";

import { sv } from "../../../__fixtures__/sv";
import { useKeyboardAnimation, useTranslateAnimation } from "../hooks";

import type { KeyboardHandler, NativeEvent } from "../../../types";

type Handlers = Required<KeyboardHandler>;

const KEYBOARD = 300;

const mockContext = { height: sv(0), progress: sv(0) };
const mockHandler: { current: Handlers | null } = { current: null };
// work that Reanimated would schedule on the UI thread
const mockUIQueue: Array<() => void> = [];
let mockIsOnUIThread = false;

/**
 * Runs a callback as if it was executed on the UI thread.
 *
 * @param callback - The callback to run.
 * @example onUIThread(() => handler.onEnd(event));
 */
function onUIThread(callback: () => void) {
  mockIsOnUIThread = true;
  callback();
  mockIsOnUIThread = false;
}

/**
 * Creates a shared value that mimics Reanimated's threading model: writes from
 * worklets are applied immediately, while writes from JS are scheduled on the
 * UI thread.
 *
 * @template T - Type of the stored value.
 * @param initial - Value stored before any write happens.
 * @returns An object with a `value` accessor.
 * @example const isClosed = mockSharedValue(true);
 */
function mockSharedValue<T>(initial: T) {
  let current = initial;

  return {
    get value() {
      return current;
    },
    set value(next: T) {
      if (mockIsOnUIThread) {
        current = next;
      } else {
        mockUIQueue.push(() => {
          current = next;
        });
      }
    },
  };
}

jest.mock("react-native-reanimated", () => {
  const { useState } = require("react");

  return {
    ...require("react-native-reanimated/mock"),
    useSharedValue: <T>(initial: T) =>
      useState(() => mockSharedValue(initial))[0],
    runOnUI:
      (worklet: (...args: unknown[]) => void) =>
      (...args: unknown[]) => {
        mockUIQueue.push(() => worklet(...args));
      },
  };
});

jest.mock("../../../context", () => ({
  useKeyboardContext: () => ({ reanimated: mockContext }),
}));

jest.mock("../../../hooks", () => ({
  useKeyboardHandler: (handler: Handlers) => {
    mockHandler.current = handler;
  },
}));

/**
 * Runs callbacks queued by `runOnUI` and by shared value writes from JS.
 *
 * @example flushUIThread();
 */
function flushUIThread() {
  onUIThread(() => {
    mockUIQueue.splice(0).forEach((callback) => callback());
  });
}

/**
 * Dispatches a keyboard event to the registered handler on the UI thread.
 *
 * @param type - Name of the handler to invoke.
 * @param height - Keyboard height reported by the event.
 * @param progress - Keyboard progress reported by the event.
 * @example emit("onEnd", 300, 1);
 */
function emit(type: keyof Handlers, height: number, progress: number) {
  const event: NativeEvent = { height, progress, duration: 250, target: 1 };

  onUIThread(() => mockHandler.current?.[type](event));
}

/**
 * Simulates a keyboard appearance: start, two frames and end.
 *
 * @example open();
 */
function open() {
  emit("onStart", KEYBOARD, 1);
  emit("onMove", KEYBOARD / 2, 0.5);
  emit("onMove", KEYBOARD, 1);
  emit("onEnd", KEYBOARD, 1);
}

beforeEach(() => {
  mockContext.height.value = 0;
  mockContext.progress.value = 0;
  mockHandler.current = null;
  mockUIQueue.length = 0;
});

describe("`useKeyboardAnimation` initial state", () => {
  it("should be taken from the context when the keyboard is already open", () => {
    mockContext.height.value = -KEYBOARD;
    mockContext.progress.value = 1;

    const { result } = renderHook(() => useKeyboardAnimation());

    flushUIThread();

    expect(result.current.heightWhenOpened.value).toBe(KEYBOARD);
    expect(result.current.height.value).toBe(KEYBOARD);
    expect(result.current.progress.value).toBe(1);
    expect(result.current.isClosed.value).toBe(false);
  });

  it("should not override keyboard events handled before it was applied", () => {
    const { result } = renderHook(() => useKeyboardAnimation());

    open();
    flushUIThread();

    expect(result.current.heightWhenOpened.value).toBe(KEYBOARD);
    expect(result.current.height.value).toBe(KEYBOARD);
    expect(result.current.progress.value).toBe(1);
    expect(result.current.isClosed.value).toBe(false);
  });

  it("should not override `onStart` handled before it was applied", () => {
    const { result } = renderHook(() => useKeyboardAnimation());

    emit("onStart", KEYBOARD, 1);
    flushUIThread();
    emit("onMove", KEYBOARD / 2, 0.5);
    emit("onMove", KEYBOARD, 1);
    emit("onEnd", KEYBOARD, 1);

    expect(result.current.heightWhenOpened.value).toBe(KEYBOARD);
    expect(result.current.isClosed.value).toBe(false);
  });

  it("should get keyboard height from `onEnd` if `onStart` was missed", () => {
    // keyboard started to open before the handler was attached
    mockContext.height.value = -KEYBOARD / 3;
    mockContext.progress.value = 1 / 3;

    const { result } = renderHook(() => useKeyboardAnimation());

    flushUIThread();
    emit("onMove", KEYBOARD, 1);
    emit("onEnd", KEYBOARD, 1);

    expect(result.current.heightWhenOpened.value).toBe(KEYBOARD);
    expect(result.current.isClosed.value).toBe(false);
  });
});

describe("`useTranslateAnimation` initial state", () => {
  it("should not override keyboard events handled before it was applied", () => {
    const { result } = renderHook(() => useTranslateAnimation());

    open();
    flushUIThread();

    expect(result.current.padding.value).toBe(1);
  });
});

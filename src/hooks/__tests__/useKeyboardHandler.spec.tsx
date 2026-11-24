import { act, renderHook } from "@testing-library/react-native";
import React, { Suspense } from "react";

import {
  useKeyboardAnimation,
  useTranslateAnimation,
} from "../../components/KeyboardAvoidingView/hooks";
import { useGenericKeyboardHandler } from "../index";

import type { EventWithName, NativeEvent } from "../../types";

type KeyboardEvent = EventWithName<NativeEvent>;

const KEYBOARD = 300;

// work scheduled for the UI thread: writes to shared values made from JS and
// worklets passed to `runOnUI`
const mockUIQueue: (() => void)[] = [];
const mockHandlers = new Set<(event: KeyboardEvent) => void>();
let mockIsOnUIThread = false;
let mockBeforeAttach: (() => void) | null = null;
// the provider follows the keyboard frame by frame on Android and gets the
// destination when the movement starts on iOS
let providerOS: "android" | "ios" = "android";

/**
 * Creates a shared value that follows the threading model of Reanimated: a write
 * from a worklet is applied immediately, a write from JS is applied on the UI
 * thread later (when the current JS task is over).
 *
 * @template T - Type of the stored value.
 * @param initial - Value stored before any write happens.
 * @returns An object with a `value` accessor.
 * @example const progress = mockSharedValue(0);
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

const mockContext = {
  reanimated: { height: mockSharedValue(0), progress: mockSharedValue(0) },
  setKeyboardHandlers: (handler: (event: KeyboardEvent) => void) => {
    // the registration is applied on the UI thread a bit later than it is requested,
    // an event dispatched in between is not delivered to the handler
    mockBeforeAttach?.();
    mockBeforeAttach = null;
    mockHandlers.add(handler);

    return () => {
      mockHandlers.delete(handler);
    };
  },
};

jest.mock("react-native-reanimated", () => {
  const { useState } = jest.requireActual("react");

  return {
    ...jest.requireActual("react-native-reanimated/mock"),
    useSharedValue: <T,>(initial: T) =>
      useState(() => mockSharedValue(initial))[0],
    useEvent: (worklet: (event: KeyboardEvent) => void) => worklet,
    runOnUI:
      (worklet: (...args: unknown[]) => void) =>
      (...args: unknown[]) => {
        mockUIQueue.push(() => worklet(...args));
      },
  };
});

jest.mock("../../bindings", () => ({
  KeyboardControllerNative: {
    getConstants: () => ({ keyboardBorderRadius: 0 }),
  },
  KeyboardEvents: { addListener: () => ({ remove: () => {} }) },
  WindowDimensionsEvents: { addListener: () => ({ remove: () => {} }) },
}));

jest.mock("../../context", () => ({
  useKeyboardContext: () => mockContext,
}));

jest.mock("../../reanimated", () => ({
  useHandler: () => ({ doDependenciesDiffer: false }),
}));

jest.mock("../../module", () => ({
  KeyboardController: { setInputMode: jest.fn(), setDefaultMode: jest.fn() },
}));

/**
 * Runs a callback as if it was executed on the UI thread.
 *
 * @param callback - The callback to run.
 * @example onUIThread(() => handler(event));
 */
function onUIThread(callback: () => void) {
  mockIsOnUIThread = true;
  callback();
  mockIsOnUIThread = false;
}

/**
 * Finishes the current JS task: runs microtasks and applies everything that
 * was scheduled for the UI thread.
 *
 * @example await finishJSTask();
 */
async function finishJSTask() {
  await Promise.resolve();
  await Promise.resolve();

  onUIThread(() => {
    while (mockUIQueue.length > 0) {
      mockUIQueue.shift()?.();
    }
  });
}

/**
 * Dispatches a keyboard event on the UI thread: updates the values of the
 * provider (the way it happens on the tested platform) and calls the
 * registered handlers.
 *
 * @param type - Type of the event.
 * @param height - Keyboard height reported by the event.
 * @param progress - Keyboard progress reported by the event.
 * @example emit("Move", 150, 0.5);
 */
function emit(
  type: "Start" | "" | "End" | "Interactive",
  height: number,
  progress: number,
) {
  const event: KeyboardEvent = {
    eventName: `onKeyboardMove${type}`,
    height,
    progress,
    duration: 250,
    target: 1,
  };

  const isProviderUpdated =
    type === "Interactive" ||
    (providerOS === "ios" ? type === "Start" : type !== "Start");

  onUIThread(() => {
    if (isProviderUpdated) {
      mockContext.reanimated.height.value = -height;
      mockContext.reanimated.progress.value = progress;
    }
    mockHandlers.forEach((handler) => handler(event));
  });
}

/**
 * Simulates a keyboard appearance.
 *
 * @example open();
 */
function open() {
  emit("Start", KEYBOARD, 1);
  emit("", 0, 0);
  emit("", KEYBOARD / 2, 0.5);
  emit("", KEYBOARD, 1);
  emit("End", KEYBOARD, 1);
}

/**
 * Simulates a keyboard disappearance.
 *
 * @example close();
 */
function close() {
  emit("Start", 0, 0);
  emit("", KEYBOARD, 1);
  emit("", KEYBOARD / 2, 0.5);
  emit("", 0, 0);
  emit("End", 0, 0);
}

/**
 * Puts the keyboard into a state without dispatching events to handlers.
 *
 * @param height - Keyboard height.
 * @param progress - Keyboard progress.
 * @example setKeyboard(300, 1);
 */
function setKeyboard(height: number, progress: number) {
  onUIThread(() => {
    mockContext.reanimated.height.value = -height;
    mockContext.reanimated.progress.value = progress;
  });
}

const neverResolves = new Promise<never>(() => {});
let isFrozen = false;

/**
 * Suspends children like `react-freeze` does: their layout effects are
 * destroyed (the handlers get detached) while the state is preserved.
 *
 * @param props - Component props.
 * @param props.children - Children to freeze.
 * @returns The children while they are not frozen.
 * @example <Freezer><Screen /></Freezer>
 */
function Freezer({ children }: { children: React.ReactNode }) {
  if (isFrozen) {
    throw neverResolves;
  }

  return <>{children}</>;
}

const FreezeWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={null}>
    <Freezer>{children}</Freezer>
  </Suspense>
);

beforeEach(() => {
  providerOS = "android";
  setKeyboard(0, 0);
  mockHandlers.clear();
  mockUIQueue.length = 0;
  mockBeforeAttach = null;
  isFrozen = false;
});

describe("`useGenericKeyboardHandler` synchronization", () => {
  const renderHandler = (wrapper?: typeof FreezeWrapper) => {
    const calls: string[] = [];
    const { rerender } = renderHook(
      () => {
        useGenericKeyboardHandler(
          {
            onSync: (e) => {
              calls.push(`sync:${e.progress}`);
            },
            onStart: (e) => {
              calls.push(`start:${e.progress}`);
            },
            onMove: (e) => {
              calls.push(`move:${e.progress}`);
            },
            onEnd: (e) => {
              calls.push(`end:${e.progress}`);
            },
          },
          [],
        );
      },
      { wrapper },
    );

    return { calls, rerender };
  };

  it("should report the state of the keyboard when the handler gets attached", async () => {
    setKeyboard(KEYBOARD, 1);

    const { calls } = renderHandler();

    await finishJSTask();

    expect(calls).toEqual(["sync:1"]);
  });

  it("should report the current state when the keyboard moves during the mount", async () => {
    setKeyboard(KEYBOARD, 1);

    const { calls } = renderHandler();

    // the keyboard gets closed before the JS task that mounted the hook is over
    close();
    await finishJSTask();

    expect(calls).toEqual([
      "start:0",
      "move:1",
      "move:0.5",
      "move:0",
      "end:0",
      "sync:0",
    ]);
  });

  it("should report the current state when the keyboard moved before the handler got attached", async () => {
    setKeyboard(KEYBOARD, 1);
    mockBeforeAttach = close;

    const { calls } = renderHandler();

    await finishJSTask();

    expect(calls).toEqual(["sync:0"]);
  });

  it("should report the state again when a frozen screen becomes active", async () => {
    const { calls, rerender } = renderHandler(FreezeWrapper);

    await finishJSTask();
    isFrozen = true;
    act(() => rerender({}));
    await finishJSTask();
    setKeyboard(KEYBOARD, 1);
    isFrozen = false;
    act(() => rerender({}));
    await finishJSTask();

    expect(calls).toEqual(["sync:0", "sync:1"]);
  });
});

describe.each(["android", "ios"] as const)(
  "`KeyboardAvoidingView` state on %s",
  (os) => {
    beforeEach(() => {
      providerOS = os;
    });

    const renderScreen = () => {
      const { result, rerender } = renderHook(() => useKeyboardAnimation(), {
        wrapper: FreezeWrapper,
      });
      const setFrozen = (frozen: boolean) => {
        isFrozen = frozen;
        act(() => rerender({}));
      };

      return {
        keyboard: result,
        freeze: () => setFrozen(true),
        unfreeze: () => setFrozen(false),
      };
    };
    const expectOpened = (
      keyboard: ReturnType<typeof renderScreen>["keyboard"],
    ) => {
      expect(keyboard.current.heightWhenOpened.value).toBe(KEYBOARD);
      expect(keyboard.current.height.value).toBe(KEYBOARD);
      expect(keyboard.current.progress.value).toBe(1);
      expect(keyboard.current.isClosed.value).toBe(false);
    };
    const expectClosed = (
      keyboard: ReturnType<typeof renderScreen>["keyboard"],
    ) => {
      expect(keyboard.current.height.value).toBe(0);
      expect(keyboard.current.progress.value).toBe(0);
      expect(keyboard.current.isClosed.value).toBe(true);
    };

    it("should be taken from the context when the keyboard is already opened", async () => {
      setKeyboard(KEYBOARD, 1);

      const { keyboard } = renderScreen();

      await finishJSTask();

      expectOpened(keyboard);
    });

    it("should be closed when the keyboard gets closed during the mount", async () => {
      setKeyboard(KEYBOARD, 1);

      const { keyboard } = renderScreen();

      close();
      await finishJSTask();

      expectClosed(keyboard);
    });

    it("should be closed when the mount is over in the middle of keyboard disappearance", async () => {
      setKeyboard(KEYBOARD, 1);

      const { keyboard } = renderScreen();

      emit("Start", 0, 0);
      emit("", KEYBOARD / 2, 0.5);
      await finishJSTask();
      emit("", 0, 0);
      emit("End", 0, 0);

      expectClosed(keyboard);
    });

    it("should be closed when the end of keyboard disappearance is dispatched before the handler gets attached", async () => {
      // the last frame of the animation (the provider has the destination on iOS)
      setKeyboard(os === "ios" ? 0 : KEYBOARD / 30, os === "ios" ? 0 : 1 / 30);
      mockBeforeAttach = () => emit("End", 0, 0);

      const { keyboard } = renderScreen();

      await finishJSTask();

      expectClosed(keyboard);
    });

    it("should be opened when the keyboard gets opened during the mount", async () => {
      const { keyboard } = renderScreen();

      open();
      await finishJSTask();

      expectOpened(keyboard);
    });

    it("should be opened when the mount is over in the middle of keyboard appearance", async () => {
      const { keyboard } = renderScreen();

      emit("Start", KEYBOARD, 1);
      emit("", KEYBOARD / 2, 0.5);
      await finishJSTask();
      emit("", KEYBOARD, 1);
      emit("End", KEYBOARD, 1);

      expectOpened(keyboard);
    });

    it("should be opened when the end of keyboard appearance is dispatched before the handler gets attached", async () => {
      setKeyboard(
        os === "ios" ? KEYBOARD : KEYBOARD * 0.9,
        os === "ios" ? 1 : 0.9,
      );
      mockBeforeAttach = () => emit("End", KEYBOARD, 1);

      const { keyboard } = renderScreen();

      await finishJSTask();

      expectOpened(keyboard);
    });

    it("should know keyboard height when mounted in the middle of keyboard appearance", async () => {
      // `onStart` was dispatched before the mount
      if (os === "ios") {
        setKeyboard(KEYBOARD, 1);
      } else {
        setKeyboard(KEYBOARD / 3, 1 / 3);
      }

      const { keyboard } = renderScreen();

      await finishJSTask();
      emit("", KEYBOARD, 1);
      emit("End", KEYBOARD, 1);

      expectOpened(keyboard);
    });

    it("should be closed when the keyboard was closed while the screen was frozen", async () => {
      const { keyboard, freeze, unfreeze } = renderScreen();

      await finishJSTask();
      open();
      expectOpened(keyboard);

      freeze();
      await finishJSTask();
      expect(mockHandlers.size).toBe(0);
      setKeyboard(0, 0);

      unfreeze();
      await finishJSTask();

      expectClosed(keyboard);
    });

    it("should be opened when the keyboard was opened while the screen was frozen", async () => {
      const { keyboard, freeze, unfreeze } = renderScreen();

      await finishJSTask();
      freeze();
      await finishJSTask();
      setKeyboard(KEYBOARD, 1);

      unfreeze();
      await finishJSTask();

      expectOpened(keyboard);
    });

    it("should be closed when the keyboard gets closed while a frozen screen becomes active", async () => {
      const { keyboard, freeze, unfreeze } = renderScreen();

      await finishJSTask();
      open();
      freeze();
      await finishJSTask();

      unfreeze();
      close();
      await finishJSTask();

      expectClosed(keyboard);
    });
  },
);

describe("`KeyboardAvoidingView` padding of `translate-with-padding`", () => {
  it("should be removed when the keyboard gets closed during the mount", async () => {
    setKeyboard(KEYBOARD, 1);

    const { result } = renderHook(() => useTranslateAnimation());

    close();
    await finishJSTask();

    expect(result.current.padding.value).toBe(0);
  });

  it("should be applied when the keyboard gets opened during the mount", async () => {
    const { result } = renderHook(() => useTranslateAnimation());

    open();
    await finishJSTask();

    expect(result.current.padding.value).toBe(1);
  });
});

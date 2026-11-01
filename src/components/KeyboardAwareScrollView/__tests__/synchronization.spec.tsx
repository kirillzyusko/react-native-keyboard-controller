import "../__fixtures__/mocks";

import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { TextInput } from "react-native";
import * as Reanimated from "react-native-reanimated";

import { useReanimatedFocusedInput, useWindowDimensions } from "../../../hooks";
import {
  BOTTOM_OFFSET,
  INPUT_LAYOUT_B,
  INPUT_TARGET_B,
  KEYBOARD_HEIGHT,
  MOCK_SCREEN_HEIGHT,
  inputEvent,
  kbEvent,
  lastScrollToY,
  mockCapturedOnLayout,
  mockInput,
  mockKeyboardHandlers,
  mockOffset,
  mockScrollTo,
  mockSelectionHandler,
  reset,
  selectionEvent,
} from "../__fixtures__/testUtils";
import KeyboardAwareScrollView from "../index";

import type {
  KeyboardAwareScrollViewProps,
  KeyboardAwareScrollViewRef,
} from "../../../types";
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

let frames: FrameRequestCallback[];
let uiJobs: (() => void)[];
let acknowledgements: (() => void)[];
const mockUpdate = jest.fn();

beforeEach(() => {
  reset();
  frames = [];
  uiJobs = [];
  acknowledgements = [];
  mockUpdate.mockReset().mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        acknowledgements.push(resolve);
      }),
  );
  jest.mocked(useWindowDimensions).mockReturnValue({
    width: 390,
    height: MOCK_SCREEN_HEIGHT,
  });
  jest.mocked(useReanimatedFocusedInput).mockReturnValue({
    input: mockInput,
    update: mockUpdate,
  });
  jest
    .spyOn(Reanimated, "runOnUI")
    .mockImplementation((callback) => (...args) => {
      uiJobs.push(() => callback(...args));
    });
  jest.spyOn(global, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);

    return frames.length;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const acknowledgeNativeMeasurement = async (scrollOffset: number) => {
  await act(async () => {
    mockInput.value = inputEvent(INPUT_TARGET_B, {
      ...INPUT_LAYOUT_B,
      absoluteY: INPUT_LAYOUT_B.absoluteY - scrollOffset,
    });
    // The provider's global layoutDidSynchronize event resolves every listener.
    const listeners = acknowledgements.splice(0);

    listeners.forEach((resolve) => resolve());
    await Promise.resolve();
  });
};

const runScheduledFrames = async () => {
  await act(async () => {
    // Run this batch only; another native measurement may schedule later work.
    const callbacks = frames.splice(0);

    callbacks.forEach((callback) => callback(0));
    await Promise.resolve();
  });
};

const runUIJobs = async () => {
  await act(async () => {
    const jobs = uiJobs.splice(0);

    jobs.forEach((job) => job());
    await Promise.resolve();
  });
};

const setup = async (
  options: Pick<
    KeyboardAwareScrollViewProps,
    "mode" | "onScrollBeginDrag"
  > = {},
) => {
  const ref = React.createRef<KeyboardAwareScrollViewRef>();
  const screen = (bottomOffset: number) => (
    <KeyboardAwareScrollView
      ref={ref}
      bottomOffset={bottomOffset}
      testID="synchronization-scroll-view"
      {...options}
    >
      <TextInput defaultValue="Draft" />
    </KeyboardAwareScrollView>
  );
  const result = render(screen(BOTTOM_OFFSET));

  await act(async () => {
    mockCapturedOnLayout.current?.({
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 812 } },
    } as LayoutChangeEvent);
  });
  await acknowledgeNativeMeasurement(0);
  await runScheduledFrames();
  await runUIJobs();

  act(() => {
    mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B));
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
  });
  mockOffset.value = 100;
  mockScrollTo.mockClear();

  return {
    ref,
    unmount: result.unmount,
    beginDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollView = result.getByTestId("synchronization-scroll-view");

      fireEvent(scrollView, "scrollBeginDrag", event);
    },
    rerender: (bottomOffset: number) => result.rerender(screen(bottomOffset)),
  };
};

describe("KeyboardAwareScrollView — asynchronous synchronization", () => {
  it("coalesces overlapping requests and measures the latest after the pending request finishes", async () => {
    const view = await setup();

    view.rerender(120);
    view.rerender(90);
    view.rerender(BOTTOM_OFFSET);
    await acknowledgeNativeMeasurement(100);
    await runScheduledFrames();
    await runUIJobs();

    expect(mockScrollTo).not.toHaveBeenCalled();
    expect(acknowledgements).toHaveLength(1);
    // Mount, the first request, and only the latest queued request measure.
    expect(mockUpdate).toHaveBeenCalledTimes(3);
    await acknowledgeNativeMeasurement(100);
    await runScheduledFrames();
    await runUIJobs();

    // 695.67 + caret 47 - visible height 616 + offset 62 = 188.67.
    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(lastScrollToY()).toBeCloseTo(188.67, 1);
  });

  it("does not let an older native acknowledgement release a newer measurement", async () => {
    const view = await setup();

    view.rerender(120);
    // A measured at 100; native scrolling advanced before B was requested.
    mockOffset.value = 150;
    view.rerender(BOTTOM_OFFSET);
    await acknowledgeNativeMeasurement(100);
    await runScheduledFrames();
    await runUIJobs();

    // B needs its own measurement: A's absoluteY would target 238.67 here.
    expect(mockScrollTo).not.toHaveBeenCalled();
    expect(acknowledgements).toHaveLength(1);
    await acknowledgeNativeMeasurement(150);
    await runScheduledFrames();
    await runUIJobs();
    expect(lastScrollToY()).toBeCloseTo(188.67, 1);
  });

  it("does not enqueue an old offset's scroll when props change before its JS frame", async () => {
    const view = await setup();

    view.rerender(120);
    await acknowledgeNativeMeasurement(100);
    view.rerender(BOTTOM_OFFSET);
    await runScheduledFrames();
    await runUIJobs();

    expect(mockScrollTo).not.toHaveBeenCalled();
    await acknowledgeNativeMeasurement(100);
    await runScheduledFrames();
    await runUIJobs();
    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(lastScrollToY()).toBeCloseTo(188.67, 1);
  });

  it("uses the latest scroll callback props for a pending request", async () => {
    const view = await setup();

    act(() => view.ref.current?.assureFocusedInputVisible());
    const requestsBeforeResize = mockUpdate.mock.calls.length;

    // Only the callback prop changes here; this does not model native reflow.
    jest
      .mocked(useWindowDimensions)
      .mockReturnValue({ width: 390, height: 900 });
    view.rerender(BOTTOM_OFFSET);
    await acknowledgeNativeMeasurement(100);
    await runScheduledFrames();
    await runUIJobs();

    expect(mockUpdate).toHaveBeenCalledTimes(requestsBeforeResize);
    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(lastScrollToY()).toBeCloseTo(216.67, 1);
  });

  it.each(["native measurement", "JS frame", "UI queue"])(
    "does not combine old absoluteY with a scroll that moved during %s",
    async (stage) => {
      const view = await setup();

      act(() => view.ref.current?.assureFocusedInputVisible());

      if (stage !== "native measurement") {
        await acknowledgeNativeMeasurement(100);
      }
      if (stage === "UI queue") {
        await runScheduledFrames();
      }
      mockOffset.value = 150;

      if (stage === "native measurement") {
        await acknowledgeNativeMeasurement(100);
      }
      if (stage !== "UI queue") {
        await runScheduledFrames();
      }
      await runUIJobs();

      // Old geometry plus the new offset would incorrectly target 238.67.
      expect(mockScrollTo).not.toHaveBeenCalled();

      // Movement must trigger a new native measurement without another caller.
      expect(acknowledgements).toHaveLength(1);
      await acknowledgeNativeMeasurement(150);
      await runScheduledFrames();
      await runUIJobs();
      expect(lastScrollToY()).toBeCloseTo(188.67, 1);
    },
  );

  describe.each(["insets", "layout"] as const)(
    "user drag in %s mode",
    (mode) => {
      it.each([
        "native measurement",
        "waiting measurement",
        "remeasurement",
        "queued retry",
      ])(
        "cancels pending %s and preserves the caller's callback",
        async (stage) => {
          const onScrollBeginDrag = jest.fn();
          const view = await setup({ mode, onScrollBeginDrag });
          const retries: (() => void)[] = [];

          act(() => view.ref.current?.assureFocusedInputVisible());

          if (stage === "waiting measurement") {
            act(() => view.ref.current?.assureFocusedInputVisible());
          }
          if (stage === "remeasurement" || stage === "queued retry") {
            await acknowledgeNativeMeasurement(100);
            mockOffset.value = 150;
            await runScheduledFrames();

            if (stage === "queued retry") {
              jest
                .spyOn(Reanimated, "runOnJS")
                .mockImplementation((callback) => (...args) => {
                  retries.push(() => callback(...args));
                });
            }
            await runUIJobs();
          }
          const requestsBeforeDrag = mockUpdate.mock.calls.length;
          const event = {
            nativeEvent: { contentOffset: { x: 0, y: 150 } },
          } as NativeSyntheticEvent<NativeScrollEvent>;

          view.beginDrag(event);

          if (stage === "queued retry") {
            await act(async () => {
              retries.forEach((retry) => retry());
            });
          } else {
            await acknowledgeNativeMeasurement(150);
          }
          await runScheduledFrames();
          await runUIJobs();

          expect(onScrollBeginDrag).toHaveBeenCalledTimes(1);
          expect(onScrollBeginDrag).toHaveBeenCalledWith(event);
          expect(mockUpdate).toHaveBeenCalledTimes(requestsBeforeDrag);
          expect(mockScrollTo).not.toHaveBeenCalled();
        },
      );
    },
  );

  it.each(["native measurement", "JS frame"])(
    "does not enqueue a scroll after unmount while waiting for %s",
    async (stage) => {
      const view = await setup();

      act(() => view.ref.current?.assureFocusedInputVisible());

      if (stage === "JS frame") {
        await acknowledgeNativeMeasurement(100);
      }
      view.unmount();

      if (stage === "native measurement") {
        await acknowledgeNativeMeasurement(100);
      }
      await runScheduledFrames();
      await runUIJobs();

      // Already queued UI work is outside this JS cancellation guarantee.
      expect(mockScrollTo).not.toHaveBeenCalled();
    },
  );
});

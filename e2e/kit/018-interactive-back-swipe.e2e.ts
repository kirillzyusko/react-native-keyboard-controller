import { expect } from "detox";

import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

const describeIOS = device.getPlatform() === "ios" ? describe : describe.skip;
const BLINKING_CURSOR = 0.35;

const composerY = async () => {
  const attributes = await element(
    by.id("back-swipe.composer"),
  ).getAttributes();

  if (!("frame" in attributes)) {
    throw new Error("Expected a single iOS composer frame");
  }

  return attributes.frame.y;
};

const expectKeyboardOpen = async (closedY: number) => {
  const y = await composerY();

  if (y < 0 || y > closedY - 100) {
    throw new Error(
      `Software keyboard did not raise the composer: closed=${closedY}, current=${y}`,
    );
  }
};

const focusInput = async () => {
  await waitAndTap("chat.input");
  await element(by.id("chat.input")).typeText("a");
  await element(by.id("chat.input")).clearText();
};

describeIOS("Interactive back swipe", () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      "interactive_back_swipe",
    );
    await waitAndTap("interactive_back_swipe");
    await waitAndTap("back-swipe.setup.mode.close");
    await expectBitmapsToBeEqual("InteractiveBackSwipeSetup");
  });

  it.each(["close", "none", "interactively"])(
    "restores the original layout after a canceled %s swipe",
    async (mode) => {
      await waitAndTap(`back-swipe.setup.mode.${mode}`);
      await waitAndTap("back-swipe.open");
      const closedY = await composerY();

      await focusInput();
      await waitForExpect(async () => {
        await expect(element(by.id("chat.input"))).toBeFocused();
        await expectKeyboardOpen(closedY);
        await expectBitmapsToBeEqual(
          "InteractiveBackSwipeRestored",
          BLINKING_CURSOR,
        );
      });

      // A short drag starts the transition but stays below the pop threshold.
      const screen = element(by.id("back-swipe.gesture"));

      await screen.swipe("right", "slow", 0.2, 0.02, 0.25);
      await waitForExpect(async () => {
        await expect(element(by.id("chat.input"))).toBeFocused();
        await expectKeyboardOpen(closedY);
        // All three policies must return to the SAME full-screen reference image.
        await expectBitmapsToBeEqual(
          "InteractiveBackSwipeRestored",
          BLINKING_CURSOR,
        );
      });

      await element(by.id("back-swipe.gesture")).swipe(
        "right",
        "slow",
        0.9,
        0.02,
        0.25,
      );
      await waitForElementById("back-swipe.open");
      await expect(element(by.id("chat.input"))).not.toExist();
      await waitAndTap("back-swipe.setup.mode.close");
      await waitForExpect(async () => {
        await expectBitmapsToBeEqual("InteractiveBackSwipeSetup");
      });
    },
  );
});

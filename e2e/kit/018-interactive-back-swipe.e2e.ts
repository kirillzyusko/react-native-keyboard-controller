import fs from "fs";

import { expect } from "detox";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import {
  delay,
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

const describeIOS = device.getPlatform() === "ios" ? describe : describe.skip;
const BLINKING_CURSOR = 0.35;
const initialScreens = new Map<string, PNG>();
let screenshotIndex = 0;

// Compare cancellation with this run's initial layout. OS versions and the
// selected keyboard language can differ from checked-in golden screenshots.
const expectInitialLayout = async (
  name: string,
  acceptableDiffPercent = 0.1,
) => {
  await delay(1000);
  const reference = initialScreens.get(name);
  const suffix = reference ? `restored-${++screenshotIndex}` : "initial";
  const path = await device.takeScreenshot(`${name}-${suffix}`);
  const actual = PNG.sync.read(fs.readFileSync(path));

  if (!reference) {
    initialScreens.set(name, actual);

    return;
  }

  if (actual.width !== reference.width || actual.height !== reference.height) {
    throw new Error(`${name} changed its screenshot dimensions`);
  }
  const changed = pixelmatch(
    reference.data,
    actual.data,
    null,
    actual.width,
    actual.height,
    { threshold: 0.1 },
  );
  const percent = (changed / (actual.width * actual.height)) * 100;

  if (percent > acceptableDiffPercent) {
    throw new Error(
      `${name} differs from its initial layout by ${percent.toFixed(2)}%`,
    );
  }
};

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
    await expectInitialLayout("InteractiveBackSwipeSetup");
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
        await expect(
          element(by.text("Sure, I'll send it in a minute.")),
        ).toBeVisible();
        await expectInitialLayout(
          "InteractiveBackSwipeRestored",
          BLINKING_CURSOR,
        );
      });

      // A short drag starts the transition but stays below the pop threshold.
      const screen = element(by.id("back-swipe.gesture"));

      if (mode === "close") {
        // Touching the edge without starting a back gesture must keep focus.
        await element(by.id("back-swipe.composer")).tap({ x: 8, y: 12 });
        await expect(element(by.id("chat.input"))).toBeFocused();
        await expectKeyboardOpen(closedY);
        await expectInitialLayout(
          "InteractiveBackSwipeRestored",
          BLINKING_CURSOR,
        );
      }

      await screen.swipe("right", "slow", 0.2, 0.02, 0.25);
      await waitForExpect(async () => {
        await expect(element(by.id("chat.input"))).toBeFocused();
        await expectKeyboardOpen(closedY);
        // All three policies must return to the SAME full-screen reference image.
        await expectInitialLayout(
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
        await expectInitialLayout("InteractiveBackSwipeSetup");
      });
    },
  );
});

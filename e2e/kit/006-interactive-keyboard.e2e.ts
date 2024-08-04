import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForExpect,
} from "./helpers";

const scrollable =
  device.getPlatform() === "android" ? "chat.gesture" : "chat.scroll";

describe("Interactive keyboard interactions", () => {
  it("should navigate to `Interactive keyboard` screen", async () => {
    const item = `interactive_keyboard_${device.getPlatform()}`;

    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      `interactive_keyboard_${device.getPlatform()}`,
    );
    await waitAndTap(item);
  });

  it("should have expected state when keyboard is opened", async () => {
    await waitAndTap("chat.input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("InteractiveKeyboardIsShown");
    });
  });

  it("should have expected state after the gesture", async () => {
    try {
      await element(by.id(scrollable)).swipe("down", "fast", 1);
    } catch (e) {
      // ignore exception, will be thrown on Android 9
    }
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("InteractiveKeyboardAfterGestureDown");
    });
  });

  it("should react on the gesture up when keyboard closed", async () => {
    try {
      // show the keyboard on Android 12+
      await element(by.id(scrollable)).swipe("up", "fast", 1, 0.5, 0.5);
      // scroll to the end of ScrollView to be sure UI is always identical
      await element(by.id(scrollable)).swipe("up", "fast", 1, 0.5, 0.4);
    } catch (e) {
      // ignore exception, will be thrown on Android 9
    }
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("InteractiveKeyboardAfterGestureUp");
    });
  });
});

import { expectBitmapsToBeEqual } from "./asserts";
import {
  closeKeyboard,
  scrollDownUntilElementIsVisible,
  switchToEmojiKeyboard,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("Native stack", () => {
  it("should navigate to `Native stack` screen", async () => {
    await scrollDownUntilElementIsVisible("main_scroll_view", "native_stack");
    await waitAndTap("native_stack");
    await waitForElementById("keyboard_animation_text_input");
  });

  it("should have expected state when keyboard is opened", async () => {
    await waitAndTap("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("NativeStackKeyboardIsShown");
    });
  });

  it("should have expected state when emoji keyboard is opened", async () => {
    await switchToEmojiKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("NativeStackEmojiKeyboard");
    });
  });

  it("should have expected state when keyboard is closed", async () => {
    // only on iOS 15 we get busy loop...
    await device.disableSynchronization();
    await closeKeyboard("keyboard_animation_text_input");
    await waitForExpect(async () => {
      // Native screen system-bar icons and the focused caret vary slightly.
      await expectBitmapsToBeEqual(
        "NativeStackKeyboardIsHidden",
        device.getPlatform() === "android" ? 0.15 : 0.1,
      );
    });
    await device.enableSynchronization();
  });
});

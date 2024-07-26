import { expectBitmapsToBeEqual } from "./asserts";
import {
  Env,
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
    // this is available only on Android 12 right now:
    // - Android 9 AOSP image can not switch to emoji
    // - on iOS we are waiting for new API: https://github.com/wix/Detox/issues/4331
    if (Env.softCheck) {
      await switchToEmojiKeyboard();
      await waitForExpect(async () => {
        await expectBitmapsToBeEqual("NativeStackEmojiKeyboard");
      });
    }
  });

  it("should have expected state when keyboard is closed", async () => {
    await closeKeyboard("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("NativeStackKeyboardIsHidden");
    });
  });
});

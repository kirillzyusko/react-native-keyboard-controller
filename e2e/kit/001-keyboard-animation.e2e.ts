import { expectBitmapsToBeEqual } from "./asserts";
import {
  Env,
  closeKeyboard,
  switchToEmojiKeyboard,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("Example", () => {
  it("should navigate to `Animated transition` screen", async () => {
    await waitAndTap("animated_transition");
    await waitForElementById("keyboard_animation_text_input");
  });

  it("should have expected state when keyboard is opened", async () => {
    await waitAndTap("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardAnimationKeyboardIsShown");
    });
  });

  it("should have expected state when emoji keyboard is opened", async () => {
    // this is available only on Android 12 right now:
    // - Android 9 AOSP image can not switch to emoji
    // - on iOS we are waiting for new API: https://github.com/wix/Detox/issues/4331
    if (Env.softCheck) {
      await switchToEmojiKeyboard();
      await waitForExpect(async () => {
        await expectBitmapsToBeEqual("KeyboardAnimationEmojiKeyboard");
      });
    }
  });

  it("should have expected state when keyboard is closed", async () => {
    await closeKeyboard("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardAnimationKeyboardIsHidden");
    });
  });
});

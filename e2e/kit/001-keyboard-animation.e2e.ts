import { expectBitmapsToBeEqual } from "./asserts";
import {
  closeKeyboard,
  switchToEmojiKeyboard,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("Simple keyboard animation", () => {
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
    await switchToEmojiKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardAnimationEmojiKeyboard");
    });
  });

  it("should have expected state when keyboard is closed", async () => {
    // only on iOS 15 we get busy loop...
    await device.disableSynchronization();
    await closeKeyboard("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardAnimationKeyboardIsHidden");
    });
    await device.enableSynchronization();
  });
});

import { expectBitmapsToBeEqual } from "./asserts";
import {
  switchToEmojiKeyboard,
  tapInMiddleOfScreen,
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
    // test `KeyboardController.dismiss` as inline `onPress` handler
    // we can't touch the element directly, because we may violate 75% of the visibility rule
    await tapInMiddleOfScreen();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardAnimationKeyboardIsHidden");
    });
  });
});

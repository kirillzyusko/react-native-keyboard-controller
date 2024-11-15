import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  switchToEmojiKeyboard,
  tapInMiddleOfScreen,
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
    // test `KeyboardController.dismiss` as inline `onPress` handler
    // we can't touch the element directly, because we may violate 75% of the visibility rule
    await tapInMiddleOfScreen();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardAnimationKeyboardIsHidden");
    });
  });
});

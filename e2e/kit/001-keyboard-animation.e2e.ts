import { expectBitmapsToBeEqual } from "./asserts";
import {
  closeKeyboard,
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

  it("should have expected state when keyboard is closed", async () => {
    await closeKeyboard("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardAnimationKeyboardIsHidden");
    });
  });
});

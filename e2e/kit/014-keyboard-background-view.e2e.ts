import { expectBitmapsToBeEqual } from "./asserts";
import {
  closeKeyboard,
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("`KeyboardBackgroundView` specification", () => {
  it("should navigate to `Keyboard Shared Transitions` screen", async () => {
    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      "keyboard_shared_transitions",
    );
    await waitAndTap("keyboard_shared_transitions");
    await waitForElementById("shared_transition_input");
  });

  it("should have expected state when keyboard is opened", async () => {
    await waitAndTap("shared_transition_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardBGViewKeyboardIsShown");
    });
  });

  it("should have expected state when keyboard is closed", async () => {
    await closeKeyboard("shared_transition_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardBGViewKeyboardIsHidden");
    });
  });
});

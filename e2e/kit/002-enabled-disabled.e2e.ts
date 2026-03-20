import { expectBitmapsToBeEqual } from "./asserts";
import {
  closeKeyboard,
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("Disabled/enabled functionality", () => {
  it("should navigate to `Enabled/disabled` screen", async () => {
    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      "enabled_disabled",
    );
    await waitAndTap("enabled_disabled");
    await waitForElementById("keyboard_animation_text_input");
  });

  it("should have expected state when enabled and keyboard is opened", async () => {
    await waitAndTap("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("EnabledKeyboardIsShown");
    });
  });

  it("should have expected state when enabled and keyboard is closed", async () => {
    await closeKeyboard("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("EnabledKeyboardIsHidden");
    });
  });

  it("should disable module", async () => {
    await waitAndTap("toggle_button");
  });

  it("should have expected state when disabled and keyboard is opened", async () => {
    await waitAndTap("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("DisabledKeyboardIsShown");
    });
  });

  it("should have expected state when disabled and keyboard is closed", async () => {
    await closeKeyboard("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("DisabledKeyboardIsHidden");
    });
  });
});

import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("`KeyboardExtender` specification", () => {
  it("should navigate to `Keyboard Extender` screen", async () => {
    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      "keyboard_extender",
    );
    await waitAndTap("keyboard_extender");
    await waitForElementById("donation_amount");
  });

  it("should have `KeyboardExtender` above the keyboard", async () => {
    await waitAndTap("donation_amount");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardExtenderIsAttached");
    });
  });
});

import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  tapItemAtIndex,
  waitAndTap,
  waitForElementById,
  waitForElementByText,
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

  it("should have working `Touchable`s inside", async () => {
    await waitAndTap("donation_20");
    await waitForElementByText("20 dollars");
    await tapItemAtIndex("OK");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardExtenderIsAttached");
    });
  });

  it("should disappear when disabled", async () => {
    await waitAndTap("postal_code");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardExtenderIsDetached");
    });
  });

  it("should appear again when enabled", async () => {
    await waitAndTap("donation_amount");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardExtenderIsAttached");
    });
  });
});

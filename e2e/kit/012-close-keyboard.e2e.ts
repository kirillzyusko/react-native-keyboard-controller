import { expect } from "detox";

import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForExpect,
} from "./helpers";

describe("`KeyboardController.dismiss()` specification", () => {
  it("should navigate to `CloseKeyboard` screen", async () => {
    await scrollDownUntilElementIsVisible("main_scroll_view", "close");
    await waitAndTap("close");
  });

  it("should show keyboard", async () => {
    await waitAndTap("input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("CloseKeyboardOpened");
    });
  });

  it("should dismiss keyboard loosing focus", async () => {
    await waitAndTap("close_keyboard_button");
    await expect(element(by.id("input"))).not.toBeFocused();
  });

  it("should show keyboard again when input tapped", async () => {
    await waitAndTap("input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("CloseKeyboardOpened");
    });
  });

  it("should dismiss keyboard keeping focus", async () => {
    await waitAndTap("keep_focus_button");
    await waitAndTap("close_keyboard_button");
    await expect(element(by.id("input"))).toBeFocused();
  });

  it("should show keyboard again when input with focus tapped", async () => {
    await waitAndTap("input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("CloseKeyboardOpenedKeepingFocus");
    });
  });

  it("should dismiss keyboard", async () => {
    await waitAndTap("close_keyboard_button");
    await expect(element(by.id("input"))).toBeFocused();
  });

  it("should show keyboard when `KeyboardController.setFocusTo('current')` is called", async () => {
    await waitAndTap("set_focus_to_current");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("CloseKeyboardOpenedKeepingFocus");
    });
  });

  it("should dismiss keyboard and blur input if `.blur()` is called", async () => {
    await waitAndTap("blur_from_ref");
    await expect(element(by.id("input"))).not.toBeFocused();
  });
});

import { expect } from "detox";

import {
  expectBitmapsToBeEqual,
  expectElementBitmapsToBeEqual,
} from "./asserts";
import {
  doActionNTimes,
  scrollDownUntilElementIsVisible,
  tap,
  waitAndTap,
  waitForCompletion,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("`KeyboardToolbar` specification", () => {
  it("should navigate to `Toolbar` screen", async () => {
    await scrollDownUntilElementIsVisible("main_scroll_view", "toolbar");
    await waitAndTap("toolbar");
    await waitForElementById("toolbar.scrollView");
  });

  it("should have expected UI when first input is focused", async () => {
    await waitAndTap("TextInput#1");
    await expectElementBitmapsToBeEqual(
      "keyboard.toolbar",
      "ToolbarFirstInputFocused",
    );
  });

  it("should show bottom sheet when `AutoFill Contacts` is pressed", async () => {
    await tap("autofill_contacts");
    await waitForElementById("autofill_contacts_close");
  });

  it("should set focus back when modal closed", async () => {
    await waitAndTap("autofill_contacts_close");
    await expect(element(by.id("TextInput#1"))).toBeFocused();
    await waitForCompletion(async () => {
      await tap("autofill_contacts");
    });
  });

  it("should do correct actions when contact gets selected", async () => {
    await waitAndTap("contact_0");
    // hide modal
    await expect(element(by.id("autofill_contacts_modal"))).not.toBeVisible();
    // should update text value
    await expect(element(by.id("TextInput#1"))).toHaveText("Kiryl");
    // shouldn't render AutoFill Contacts anymore
    await expect(element(by.id("autofill_contacts"))).not.toExist();
    // should move focus to next field
    await expect(element(by.id("TextInput#2"))).toBeFocused();
    // should match to snapshot (active arrows, no "AutoFill Contacts" label)
    await expectElementBitmapsToBeEqual(
      "keyboard.toolbar",
      "ToolbarAllButtonsEnabled",
    );
  });

  it("should skip a disabled fields", async () => {
    await tap("keyboard.toolbar.next");
    await expect(element(by.id("TextInput#5"))).toBeFocused();
  });

  it("should handle multiple clicks in row", async () => {
    await doActionNTimes(() => tap("keyboard.toolbar.next"), 3);
    await expect(element(by.id("TextInput#8"))).toBeFocused();
  });

  it("should handle `previous` clicks correctly", async () => {
    await tap("keyboard.toolbar.previous");
    await expect(element(by.id("TextInput#7"))).toBeFocused();
  });

  it("should have expected UI state when end of form reached", async () => {
    await doActionNTimes(() => tap("keyboard.toolbar.next"), 6);
    await expect(element(by.id("TextInput#13"))).toBeFocused();
    await expectElementBitmapsToBeEqual(
      "keyboard.toolbar",
      "ToolbarLastInputFocused",
    );
  });

  it("should enable next button when go to previous field from the last one", async () => {
    await tap("keyboard.toolbar.previous");
    await expect(element(by.id("TextInput#12"))).toBeFocused();
    await expectElementBitmapsToBeEqual(
      "keyboard.toolbar",
      "ToolbarAllButtonsEnabled",
    );
  });

  it("should close keyboard when press `Done`", async () => {
    await tap("keyboard.toolbar.done");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("ToolbarKeyboardClosed");
    });
  });
});

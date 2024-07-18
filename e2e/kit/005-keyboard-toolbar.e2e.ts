import { expect } from "detox";

import {
  expectBitmapsToBeEqual,
  expectElementBitmapsToBeEqual,
} from "./asserts";
import {
  doActionNTimes,
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
  waitForToBeFocused,
} from "./helpers";

describe("`KeyboardToolbar` specification", () => {
  it("should navigate to `Toolbar` screen", async () => {
    await scrollDownUntilElementIsVisible("main_scroll_view", "toolbar");
    await waitAndTap("toolbar");
    await waitForElementById("toolbar.scrollView");
  });

  it("should have expected UI when first input is focused", async () => {
    await waitAndTap("TextInput#1");
    await waitForExpect(async () => {
      await expectElementBitmapsToBeEqual(
        "keyboard.toolbar",
        "ToolbarFirstInputFocused",
      );
    });
  });

  it("should show bottom sheet when `AutoFill Contacts` is pressed", async () => {
    await waitAndTap("autofill_contacts");
    await waitForElementById("autofill_contacts_close");
  });

  it("should set focus back when modal closed", async () => {
    await waitAndTap("autofill_contacts_close");
    await waitForToBeFocused("TextInput#1");
    await waitAndTap("autofill_contacts");
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
    await waitForToBeFocused("TextInput#2");
    // should match to snapshot (active arrows, no "AutoFill Contacts" label)
    await waitForExpect(async () => {
      await expectElementBitmapsToBeEqual(
        "keyboard.toolbar",
        "ToolbarAllButtonsEnabled",
      );
    });
  });

  it("should skip a disabled fields", async () => {
    await waitAndTap("keyboard.toolbar.next");
    await waitForToBeFocused("TextInput#5");
  });

  it("should handle multiple clicks in row", async () => {
    await doActionNTimes(() => waitAndTap("keyboard.toolbar.next"), 3);
    await waitForToBeFocused("TextInput#8");
  });

  it("should handle `previous` clicks correctly", async () => {
    await waitAndTap("keyboard.toolbar.previous");
    await waitForToBeFocused("TextInput#7");
  });

  it("should have expected UI state when end of form reached", async () => {
    await doActionNTimes(() => waitAndTap("keyboard.toolbar.next"), 6);
    await waitForToBeFocused("TextInput#13");
    await waitForExpect(async () => {
      await expectElementBitmapsToBeEqual(
        "keyboard.toolbar",
        "ToolbarLastInputFocused",
      );
    });
  });

  it("should enable next button when go to previous field from the last one", async () => {
    await waitAndTap("keyboard.toolbar.previous");
    await waitForToBeFocused("TextInput#12");
    await waitForExpect(async () => {
      await expectElementBitmapsToBeEqual(
        "keyboard.toolbar",
        "ToolbarAllButtonsEnabled",
      );
    });
  });

  it("should close keyboard when press `Done`", async () => {
    await waitAndTap("keyboard.toolbar.done");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("ToolbarKeyboardClosed");
    });
  });
});

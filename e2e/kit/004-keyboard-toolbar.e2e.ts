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
} from "./helpers";
import setDemoMode from "./utils/setDemoMode";

// TODO: add interactions with "AutoFill Contacts" + verify conditional rendering
describe("`KeyboardToolbar` specification", () => {
  beforeAll(async () => {
    await setDemoMode();
    await device.launchApp();
  });

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

  it("should have second input focused when `next` button pressed", async () => {
    await waitAndTap("keyboard.toolbar.next");
    await expect(element(by.id("TextInput#2"))).toBeFocused();
    await expectElementBitmapsToBeEqual(
      "keyboard.toolbar",
      "ToolbarAllButtonsEnabled",
    );
  });

  it("should skip a disabled fields", async () => {
    await waitAndTap("keyboard.toolbar.next");
    await expect(element(by.id("TextInput#5"))).toBeFocused();
  });

  it("should handle multiple clicks in row", async () => {
    await doActionNTimes(() => waitAndTap("keyboard.toolbar.next"), 3);
    await expect(element(by.id("TextInput#8"))).toBeFocused();
  });

  it("should handle `previous` clicks correctly", async () => {
    await waitAndTap("keyboard.toolbar.previous");
    await expect(element(by.id("TextInput#7"))).toBeFocused();
  });

  it("should have expected UI state when end of form reached", async () => {
    await doActionNTimes(() => waitAndTap("keyboard.toolbar.next"), 6);
    await expect(element(by.id("TextInput#13"))).toBeFocused();
    await expectElementBitmapsToBeEqual(
      "keyboard.toolbar",
      "ToolbarLastInputFocused",
    );
  });

  it("should enable next button when go to previous field from the last one", async () => {
    await waitAndTap("keyboard.toolbar.previous");
    await expect(element(by.id("TextInput#12"))).toBeFocused();
    await expectElementBitmapsToBeEqual(
      "keyboard.toolbar",
      "ToolbarAllButtonsEnabled",
    );
  });

  it("should close keyboard when press `Done`", async () => {
    await waitAndTap("keyboard.toolbar.done");
    await expectBitmapsToBeEqual("ToolbarKeyboardClosed");
  });
});

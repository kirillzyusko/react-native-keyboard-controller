import { expectBitmapsToBeEqual } from "./asserts";
import {
  closeKeyboard,
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("Bottom tab bar", () => {
  it("should navigate to `Bottom tab bar` screen", async () => {
    await scrollDownUntilElementIsVisible("main_scroll_view", "bottom_tab_bar");
    await waitAndTap("bottom_tab_bar");
  });

  it("should have expected state in portrait mode", async () => {
    await waitForElementById("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("BottomTabBarPortrait", 0.25);
    });
  });

  it("should have expected state in landscape mode", async () => {
    await device.setOrientation("landscape");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("BottomTabBarLandscape");
    });
  });

  it("should have expected state in portrait mode after rotation", async () => {
    await device.setOrientation("portrait");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("BottomTabBarPortraitAgain");
    });
  });

  it("should have expected state when keyboard open", async () => {
    await waitAndTap("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("BottomTabBarKeyboardIsShown");
    });
  });

  it("should have expected state when emoji keyboard closed", async () => {
    await closeKeyboard("keyboard_animation_text_input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("BottomTabBarKeyboardIsHidden");
    });
  });
});

import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

const test = device.getPlatform() === "ios" ? describe.skip : describe;

test("`OverKeyboardView` specification", () => {
  it("should navigate to `OverKeyboardView` screen", async () => {
    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      "over_keyboard_view",
    );
    await waitAndTap("over_keyboard_view");
  });

  it("should have expected state when view is not visible", async () => {
    await waitForElementById("over_keyboard_view.input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("OverKeyboardViewNotShown");
    });
  });

  it("should be visible when `visible={true}`", async () => {
    await waitAndTap("over_keyboard_view.show");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("OverKeyboardViewShown");
    });
  });

  it("should have touchable background", async () => {
    await waitAndTap("over_keyboard_view.background");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("OverKeyboardViewNotShown");
    });
  });

  it("should be displayed overlapping keyboard", async () => {
    await waitAndTap("over_keyboard_view.input");
    await waitAndTap("over_keyboard_view.show");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("OverKeyboardViewShownWithKeyboard");
    });
  });

  it("should have tappable elements", async () => {
    await waitAndTap("over_keyboard_view.content");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("OverKeyboardViewHiddenWithKeyboard");
    });
  });
});

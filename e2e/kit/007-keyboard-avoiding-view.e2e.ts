import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitAndType,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("`KeyboardAvoidingView` specification", () => {
  it("should navigate to `KeyboardAvoidingView` screen", async () => {
    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      "keyboard_avoiding_view",
    );
    await waitAndTap("keyboard_avoiding_view");
    await waitForElementById("keyboard_avoiding_view.container");
  });

  it("should have expected UI when keyboard closed - package/padding", async () => {
    await waitForExpect(async () => {
      // 0.25 because on iOS Home indicator sometimes may have different colors per different runs
      await expectBitmapsToBeEqual("AvoidingViewPackagePaddingInitial", 0.25);
    });
  });

  it("should have expected UI when keyboard opened - package/padding", async () => {
    await waitAndTap("keyboard_avoiding_view.username");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewPackagePaddingOpened");
    });
  });

  it("should have expected UI when keyboard gets closed - package/padding", async () => {
    await waitAndType("keyboard_avoiding_view.username", "\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewPackagePaddingClosed");
    });
  });

  it("should toggle implementation - RN/padding", async () => {
    await waitAndTap("keyboard_avoiding_view.implementation");
  });

  it("should have expected UI when keyboard closed - RN/padding", async () => {
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewRNPaddingInitial");
    });
  });

  it("should have expected UI when keyboard opened - RN/padding", async () => {
    await waitAndTap("keyboard_avoiding_view.username");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewRNPaddingOpened");
    });
  });

  it("should have expected UI when keyboard gets closed - RN/padding", async () => {
    await waitAndType("keyboard_avoiding_view.username", "\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewRNPaddingClosed");
    });
  });
});

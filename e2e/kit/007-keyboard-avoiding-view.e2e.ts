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

  // Package/padding/Rel (default state: offset=100)
  it("should have expected UI when keyboard closed - package/padding", async () => {
    await waitForExpect(async () => {
      // 0.25 because on iOS Home indicator sometimes may have different colors per different runs
      await expectBitmapsToBeEqual("AvoidingViewPackagePaddingInitial", 0.27);
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

  // Switch to automaticOffset mode with offset=0
  it("should toggle to absolute position mode", async () => {
    // offset: +100 → +0
    await waitAndTap("keyboard_avoiding_view.offset");
    // absolute: Rel → Abs
    await waitAndTap("keyboard_avoiding_view.absolute");
    // TODO: add bitmap assertion to verify toggle state
  });

  // Package/padding/Abs (offset=0)
  it("should have expected UI when keyboard closed - package/padding/abs", async () => {
    await waitForExpect(async () => {
      // TODO: add reference screenshot
      await expectBitmapsToBeEqual(
        "AvoidingViewPackagePaddingAutoInitial",
        0.27,
      );
    });
  });

  it("should have expected UI when keyboard opened - package/padding/abs", async () => {
    await waitAndTap("keyboard_avoiding_view.username");
    await waitForExpect(async () => {
      // TODO: add reference screenshot
      await expectBitmapsToBeEqual("AvoidingViewPackagePaddingAutoOpened");
    });
  });

  it("should have expected UI when keyboard gets closed - package/padding/abs", async () => {
    await waitAndType("keyboard_avoiding_view.username", "\n");
    await waitForExpect(async () => {
      // TODO: add reference screenshot
      await expectBitmapsToBeEqual("AvoidingViewPackagePaddingAutoClosed");
    });
  });

  // Switch back to Rel mode and toggle to RN implementation
  it("should toggle implementation - RN/padding", async () => {
    // absolute: Abs → Rel
    await waitAndTap("keyboard_avoiding_view.absolute");
    // offset: +0 → +50 → +100
    await waitAndTap("keyboard_avoiding_view.offset");
    await waitAndTap("keyboard_avoiding_view.offset");
    // implementation: Package → RN
    await waitAndTap("keyboard_avoiding_view.implementation");
    // TODO: add bitmap assertion to verify toggle state
  });

  // RN/padding/Rel (offset=100)
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

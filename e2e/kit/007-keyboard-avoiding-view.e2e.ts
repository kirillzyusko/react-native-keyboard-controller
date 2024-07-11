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
      await expectBitmapsToBeEqual("AvoidingViewInitial");
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
      await expectBitmapsToBeEqual("AvoidingViewInitial");
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

  it("should toggle behavior and implementation - package/height", async () => {
    await waitAndTap("keyboard_avoiding_view.behavior");
    await waitAndTap("keyboard_avoiding_view.implementation");
  });

  it("should have expected UI when keyboard closed - package/height", async () => {
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewInitial");
    });
  });

  it("should have expected UI when keyboard opened - package/height", async () => {
    await waitAndTap("keyboard_avoiding_view.password");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewPackageHeightOpened");
    });
  });

  it("should have expected UI when keyboard gets closed - package/height", async () => {
    await waitAndType("keyboard_avoiding_view.password", "\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewPackageHeightClosed");
    });
  });

  it("should toggle implementation - RN/height", async () => {
    await waitAndTap("keyboard_avoiding_view.implementation");
  });

  it("should have expected UI when keyboard closed - RN/height", async () => {
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewInitial");
    });
  });

  it("should have expected UI when keyboard opened - RN/height", async () => {
    await waitAndTap("keyboard_avoiding_view.password");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewRNHeightOpened");
    });
  });

  it("should have expected UI when keyboard gets closed - RN/height", async () => {
    await waitAndType("keyboard_avoiding_view.password", "\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewRNHeightClosed");
    });
  });

  it("should toggle behavior and implementation - package/position", async () => {
    await waitAndTap("keyboard_avoiding_view.behavior");
    await waitAndTap("keyboard_avoiding_view.implementation");
  });

  it("should have expected UI when keyboard closed - package/position", async () => {
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewInitial");
    });
  });

  it("should have expected UI when keyboard opened - package/position", async () => {
    await waitAndTap("keyboard_avoiding_view.password");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewPackagePositionOpened");
    });
  });

  it("should have expected UI when keyboard gets closed - package/position", async () => {
    await waitAndType("keyboard_avoiding_view.password", "\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewPackagePositionClosed");
    });
  });

  it("should toggle implementation - RN/position", async () => {
    await waitAndTap("keyboard_avoiding_view.implementation");
  });

  it("should have expected UI when keyboard closed - RN/position", async () => {
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewInitial");
    });
  });

  it("should have expected UI when keyboard opened - RN/position", async () => {
    await waitAndTap("keyboard_avoiding_view.password");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewRNPositionOpened");
    });
  });

  it("should have expected UI when keyboard gets closed - RN/position", async () => {
    await waitAndType("keyboard_avoiding_view.password", "\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("AvoidingViewRNPositionClosed");
    });
  });
});

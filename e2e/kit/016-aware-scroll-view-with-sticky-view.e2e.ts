import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  tap,
  waitAndTap,
  waitForExpect,
} from "./helpers";

const BLINKING_CURSOR = 0.35;

const closeKeyboard = async () => {
  // tap outside to close a keyboard
  await tap("aware_scroll_sticky_view_scroll_container", { x: 0, y: 100 });
};

describe("AwareScrollView with StickyView test cases", () => {
  it("should push input above keyboard on focus", async () => {
    await waitAndTap("aware_scroll_view_sticky_footer");
    await scrollDownUntilElementIsVisible(
      "aware_scroll_sticky_view_scroll_container",
      "TextInput#4",
    );
    await waitAndTap("TextInput#4");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewWithStickyViewFirstInputFocused",
        BLINKING_CURSOR,
      );
    });
  });

  it("should react on `bottomOffset` change", async () => {
    await waitAndTap("toggle_height");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewWithStickyViewBottomOffsetChanged",
        BLINKING_CURSOR,
      );
    });
  });

  it("should react on `bottomOffset` change even if input is not visible", async () => {
    await scrollDownUntilElementIsVisible(
      "aware_scroll_sticky_view_scroll_container",
      "TextInput#9",
      { x: 0, y: 0.2, checkScrollViewVisibility: false },
    );
    await waitAndTap("toggle_height");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewWithStickyViewFirstInputFocused",
        BLINKING_CURSOR,
      );
    });
  });

  it("shouldn't scroll a scroll view when focusing input inside sticky view", async () => {
    await closeKeyboard();
    await element(by.id("aware_scroll_sticky_view_scroll_container")).swipe(
      "down",
      "fast",
      1,
    );
    await waitAndTap("Amount");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewWithStickyViewStickyInputFocused",
        BLINKING_CURSOR,
      );
    });
  });
});

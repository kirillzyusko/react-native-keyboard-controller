import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForExpect,
} from "./helpers";

const BLINKING_CURSOR = 0.35;

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

  it("should react on `bottomOffset` change even if input is nopt visible", async () => {
    await scrollDownUntilElementIsVisible(
      "aware_scroll_sticky_view_scroll_container",
      "TextInput#9",
    );
    await waitAndTap("toggle_height");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewWithStickyViewFirstInputFocused",
        BLINKING_CURSOR,
      );
    });
  });
});

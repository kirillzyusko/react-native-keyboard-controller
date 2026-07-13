import { device } from "detox";

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
    await device.takeScreenshot("sticky-01-screen-opened");
    await scrollDownUntilElementIsVisible(
      "aware_scroll_sticky_view_scroll_container",
      "TextInput#4",
    );
    await device.takeScreenshot("sticky-02-input-visible-before-focus");
    await waitAndTap("TextInput#4");
    await device.takeScreenshot("sticky-03-after-focus");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewWithStickyViewFirstInputFocused",
        BLINKING_CURSOR,
      );
    });
  });
});

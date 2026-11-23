// Ported from kit/016-aware-scroll-view-with-sticky-view.e2e.ts
import { describe } from "@e2e-dev/mobile";

import {
  type Ctx,
  LONG_TIMEOUT,
  expectScreen,
  openHome,
  scrollDownUntilElementIsInside,
  scrollDownUntilElementIsVisible,
  swipeElement,
  tapAtCentre,
  test,
} from "./support/kit";

const BLINKING_CURSOR = 0.35;
const SCROLL = "aware_scroll_sticky_view_scroll_container";

const closeKeyboard = async ({ screen }: Ctx) => {
  // tap outside to close a keyboard
  await screen.getByTestId(SCROLL).tap({ position: { x: 0, y: 100 } });
};

describe("AwareScrollView with StickyView test cases", { serial: true }, () => {
  test("should push input above keyboard on focus", async (ctx) => {
    await openHome(ctx);
    await ctx.screen
      .getByTestId("aware_scroll_view_sticky_footer")
      .tap({ timeout: LONG_TIMEOUT });
    await scrollDownUntilElementIsVisible(ctx, SCROLL, "TextInput#4");
    await ctx.screen.getByTestId("TextInput#4").tap();
    await expectScreen(
      ctx.screen,
      "AwareScrollViewWithStickyViewFirstInputFocused",
      BLINKING_CURSOR,
    );
  });

  test("should react on bottomOffset change", async (ctx) => {
    // The sticky footer rides on the keyboard; agent-device reads it as covered.
    await tapAtCentre(ctx, "toggle_height");
    await expectScreen(
      ctx.screen,
      "AwareScrollViewWithStickyViewBottomOffsetChanged",
      BLINKING_CURSOR,
    );
  });

  test("should react on bottomOffset change even if input is not visible", async (ctx) => {
    // Detox: from { x: 0, y: 0.2 }, without re-checking the scroll view.
    await scrollDownUntilElementIsInside(ctx, SCROLL, "TextInput#9", 0, 0.2);
    // The sticky footer rides on the keyboard; agent-device reads it as covered.
    await tapAtCentre(ctx, "toggle_height");
    await expectScreen(
      ctx.screen,
      "AwareScrollViewWithStickyViewFirstInputFocused",
      BLINKING_CURSOR,
    );
  });

  test("shouldn't scroll a scroll view when focusing input inside sticky view", async (ctx) => {
    await closeKeyboard(ctx);
    await swipeElement(ctx, SCROLL, "down", "fast", 1);
    await ctx.screen.getByTestId("Amount").tap({ timeout: LONG_TIMEOUT });
    await expectScreen(
      ctx.screen,
      "AwareScrollViewWithStickyViewStickyInputFocused",
      BLINKING_CURSOR,
    );
  });
});

// Ported from kit/004-aware-scroll-view.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  type Ctx,
  LONG_TIMEOUT,
  expectScreen,
  openHome,
  replaceText,
  scrollElement,
  scrollUpUntilElementIsBarelyVisible,
  selectText,
  tapAtCentre,
  tapBackspaceKey,
  test,
  typeText,
} from "./support/kit";

const BLINKING_CURSOR = 0.35;
/**
 * Detox doesn't provide the API for text selection, so we just use a double tap, but the problem is that
 * if text contains special characters (comas, dots, etc.) then the selection will be until the special character
 * and not the whole text. In this particular test we want to select the whole text, so we use a string without
 * special characters.
 */
const PI_NUMBER_WITHOUT_COMA =
  "31415926535897932384626433832795028841971693993751058209749445923078164062862";

// Same as SOFT_CHECK in the Detox suite: skip pixel checks for asynchronous resizes.
const softCheck = process.env.SOFT_CHECK === "true";

const closeKeyboard = async ({ screen }: Ctx) => {
  // tap outside to close a keyboard
  await screen
    .getByTestId("aware_scroll_view_container")
    .tap({ position: { x: 0, y: 100 } });
};

describe("AwareScrollView test cases", { serial: true }, () => {
  test("should push input above keyboard on focus", async (ctx) => {
    await openHome(ctx);
    await ctx.screen.getByTestId("aware_scroll_view").tap();
    await ctx.screen.getByTestId("TextInput#3").tap({ timeout: LONG_TIMEOUT });
    await expectScreen(
      ctx.screen,
      "AwareScrollViewFirstInputFocused",
      BLINKING_CURSOR,
    );
  });

  test("should detect TextInput growth", async (ctx) => {
    await typeText(ctx, "TextInput#3", "\n\n\n\n\n");
    await expectScreen(
      ctx.screen,
      "AwareScrollViewFirstInputGrown",
      BLINKING_CURSOR,
    );
  });

  test("should auto-scroll when new input gets focused", async (ctx) => {
    await replaceText(ctx, "TextInput#3", "\n\n");
    await ctx.screen.getByTestId("TextInput#4").tap();

    if (softCheck) {
      // on Android (not AOSP) focus and resize events are asynchronous, so only
      // check the input is visible (see the Detox spec for the full reasoning)
      await expect(ctx.screen.getByTestId("TextInput#4")).toBeVisible({
        timeout: 15_000,
      });
    } else {
      await expectScreen(
        ctx.screen,
        "AwareScrollViewInputChanged",
        BLINKING_CURSOR,
      );
    }
  });

  test("should auto-scroll when text selection changed", async (ctx) => {
    await replaceText(ctx, "TextInput#4", PI_NUMBER_WITHOUT_COMA);
    await scrollUpUntilElementIsBarelyVisible(
      ctx,
      "aware_scroll_view_container",
      "TextInput#4",
    );
    await selectText(ctx, "TextInput#4");
    await expectScreen(
      ctx.screen,
      "AwareScrollViewTextSelectionChanged",
      BLINKING_CURSOR,
    );

    if (ctx.platform === "android") {
      // While the selection toolbar shows, Android API 28 lists only that
      // toolbar and the keyboard, so the field cannot be found. Deleting the
      // selection closes the toolbar.
      await tapBackspaceKey(ctx);
    }
    await ctx.screen.getByTestId("TextInput#4").clear();
  });

  test("should auto-scroll when user types a text", async (ctx) => {
    await scrollElement(ctx, "aware_scroll_view_container", 40, "up");
    await typeText(ctx, "TextInput#4", "1");
    await expectScreen(
      ctx.screen,
      "AwareScrollViewTextChanged",
      BLINKING_CURSOR,
    );
  });

  test("should scroll back when keyboard dismissed", async (ctx) => {
    await closeKeyboard(ctx);

    if (softCheck) {
      await expect(ctx.screen.getByTestId("TextInput#2")).toBeVisible({
        timeout: 15_000,
      });
      await expect(ctx.screen.getByTestId("TextInput#6")).toBeVisible({
        timeout: 15_000,
      });
    } else {
      await expectScreen(
        ctx.screen,
        "AwareScrollViewKeyboardClosed",
        BLINKING_CURSOR,
      );
    }
  });

  test("shouldn't scroll back when keyboard dismissed if such behavior intentionally disabled", async (ctx) => {
    const { screen } = ctx;

    await screen.getByTestId("open_bottom_sheet_modal").tap();
    // The bottom sheet sits over the keyboard; agent-device reads its buttons as covered.
    await expect(
      screen.getByTestId("bottom_sheet_toggle_back_scroll"),
    ).toHaveCount(1, { timeout: LONG_TIMEOUT });
    await tapAtCentre(ctx, "bottom_sheet_toggle_back_scroll");
    await tapAtCentre(ctx, "bottom_sheet_close_modal");
    await screen.getByTestId("TextInput#5").tap({ timeout: LONG_TIMEOUT });
    await expectScreen(
      screen,
      "AwareScrollViewSecondInputFocused",
      BLINKING_CURSOR,
    );
    await closeKeyboard(ctx);
    await expectScreen(
      screen,
      "AwareScrollViewKeyboardClosedWithoutBackScroll",
      BLINKING_CURSOR,
    );
  });

  test("shouldn't auto scroll if `KeyboardAwareScrollView` is disabled", async (ctx) => {
    const { screen } = ctx;

    await screen.getByTestId("open_bottom_sheet_modal").tap();
    // The bottom sheet sits over the keyboard; agent-device reads its buttons as covered.
    await expect(
      screen.getByTestId("bottom_sheet_toggle_enabled_state"),
    ).toHaveCount(1, { timeout: LONG_TIMEOUT });
    await tapAtCentre(ctx, "bottom_sheet_toggle_enabled_state");
    await tapAtCentre(ctx, "bottom_sheet_close_modal");
    await screen.getByTestId("TextInput#7").tap({ timeout: LONG_TIMEOUT });
    await expectScreen(
      screen,
      "AwareScrollViewDisabledStateKeyboardOpened",
      BLINKING_CURSOR,
    );
    await closeKeyboard(ctx);
    await expectScreen(
      screen,
      "AwareScrollViewDisabledStateKeyboardClosed",
      BLINKING_CURSOR,
    );
  });
});

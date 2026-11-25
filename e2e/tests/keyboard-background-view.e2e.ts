// Ported from kit/014-keyboard-background-view.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  closeKeyboard,
  expectScreen,
  openExample,
  test,
} from "./support/kit";

const INPUT = "shared_transition_input";

describe("`KeyboardBackgroundView` specification", { serial: true }, () => {
  test("should navigate to `Keyboard Shared Transitions` screen", async (ctx) => {
    await openExample(ctx, "keyboard_shared_transitions");
    await expect(ctx.screen.getByTestId(INPUT)).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should have expected state when keyboard is opened", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).tap();
    // 0.25 because on iOS Home indicator sometimes may have different colors per different runs
    await expectScreen(ctx.screen, "KeyboardBGViewKeyboardIsShown", 0.25);
  });

  test("should have expected state when keyboard is closed", async (ctx) => {
    await closeKeyboard(ctx, INPUT);
    // 0.25 because on iOS Home indicator sometimes may have different colors per different runs
    await expectScreen(ctx.screen, "KeyboardBGViewKeyboardIsHidden", 0.25);
  });
});
